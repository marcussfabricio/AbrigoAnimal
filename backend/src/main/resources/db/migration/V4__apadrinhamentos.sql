-- No código, apadrinhamento guarda só os ids (fronteira entre módulos).
-- No banco, as chaves estrangeiras garantem que ninguém aponte para pessoa/animal inexistente.
create table apadrinhamento (
    id             uuid primary key,
    versao         bigint       not null,
    organizacao_id bigint       not null references organizacao (id),
    pessoa_id      uuid         not null references pessoa (id),
    animal_id      uuid         not null references animal (id),
    tipo_apoio     varchar(20)  not null,
    data_inicio    date         not null,
    data_fim       date,
    observacoes    text,
    criado_em      timestamptz  not null,
    atualizado_em  timestamptz  not null,
    criado_por     varchar(150) not null,
    atualizado_por varchar(150) not null,
    constraint ck_apadrinhamento_tipo  check (tipo_apoio in ('AFETIVO', 'FINANCEIRO', 'AMBOS')),
    constraint ck_apadrinhamento_datas check (data_fim is null or data_fim >= data_inicio)
);

-- Uma pessoa não pode ter dois apadrinhamentos ATIVOS do mesmo animal (último guarda-chuva da regra).
create unique index uk_apadrinhamento_ativo on apadrinhamento (pessoa_id, animal_id) where data_fim is null;
create index ix_apadrinhamento_animal on apadrinhamento (animal_id);
create index ix_apadrinhamento_pessoa on apadrinhamento (pessoa_id);
