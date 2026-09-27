package br.org.abrigo.apadrinhamento.internal.domain;

import br.org.abrigo.plataforma.EntidadeBase;
import br.org.abrigo.plataforma.RegraNegocioException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Note: pessoaId e animalId são só UUIDs, não @ManyToOne.
 * Pessoa e Animal pertencem a OUTROS módulos; ligar as entidades por JPA quebraria a fronteira.
 * A integridade no banco continua garantida por chave estrangeira (migration V4).
 */
@Entity
@Table(name = "apadrinhamento")
public class Apadrinhamento extends EntidadeBase {

    @Column(nullable = false)
    private UUID pessoaId;

    @Column(nullable = false)
    private UUID animalId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoApoio tipoApoio;

    @Column(nullable = false)
    private LocalDate dataInicio;

    private LocalDate dataFim;

    @Column(columnDefinition = "text")
    private String observacoes;

    protected Apadrinhamento() {
    }

    /**
     * @param dataInicio pode ser no passado (cadastro dos termos em papel que já existem),
     *                   mas não no futuro.
     */
    public static Apadrinhamento iniciar(UUID pessoaId, UUID animalId, TipoApoio tipoApoio,
                                         LocalDate dataInicio, String observacoes, LocalDate hoje) {
        if (pessoaId == null || animalId == null) {
            throw new RegraNegocioException("Informe a pessoa e o animal.");
        }
        if (dataInicio == null || dataInicio.isAfter(hoje)) {
            throw new RegraNegocioException("A data de início é obrigatória e não pode ser futura.");
        }
        Apadrinhamento a = new Apadrinhamento();
        a.pessoaId = pessoaId;
        a.animalId = animalId;
        a.tipoApoio = tipoApoio == null ? TipoApoio.AFETIVO : tipoApoio;
        a.dataInicio = dataInicio;
        a.observacoes = observacoes == null || observacoes.isBlank() ? null : observacoes.trim();
        return a;
    }

    public void encerrar(LocalDate dataFim, LocalDate hoje) {
        if (!estaAtivo()) {
            throw new RegraNegocioException("Este apadrinhamento já foi encerrado.");
        }
        if (dataFim == null || dataFim.isBefore(dataInicio) || dataFim.isAfter(hoje)) {
            throw new RegraNegocioException("A data de encerramento deve estar entre o início e hoje.");
        }
        this.dataFim = dataFim;
    }

    public void alterarTipoApoio(TipoApoio novo) {
        if (novo == null) {
            throw new RegraNegocioException("Informe o tipo de apoio.");
        }
        this.tipoApoio = novo;
    }

    public boolean estaAtivo() {
        return dataFim == null;
    }

    public UUID getPessoaId() { return pessoaId; }
    public UUID getAnimalId() { return animalId; }
    public TipoApoio getTipoApoio() { return tipoApoio; }
    public LocalDate getDataInicio() { return dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public String getObservacoes() { return observacoes; }
}
