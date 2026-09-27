package br.org.abrigo.identidade.internal.web;

import br.org.abrigo.identidade.internal.GestaoUsuarios;
import br.org.abrigo.identidade.internal.GestaoUsuarios.UsuarioResposta;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Login e logout são tratados pelo próprio Spring Security (ver SegurancaConfig):
 * POST /api/auth/login (username, password) e POST /api/auth/logout.
 */
@RestController
@RequestMapping("/api/auth")
class AutenticacaoController {

    private final GestaoUsuarios gestao;

    AutenticacaoController(GestaoUsuarios gestao) {
        this.gestao = gestao;
    }

    /** O front chama isto ao abrir: gera o cookie XSRF-TOKEN antes do primeiro POST (inclusive o login). */
    @GetMapping("/csrf")
    CsrfResposta csrf(CsrfToken token) {
        return new CsrfResposta(token.getHeaderName(), token.getToken());
    }

    /** Quem está logado. 401 se não houver sessão (o front usa para decidir se mostra o login). */
    @GetMapping("/me")
    UsuarioResposta eu(Authentication autenticacao) {
        return gestao.buscarPorEmail(autenticacao.getName());
    }

    record CsrfResposta(String header, String token) {
    }
}
