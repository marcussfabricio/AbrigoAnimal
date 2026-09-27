/**
 * Cadastro dos animais: dados, fotos, ficha descritiva de saúde, situação e visibilidade na vitrine.
 *
 * <p>É um módulo "base": NÃO depende de nenhum módulo de negócio. Os módulos de processo
 * (apadrinhamento, solicitações, vitrine) é que dependem dele, pela API pública
 * (classes deste pacote raiz: AnimalService, AnimalResumo, AnimalVitrine, enums).
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Animais",
        allowedDependencies = {"plataforma"})
package br.org.abrigo.animais;
