/**
 * Vitrine pública: lista e página de cada animal para o público (sem login),
 * mais a rota /animais/{slug} que gera a prévia com foto no WhatsApp/Instagram (Open Graph).
 *
 * <p>Só lê dados PÚBLICOS (AnimalVitrine). Não depende de pessoas nem de apadrinhamento.
 */
@org.springframework.modulith.ApplicationModule(
        displayName = "Vitrine",
        allowedDependencies = {"plataforma", "animais"})
package br.org.abrigo.vitrine;
