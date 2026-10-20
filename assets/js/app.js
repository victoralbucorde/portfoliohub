/*
 * PortfolioHUB — lê config.json e projects.json, busca os repositórios públicos
 * na API REST do GitHub e monta a vitrine de projetos.
 *
 * Regras de segurança seguidas neste arquivo:
 *  - nenhum token ou segredo no front-end (só endpoints públicos da API);
 *  - todo dado externo entra na página via textContent (nunca como HTML bruto);
 *  - links externos só são aceitos se forem http(s) (bloqueia "javascript:");
 *  - o usuário vindo da URL (?user=) é validado com a regra de nomes do GitHub.
 */
(() => {
  "use strict";

  const API = "https://api.github.com";
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const GITHUB_USER_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
    HTML: "#e34c26", CSS: "#563d7c", "C#": "#178600", "C++": "#f34b7d", C: "#555555",
    PHP: "#4F5D95", Ruby: "#701516", Go: "#00ADD8", Kotlin: "#A97BFF", Swift: "#F05138",
    Dart: "#00B4AB", Shell: "#89e051", "Jupyter Notebook": "#DA5B0B", Vue: "#41b883",
  };

  const $ = (sel) => document.querySelector(sel);
  const state = { projects: [], language: "Todas", query: "", sort: "featured", notice: "" };

  // ---------- utilidades ----------

  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
      return null;
    }
  }

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function setStatus(message, isError = false) {
    const status = $("#status");
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  // "2026-10-20" (sem hora) seria lido como UTC e exibido como dia anterior no Brasil
  function parseDate(value) {
    if (!value) return new Date(0);
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  }

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { at, data } = JSON.parse(raw);
      return Date.now() - at < CACHE_TTL_MS ? data : null;
    } catch {
      return null;
    }
  }

  function cacheSet(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch {
      /* armazenamento indisponível: segue sem cache */
    }
  }

  async function getJson(url, { optional = false } = {}) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      if (optional) return null;
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.rateLimited = res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0";
      throw err;
    }
    return res.json();
  }

  async function github(path) {
    const key = `phub:${path}`;
    const cached = cacheGet(key);
    if (cached) return cached;
    const data = await getJson(`${API}${path}`);
    cacheSet(key, data);
    return data;
  }

  // ---------- dados ----------

  function fromRepo(repo, featured) {
    return {
      name: repo.name,
      description: repo.description || "Sem descrição.",
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics || [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.pushed_at || repo.updated_at,
      featured: featured.includes(repo.name.toLowerCase()),
      source: "github",
    };
  }

  function fromManual(item) {
    return {
      name: String(item.name || "Projeto"),
      description: String(item.description || ""),
      url: item.url,
      homepage: item.homepage,
      language: item.language || null,
      topics: Array.isArray(item.topics) ? item.topics.map(String) : [],
      stars: 0,
      forks: 0,
      updated: item.updated || null,
      featured: Boolean(item.featured),
      source: "manual",
    };
  }

  function resolveUser(config) {
    const fromQuery = new URLSearchParams(location.search).get("user");
    if (fromQuery && GITHUB_USER_RE.test(fromQuery)) return fromQuery;
    const fromConfig = String(config.githubUser || "");
    if (fromConfig === "SEU-USUARIO-GITHUB") return null;
    return GITHUB_USER_RE.test(fromConfig) ? fromConfig : null;
  }

  // ---------- renderização ----------

  function renderProfile(config, user) {
    const name = config.displayName || user?.name || user?.login || "Meu Portfólio";
    $("#name").textContent = name;
    $("#role").textContent = config.role || "Portfólio";
    $("#bio").textContent = config.bio || user?.bio || "";
    document.title = `${name} · PortfolioHUB`;

    if (user) {
      const avatar = $("#avatar");
      avatar.src = user.avatar_url;
      avatar.alt = `Foto de ${name}`;
      avatar.hidden = false;
      $("#nav-github").href = user.html_url;
    }

    const links = $("#links");
    links.replaceChildren();
    for (const link of config.links || []) {
      const href = safeUrl(link.url);
      if (!href) continue;
      const a = el("a", link.label, "btn");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const li = el("li");
      li.append(a);
      links.append(li);
    }
  }

  function renderStats(user) {
    const stats = $("#stats");
    stats.replaceChildren();
    const totalStars = state.projects.reduce((sum, p) => sum + p.stars, 0);
    const languages = new Set(state.projects.map((p) => p.language).filter(Boolean));
    const items = [
      ["Projetos", state.projects.length],
      ["Estrelas", totalStars],
      ["Linguagens", languages.size],
    ];
    if (user) items.push(["Seguidores", user.followers]);
    for (const [label, value] of items) {
      const li = el("li");
      li.append(el("strong", String(value)), document.createTextNode(` ${label}`));
      stats.append(li);
    }
  }

  function renderLanguageChips() {
    const counts = new Map();
    for (const p of state.projects) {
      if (p.language) counts.set(p.language, (counts.get(p.language) || 0) + 1);
    }
    const options = ["Todas", ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([lang]) => lang)];
    const box = $("#languages");
    box.replaceChildren();
    for (const lang of options) {
      const chip = el("button", lang, "chip");
      chip.type = "button";
      chip.setAttribute("aria-pressed", String(lang === state.language));
      chip.addEventListener("click", () => {
        state.language = lang;
        renderLanguageChips();
        renderGrid();
      });
      box.append(chip);
    }
  }

  function visibleProjects() {
    const q = state.query.trim().toLowerCase();
    const list = state.projects.filter((p) => {
      if (state.language !== "Todas" && p.language !== state.language) return false;
      if (!q) return true;
      return [p.name, p.description, ...p.topics].join(" ").toLowerCase().includes(q);
    });
    const byDate = (a, b) => parseDate(b.updated) - parseDate(a.updated);
    const sorters = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || byDate(a, b),
      updated: byDate,
      stars: (a, b) => b.stars - a.stars || byDate(a, b),
      name: (a, b) => a.name.localeCompare(b.name, "pt-BR"),
    };
    return list.sort(sorters[state.sort] || sorters.featured);
  }

  function renderGrid() {
    const grid = $("#grid");
    const tpl = $("#card-tpl");
    const list = visibleProjects();
    grid.replaceChildren();

    for (const p of list) {
      const card = tpl.content.firstElementChild.cloneNode(true);
      if (p.featured) {
        card.classList.add("featured");
        card.querySelector(".badge").hidden = false;
      }

      const repoUrl = safeUrl(p.url);
      const title = card.querySelector(".card-title a");
      title.textContent = p.name;
      if (repoUrl) title.href = repoUrl;

      card.querySelector(".card-desc").textContent = p.description;

      const topics = card.querySelector(".topics");
      for (const t of p.topics.slice(0, 6)) topics.append(el("li", t));

      const lang = card.querySelector(".lang");
      if (p.language) {
        lang.querySelector("span").textContent = p.language;
        lang.querySelector(".dot").style.background = LANG_COLORS[p.language] || "";
      } else {
        lang.remove();
      }
      card.querySelector(".stars").textContent = `★ ${p.stars}`;
      card.querySelector(".forks").textContent = `⑂ ${p.forks}`;
      card.querySelector(".updated").textContent = p.updated ? `Atualizado em ${dateFmt.format(parseDate(p.updated))}` : "";
      if (p.source === "manual") {
        card.querySelector(".stars").remove();
        card.querySelector(".forks").remove();
      }

      const code = card.querySelector(".btn.code");
      if (repoUrl) code.href = repoUrl; else code.remove();

      const demoUrl = safeUrl(p.homepage);
      if (demoUrl) {
        const demo = card.querySelector(".btn.demo");
        demo.href = demoUrl;
        demo.hidden = false;
      }

      grid.append(card);
    }

    // Avisos de erro (API, configuração) têm prioridade sobre a contagem
    if (state.notice) setStatus(state.notice, true);
    else if (state.projects.length && !list.length) setStatus("Nenhum projeto corresponde ao filtro.");
    else if (state.projects.length) setStatus(`${list.length} de ${state.projects.length} projetos`);
  }

  // ---------- inicialização ----------

  async function init() {
    $("#search").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

    const config = (await getJson("config.json", { optional: true })) || {};
    const manual = (await getJson("projects.json", { optional: true })) || [];
    const featured = (config.featuredRepos || []).map((n) => String(n).toLowerCase());
    const excluded = new Set((config.excludeRepos || []).map((n) => String(n).toLowerCase()));
    const username = resolveUser(config);

    let user = null;
    let repos = [];
    if (!username) {
      state.notice = "Defina \"githubUser\" em config.json para carregar seus repositórios do GitHub.";
    } else {
      setStatus("Buscando repositórios no GitHub…");
      try {
        [user, repos] = await Promise.all([
          github(`/users/${encodeURIComponent(username)}`),
          github(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`),
        ]);
      } catch (err) {
        const msg = err.status === 404 ? `Usuário "${username}" não encontrado no GitHub.`
          : err.rateLimited ? "Limite de requisições da API do GitHub atingido. Tente novamente em alguns minutos."
          : "Não foi possível falar com a API do GitHub agora.";
        state.notice = msg;
      }
    }

    const fromGithub = repos
      .filter((r) => !r.fork || config.includeForks)
      .filter((r) => !r.archived || config.includeArchived)
      .filter((r) => !excluded.has(r.name.toLowerCase()))
      .map((r) => fromRepo(r, featured));

    state.projects = [...fromGithub, ...(Array.isArray(manual) ? manual.map(fromManual) : [])];

    renderProfile(config, user);
    renderStats(user);
    renderLanguageChips();
    renderGrid();
    if (!state.projects.length && username && user) setStatus("Nenhum repositório público encontrado.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
