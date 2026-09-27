/**
 * Infraestrutura comum a todos os módulos: entidade base com auditoria,
 * exceções de negócio, paginação, armazenamento de arquivos, tratamento de erros
 * e o "fallback" que entrega o index.html do React.
 *
 * <p>Regra: este módulo NÃO conhece nenhum módulo de negócio.
 */
@org.springframework.modulith.ApplicationModule(displayName = "Plataforma")
package br.org.abrigo.plataforma;
