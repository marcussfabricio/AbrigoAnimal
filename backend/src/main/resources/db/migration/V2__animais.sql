create table animal (
    id                       uuid primary key,
    versao                   bigint       not null,
    organizacao_id           bigint       not null references organizacao (id),
    nome                     varchar(120) not null,
    slug                     varchar(160) not null,
    especie                  varchar(20)  not null,
    sexo                     varchar(20)  not null,
    cor                      varchar(80),
    data_nascimento_estimada date,
    castrado                 boolean      not null default false,
    chip                     varchar(40),
    canil                    varchar(40),
    ala                      varchar(40),
    idoso                    boolean      not null default false,
    medicacao_continua       boolean      not null default false,
    descricao                text,
    medicacoes               text,
    condicoes_saude          text,
    vacinas                  text,
    situacao                 varchar(20)  not null,
    data_obito               date,
    visivel_na_vitrine       boolean      not null default true,
    criado_em                timestamptz  not null,
    atualizado_em            timestamptz  not null,
    criado_por               varchar(150) not null,
    atualizado_por           varchar(150) not null,
    constraint ck_animal_especie  check (especie in ('CAO', 'GATO')),
    constraint ck_animal_sexo     check (sexo in ('MACHO', 'FEMEA', 'INDEFINIDO')),
    constraint ck_animal_situacao check (situacao in ('DISPONIVEL', 'EM_TRATAMENTO', 'ADOTADO', 'OBITO')),
    constraint ck_animal_obito    check (situacao <> 'OBITO' or data_obito is not null)
);

create unique index uk_animal_slug on animal (slug);
create unique index uk_animal_chip on animal (chip) where chip is not null;
create index ix_animal_vitrine on animal (visivel_na_vitrine, situacao);
create index ix_animal_nome on animal (lower(nome));

create table foto_animal (
    id             uuid primary key,
    animal_id      uuid         not null references animal (id) on delete cascade,
    chave_arquivo  varchar(300) not null,
    principal      boolean      not null,
    ordem          integer      not null,
    adicionada_em  timestamptz  not null
);

create index ix_foto_animal_animal on foto_animal (animal_id);
