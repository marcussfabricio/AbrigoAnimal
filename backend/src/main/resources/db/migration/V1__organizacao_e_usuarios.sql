-- Organização: hoje só existe a ONG 1. A coluna organizacao_id em todas as tabelas
-- deixa a porta aberta para multi-ONG no futuro (decisão T5), sem custo agora.
create table organizacao (
    id        bigint primary key,
    nome      varchar(200) not null,
    criado_em timestamptz  not null default now()
);

insert into organizacao (id, nome) values (1, 'Abrigo Animal');

create table usuario (
    id             uuid primary key,
    versao         bigint       not null,
    organizacao_id bigint       not null references organizacao (id),
    nome           varchar(150) not null,
    email          varchar(200) not null,
    senha_hash     varchar(200) not null,
    ativo          boolean      not null,
    criado_em      timestamptz  not null,
    atualizado_em  timestamptz  not null,
    criado_por     varchar(150) not null,
    atualizado_por varchar(150) not null
);

create unique index uk_usuario_email on usuario (lower(email));
