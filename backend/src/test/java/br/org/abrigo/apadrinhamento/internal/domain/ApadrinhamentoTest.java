package br.org.abrigo.apadrinhamento.internal.domain;

import br.org.abrigo.plataforma.RegraNegocioException;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ApadrinhamentoTest {

    static final LocalDate HOJE = LocalDate.of(2026, 10, 1);

    Apadrinhamento novo(LocalDate inicio) {
        return Apadrinhamento.iniciar(UUID.randomUUID(), UUID.randomUUID(), TipoApoio.AMBOS, inicio, null, HOJE);
    }

    @Test
    void aceitaDataDeInicioNoPassadoParaCadastrarTermosEmPapel() {
        Apadrinhamento a = novo(LocalDate.of(2023, 3, 10));

        assertThat(a.estaAtivo()).isTrue();
    }

    @Test
    void recusaDataDeInicioFutura() {
        assertThatThrownBy(() -> novo(HOJE.plusDays(1))).isInstanceOf(RegraNegocioException.class);
    }

    @Test
    void semTipoInformadoAssumeAfetivo() {
        Apadrinhamento a = Apadrinhamento.iniciar(UUID.randomUUID(), UUID.randomUUID(), null, HOJE, null, HOJE);

        assertThat(a.getTipoApoio()).isEqualTo(TipoApoio.AFETIVO);
    }

    @Test
    void encerraUmaVezSo() {
        Apadrinhamento a = novo(HOJE.minusMonths(2));

        a.encerrar(HOJE, HOJE);

        assertThat(a.estaAtivo()).isFalse();
        assertThatThrownBy(() -> a.encerrar(HOJE, HOJE)).isInstanceOf(RegraNegocioException.class);
    }

    @Test
    void encerramentoNaoPodeSerAntesDoInicio() {
        Apadrinhamento a = novo(HOJE.minusDays(5));

        assertThatThrownBy(() -> a.encerrar(HOJE.minusDays(10), HOJE)).isInstanceOf(RegraNegocioException.class);
    }
}
