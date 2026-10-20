# PortfolioHUB

Plataforma centralizada para exibir e gerenciar projetos e portfólios digitais, integrada ao GitHub e publicada no GitHub Pages. Implantação guiada pelo Google Gemini (Entrega Final do Bootcamp I).

**Site:** https://victoralbucorde.github.io/portfoliohub/

## Recursos

- Lista automática dos repositórios públicos do GitHub (API REST), com destaques, busca, filtro por linguagem e ordenação
- Projetos extras cadastrados em `projects.json`
- Responsivo, com tema claro e escuro, sem dependências externas
- Segurança: CSP, nenhum segredo no front-end, CodeQL, Gitleaks, Dependabot, Ruleset na `main`
- Deploy contínuo no GitHub Pages via GitHub Actions

## Como usar

1. Edite `config.json` com seu usuário do GitHub, nome, bio e links.
2. (Opcional) Adicione projetos fora do GitHub em `projects.json`.
3. Rode localmente:

   ```bash
   python3 -m http.server 8000
   ```

   e acesse http://localhost:8000 (ou `http://localhost:8000/?user=octocat` para testar outro perfil).
4. Faça push para a `main` e ative *Settings > Pages > Source: GitHub Actions*.

## Documentação

| Etapa | Documento |
|---|---|
| 1. Planejamento e configuração do Gemini | [docs/01-planejamento.md](docs/01-planejamento.md) |
| 2. Configuração inicial e integração com GitHub | [docs/02-configuracao-github.md](docs/02-configuracao-github.md) |
| 3. Gestão de usuários e segurança | [docs/03-usuarios-e-seguranca.md](docs/03-usuarios-e-seguranca.md) |
| 4. Compartilhamento e controle de acesso | [docs/04-colaboracao.md](docs/04-colaboracao.md) |
| 5. Integração final e testes | [docs/05-testes-e-lancamento.md](docs/05-testes-e-lancamento.md) |
| 6. Revisão final e apresentação | [docs/06-apresentacao.md](docs/06-apresentacao.md) |
| Prompts do Gemini | [docs/apendice-a-prompts-gemini.md](docs/apendice-a-prompts-gemini.md) |

Veja também [SECURITY.md](SECURITY.md) e [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

[MIT](LICENSE)
