package br.org.abrigo.animais.internal;

import java.util.Optional;

/**
 * Descobre o tipo da imagem pelos primeiros bytes ("assinatura"), sem confiar
 * no Content-Type enviado pelo navegador (que pode ser falsificado).
 */
enum TipoImagem {
    JPEG("jpg"), PNG("png"), WEBP("webp");

    private final String extensao;

    TipoImagem(String extensao) {
        this.extensao = extensao;
    }

    String extensao() {
        return extensao;
    }

    static Optional<TipoImagem> detectar(byte[] b) {
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return Optional.of(JPEG);
        }
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') {
            return Optional.of(PNG);
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return Optional.of(WEBP);
        }
        return Optional.empty();
    }
}
