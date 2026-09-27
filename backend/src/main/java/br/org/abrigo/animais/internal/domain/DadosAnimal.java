package br.org.abrigo.animais.internal.domain;

import br.org.abrigo.animais.Especie;
import br.org.abrigo.animais.Sexo;

import java.time.LocalDate;

/** Dados editáveis de um animal (entrada dos casos de uso cadastrar/atualizar). */
public record DadosAnimal(
        String nome,
        Especie especie,
        Sexo sexo,
        String cor,
        LocalDate dataNascimentoEstimada,
        boolean castrado,
        String chip,
        String canil,
        String ala,
        boolean idoso,
        boolean medicacaoContinua,
        String descricao,
        String medicacoes,
        String condicoesSaude,
        String vacinas) {
}
