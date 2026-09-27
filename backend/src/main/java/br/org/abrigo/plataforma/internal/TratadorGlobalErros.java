package br.org.abrigo.plataforma.internal;

import br.org.abrigo.plataforma.LimiteExcedidoException;
import br.org.abrigo.plataforma.RecursoNaoEncontradoException;
import br.org.abrigo.plataforma.RegraNegocioException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Converte exceções em respostas HTTP padronizadas (RFC 9457 "Problem Details").
 * O front recebe sempre o mesmo formato: { title, status, detail, campos? }.
 */
@RestControllerAdvice
class TratadorGlobalErros {

    private static final Logger log = LoggerFactory.getLogger(TratadorGlobalErros.class);

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    ProblemDetail naoEncontrado(RecursoNaoEncontradoException e) {
        return problema(HttpStatus.NOT_FOUND, "Não encontrado", e.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    ProblemDetail regraNegocio(RegraNegocioException e) {
        return problema(HttpStatusCode.valueOf(422), "Regra de negócio", e.getMessage());
    }

    @ExceptionHandler(LimiteExcedidoException.class)
    ProblemDetail limiteExcedido(LimiteExcedidoException e) {
        return problema(HttpStatusCode.valueOf(429), "Muitas requisições", e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : e.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        ProblemDetail pd = problema(HttpStatus.BAD_REQUEST, "Dados inválidos",
                "Um ou mais campos estão inválidos.");
        pd.setProperty("campos", campos);
        return pd;
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    ProblemDetail conflitoVersao(ObjectOptimisticLockingFailureException e) {
        return problema(HttpStatus.CONFLICT, "Registro alterado por outra pessoa",
                "Este registro foi alterado enquanto você editava. Recarregue e tente de novo.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ProblemDetail integridade(DataIntegrityViolationException e) {
        log.warn("Violação de integridade no banco", e);
        return problema(HttpStatus.CONFLICT, "Conflito de dados",
                "A operação viola uma restrição dos dados (registro duplicado ou referência inválida).");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ProblemDetail arquivoGrande(MaxUploadSizeExceededException e) {
        return problema(HttpStatusCode.valueOf(413), "Arquivo muito grande",
                "O arquivo enviado passa do limite permitido.");
    }

    private static ProblemDetail problema(HttpStatusCode status, String titulo, String detalhe) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detalhe);
        pd.setTitle(titulo);
        return pd;
    }
}
