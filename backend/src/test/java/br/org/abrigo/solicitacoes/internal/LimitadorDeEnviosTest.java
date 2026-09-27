package br.org.abrigo.solicitacoes.internal;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class LimitadorDeEnviosTest {

    /** Relógio que dá para "adiantar" no teste. */
    static class RelogioAjustavel extends Clock {
        Instant agora = Instant.parse("2026-10-01T10:00:00Z");

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return agora;
        }
    }

    @Test
    void bloqueiaAcimaDoLimiteELiberaDepoisDeUmaHora() {
        var relogio = new RelogioAjustavel();
        var limitador = new LimitadorDeEnvios(2, relogio);

        assertThat(limitador.tentarRegistrar("1.1.1.1")).isTrue();
        assertThat(limitador.tentarRegistrar("1.1.1.1")).isTrue();
        assertThat(limitador.tentarRegistrar("1.1.1.1")).isFalse();
        assertThat(limitador.tentarRegistrar("2.2.2.2")).isTrue(); // outro IP não é afetado

        relogio.agora = relogio.agora.plus(Duration.ofMinutes(61));

        assertThat(limitador.tentarRegistrar("1.1.1.1")).isTrue();
    }
}
