# 2. Configuração Inicial e Integração com o GitHub

## 2.1 Ambiente GitHub dedicado ao projeto

1. Criar (ou usar) a conta em **github.com** e ativar a autenticação em dois fatores antes de qualquer outra coisa (detalhes na seção 3).
2. Criar o repositório: **New repository**, nome `portfoliohub`, visibilidade **Public** (necessário para o GitHub Pages gratuito), sem README inicial (o projeto já traz um).
3. Em **Settings > General**: ativar **Issues**, **Projects** e **Discussions**; desativar **Wiki** (a documentação fica versionada em `docs/`); em *Pull Requests*, permitir apenas **Squash merging** e marcar **Automatically delete head branches**.
4. Adicionar descrição, site (`https://victoralbucorde.github.io/portfoliohub/`) e tópicos (`portfolio`, `github-pages`, `bootcamp`) na página inicial do repositório.

## 2.2 Envio do código

Na pasta do projeto, no terminal:

```
git init -b main
git add .
git commit -m "feat: implantação inicial do PortfolioHUB"
git remote add origin https://github.com/victoralbucorde/portfoliohub.git
git push -u origin main
```

O usuário `victoralbucorde` já está configurado em `config.json`, `projects.json`, `.github/CODEOWNERS` e `.github/ISSUE_TEMPLATE/config.yml`.

## 2.3 Estrutura do repositório

| Caminho | Conteúdo |
|---|---|
| `index.html` | Página do PortfolioHUB, com Content Security Policy |
| `assets/js/app.js` | Integração com a API do GitHub, filtros, busca e ordenação |
| `assets/css/style.css` | Visual responsivo com tema claro e escuro |
| `config.json` | Usuário do GitHub, nome, bio, projetos em destaque e links |
| `projects.json` | Projetos cadastrados manualmente (fora do GitHub) |
| `.github/workflows/` | CI, CodeQL e deploy no GitHub Pages |
| `.github/CODEOWNERS` | Responsáveis obrigatórios pela revisão |
| `.github/dependabot.yml` | Atualização automática das Actions |
| `.github/ISSUE_TEMPLATE/`, `pull_request_template.md` | Padronização de issues e PRs |
| `SECURITY.md`, `CONTRIBUTING.md`, `LICENSE` | Políticas do projeto |
| `docs/` | Documentação completa da implantação |

## 2.4 Integração das funcionalidades do GitHub no PortfolioHUB

O PortfolioHUB usa o GitHub como **armazenamento e fonte de dados** dos projetos:

- **Listagem automática:** `app.js` consulta `GET /users/{usuario}` e `GET /users/{usuario}/repos` na API REST pública. Cada repositório vira um card com nome, descrição, linguagem, tópicos, estrelas, forks, data do último push, link para o código e link para a demonstração (campo *Website* do repositório).
- **Curadoria via `config.json`:** `featuredRepos` marca destaques, `excludeRepos` esconde repositórios, `includeForks` e `includeArchived` controlam o que aparece.
- **Projetos externos via `projects.json`:** permite exibir trabalhos que não estão no GitHub, mantendo tudo versionado.
- **Publicar um projeto novo = criar um repositório público.** Ele aparece no portfólio automaticamente, sem editar o site.
- **Filtros e busca:** por linguagem, nome, descrição e tópicos; ordenação por destaque, data, estrelas ou nome.
- **Pré-visualização de outro perfil:** `?user=nome` na URL (validado com a regra de nomes do GitHub).
- **Sem token no front-end:** só endpoints públicos são usados; um cache de 10 minutos no navegador reduz chamadas à API.

## 2.5 Publicação no GitHub Pages

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. O workflow `deploy.yml` roda a cada push na `main`: copia apenas os arquivos públicos (`index.html`, `config.json`, `projects.json`, `assets/`) para `_site` e publica com `actions/deploy-pages`.
3. O endereço final aparece em **Settings > Pages** e no ambiente `github-pages` da aba **Actions**.
4. Em **Settings > Environments > github-pages**, restringir o deploy à branch `main` (*Deployment branches: Selected branches*).

> **Evidência:** inserir prints do repositório criado, da aba Actions com o deploy concluído e do site publicado.
