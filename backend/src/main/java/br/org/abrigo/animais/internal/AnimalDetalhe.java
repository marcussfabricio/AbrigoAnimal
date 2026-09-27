package br.org.abrigo.animais.internal;

import br.org.abrigo.animais.Especie;
import br.org.abrigo.animais.Sexo;
import br.org.abrigo.animais.SituacaoAnimal;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/** Visão completa (interna) de um animal para a equipe da ONG. */
public record AnimalDetalhe(
        UUID id,
        Long versao,
        String nome,
        String slug,
        Especie especie,
        Sexo sexo,
        String cor,
        LocalDate dataNascimentoEstimada,
        Integer idadeAnos,
        boolean castrado,
        String chip,
        String canil,
        String ala,
        boolean idoso,
        boolean medicacaoContinua,
        String descricao,
        String medicacoes,
        String condicoesSaude,
        String vacinas,
        SituacaoAnimal situacao,
        LocalDate dataObito,
        boolean visivelNaVitrine,
        List<Foto> fotos,
        Instant criadoEm,
        Instant atualizadoEm,
        String atualizadoPor) {

    public record Foto(UUID id, String url, boolean principal) {
    }
}
