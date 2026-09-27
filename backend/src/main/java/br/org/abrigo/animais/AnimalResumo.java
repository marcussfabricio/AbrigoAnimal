package br.org.abrigo.animais;

import java.util.UUID;

/** O que outros módulos (apadrinhamento, solicitações) precisam saber de um animal. */
public record AnimalResumo(
        UUID id,
        String nome,
        String slug,
        Especie especie,
        SituacaoAnimal situacao,
        boolean visivelNaVitrine) {

    public boolean emObito() {
        return situacao == SituacaoAnimal.OBITO;
    }
}
