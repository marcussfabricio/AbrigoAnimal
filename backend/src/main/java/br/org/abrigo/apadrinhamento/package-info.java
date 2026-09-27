/**
 * Vínculo entre uma pessoa (padrinho/madrinha) e um animal.
 *
 * <p>Regras da entrevista 02: N:N sem restrição, contribuição livre (sem valor fixo,
 * sem cobrança, sem vencimento), visitas sem agenda.
 *
 * <p>Depende de animais e pessoas SOMENTE pelas APIs públicas deles
 * (AnimalService, PessoaService). Guarda apenas os ids — sem relacionamento JPA entre módulos.
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Apadrinhamento",
        allowedDependencies = {"plataforma", "animais", "pessoas"})
package br.org.abrigo.apadrinhamento;
