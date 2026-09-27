package br.org.abrigo.integracao;

import br.org.abrigo.suporte.IntegracaoTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AnimaisIntegrationTest extends IntegracaoTest {

    @Test
    void cadastraEAparecenaVitrine() throws Exception {
        String animal = cadastrarAnimalSimples("Pipoca");
        String slug = campo(animal, "$.slug");

        mvc.perform(get("/api/public/animais/" + slug))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Pipoca"))
                .andExpect(jsonPath("$.idoso").value(true))
                .andExpect(jsonPath("$.disponivelParaAdocao").value(true));
    }

    @Test
    void validacaoDeFormatoDevolveCampos() throws Exception {
        mvc.perform(post("/api/animais").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"especie\": \"CAO\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists());
    }

    @Test
    void chipDuplicadoEhRegraDeNegocio() throws Exception {
        cadastrarAnimal("{\"nome\": \"A\", \"especie\": \"CAO\", \"chip\": \"CHIP-DUP-1\"}");

        mvc.perform(post("/api/animais").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\": \"B\", \"especie\": \"CAO\", \"chip\": \"CHIP-DUP-1\"}"))
                .andExpect(status().is(422));
    }

    @Test
    void obitoTiraDaVitrine() throws Exception {
        String animal = cadastrarAnimalSimples("Estrela");
        String id = campo(animal, "$.id");
        String slug = campo(animal, "$.slug");

        mvc.perform(post("/api/animais/" + id + "/obito").with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"data\": \"2026-01-10\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.situacao").value("OBITO"));

        mvc.perform(get("/api/public/animais/" + slug)).andExpect(status().isNotFound());
    }

    @Test
    void edicaoComVersaoDesatualizadaDa409() throws Exception {
        String animal = cadastrarAnimalSimples("Luna");
        String id = campo(animal, "$.id");
        String corpo = "{\"nome\": \"Luna 2\", \"especie\": \"CAO\", \"versao\": %s}";

        mvc.perform(put("/api/animais/" + id).with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(corpo.formatted(0)))
                .andExpect(status().isOk());

        // segunda edição ainda com a versão 0: alguém já salvou antes
        mvc.perform(put("/api/animais/" + id).with(user(EQUIPE)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(corpo.formatted(0)))
                .andExpect(status().isConflict());
    }

    @Test
    void auditoriaRegistraQuemAlterou() throws Exception {
        String animal = cadastrarAnimalSimples("Nina");

        org.assertj.core.api.Assertions.assertThat(campo(animal, "$.atualizadoPor")).isEqualTo(EQUIPE);
    }

    @Test
    void linkCompartilhadoTemPreviaComNomeDoAnimal() throws Exception {
        String slug = campo(cadastrarAnimalSimples("Paçoca"), "$.slug");

        mvc.perform(get("/animais/" + slug))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("og:title")))
                .andExpect(content().string(containsString("https://abrigo.teste/animais/" + slug)));
    }
}
