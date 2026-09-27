package br.org.abrigo.animais.internal.web;

import br.org.abrigo.animais.Especie;
import br.org.abrigo.animais.Sexo;
import br.org.abrigo.animais.internal.domain.DadosAnimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Corpo do POST/PUT de animal. Aqui só se valida FORMATO (obrigatório, tamanho).
 * Regras de negócio (chip único, óbito...) ficam no domínio.
 */
record AnimalRequest(
        @NotBlank(message = "Informe o nome") @Size(max = 120) String nome,
        @NotNull(message = "Informe a espécie") Especie especie,
        Sexo sexo,
        @Size(max = 80) String cor,
        @PastOrPresent(message = "A data de nascimento não pode ser futura") LocalDate dataNascimentoEstimada,
        Boolean castrado,
        @Size(max = 40) String chip,
        @Size(max = 40) String canil,
        @Size(max = 40) String ala,
        Boolean idoso,
        Boolean medicacaoContinua,
        @Size(max = 5000) String descricao,
        @Size(max = 5000) String medicacoes,
        @Size(max = 5000) String condicoesSaude,
        @Size(max = 5000) String vacinas,
        /** Obrigatória na edição (PUT): a versão que a tela carregou. */
        Long versao) {

    DadosAnimal paraDados() {
        return new DadosAnimal(nome, especie, sexo, cor, dataNascimentoEstimada,
                Boolean.TRUE.equals(castrado), chip, canil, ala,
                Boolean.TRUE.equals(idoso), Boolean.TRUE.equals(medicacaoContinua),
                descricao, medicacoes, condicoesSaude, vacinas);
    }
}
