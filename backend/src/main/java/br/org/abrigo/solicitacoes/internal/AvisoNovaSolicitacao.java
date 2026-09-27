package br.org.abrigo.solicitacoes.internal;

import br.org.abrigo.solicitacoes.SolicitacaoRecebida;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

/**
 * Reage ao evento SolicitacaoRecebida DEPOIS do commit.
 * Hoje só registra no log. Quando a ONG definir o canal de aviso (RF-27: e-mail? WhatsApp?),
 * a implementação entra aqui — o formulário não muda nada.
 *
 * <p>Se este método falhar, o Modulith mantém o evento como "não concluído" na tabela
 * event_publication, e ele pode ser reprocessado.
 */
@Component
class AvisoNovaSolicitacao {

    private static final Logger log = LoggerFactory.getLogger(AvisoNovaSolicitacao.class);

    @ApplicationModuleListener
    void aoReceber(SolicitacaoRecebida evento) {
        log.info("Nova solicitação recebida pelo site: tipo={}, protocolo={}", evento.tipo(), evento.solicitacaoId());
    }
}
