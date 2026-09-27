package br.org.abrigo.plataforma;

/**
 * Uma regra de negócio foi violada (ex.: apadrinhar um animal em óbito).
 * Vira HTTP 422 no TratadorGlobalErros.
 */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
