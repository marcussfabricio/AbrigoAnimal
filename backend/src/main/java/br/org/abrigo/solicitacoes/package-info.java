/**
 * Pedidos de interesse vindos do site ("quero apadrinhar", "quero adotar") e a caixa
 * de solicitações onde a equipe acompanha cada contato (RF-21, RF-24, RF-25, RF-26).
 *
 * <p>Exemplo de comunicação por EVENTO: ao receber um pedido, o módulo publica
 * SolicitacaoRecebida. Quem quiser reagir (hoje: um aviso no log; futuro: e-mail/WhatsApp, RF-27)
 * escuta o evento — sem que o formulário precise conhecer quem reage.
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Solicitações",
        allowedDependencies = {"plataforma", "animais"})
package br.org.abrigo.solicitacoes;
