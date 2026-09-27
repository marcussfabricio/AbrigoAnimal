package br.org.abrigo.pessoas.internal.web;

import br.org.abrigo.pessoas.internal.GestaoPessoas;
import br.org.abrigo.pessoas.internal.GestaoPessoas.PessoaDetalhe;
import br.org.abrigo.pessoas.internal.domain.DadosPessoa;
import br.org.abrigo.plataforma.Pagina;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/pessoas")
class PessoasController {

    private final GestaoPessoas gestao;

    PessoasController(GestaoPessoas gestao) {
        this.gestao = gestao;
    }

    @GetMapping
    Pagina<PessoaDetalhe> listar(@RequestParam(required = false) String busca,
                                 @RequestParam(defaultValue = "0") int pagina,
                                 @RequestParam(defaultValue = "20") int tamanho) {
        return gestao.listar(busca, PageRequest.of(Math.max(pagina, 0), Math.clamp(tamanho, 1, 50), Sort.by("nome")));
    }

    @GetMapping("/{id}")
    PessoaDetalhe buscar(@PathVariable UUID id) {
        return gestao.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    PessoaDetalhe cadastrar(@Valid @RequestBody PessoaRequest req) {
        return gestao.cadastrar(req.paraDados(), Boolean.TRUE.equals(req.consentiu()));
    }

    @PutMapping("/{id}")
    PessoaDetalhe atualizar(@PathVariable UUID id, @Valid @RequestBody PessoaRequest req) {
        return gestao.atualizar(id, req.paraDados());
    }

    record PessoaRequest(
            @NotBlank(message = "Informe o nome") @Size(max = 150) String nome,
            @Size(max = 20) String telefone,
            @Email(message = "E-mail inválido") @Size(max = 200) String email,
            @Size(max = 14) String cpf,
            @Size(max = 500) String endereco,
            @Size(max = 2000) String observacoes,
            /** A pessoa autorizou o uso dos dados (termo em papel ou formulário). */
            Boolean consentiu) {

        DadosPessoa paraDados() {
            return new DadosPessoa(nome, telefone, email, cpf, endereco, observacoes);
        }
    }
}
