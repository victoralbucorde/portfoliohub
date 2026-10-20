# Como contribuir

## Rodando localmente

```bash
python3 -m http.server 8000
```

Acesse http://localhost:8000.

## Fluxo

1. Abra (ou escolha) uma issue.
2. Crie uma branch a partir da `main`: `feat/…`, `fix/…`, `docs/…` ou `chore/…`.
3. Faça commits no padrão Conventional Commits (`feat: adiciona filtro por tópico`).
4. Abra um Pull Request preenchendo o template e referenciando a issue (`Closes #N`).
5. Aguarde os checks (CI, Gitleaks, CodeQL) e a revisão do CODEOWNER.
6. O merge é feito por *squash*; o deploy é automático.

## Regras

- Nunca adicione tokens, senhas ou dados pessoais. Se acontecer, avise o responsável imediatamente para revogar o segredo.
- Use `textContent` (nunca `innerHTML`) para exibir dados externos.
- Não adicione scripts ou estilos de terceiros sem atualizar a CSP e justificar no PR.
- Mantenha `config.json` e `projects.json` como JSON válido.

Contribuições externas são bem-vindas via fork.
