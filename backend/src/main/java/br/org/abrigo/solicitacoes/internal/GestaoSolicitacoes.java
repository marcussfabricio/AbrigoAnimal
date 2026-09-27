package br.org.abrigo.solicitacoes.internal;

import br.org.abrigo.animais.AnimalResumo;
import br.org.abrigo.animais.AnimalService;
import br.org.abrigo.plataforma.LimiteExcedidoException;
import br.org.abrigo.plataforma.Pagina;
import br.org.abrigo.plataforma.RecursoNaoEncontradoException;
import br.org.abrigo.plataforma.RegraNegocioException;
import br.org.abrigo.solicitacoes.SolicitacaoRecebida;
import br.org.abrigo.solicitacoes.TipoSolicitacao;
import br.org.abrigo.solicitacoes.internal.domain.Solicitacao;
import br.org.abrigo.solicitacoes.internal.domain.StatusSolicitacao;
import br.org.abrigo.solicitacoes.internal.persistence.SolicitacaoRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class GestaoSolicitacoes {

    private final SolicitacaoRepository solicitacoes;
    private final AnimalService animais;
    private final LimitadorDeEnvios limitador;
    private final ApplicationEventPublisher eventos;
    private final Clock clock;

    GestaoSolicitacoes(SolicitacaoRepository solicitacoes, AnimalService animais, LimitadorDeEnvios limitador,
                       ApplicationEventPublisher eventos, Clock clock) {
        this.solicitacoes = solicitacoes;
        this.animais = animais;
        this.limitador = limitador;
        this.eventos = eventos;
        this.clock = clock;
    }

    /**
     * Recebe o formulário do site.
     *
     * @param campoIsca campo escondido no formulário: pessoas não o veem, robôs preenchem.
     *                  Se vier preenchido, fingimos sucesso e não gravamos nada.
     * @return número de protocolo
     */
    public UUID receber(FormularioInteresse form, String ip, String campoIsca) {
        if (campoIsca != null && !campoIsca.isBlank()) {
            return UUID.randomUUID();
        }
        if (!limitador.tentarRegistrar(ip)) {
            throw new LimiteExcedidoException("Muitos envios em pouco tempo. Tente novamente mais tarde.");
        }
        UUID animalId = null;
        if (form.animalSlug() != null && !form.animalSlug().isBlank()) {
            animalId = animais.buscarResumoNaVitrine(form.animalSlug())
                    .map(AnimalResumo::id)
                    .orElseThrow(() -> new RegraNegocioException("Animal não encontrado na vitrine."));
        }
        Solicitacao s = Solicitacao.receber(form.tipo(), animalId, form.nome(), form.telefone(), form.email(),
                form.mensagem(), form.consentiu(), Instant.now(clock));
        solicitacoes.save(s);
        // Publicado dentro da transação; os ouvintes (@ApplicationModuleListener) rodam após o commit.
        eventos.publishEvent(new SolicitacaoRecebida(s.getId(), s.getTipo(), animalId));
        return s.getId();
    }

    @Transactional(readOnly = true)
    public Pagina<SolicitacaoDetalhe> listar(StatusSolicitacao status, Pageable pageable) {
        var pagina = status == null ? solicitacoes.findAll(pageable) : solicitacoes.findByStatus(status, pageable);
        return Pagina.de(pagina.map(this::detalhar));
    }

    public SolicitacaoDetalhe alterarStatus(UUID id, StatusSolicitacao status, String observacao) {
        Solicitacao s = solicitacoes.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Solicitação", id));
        s.alterarStatus(status, observacao);
        return detalhar(s);
    }

    private SolicitacaoDetalhe detalhar(Solicitacao s) {
        String animalNome = s.getAnimalId() == null ? null
                : animais.buscarResumo(s.getAnimalId()).map(AnimalResumo::nome).orElse(null);
        return new SolicitacaoDetalhe(s.getId(), s.getTipo(), s.getAnimalId(), animalNome, s.getNome(),
                s.getTelefone(), s.getEmail(), s.getMensagem(), s.getStatus(), s.getObservacaoInterna(),
                s.getCriadoEm());
    }

    public record FormularioInteresse(TipoSolicitacao tipo, String animalSlug, String nome, String telefone,
                                      String email, String mensagem, boolean consentiu) {
    }

    public record SolicitacaoDetalhe(UUID id, TipoSolicitacao tipo, UUID animalId, String animalNome, String nome,
                                     String telefone, String email, String mensagem, StatusSolicitacao status,
                                     String observacaoInterna, Instant recebidaEm) {
    }
}
