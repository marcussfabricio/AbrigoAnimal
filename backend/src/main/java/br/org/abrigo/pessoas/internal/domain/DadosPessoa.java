package br.org.abrigo.pessoas.internal.domain;

public record DadosPessoa(
        String nome,
        String telefone,
        String email,
        String cpf,
        String endereco,
        String observacoes) {
}
