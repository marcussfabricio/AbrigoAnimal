package br.org.abrigo.apadrinhamento.internal;

import br.org.abrigo.animais.AnimalResumo;
import br.org.abrigo.animais.AnimalService;
import br.org.abrigo.apadrinhamento.internal.domain.Apadrinhamento;
import br.org.abrigo.apadrinhamento.internal.domain.TipoApoio;
import br.org.abrigo.apadrinhamento.internal.persistence.ApadrinhamentoRepository;
import br.org.abrigo.pessoas.PessoaResumo;
import br.org.abrigo.pessoas.PessoaService;
import br.org.abrigo.plataforma.RecursoNaoEncontradoException;
import br.org.abrigo.plataforma.RegraNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Exemplo de comunicação entre módulos por CHAMADA DIRETA:
 * para iniciar um apadrinhamento eu PRECISO saber, agora, se o animal existe e não está em óbito
 * → chamo a API pública de animais (AnimalService). Idem para pessoas.
 */
@Service
@Transactional
public class GestaoApadrinhamentos {

    private final ApadrinhamentoRepository apadrinhamentos;
    private final AnimalService animais;
    private final PessoaService pessoas;
    private final Clock clock;

    GestaoApadrinhamentos(ApadrinhamentoRepository apadrinhamentos, AnimalService animais,
                          PessoaService pessoas, Clock clock) {
        this.apadrinhamentos = apadrinhamentos;
        this.animais = animais;
        this.pessoas = pessoas;
        this.clock = clock;
    }

    public ApadrinhamentoDetalhe iniciar(UUID pessoaId, UUID animalId, TipoApoio tipoApoio,
                                         LocalDate dataInicio, String observacoes) {
        AnimalResumo animal = animais.buscarResumo(animalId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Animal", animalId));
        PessoaResumo pessoa = pessoas.buscarResumo(pessoaId)
                .orElseThrow(() -> RecursoNaoEncontradoException.de("Pessoa", pessoaId));
        if (animal.emObito()) {
            throw new RegraNegocioException("Não é possível apadrinhar um animal com óbito registrado.");
        }
        if (apadrinhamentos.existsByPessoaIdAndAnimalIdAndDataFimIsNull(pessoaId, animalId)) {
            throw new RegraNegocioException(pessoa.nome() + " já é padrinho/madrinha ativo(a) de " + animal.nome() + ".");
        }
        LocalDate hoje = LocalDate.now(clock);
        Apadrinhamento novo = Apadrinhamento.iniciar(pessoaId, animalId, tipoApoio,
                dataInicio == null ? hoje : dataInicio, observacoes, hoje);
        return ApadrinhamentoDetalhe.de(apadrinhamentos.save(novo), pessoa.nome(), animal.nome());
    }

    public ApadrinhamentoDetalhe encerrar(UUID id, LocalDate dataFim) {
        Apadrinhamento a = carregar(id);
        LocalDate hoje = LocalDate.now(clock);
        a.encerrar(dataFim == null ? hoje : dataFim, hoje);
        return detalhar(a);
    }

    public ApadrinhamentoDetalhe alterarTipoApoio(UUID id, TipoApoio tipo) {
        Apadrinhamento a = carregar(id);
        a.alterarTipoApoio(tipo);
        return detalhar(a);
    }

    /** RF-15: no animal, ver seus padrinhos. */
    @Transactional(readOnly = true)
    public List<ApadrinhamentoDetalhe> doAnimal(UUID animalId) {
        return apadrinhamentos.findByAnimalIdOrderByDataInicioDesc(animalId).stream().map(this::detalhar).toList();
    }

    /** RF-15: no padrinho, ver seus afilhados. */
    @Transactional(readOnly = true)
    public List<ApadrinhamentoDetalhe> daPessoa(UUID pessoaId) {
        return apadrinhamentos.findByPessoaIdOrderByDataInicioDesc(pessoaId).stream().map(this::detalhar).toList();
    }

    private Apadrinhamento carregar(UUID id) {
        return apadrinhamentos.findById(id).orElseThrow(() -> RecursoNaoEncontradoException.de("Apadrinhamento", id));
    }

    private ApadrinhamentoDetalhe detalhar(Apadrinhamento a) {
        String nomePessoa = pessoas.buscarResumo(a.getPessoaId()).map(PessoaResumo::nome).orElse("?");
        String nomeAnimal = animais.buscarResumo(a.getAnimalId()).map(AnimalResumo::nome).orElse("?");
        return ApadrinhamentoDetalhe.de(a, nomePessoa, nomeAnimal);
    }

    public record ApadrinhamentoDetalhe(UUID id, UUID pessoaId, String pessoaNome, UUID animalId, String animalNome,
                                        TipoApoio tipoApoio, LocalDate dataInicio, LocalDate dataFim,
                                        boolean ativo, String observacoes) {
        static ApadrinhamentoDetalhe de(Apadrinhamento a, String pessoaNome, String animalNome) {
            return new ApadrinhamentoDetalhe(a.getId(), a.getPessoaId(), pessoaNome, a.getAnimalId(), animalNome,
                    a.getTipoApoio(), a.getDataInicio(), a.getDataFim(), a.estaAtivo(), a.getObservacoes());
        }
    }
}
