# 6. Revisão Final e Apresentação

## 6.1 Soluções implementadas

- **PortfolioHUB funcional e sem dependências:** HTML, CSS e JavaScript puros, responsivo, com tema claro e escuro, busca, filtros e ordenação.
- **GitHub como fonte de dados:** os projetos vêm direto da API pública; criar um repositório já atualiza o portfólio.
- **Publicação automática:** merge na `main` dispara o deploy no GitHub Pages.
- **Segurança em camadas:** conta com 2FA, Ruleset na `main`, CODEOWNERS, Secret Scanning com Push Protection, Gitleaks, CodeQL, Dependabot, CSP e menor privilégio nos workflows.
- **Colaboração organizada:** GitHub Flow, templates, Conventional Commits, Projects e documentação versionada.
- **Gemini como guia:** Gem personalizado com o contexto do projeto, usado para planejar, revisar a segurança e montar checklists.

## 6.2 Desafios superados

| Desafio | Solução |
|---|---|
| Exibir projetos sem back-end e sem expor token | Somente endpoints públicos da API, com cache no navegador |
| Limite de 60 requisições por hora da API sem autenticação | Cache de 10 minutos e mensagem clara quando o limite é atingido |
| Impedir XSS vindo de descrições de repositórios | `textContent` em todo o código, CSP restritiva e checagem no CI |
| Data "2026-10-20" aparecia como dia 19 (fuso UTC) | Datas sem horário passaram a ser tratadas no fuso local |
| Mensagens de erro sumiam ao renderizar a lista | Avisos passaram a ter prioridade sobre o contador de projetos |
| Ruleset com aprovação obrigatória travava o merge sendo o único dono (não é possível aprovar o próprio PR) | PR e checks obrigatórios sem bypass; aprovação exigida a partir do primeiro colaborador revisor |

## 6.3 Roteiro do vídeo (5 minutos, YouTube)

Publicar como **Não listado** (ou Público) e colocar o link na capa deste documento.

| Tempo | Cena | Fala / ação |
|---|---|---|
| 0:00–0:30 | Abertura (câmera ou slide) | Nome, bootcamp e objetivo: implantar o PortfolioHUB com GitHub e Gemini |
| 0:30–1:00 | Plano de implantação | Mostrar cronograma, arquitetura e o Gem "Guia PortfolioHUB" |
| 1:00–2:00 | Site publicado | Navegar pelo portfólio: perfil, filtro por linguagem, busca, destaque, celular |
| 2:00–2:45 | Repositório | Estrutura de pastas, `config.json`, criar um repositório e ver ele aparecer no site |
| 2:45–3:45 | Segurança | 2FA, Ruleset da `main`, Secret Scanning com Push Protection, CodeQL, Dependabot, CSP no `index.html` |
| 3:45–4:30 | Colaboração | Abrir um PR, mostrar checks verdes, revisão do CODEOWNER, merge e deploy automático |
| 4:30–5:00 | Encerramento | Desafios superados, próximos passos e agradecimento |

Dicas de gravação: gravar a tela com o OBS Studio ou o gravador nativo do sistema, em 1080p; esconder e-mails, códigos de 2FA e tokens antes de gravar; adicionar capítulos na descrição do YouTube usando os tempos acima.

## 6.4 Próximos passos

- Página de detalhes por projeto lendo o README do repositório.
- Domínio próprio com HTTPS.
- Testes automatizados de interface (Playwright) no CI.
- Formulário de contato via serviço externo, mantendo a CSP.
