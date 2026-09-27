package br.org.abrigo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada. Cada subpacote de primeiro nível (animais, pessoas, ...)
 * é um módulo do Spring Modulith. Ver ModularidadeTest.
 */
@SpringBootApplication
public class AbrigoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AbrigoApplication.class, args);
    }
}
