package br.org.abrigo.solicitacoes;

import java.util.UUID;

/**
 * Evento publicado quando alguém envia o formulário do site.
 * Contém só ids e o tipo — NUNCA dados pessoais (o evento é gravado no banco pelo Modulith).
 */
public record SolicitacaoRecebida(UUID solicitacaoId, TipoSolicitacao tipo, UUID animalId) {
}
