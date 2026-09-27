# API · Fase 1

Base: `/api`. Erros no formato Problem Details: `{ title, status, detail, campos? }`.

## Autenticação (sessão com cookie)

1. `GET /api/auth/csrf` → gera o cookie `XSRF-TOKEN`.
2. `POST /api/auth/login` (form-urlencoded: `username`, `password`) com header `X-XSRF-TOKEN` = valor do cookie → `204`.
3. Todo `POST/PUT/DELETE` interno envia o header `X-XSRF-TOKEN`.
4. `GET /api/auth/me` → usuário logado (`401` se não houver sessão).
5. `POST /api/auth/logout` → `204`.

## Interna (exige login)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/animais?busca&especie&situacao&ala&idoso&pagina&tamanho` | Lista paginada |
| GET | `/api/animais/{id}` | Detalhe |
| POST | `/api/animais` | Cadastrar |
| PUT | `/api/animais/{id}` | Editar (enviar `versao`; `409` se alguém salvou antes) |
| POST | `/api/animais/{id}/situacao` | `{situacao}`: DISPONIVEL, EM_TRATAMENTO, ADOTADO |
| POST | `/api/animais/{id}/obito` | `{data}` (estado final, sai da vitrine) |
| POST | `/api/animais/{id}/vitrine` | `{visivel}` |
| POST | `/api/animais/{id}/fotos` | multipart `arquivo` (JPG/PNG/WEBP, até 3 MB) |
| DELETE | `/api/animais/{id}/fotos/{fotoId}` | Remover foto |
| POST | `/api/animais/{id}/fotos/{fotoId}/principal` | Definir foto principal |
| GET/POST/PUT | `/api/pessoas`, `/api/pessoas/{id}` | Cadastro de pessoas (`?busca=` por nome, e-mail, telefone) |
| GET | `/api/apadrinhamentos?animalId=` ou `?pessoaId=` | Padrinhos do animal / afilhados da pessoa |
| POST | `/api/apadrinhamentos` | `{pessoaId, animalId, tipoApoio, dataInicio?, observacoes?}` |
| POST | `/api/apadrinhamentos/{id}/encerrar` | `{dataFim?}` |
| POST | `/api/apadrinhamentos/{id}/tipo-apoio` | `{tipoApoio}`: AFETIVO, FINANCEIRO, AMBOS |
| GET | `/api/solicitacoes?status&pagina&tamanho` | Caixa de solicitações |
| POST | `/api/solicitacoes/{id}/status` | `{status, observacao?}`: NOVA, EM_CONTATO, CONCLUIDA, DESCARTADA |
| GET/POST | `/api/usuarios` | Usuários da equipe |
| POST | `/api/usuarios/{id}/desativar` | Desativar usuário |

## Pública (sem login)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/public/animais?especie&sexo&idoso&pagina&tamanho` | Vitrine |
| GET | `/api/public/animais/{slug}` | Página do animal |
| POST | `/api/public/solicitacoes` | `{tipo, animalSlug?, nome, telefone?, email?, mensagem?, consentimento: true, site: ""}` → `{protocolo}` |
| GET | `/animais/{slug}` | HTML com meta tags Open Graph (prévia no WhatsApp) |
| GET | `/arquivos/{chave}` | Fotos |

> O campo `site` do formulário é uma **isca para robôs**: deve existir escondido no HTML e ficar vazio.
