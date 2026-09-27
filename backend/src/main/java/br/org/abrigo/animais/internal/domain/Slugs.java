package br.org.abrigo.animais.internal.domain;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

/**
 * Gera o identificador "amigável" usado na URL pública: /animais/thor-3f2a1b
 * O sufixo do id garante unicidade mesmo com dois animais chamados "Thor".
 */
public final class Slugs {

    private Slugs() {
    }

    public static String gerar(String nome, UUID id) {
        String semAcento = Normalizer.normalize(nome, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        String base = semAcento.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (base.isEmpty()) {
            base = "animal";
        }
        if (base.length() > 60) {
            base = base.substring(0, 60).replaceAll("-$", "");
        }
        return base + "-" + id.toString().substring(0, 6);
    }
}
