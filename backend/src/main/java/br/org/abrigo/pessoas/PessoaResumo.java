package br.org.abrigo.pessoas;

import java.util.UUID;

/** O que outros módulos precisam saber de uma pessoa (sem CPF nem endereço). */
public record PessoaResumo(UUID id, String nome, String telefone, String email) {
}
