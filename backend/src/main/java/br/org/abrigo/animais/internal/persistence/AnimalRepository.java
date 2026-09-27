package br.org.abrigo.animais.internal.persistence;

import br.org.abrigo.animais.internal.domain.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface AnimalRepository extends JpaRepository<Animal, UUID>, JpaSpecificationExecutor<Animal> {

    Optional<Animal> findBySlug(String slug);

    Optional<Animal> findByChip(String chip);
}
