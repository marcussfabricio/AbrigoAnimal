package br.org.abrigo.pessoas.internal.persistence;

import br.org.abrigo.pessoas.internal.domain.Pessoa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PessoaRepository extends JpaRepository<Pessoa, UUID> {

    Optional<Pessoa> findByCpf(String cpf);

    /** Busca por nome, e-mail ou telefone (termo já em minúsculas e com %...%). */
    @Query("""
            select p from Pessoa p
            where lower(p.nome) like :termo
               or lower(p.email) like :termo
               or p.telefone like :termo
            """)
    Page<Pessoa> buscar(@Param("termo") String termo, Pageable pageable);
}
