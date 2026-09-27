package br.org.abrigo.plataforma.internal;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Entrega o frontend (build do React em classpath:/static) e faz o "fallback de SPA":
 * qualquer rota que não seja arquivo, /api ou /actuator devolve o index.html,
 * para o React Router decidir a tela (ex.: F5 em /gestao/padrinhos/12).
 *
 * <p>Obs.: o mapeamento estático padrão do Boot está desligado em application.yml
 * (spring.web.resources.add-mappings=false) para este ser o único.
 */
@Configuration(proxyBeanMethods = false)
class SpaConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String caminho, Resource local) throws IOException {
                        if (caminho.contains("..")) {
                            return null;
                        }
                        Resource solicitado = local.createRelative(caminho);
                        if (solicitado.exists() && solicitado.isReadable()) {
                            return solicitado;
                        }
                        boolean pareceArquivo = caminho.contains(".");
                        boolean rotaDeServidor = caminho.startsWith("api/") || caminho.startsWith("actuator/")
                                || caminho.startsWith("arquivos/");
                        if (pareceArquivo || rotaDeServidor) {
                            return null; // 404 de verdade
                        }
                        Resource index = new ClassPathResource("/static/index.html");
                        return index.exists() ? index : null;
                    }
                });
    }
}
