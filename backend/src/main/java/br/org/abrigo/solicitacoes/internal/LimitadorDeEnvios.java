package br.org.abrigo.solicitacoes.internal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Antispam simples (RF-26): no máximo N envios por IP na última hora.
 * Em memória — suficiente para uma instância só. Se um dia houver várias instâncias,
 * trocar por algo compartilhado (ex.: tabela no banco).
 */
@Component
public class LimitadorDeEnvios {

    private static final Duration JANELA = Duration.ofHours(1);

    private final int limite;
    private final Clock clock;
    private final Map<String, Deque<Instant>> enviosPorIp = new ConcurrentHashMap<>();

    public LimitadorDeEnvios(@Value("${abrigo.solicitacoes.limite-por-hora:5}") int limite, Clock clock) {
        this.limite = limite;
        this.clock = clock;
    }

    /** @return true se pode enviar (e já registra o envio). */
    public boolean tentarRegistrar(String ip) {
        Instant agora = Instant.now(clock);
        Instant inicioJanela = agora.minus(JANELA);
        Deque<Instant> envios = enviosPorIp.computeIfAbsent(ip, k -> new ArrayDeque<>());
        synchronized (envios) {
            while (!envios.isEmpty() && envios.peekFirst().isBefore(inicioJanela)) {
                envios.pollFirst();
            }
            if (envios.size() >= limite) {
                return false;
            }
            envios.addLast(agora);
            return true;
        }
    }
}
