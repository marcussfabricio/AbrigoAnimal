package br.org.abrigo.plataforma;

import java.util.UUID;

/** Vira HTTP 404 no TratadorGlobalErros. */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public static RecursoNaoEncontradoException de(String recurso, UUID id) {
        return new RecursoNaoEncontradoException(recurso + " não encontrado(a): " + id);
    }
}
