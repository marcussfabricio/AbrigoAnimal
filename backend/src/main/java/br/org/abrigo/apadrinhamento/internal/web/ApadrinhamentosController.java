package br.org.abrigo.apadrinhamento.internal.web;

import br.org.abrigo.apadrinhamento.internal.GestaoApadrinhamentos;
import br.org.abrigo.apadrinhamento.internal.GestaoApadrinhamentos.ApadrinhamentoDetalhe;
import br.org.abrigo.apadrinhamento.internal.domain.TipoApoio;
import br.org.abrigo.plataforma.RegraNegocioException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/apadrinhamentos")
class ApadrinhamentosController {

    private final GestaoApadrinhamentos gestao;

    ApadrinhamentosController(GestaoApadrinhamentos gestao) {
        this.gestao = gestao;
    }

    /** GET /api/apadrinhamentos?animalId=... ou ?pessoaId=... */
    @GetMapping
    List<ApadrinhamentoDetalhe> listar(@RequestParam(required = false) UUID animalId,
                                       @RequestParam(required = false) UUID pessoaId) {
        if (animalId != null) {
            return gestao.doAnimal(animalId);
        }
        if (pessoaId != null) {
            return gestao.daPessoa(pessoaId);
        }
        throw new RegraNegocioException("Informe animalId ou pessoaId.");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ApadrinhamentoDetalhe iniciar(@Valid @RequestBody NovoApadrinhamentoRequest req) {
        return gestao.iniciar(req.pessoaId(), req.animalId(), req.tipoApoio(), req.dataInicio(), req.observacoes());
    }

    @PostMapping("/{id}/encerrar")
    ApadrinhamentoDetalhe encerrar(@PathVariable UUID id, @RequestBody(required = false) EncerrarRequest req) {
        return gestao.encerrar(id, req == null ? null : req.dataFim());
    }

    @PostMapping("/{id}/tipo-apoio")
    ApadrinhamentoDetalhe alterarTipoApoio(@PathVariable UUID id, @Valid @RequestBody TipoApoioRequest req) {
        return gestao.alterarTipoApoio(id, req.tipoApoio());
    }

    record NovoApadrinhamentoRequest(
            @NotNull(message = "Informe a pessoa") UUID pessoaId,
            @NotNull(message = "Informe o animal") UUID animalId,
            TipoApoio tipoApoio,
            LocalDate dataInicio,
            @Size(max = 2000) String observacoes) {
    }

    record EncerrarRequest(LocalDate dataFim) {
    }

    record TipoApoioRequest(@NotNull TipoApoio tipoApoio) {
    }
}
