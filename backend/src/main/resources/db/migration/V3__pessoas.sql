-- Dados pessoais (LGPD). CPF e endereço opcionais até a ONG decidir se são necessários.
create table pessoa (
    id               uuid primary key,
    versao           bigint       not null,
    organizacao_id   bigint       not null references organizacao (id),
    nome             varchar(150) not null,
    telefone         varchar(20),
    email            varchar(200),
    cpf              varchar(11),
    endereco         text,
    observacoes      text,
    consentimento_em timestamptz,
    criado_em        timestamptz  not null,
    atualizado_em    timestamptz  not null,
    criado_por       varchar(150) not null,
    atualizado_por   varchar(150) not null,
    constraint ck_pessoa_contato check (telefone is not null or email is not null)
);

create unique index uk_pessoa_cpf on pessoa (cpf) where cpf is not null;
create index ix_pessoa_nome on pessoa (lower(nome));
