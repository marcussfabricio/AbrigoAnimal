package br.org.abrigo.animais;

/**
 * Situação do animal no abrigo.
 *
 * <p>"Apadrinhado" NÃO é uma situação: um animal pode ter vários padrinhos e continuar
 * disponível para adoção (entrevista 02). Se ele tem padrinho é uma informação do
 * módulo de apadrinhamento, não um estado do animal.
 */
public enum SituacaoAnimal {
    DISPONIVEL,
    EM_TRATAMENTO,
    ADOTADO,
    /** Estado final: não volta a nenhum outro. */
    OBITO
}
