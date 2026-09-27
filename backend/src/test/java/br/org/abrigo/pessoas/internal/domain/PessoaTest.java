package br.org.abrigo.pessoas.internal.domain;

import br.org.abrigo.plataforma.RegraNegocioException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PessoaTest {

    @Test
    void exigePeloMenosUmContato() {
        var semContato = new DadosPessoa("Ana", null, " ", null, null, null);

        assertThatThrownBy(() -> Pessoa.cadastrar(semContato, null))
                .isInstanceOf(RegraNegocioException.class)
                .hasMessageContaining("contato");
    }

    @Test
    void normalizaTelefoneEEmail() {
        var dados = new DadosPessoa(" Ana ", "(47) 99999-1234", " Ana@Email.COM ", null, null, null);

        Pessoa p = Pessoa.cadastrar(dados, null);

        assertThat(p.getNome()).isEqualTo("Ana");
        assertThat(p.getTelefone()).isEqualTo("47999991234");
        assertThat(p.getEmail()).isEqualTo("ana@email.com");
    }

    @Test
    void telefoneSemDddEhRecusado() {
        var dados = new DadosPessoa("Ana", "99999-1234", null, null, null, null);

        assertThatThrownBy(() -> Pessoa.cadastrar(dados, null)).isInstanceOf(RegraNegocioException.class);
    }
}
