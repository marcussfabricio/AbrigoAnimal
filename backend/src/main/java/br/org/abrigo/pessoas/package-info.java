/**
 * Cadastro ÚNICO de pessoas: a mesma pessoa pode ser padrinho de um animal e adotar outro.
 * Contém dados pessoais (LGPD): nada deste módulo pode aparecer na API pública.
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Pessoas",
        allowedDependencies = {"plataforma"})
package br.org.abrigo.pessoas;
