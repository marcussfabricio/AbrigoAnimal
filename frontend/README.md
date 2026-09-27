# Frontend (a construir)

React + Vite em **JavaScript** (ADR-003), mobile-first, PWA.

- O protótipo em HTML do repositório `AbrigoAnimal` serve como **referência visual**.
- Estrutura prevista: `src/app`, `src/features/{animais,pessoas,apadrinhamento,vitrine,solicitacoes,identidade}`, `src/shared`.
- Em desenvolvimento, o `vite.config.js` deve ter proxy de `/api`, `/arquivos` e `/animais` para `http://localhost:8080`.
- Rotas internas (equipe) ficam sob `/gestao/...`; `/animais/{slug}` é a página pública de cada animal.

Contrato da API: ver `docs/api.md`.
