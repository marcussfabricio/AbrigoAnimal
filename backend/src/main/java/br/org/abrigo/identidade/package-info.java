/**
 * Usuários da equipe da ONG, login por sessão (cookie) e configuração de segurança.
 * Todos os usuários têm o mesmo nível de acesso (Q-28), mas cada um tem seu login (P-04).
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Identidade",
        allowedDependencies = {"plataforma"})
package br.org.abrigo.identidade;
