package br.org.abrigo.plataforma.internal;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Clock;
import java.time.ZoneId;
import java.util.Optional;

@Configuration(proxyBeanMethods = false)
@EnableJpaAuditing(auditorAwareRef = "auditorAtual")
class ConfiguracaoPlataforma {

    /**
     * Relógio único do sistema, no fuso da ONG. Os módulos pedem "hoje" a este bean
     * em vez de chamar LocalDate.now() direto, o que torna as regras com datas testáveis.
     */
    @Bean
    Clock clock() {
        return Clock.system(ZoneId.of("America/Sao_Paulo"));
    }

    /**
     * Quem está fazendo a alteração (preenche criadoPor / atualizadoPor).
     * - usuário logado → e-mail dele
     * - visitante do site (formulário público) → "publico"
     * - processos internos sem requisição (ex.: carga do admin inicial) → "sistema"
     */
    @Bean
    AuditorAware<String> auditorAtual() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return Optional.of("sistema");
            }
            if (auth instanceof AnonymousAuthenticationToken || !auth.isAuthenticated()) {
                return Optional.of("publico");
            }
            return Optional.of(auth.getName());
        };
    }
}
