package br.org.abrigo.integracao;

import br.org.abrigo.suporte.IntegracaoTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Formulário "quero apadrinhar / quero adotar" (sem login). */
class SolicitacaoPublicaIntegrationTest extends IntegracaoTest {

    /** Cada teste usa um IP diferente para o limitador de envios não interferir entre testes. */
    private static RequestPostProcessor ip(String ip) {
        return req -> {
            req.setRemoteAddr(ip);
            return req;
        };
    }

    private String formulario(String slug, boolean consentimento, String isca) {
        return formulario(slug, consentimento, isca, "Visitante");
    }

    private String formulario(String slug, boolean consentimento, String isca, String nome) {
        return """
                {"tipo": "APADRINHAR", "animalSlug": "%s", "nome": "%s", "telefone": "47 98888-7777",
                 "mensagem": "Quero ajudar!", "consentimento": %s, "site": "%s"}
                """.formatted(slug, nome, consentimento, isca);
    }

    @Test
    void recebeERespondeSoComProtocolo() throws Exception {
        String slug = campo(cadastrarAnimalSimples("Biscoito"), "$.slug");

        mvc.perform(post("/api/public/solicitacoes").with(ip("10.0.0.1"))
                        .contentType(MediaType.APPLICATION_JSON).content(formulario(slug, true, "")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.protocolo").exists())
                .andExpect(jsonPath("$.telefone").doesNotExist());

        mvc.perform(get("/api/solicitacoes").param("status", "NOVA").with(user(EQUIPE)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itens[?(@.animalNome == 'Biscoito')]").exists());
    }

    @Test
    void semConsentimentoNaoGuarda() throws Exception {
        mvc.perform(post("/api/public/solicitacoes").with(ip("10.0.0.2"))
                        .contentType(MediaType.APPLICATION_JSON).content(formulario("", false, "")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.consentimento").exists());
    }

    @Test
    void limitaEnviosPorIp() throws Exception {
        String corpo = formulario("", true, "");
        for (int i = 0; i < 3; i++) { // limite configurado no teste = 3/hora
            mvc.perform(post("/api/public/solicitacoes").with(ip("10.0.0.3"))
                            .contentType(MediaType.APPLICATION_JSON).content(corpo))
                    .andExpect(status().isCreated());
        }
        mvc.perform(post("/api/public/solicitacoes").with(ip("10.0.0.3"))
                        .contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void robosQuePreenchemOCampoIscaRecebemSucessoFalso() throws Exception {
        mvc.perform(post("/api/public/solicitacoes").with(ip("10.0.0.4"))
                        .contentType(MediaType.APPLICATION_JSON).content(formulario("", true, "http://spam", "Robo Spammer")))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/solicitacoes").with(user(EQUIPE)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itens[?(@.nome == 'Robo Spammer')]").doesNotExist());
    }
}
