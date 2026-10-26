/** Navegação explícita para que todos os registros possam ser encontrados. */
export default function Paginacao({ pagina, totalPaginas, aoMudar, ocupado = false }) {
  if (pagina === 0 && (!totalPaginas || totalPaginas <= 1)) return null;
  return (
    <nav className="paginacao" aria-label="Páginas da lista">
      <button
        className="botao botao-contorno"
        disabled={ocupado || pagina === 0}
        onClick={() => aoMudar(pagina - 1)}
      >
        Anterior
      </button>
      <span role="status">
        {pagina >= totalPaginas
          ? 'Volte à página anterior'
          : `Página ${pagina + 1} de ${totalPaginas}`}
      </span>
      <button
        className="botao botao-contorno"
        disabled={ocupado || pagina >= totalPaginas - 1}
        onClick={() => aoMudar(pagina + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}
