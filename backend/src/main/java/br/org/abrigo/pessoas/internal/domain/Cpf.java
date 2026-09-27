package br.org.abrigo.pessoas.internal.domain;

import br.org.abrigo.plataforma.RegraNegocioException;

/** Normaliza (só dígitos) e valida CPF pelos dígitos verificadores. */
public final class Cpf {

    private Cpf() {
    }

    /** @return 11 dígitos, ou null se vazio. Lança RegraNegocioException se inválido. */
    public static String normalizar(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String digitos = valor.replaceAll("\\D", "");
        if (!valido(digitos)) {
            throw new RegraNegocioException("CPF inválido.");
        }
        return digitos;
    }

    public static boolean valido(String digitos) {
        if (digitos == null || digitos.length() != 11 || digitos.chars().distinct().count() == 1) {
            return false;
        }
        return digitoVerificador(digitos, 9) == digitos.charAt(9) - '0'
                && digitoVerificador(digitos, 10) == digitos.charAt(10) - '0';
    }

    private static int digitoVerificador(String d, int quantidade) {
        int soma = 0;
        for (int i = 0; i < quantidade; i++) {
            soma += (d.charAt(i) - '0') * (quantidade + 1 - i);
        }
        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}
