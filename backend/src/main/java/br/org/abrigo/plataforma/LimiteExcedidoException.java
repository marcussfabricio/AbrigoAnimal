package br.org.abrigo.plataforma;

/** Muitas requisições em pouco tempo (ex.: formulário público). Vira HTTP 429. */
public class LimiteExcedidoException extends RuntimeException {

    public LimiteExcedidoException(String mensagem) {
        super(mensagem);
    }
}
