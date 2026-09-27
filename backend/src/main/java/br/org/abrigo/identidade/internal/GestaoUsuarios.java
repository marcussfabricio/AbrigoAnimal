package br.org.abrigo.identidade.internal;

import br.org.abrigo.identidade.internal.domain.Usuario;
import br.org.abrigo.identidade.internal.persistence.UsuarioRepository;
import br.org.abrigo.plataforma.RecursoNaoEncontradoException;
import br.org.abrigo.plataforma.RegraNegocioException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class GestaoUsuarios {

    static final int TAMANHO_MINIMO_SENHA = 8;

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    GestaoUsuarios(UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    public UsuarioResposta criar(String nome, String email, String senha) {
        String emailNormalizado = Usuario.normalizarEmail(email);
        if (usuarios.existsByEmailIgnoreCase(emailNormalizado)) {
            throw new RegraNegocioException("Já existe um usuário com este e-mail.");
        }
        validarSenha(senha);
        Usuario u = usuarios.save(Usuario.criar(nome, emailNormalizado, encoder.encode(senha)));
        return UsuarioResposta.de(u);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResposta> listar() {
        return usuarios.findAllByOrderByNomeAsc().stream().map(UsuarioResposta::de).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResposta buscarPorEmail(String email) {
        return usuarios.findByEmailIgnoreCase(email)
                .map(UsuarioResposta::de)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    public UsuarioResposta desativar(UUID id, String emailDeQuemPediu) {
        Usuario u = usuarios.findById(id).orElseThrow(() -> RecursoNaoEncontradoException.de("Usuário", id));
        if (u.getEmail().equalsIgnoreCase(emailDeQuemPediu)) {
            throw new RegraNegocioException("Você não pode desativar o seu próprio usuário.");
        }
        u.desativar();
        return UsuarioResposta.de(u);
    }

    public boolean existeAlgumUsuario() {
        return usuarios.count() > 0;
    }

    private static void validarSenha(String senha) {
        if (senha == null || senha.length() < TAMANHO_MINIMO_SENHA) {
            throw new RegraNegocioException("A senha precisa ter pelo menos " + TAMANHO_MINIMO_SENHA + " caracteres.");
        }
    }

    public record UsuarioResposta(UUID id, String nome, String email, boolean ativo) {
        static UsuarioResposta de(Usuario u) {
            return new UsuarioResposta(u.getId(), u.getNome(), u.getEmail(), u.isAtivo());
        }
    }
}
