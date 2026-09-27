package br.org.abrigo.solicitacoes.internal.domain;

import br.org.abrigo.plataforma.EntidadeBase;
import br.org.abrigo.plataforma.RegraNegocioException;
import br.org.abrigo.solicitacoes.TipoSolicitacao;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "solicitacao")
public class Solicitacao extends EntidadeBase {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoSolicitacao tipo;

    private UUID animalId;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 20)
    private String telefone;

    @Column(length = 200)
    private String email;

    @Column(columnDefinition = "text")
    private String mensagem;

    /** Sem consentimento, não guardamos nada (LGPD). */
    @Column(nullable = false)
    private Instant consentimentoEm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacao status;

    @Column(columnDefinition = "text")
    private String observacaoInterna;

    protected Solicitacao() {
    }

    public static Solicitacao receber(TipoSolicitacao tipo, UUID animalId, String nome, String telefone,
                                      String email, String mensagem, boolean consentiu, Instant agora) {
        if (!consentiu) {
            throw new RegraNegocioException("É preciso autorizar o uso dos dados para enviarmos o contato.");
        }
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Informe seu nome.");
        }
        String tel = telefone == null || telefone.isBlank() ? null : telefone.replaceAll("\\D", "");
        String mail = email == null || email.isBlank() ? null : email.trim().toLowerCase(Locale.ROOT);
        if (tel == null && mail == null) {
            throw new RegraNegocioException("Informe um telefone ou e-mail para contato.");
        }
        if (tel != null && (tel.length() < 10 || tel.length() > 13)) {
            throw new RegraNegocioException("Telefone inválido: informe DDD + número.");
        }
        Solicitacao s = new Solicitacao();
        s.tipo = tipo == null ? TipoSolicitacao.OUTRO : tipo;
        s.animalId = animalId;
        s.nome = nome.trim();
        s.telefone = tel;
        s.email = mail;
        s.mensagem = mensagem == null || mensagem.isBlank() ? null : mensagem.trim();
        s.consentimentoEm = agora;
        s.status = StatusSolicitacao.NOVA;
        return s;
    }

    public void alterarStatus(StatusSolicitacao novo, String observacao) {
        if (novo == null) {
            throw new RegraNegocioException("Informe o novo status.");
        }
        this.status = novo;
        if (observacao != null && !observacao.isBlank()) {
            this.observacaoInterna = observacao.trim();
        }
    }

    public TipoSolicitacao getTipo() { return tipo; }
    public UUID getAnimalId() { return animalId; }
    public String getNome() { return nome; }
    public String getTelefone() { return telefone; }
    public String getEmail() { return email; }
    public String getMensagem() { return mensagem; }
    public Instant getConsentimentoEm() { return consentimentoEm; }
    public StatusSolicitacao getStatus() { return status; }
    public String getObservacaoInterna() { return observacaoInterna; }
}
