# 4. Compartilhamento e Controle de Acesso com GitHub

## 4.1 Integração do repositório ao PortfolioHUB

- Cada card do portfólio aponta para o repositório correspondente (**Código**) e para a demonstração publicada (**Ver online**), permitindo que qualquer pessoa acesse, clone ou faça fork do código.
- O próprio PortfolioHUB é um repositório público: todo o histórico de mudanças fica visível em *Commits*, *Pull requests* e *Releases*.
- O cabeçalho do site leva ao perfil do GitHub; a seção "Sobre" explica o fluxo de publicação.

## 4.2 Fluxo de trabalho (GitHub Flow)

1. **Issue:** toda tarefa começa como issue (templates *Relatar problema* e *Sugerir melhoria*), com rótulo e entrada no quadro do GitHub Projects (*A fazer > Em andamento > Em revisão > Concluído*).
2. **Branch:** criada a partir da `main` com prefixo pelo tipo: `feat/`, `fix/`, `docs/`, `chore/` (ex.: `feat/filtro-por-topico`).
3. **Commits:** padrão *Conventional Commits* (`feat:`, `fix:`, `docs:`, `chore:`), pequenos e descritivos.
4. **Pull Request:** usa o template com checklist de segurança e `Closes #N` para fechar a issue automaticamente.
5. **Verificações automáticas:** CI (JSON, arquivos obrigatórios, CSP), Gitleaks e CodeQL precisam ficar verdes.
6. **Revisão:** o CODEOWNER revisa, comenta linha a linha e aprova ou pede mudanças; todas as conversas precisam estar resolvidas.
7. **Merge:** *squash merge* na `main`, a branch é apagada automaticamente e o deploy publica o site.
8. **Release:** marcos importantes recebem tag semântica (`v1.0.0`) e notas geradas automaticamente.

```
git switch -c feat/novo-projeto
# editar projects.json
git add projects.json
git commit -m "feat: adiciona projeto de API de tarefas"
git push -u origin feat/novo-projeto
# abrir o Pull Request no GitHub
```

## 4.3 Controle de acesso no compartilhamento

| Situação | Como é tratada |
|---|---|
| Pessoa externa quer contribuir | Faz fork e abre PR; Actions de forks rodam sem acesso a segredos |
| Colaborador interno | Papel *Write*, trabalha em branches; não consegue enviar direto para a `main` |
| Revisor ou tutor do bootcamp | Papel *Triage* ou *Read* |
| Vulnerabilidade encontrada | Reporte privado (*Security > Report a vulnerability*), nunca issue pública |
| Saída de um colaborador | Remoção em *Collaborators* e revisão das chaves de deploy e tokens |

## 4.4 Práticas de colaboração adotadas

- `CONTRIBUTING.md` explica como rodar localmente, o padrão de branches e commits e o checklist do PR.
- Templates de issue e PR garantem informações mínimas e lembram de não expor dados sensíveis.
- Revisão obrigatória por CODEOWNER, inclusive para o administrador.
- Discussões técnicas em *Discussions*; tarefas em *Issues*; planejamento em *Projects*.
- Ferramentas Google Workspace no apoio: pasta compartilhada no **Drive** com as evidências, **Docs** com o roteiro do vídeo, **Sheets** com o checklist de implantação e **Gemini** para revisar textos de PR e documentação.

> **Evidência:** inserir prints de um Pull Request com revisão aprovada, dos checks verdes e do quadro no GitHub Projects.
