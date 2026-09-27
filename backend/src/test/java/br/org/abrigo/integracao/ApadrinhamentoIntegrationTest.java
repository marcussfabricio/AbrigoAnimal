package br.org.abrigo.integracao;

import br.org.abrigo.suporte.IntegracaoTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ApadrinhamentoIntegrationTest extends IntegracaoTest {

    private String apadrinhar(String pessoaId, String animalId) {
        return """
                {"pessoaId": "%s", "animalId": "%s", "tipoApoio": "AMBOS", "dataInicio": "2025-06-01"}
                """.formatted(pessoaId, animalId);
    }

    @Test
    void variosPadrinhosPorAnimalEVariosAfilhadosPorPadrinho() throws Exception {
        String animal1 = campo(cadastrarAnimalSimples("Tobias"), "$.id");
        String animal2 = campo(cadastrarAnimalSimples("Frida"), "$.id");
        String ana = campo(cadastrarPessoa("Ana", null), "$.id");
        String bia = campo(cadastrarPessoa("Bia", null), "$.id");

        for (String[] par : new String[][]{{ana, animal1}, {bia, animal1}, {ana, animal2}}) {
            mvc.perform(post("/api/apadrinhamentos").with(user(EQUIPE)).with(csrf())
                            .contentType(MediaType.APPLICATION_JSON).content(apadrinhar(par[0], par[1])))
                    .andExpect(status().isCreated());
        }

        mvc.perform(get("/api/apadrinhamentos").param("animalId", animal1).with(user(EQUIPE)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mvc.perform(get("/api/apadrinhamentos").param("pessoaId", ana).with(user(EQUIPE)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].animalNome").exists());
    }

    @Test
    void naoDuplicaApadrinhamentoAtivoDaMesmaPessoa() throws Exception {
        String animal = campo(cadastrarAnimalSimples("Bento"), "$.id");
        String pessoa = campo(cadastrarPessoa("Caio", null), "$.id");

        mvc.perform(post("/api/apadrinhamentos").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(apadrinhar(pessoa, animal)))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/apadrinhamentos").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(apadrinhar(pessoa, animal)))
                .andExpect(status().is(422));
    }

    @Test
    void naoApadrinhaAnimalEmObito() throws Exception {
        String animal = campo(cadastrarAnimalSimples("Sol"), "$.id");
        String pessoa = campo(cadastrarPessoa("Duda", null), "$.id");
        mvc.perform(post("/api/animais/" + animal + "/obito").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"data\": \"2026-02-01\"}"))
                .andExpect(status().isOk());

        mvc.perform(post("/api/apadrinhamentos").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(apadrinhar(pessoa, animal)))
                .andExpect(status().is(422));
    }
}
