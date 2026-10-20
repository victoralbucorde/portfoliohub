# Política de Segurança

## Versões suportadas

Apenas a versão publicada a partir da branch `main` recebe correções.

## Como reportar uma vulnerabilidade

**Não abra issue pública.** Use o reporte privado do GitHub: aba **Security > Report a vulnerability** deste repositório.

Inclua: descrição do problema, passos para reproduzir, impacto e, se possível, sugestão de correção. A resposta inicial ocorre em até 72 horas e a correção é priorizada conforme a gravidade.

## Práticas adotadas

- 2FA obrigatória para quem tem acesso de escrita
- Ruleset na `main`: PR obrigatório, checks verdes, sem force-push e sem bypass; revisão de CODEOWNER sempre que houver outro colaborador
- Secret scanning com Push Protection e Gitleaks no CI
- CodeQL (`security-extended`) em todo PR e semanalmente
- Dependabot para as GitHub Actions
- Content Security Policy restritiva e nenhum token no front-end
- Workflows com permissões mínimas (`permissions:` explícito)

## Escopo

Este é um site estático. Não há coleta de dados pessoais, login ou back-end. A única chamada externa é à API pública do GitHub.
