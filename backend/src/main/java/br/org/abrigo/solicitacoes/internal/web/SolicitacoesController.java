package br.org.abrigo.solicitacoes.internal.web;

import br.org.abrigo.plataforma.Pagina;
import br.org.abrigo.solicitacoes.internal.GestaoSolicitacoes;
import br.org.abrigo.solicitacoes.internal.GestaoSolicitacoes.SolicitacaoDetalhe;
import br.org.abrigo.solicitacoes.internal.domain.StatusSolicitacao;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/** Caixa de solicitações da equipe (RF-24). */
@RestController
@RequestMapping("/api/solicitacoes")
class SolicitacoesController {

    private final GestaoSolicitacoes gestao;

    SolicitacoesController(GestaoSolicitacoes gestao) {
        this.gestao = gestao;
    }

    @GetMapping
    Pagina<SolicitacaoDetalhe> listar(@RequestParam(required = false) StatusSolicitacao status,
                                      @RequestParam(defaultValue = "0") int pagina,
                                      @RequestParam(defaultValue = "20") int tamanho) {
        var pageable = PageRequest.of(Math.max(pagina, 0), Math.clamp(tamanho, 1, 50),
                Sort.by(Sort.Direction.DESC, "criadoEm"));
        return gestao.listar(status, pageable);
    }

    @PostMapping("/{id}/status")
    SolicitacaoDetalhe alterarStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest req) {
        return gestao.alterarStatus(id, req.status(), req.observacao());
    }

    record StatusRequest(@NotNull(message = "Informe o status") StatusSolicitacao status,
                         @Size(max = 2000) String observacao) {
    }
}
