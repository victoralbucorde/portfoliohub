# 5. Finalização da Integração e Testes

## 5.1 Etapas finais de integração

Com o apoio do Gemini (prompt A.5), as etapas restantes foram conferidas:

- [ ] `githubUser`, nome, bio e links preenchidos em `config.json`
- [ ] Repositórios principais com descrição, tópicos e campo *Website* preenchidos no GitHub
- [ ] Projetos em destaque definidos em `featuredRepos`
- [ ] GitHub Pages publicado pela Action e restrito à `main`
- [ ] Ruleset ativo e testado (push direto na `main` recusado)
- [ ] Secret scanning, Push protection, Dependabot e CodeQL ativos
- [ ] Reporte privado de vulnerabilidades ativo

## 5.2 Plano de testes

| # | Teste | Resultado esperado |
|---|---|---|
| T1 | Abrir o site com um usuário válido | Perfil, estatísticas e cards dos repositórios carregados |
| T2 | Filtrar por linguagem e buscar por texto | Apenas os projetos correspondentes aparecem e o contador muda |
| T3 | Trocar a ordenação | Ordem por destaque, data, estrelas e nome funciona |
| T4 | Usuário inexistente (`?user=nao-existe-xyz`) | Mensagem "Usuário não encontrado no GitHub" |
| T5 | `config.json` sem usuário configurado | Aviso para definir `githubUser`; projetos manuais continuam visíveis |
| T6 | Abrir no celular (375 px) | Layout em uma coluna, sem rolagem horizontal |
| T7 | Tema escuro do sistema | Cores ajustadas automaticamente |
| T8 | Console do navegador | Nenhuma violação de CSP |
| T9 | Push direto na `main` | Recusado pelo Ruleset |
| T10 | Commit com token falso de teste em uma branch | Bloqueado pela Push Protection ou reprovado pelo Gitleaks |
| T11 | PR alterando `projects.json` com JSON inválido | CI falha e o merge fica bloqueado |
| T12 | Merge de PR aprovado | Deploy automático e site atualizado em poucos minutos |

Os testes T1 a T8 foram executados localmente (`python3 -m http.server 8000`) durante o desenvolvimento, inclusive contra a API real do GitHub. Os testes T9 a T12 dependem do repositório publicado e devem ser executados e registrados com prints.

## 5.3 Preparação para produção

- Remover qualquer texto de exemplo (como `SEU-PERFIL` no link do LinkedIn).
- Conferir no **PageSpeed Insights** / Lighthouse: desempenho, acessibilidade e boas práticas.
- Criar a release **v1.0.0** em *Releases > Draft a new release*, com notas geradas automaticamente.
- (Opcional) Domínio próprio em *Settings > Pages > Custom domain*, com **Enforce HTTPS** marcado.
- Divulgar o link no LinkedIn e no perfil do GitHub (README de perfil).

## 5.4 Manutenção contínua

- PRs do Dependabot revisados semanalmente.
- Alertas de *Security* verificados a cada release.
- CodeQL agendado toda segunda-feira.
- Novos projetos entram automaticamente ao criar repositórios públicos.

> **Evidência:** inserir prints dos testes T9 a T12, da release v1.0.0 e do relatório do Lighthouse.
