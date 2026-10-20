# 1. Planejamento da Implantação

## 1.1 Objetivo

Implantar o **PortfolioHUB**, uma plataforma centralizada para exibir e gerenciar projetos e portfólios digitais, integrada ao GitHub (armazenamento, versionamento, colaboração e publicação) e com políticas de segurança aplicadas desde o primeiro commit. O **Google Gemini** é usado como assistente-guia em todas as etapas: planejamento, revisão de configurações, checagem de boas práticas de segurança e preparação da apresentação.

## 1.2 Escopo

**Dentro do escopo**

- Site do PortfolioHUB (HTML, CSS e JavaScript, sem dependências externas) que lista automaticamente os repositórios públicos do GitHub e projetos cadastrados manualmente.
- Repositório GitHub dedicado com README, licença, política de segurança, guia de contribuição e templates.
- Gestão de usuários: conta com 2FA, colaboradores com papéis definidos, CODEOWNERS e revisão obrigatória.
- Segurança: Content Security Policy, regras de proteção da branch `main`, varredura de segredos, CodeQL, Dependabot e reporte privado de vulnerabilidades.
- Publicação contínua no GitHub Pages via GitHub Actions.
- Documentação do processo e apresentação de 5 minutos no YouTube.

**Fora do escopo**

- Back-end próprio, banco de dados ou login no site (o site é estático e público; toda gestão de acesso acontece no GitHub).

## 1.3 Arquitetura da solução

| Camada | Tecnologia | Função |
|---|---|---|
| Código-fonte | Repositório GitHub `portfoliohub` | Armazenamento, histórico e controle de versão |
| Colaboração | Issues, Pull Requests, Projects, CODEOWNERS | Fluxo de trabalho e revisão |
| Segurança | Rulesets, Secret Scanning, CodeQL, Dependabot, Gitleaks | Proteção do código e da cadeia de publicação |
| Integração contínua | GitHub Actions (`ci.yml`, `codeql.yml`) | Validação automática a cada PR |
| Entrega contínua | GitHub Actions (`deploy.yml`) + GitHub Pages | Publicação automática ao fazer merge na `main` |
| Dados do portfólio | API REST do GitHub + `projects.json` | Lista de projetos sempre atualizada |
| Apoio/guia | Google Gemini (Gem personalizado) | Plano, revisão de segurança e checklists |
| Registro | Google Drive / Docs / Sheets | Evidências, checklist e roteiro do vídeo |

Fluxo resumido: o desenvolvedor cria uma branch, abre um Pull Request, o CI valida o conteúdo e procura segredos, o CodeQL analisa o JavaScript, o responsável (CODEOWNER) revisa e aprova, o merge na `main` dispara o deploy e o GitHub Pages publica o site. No navegador do visitante, o PortfolioHUB consulta a API pública do GitHub e monta a vitrine de projetos.

## 1.4 Cronograma

| Data | Etapa | Entregável |
|---|---|---|
| 20/10 | Planejamento e configuração do Gemini | Plano de implantação, Gem "Guia PortfolioHUB" |
| 21/10 | Configuração inicial e integração com GitHub | Repositório criado, site publicado no Pages |
| 22/10 | Gestão de usuários e segurança | 2FA, colaboradores, rulesets, scanners ativos |
| 23/10 | Compartilhamento e controle de acesso | Fluxo de PR documentado, primeiro PR revisado |
| 24/10 | Finalização da integração e testes | Plano de testes executado, release v1.0.0 |
| 25/10 | Revisão final e apresentação | Vídeo no YouTube e PDF entregue (até 23h55) |

## 1.5 Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Vazamento de token ou senha no repositório | Alto | `.gitignore` para `.env`, Push Protection, Gitleaks no CI, nenhum segredo no front-end |
| Alteração indevida na `main` | Alto | Ruleset exigindo PR, aprovação e CI verde; bloqueio de force-push |
| Injeção de script (XSS) via dados da API | Médio | CSP restritiva e uso exclusivo de `textContent` |
| Limite de requisições da API do GitHub (60/h por IP) | Baixo | Cache de 10 minutos no navegador e mensagem amigável |
| Dependências desatualizadas nas Actions | Médio | Dependabot semanal para `github-actions` |
| Atraso no prazo | Médio | Cronograma diário e checklist no Google Sheets |

## 1.6 Configuração do Google Gemini como guia

Para que o Gemini acompanhe toda a trilha com o mesmo contexto, foi criado um **Gem** (assistente personalizado) em gemini.google.com:

1. Acessar **gemini.google.com** com a conta Google, abrir **Gems** e clicar em **Novo Gem**.
2. Nome: **Guia PortfolioHUB**.
3. Colar as instruções abaixo e salvar.
4. Em cada etapa, abrir uma conversa com o Gem usando os prompts do Apêndice A e registrar as respostas (print) na pasta do projeto no Google Drive.

```
Você é meu mentor de DevOps e segurança na implantação do PortfolioHUB,
um site estático de portfólio hospedado no GitHub Pages, que lê
repositórios pela API REST pública do GitHub.

Contexto fixo:
- Repositório: portfoliohub (GitHub), branch principal: main
- Stack: HTML, CSS e JavaScript puros, sem back-end
- CI/CD: GitHub Actions (CI, CodeQL, deploy no Pages)
- Etapas: 1 Planejamento, 2 Configuração e integração GitHub,
  3 Usuários e segurança, 4 Compartilhamento e controle de acesso,
  5 Integração final e testes, 6 Revisão e apresentação

Regras:
- Responda em português, em passos numerados e verificáveis.
- Sempre aponte riscos de segurança e a boa prática correspondente
  (OWASP Top 10, princípio do menor privilégio, GitHub Docs).
- Nunca me peça senhas ou tokens; se um passo exigir segredo,
  indique onde configurá-lo com segurança (GitHub Secrets).
- Ao final de cada resposta, liste um checklist do que devo validar.
```

> **Evidência:** inserir aqui o print do Gem "Guia PortfolioHUB" criado e da primeira conversa (prompt A.1).
