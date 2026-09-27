package br.org.abrigo.pessoas.internal.domain;

import br.org.abrigo.plataforma.RegraNegocioException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CpfTest {

    @Test
    void aceitaCpfValidoComOuSemMascara() {
        assertThat(Cpf.normalizar("529.982.247-25")).isEqualTo("52998224725");
        assertThat(Cpf.normalizar("52998224725")).isEqualTo("52998224725");
    }

    @Test
    void vazioViraNull() {
        assertThat(Cpf.normalizar("  ")).isNull();
    }

    @Test
    void recusaDigitoVerificadorErradoESequenciasRepetidas() {
        assertThatThrownBy(() -> Cpf.normalizar("529.982.247-26")).isInstanceOf(RegraNegocioException.class);
        assertThatThrownBy(() -> Cpf.normalizar("111.111.111-11")).isInstanceOf(RegraNegocioException.class);
        assertThatThrownBy(() -> Cpf.normalizar("123")).isInstanceOf(RegraNegocioException.class);
    }
}
