package br.org.abrigo.plataforma;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Base de todas as entidades "raiz" do sistema.
 *
 * <ul>
 *   <li><b>id UUID gerado na aplicação</b>: o objeto já nasce com identidade, o que permite
 *   referenciar entidades de outros módulos apenas pelo id (sem relacionamento JPA entre módulos).</li>
 *   <li><b>versao</b>: bloqueio otimista (duas pessoas editando o mesmo registro) e também
 *   é o que o Spring Data usa para saber se a entidade é nova (versao == null → INSERT).</li>
 *   <li><b>organizacaoId</b>: porta aberta para multi-ONG (decisão T5), fixo em 1 por enquanto.</li>
 *   <li><b>auditoria</b>: quem criou/alterou e quando (RNF-09), preenchida automaticamente.</li>
 * </ul>
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class EntidadeBase {

    public static final long ORGANIZACAO_PADRAO = 1L;

    @Id
    private UUID id;

    @Version
    private Long versao;

    @Column(nullable = false, updatable = false)
    private Long organizacaoId = ORGANIZACAO_PADRAO;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant criadoEm;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant atualizadoEm;

    @CreatedBy
    @Column(nullable = false, updatable = false, length = 150)
    private String criadoPor;

    @LastModifiedBy
    @Column(nullable = false, length = 150)
    private String atualizadoPor;

    protected EntidadeBase() {
        this.id = UUID.randomUUID();
    }

    public UUID getId() {
        return id;
    }

    public Long getVersao() {
        return versao;
    }

    public Long getOrganizacaoId() {
        return organizacaoId;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public String getCriadoPor() {
        return criadoPor;
    }

    public String getAtualizadoPor() {
        return atualizadoPor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return Objects.equals(id, ((EntidadeBase) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
