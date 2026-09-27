create table solicitacao (
    id                 uuid primary key,
    versao             bigint       not null,
    organizacao_id     bigint       not null references organizacao (id),
    tipo               varchar(20)  not null,
    animal_id          uuid references animal (id),
    nome               varchar(150) not null,
    telefone           varchar(20),
    email              varchar(200),
    mensagem           text,
    consentimento_em   timestamptz  not null,
    status             varchar(20)  not null,
    observacao_interna text,
    criado_em          timestamptz  not null,
    atualizado_em      timestamptz  not null,
    criado_por         varchar(150) not null,
    atualizado_por     varchar(150) not null,
    constraint ck_solicitacao_tipo    check (tipo in ('APADRINHAR', 'ADOTAR', 'OUTRO')),
    constraint ck_solicitacao_status  check (status in ('NOVA', 'EM_CONTATO', 'CONCLUIDA', 'DESCARTADA')),
    constraint ck_solicitacao_contato check (telefone is not null or email is not null)
);

create index ix_solicitacao_status on solicitacao (status, criado_em desc);
