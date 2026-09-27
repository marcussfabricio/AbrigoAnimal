package br.org.abrigo.solicitacoes.internal.persistence;

import br.org.abrigo.solicitacoes.internal.domain.Solicitacao;
import br.org.abrigo.solicitacoes.internal.domain.StatusSolicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, UUID> {

    Page<Solicitacao> findByStatus(StatusSolicitacao status, Pageable pageable);

    long countByStatus(StatusSolicitacao status);
}
