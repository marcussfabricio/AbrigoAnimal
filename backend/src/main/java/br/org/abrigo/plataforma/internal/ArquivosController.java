package br.org.abrigo.plataforma.internal;

import br.org.abrigo.plataforma.ArmazenamentoArquivos;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

/**
 * Entrega os arquivos (fotos dos animais). Público: as fotos aparecem na vitrine.
 * Como cada foto tem uma chave única e nunca é sobrescrita, pode ficar em cache por muito tempo.
 */
@RestController
class ArquivosController {

    private final ArmazenamentoArquivos armazenamento;

    ArquivosController(ArmazenamentoArquivos armazenamento) {
        this.armazenamento = armazenamento;
    }

    @GetMapping("/arquivos/{*chave}")
    ResponseEntity<Resource> obter(@PathVariable String chave) {
        String semBarraInicial = chave.startsWith("/") ? chave.substring(1) : chave;
        return armazenamento.obter(semBarraInicial)
                .map(arquivo -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(arquivo.contentType()))
                        .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic().immutable())
                        .body(arquivo.recurso()))
                .orElse(ResponseEntity.notFound().build());
    }
}
