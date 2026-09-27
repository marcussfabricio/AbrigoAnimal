package br.org.abrigo.pessoas;

import br.org.abrigo.pessoas.internal.persistence.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/** API PÚBLICA do módulo pessoas para os demais módulos. */
@Service
@Transactional(readOnly = true)
public class PessoaService {

    private final PessoaRepository pessoas;

    public PessoaService(PessoaRepository pessoas) {
        this.pessoas = pessoas;
    }

    public Optional<PessoaResumo> buscarResumo(UUID id) {
        return pessoas.findById(id)
                .map(p -> new PessoaResumo(p.getId(), p.getNome(), p.getTelefone(), p.getEmail()));
    }
}
