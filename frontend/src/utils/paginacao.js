/** Percorre as páginas respeitando o limite aplicado pelo servidor. */
export async function carregarTodasPaginas(carregar) {
  const primeira = await carregar(0);
  const itens = [...primeira.itens];
  for (let pagina = 1; pagina < primeira.totalPaginas; pagina += 1) {
    const proxima = await carregar(pagina);
    itens.push(...proxima.itens);
  }
  return itens;
}
