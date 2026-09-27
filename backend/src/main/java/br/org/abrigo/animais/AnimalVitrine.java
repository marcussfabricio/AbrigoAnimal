package br.org.abrigo.animais;

import java.util.List;

/**
 * Somente os dados PÚBLICOS de um animal (primeira barreira da LGPD/privacidade).
 * Não contém chip, canil, ala nem dados de auditoria.
 */
public record AnimalVitrine(
        String nome,
        String slug,
        Especie especie,
        Sexo sexo,
        String cor,
        Integer idadeAnos,
        boolean castrado,
        boolean idoso,
        boolean medicacaoContinua,
        String descricao,
        String medicacoes,
        String condicoesSaude,
        String vacinas,
        SituacaoAnimal situacao,
        String fotoPrincipal,
        List<String> fotos) {
}
