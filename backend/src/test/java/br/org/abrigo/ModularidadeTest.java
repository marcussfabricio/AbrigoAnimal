package br.org.abrigo;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

/**
 * Teste de ARQUITETURA. Falha se:
 * - um módulo acessar classes internas (internal/...) de outro;
 * - houver dependência circular entre módulos;
 * - um módulo depender de algo fora do "allowedDependencies" do seu package-info.
 * Também gera a documentação/diagramas em target/spring-modulith-docs.
 */
class ModularidadeTest {

    static final ApplicationModules MODULOS = ApplicationModules.of(AbrigoApplication.class);

    @Test
    void fronteirasEntreModulosSaoRespeitadas() {
        MODULOS.verify();
    }

    @Test
    void geraDocumentacaoDosModulos() {
        new Documenter(MODULOS).writeDocumentation();
    }
}
