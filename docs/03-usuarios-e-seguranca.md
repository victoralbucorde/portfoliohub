# 3. Gestão de Usuários e Segurança

## 3.1 Proteção da conta

- **Autenticação em dois fatores (2FA)** obrigatória: *Settings > Password and authentication > Enable two-factor authentication*, com app autenticador (Google Authenticator, por exemplo) e **passkey** como segundo método. Os códigos de recuperação ficam guardados fora do computador.
- **E-mail privado nos commits:** *Settings > Emails > Keep my email addresses private* e *Block command line pushes that expose my email*.
- **Commits assinados (opcional, recomendado):** chave SSH de assinatura cadastrada em *Settings > SSH and GPG keys* e `git config commit.gpgsign true`, exibindo o selo *Verified* nos commits.
- **Tokens:** quando necessários, apenas *fine-grained personal access tokens*, com acesso a um único repositório, permissões mínimas e validade curta. Nenhum token é usado pelo site.

## 3.2 Usuários, papéis e integração com o PortfolioHUB

O site é público e somente leitura; **quem pode alterar o PortfolioHUB é definido pelas permissões do repositório no GitHub**. Por isso a gestão de usuários do PortfolioHUB é feita no GitHub:

| Papel | Permissão no GitHub | O que pode fazer |
|---|---|---|
| Responsável (owner) | Admin | Configurações, segurança, aprovação final e merge |
| Mantenedor | Maintain | Gerenciar issues, PRs e releases, sem acesso a configurações sensíveis |
| Colaborador | Write | Criar branches e abrir PRs (não pode enviar direto para a `main`) |
| Revisor / tutor | Triage ou Read | Comentar, revisar e classificar issues |
| Visitante | Público | Ver o site e o código, abrir issues e PRs via fork |

Passos: *Settings > Collaborators and teams > Add people*, escolhendo o papel de menor privilégio que permita a tarefa. Se o projeto crescer, migrar o repositório para uma **Organização** e usar **Teams** (`@org/mantenedores`, `@org/revisores`) com 2FA exigida para todos os membros.

O arquivo `.github/CODEOWNERS` liga os usuários ao fluxo: qualquer PR que altere o projeto pede automaticamente a revisão do responsável, e mudanças em `.github/` e `SECURITY.md` sempre exigem essa aprovação.

## 3.3 Proteção da branch principal (Ruleset)

Em *Settings > Rules > Rulesets > New branch ruleset*, alvo `main`, modo **Active**:

- **Restrict deletions** e **Block force pushes**.
- **Require a pull request before merging**: 1 aprovação, *Require review from Code Owners*, *Dismiss stale approvals when new commits are pushed*, *Require conversation resolution*.
- **Atenção (projeto individual):** o GitHub não permite aprovar o próprio PR. Enquanto não houver outro colaborador, use **0 aprovações** (o PR e os checks continuam obrigatórios) ou convide um colega/tutor com papel *Write* para revisar. Ao ganhar colaboradores, volte para 1 aprovação.
- **Require status checks to pass**: `Validar conteúdo`, `Varredura de segredos` e `Análise estática (JavaScript)`, com a branch atualizada antes do merge.
- **Require linear history** (combina com *squash merge*).
- **Bypass list** vazia (nem o administrador envia direto para a `main` ou pula os checks).

## 3.4 Recursos de segurança ativados

Em *Settings > Code security and analysis*:

| Recurso | Função |
|---|---|
| Dependency graph + Dependabot alerts | Avisa sobre vulnerabilidades conhecidas nas dependências |
| Dependabot security updates + `dependabot.yml` | Abre PRs automáticos para atualizar as Actions |
| Secret scanning + **Push protection** | Bloqueia o push se houver token ou chave no commit |
| Code scanning (CodeQL, `security-extended`) | Análise estática do JavaScript a cada PR e semanalmente |
| Private vulnerability reporting | Canal privado para reportar falhas (ver `SECURITY.md`) |

## 3.5 Segurança no próprio PortfolioHUB

| Ameaça | Controle implementado |
|---|---|
| XSS (OWASP A03 – Injeção) | Dados da API inseridos só com `textContent`; o CI falha se aparecer `innerHTML` |
| Script ou recurso de terceiros | **CSP**: `script-src 'self'`, `connect-src` limitado a `api.github.com`, `object-src 'none'`, `form-action 'none'` |
| Link malicioso (`javascript:`) | `safeUrl()` aceita apenas `http` e `https` |
| Tabnabbing | Todos os links externos com `rel="noopener noreferrer"` |
| Parâmetro de URL manipulado | `?user=` validado com a expressão regular de nomes do GitHub |
| Vazamento de segredos (A02/A05) | Site sem tokens; `.gitignore` de `.env`/chaves; Gitleaks no CI e Push Protection |
| Cadeia de publicação (A08) | Workflows com `permissions` mínimas; deploy só pela `main`, via ambiente protegido |
| Componentes desatualizados (A06) | Dependabot semanal; nenhuma biblioteca JavaScript externa |
| Vazamento de origem | `Referrer-Policy: strict-origin-when-cross-origin` |

## 3.6 Conformidade com boas práticas usando o Gemini

As configurações foram revisadas com o Gem "Guia PortfolioHUB" usando os prompts A.3 e A.4 do Apêndice A. O Gemini recebeu o conteúdo de `index.html` (CSP), dos workflows e a lista de recursos ativados, e devolveu um checklist com base no OWASP Top 10 e na documentação do GitHub. Cada item foi conferido e registrado na planilha de checklist (Google Sheets).

> **Evidência:** inserir prints da tela de 2FA ativa (sem códigos visíveis), do Ruleset da `main`, de *Code security and analysis* e da resposta do Gemini ao prompt A.3.
