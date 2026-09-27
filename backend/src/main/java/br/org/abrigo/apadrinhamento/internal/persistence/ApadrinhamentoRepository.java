package br.org.abrigo.apadrinhamento.internal.persistence;

import br.org.abrigo.apadrinhamento.internal.domain.Apadrinhamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApadrinhamentoRepository extends JpaRepository<Apadrinhamento, UUID> {

    boolean existsByPessoaIdAndAnimalIdAndDataFimIsNull(UUID pessoaId, UUID animalId);

    List<Apadrinhamento> findByAnimalIdOrderByDataInicioDesc(UUID animalId);

    List<Apadrinhamento> findByPessoaIdOrderByDataInicioDesc(UUID pessoaId);
}
