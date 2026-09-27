# Decisões técnicas (ADRs)

Decisões de negócio e de escopo ficam no vault Obsidian. Aqui ficam as decisões TÉCNICAS,
versionadas junto com o código que elas justificam.

| # | Decisão |
|---|---|
| [0001](0001-monolito-modular.md) | Monólito modular com Spring Modulith, um único deploy |
| [0002](0002-sessao-com-cookie.md) | Autenticação por sessão (cookie httpOnly + CSRF), não JWT |
| [0003](0003-armazenamento-atras-de-interface.md) | Fotos atrás de uma interface; disco agora, R2/S3 depois |
