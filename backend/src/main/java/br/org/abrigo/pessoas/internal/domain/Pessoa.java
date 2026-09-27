package br.org.abrigo.pessoas.internal.domain;

import br.org.abrigo.plataforma.EntidadeBase;
import br.org.abrigo.plataforma.RegraNegocioException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.Locale;

/**
 * Pessoa (padrinho/madrinha e, na Fase 2, adotante).
 *
 * <p>CPF e endereço são opcionais até a ONG decidir se são necessários (pendência LGPD).
 * Regra mínima: é preciso ter PELO MENOS UM contato (telefone ou e-mail),
 * senão o cadastro não serve para nada.
 */
@Entity
@Table(name = "pessoa")
public class Pessoa extends EntidadeBase {

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 20)
    private String telefone;

    @Column(length = 200)
    private String email;

    @Column(length = 11)
    private String cpf;

    @Column(columnDefinition = "text")
    private String endereco;

    @Column(columnDefinition = "text")
    private String observacoes;

    /** Quando a pessoa consentiu com o uso dos dados (LGPD). */
    private Instant consentimentoEm;

    protected Pessoa() {
    }

    public static Pessoa cadastrar(DadosPessoa dados, Instant consentimentoEm) {
        Pessoa p = new Pessoa();
        p.aplicar(dados);
        p.consentimentoEm = consentimentoEm;
        return p;
    }

    public void atualizar(DadosPessoa dados) {
        aplicar(dados);
    }

    private void aplicar(DadosPessoa d) {
        if (d.nome() == null || d.nome().isBlank()) {
            throw new RegraNegocioException("O nome é obrigatório.");
        }
        String tel = normalizarTelefone(d.telefone());
        String mail = normalizarEmail(d.email());
        if (tel == null && mail == null) {
            throw new RegraNegocioException("Informe pelo menos um contato: telefone ou e-mail.");
        }
        this.nome = d.nome().trim();
        this.telefone = tel;
        this.email = mail;
        this.cpf = Cpf.normalizar(d.cpf());
        this.endereco = limpar(d.endereco());
        this.observacoes = limpar(d.observacoes());
    }

    static String normalizarTelefone(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String digitos = valor.replaceAll("\\D", "");
        if (digitos.length() < 10 || digitos.length() > 13) {
            throw new RegraNegocioException("Telefone inválido: informe DDD + número.");
        }
        return digitos;
    }

    static String normalizarEmail(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim().toLowerCase(Locale.ROOT);
    }

    private static String limpar(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    public String getNome() { return nome; }
    public String getTelefone() { return telefone; }
    public String getEmail() { return email; }
    public String getCpf() { return cpf; }
    public String getEndereco() { return endereco; }
    public String getObservacoes() { return observacoes; }
    public Instant getConsentimentoEm() { return consentimentoEm; }
}
