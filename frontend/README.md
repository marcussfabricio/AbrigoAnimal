# Frontend · ESBOÇO (não é o MVP)

React 19 + Vite, JavaScript (ADR-003). Baseado no protótipo visual da equipe (`AbrigoAnimal-frontend`).
**Objetivo agora:** a equipe navegar, discutir e alterar o visual. **Ainda NÃO conversa com o backend.**

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
```

## Como o front vai se ligar ao back (a "costura")

```
 Telas (App.jsx, Admin.jsx...)
        │   só chamam funções de src/api/ — não sabem de onde vêm os dados
        ▼
 src/api/vitrineApi.js, solicitacoesApi.js      ← CONTRATO: mesmo formato do backend
        │
        ├── VITE_USAR_API=false (hoje) → src/api/mock/  (dados de exemplo)
        └── VITE_USAR_API=true  (integração) → src/api/cliente.js → fetch("/api/...") → Spring
```

| Arquivo | Papel |
|---|---|
| `src/api/config.js` | A chave: mock ou backend real |
| `src/api/vitrineApi.js` | Animais da vitrine (`GET /api/public/animais`) |
| `src/api/solicitacoesApi.js` | Formulário de interesse (`POST /api/public/solicitacoes`) — ainda não usado pelas telas |
| `src/api/cliente.js` | Único lugar com `fetch`: cookie de sessão, CSRF, erros do backend |
| `src/api/adaptadores.js` | Traduz o formato da API para o formato dos componentes do protótipo |
| `src/api/mock/animais.js` | Dados de exemplo **no formato exato do backend** |

**Regra para a equipe:** tela nova que precisa de dados → cria/usa uma função em `src/api/`,
nunca `fetch` direto na tela e nunca importar arquivo de dados na tela.
Assim, a integração final é trocar a chave, não reescrever telas.

Contrato completo da API: [`../docs/api.md`](../docs/api.md).

## Ligar no backend (só na fase de integração)

1. Backend rodando em `localhost:8080`
2. Criar `frontend/.env.local` com `VITE_USAR_API=true`
3. `npm run dev` → o Vite repassa `/api` e `/arquivos` para o Spring (ver `vite.config.js`)

## Prévia para a equipe

O workflow `.github/workflows/frontend-pages.yml` publica o esboço no GitHub Pages a cada push em `frontend/`
(ativar em Settings → Pages → Source: GitHub Actions).

## Divergências protótipo × backend (validar com a equipe)

Ver a nota do vault **Integração Back-Front**. Resumo: contas de visitante, campos extras do formulário,
porte/temperamento, financeiro e estoque (fora do escopo), só cães (o abrigo tem 27 gatos).
