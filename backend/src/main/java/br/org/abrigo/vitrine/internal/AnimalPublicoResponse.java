package br.org.abrigo.vitrine.internal;

import br.org.abrigo.animais.AnimalVitrine;
import br.org.abrigo.animais.Especie;
import br.org.abrigo.animais.Sexo;
import br.org.abrigo.animais.SituacaoAnimal;

import java.util.List;

/**
 * DTO PRÓPRIO da API pública — segunda barreira de privacidade.
 * Mesmo que AnimalVitrine ganhe um campo amanhã, ele só aparece aqui se alguém
 * adicionar explicitamente (e o teste ApiPublicaSemDadosSensiveisTest vigia isso).
 */
record AnimalPublicoResponse(
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
        boolean disponivelParaAdocao,
        String fotoPrincipal,
        List<String> fotos) {

    static AnimalPublicoResponse de(AnimalVitrine a) {
        return new AnimalPublicoResponse(a.nome(), a.slug(), a.especie(), a.sexo(), a.cor(), a.idadeAnos(),
                a.castrado(), a.idoso(), a.medicacaoContinua(), a.descricao(), a.medicacoes(),
                a.condicoesSaude(), a.vacinas(), a.situacao() == SituacaoAnimal.DISPONIVEL,
                a.fotoPrincipal(), a.fotos());
    }
}
