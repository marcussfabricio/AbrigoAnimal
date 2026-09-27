package br.org.abrigo.plataforma;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/**
 * Formato estável de resposta paginada. Evita devolver o Page do Spring Data
 * direto no JSON (formato interno, que pode mudar entre versões).
 */
public record Pagina<T>(List<T> itens, int pagina, int tamanho, long total, int totalPaginas) {

    public static <T> Pagina<T> de(Page<T> page) {
        return new Pagina<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    public <R> Pagina<R> map(Function<T, R> conversor) {
        return new Pagina<>(itens.stream().map(conversor).toList(), pagina, tamanho, total, totalPaginas);
    }
}
