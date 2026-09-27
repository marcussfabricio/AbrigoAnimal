/**
 * TRADUTOR entre o formato da API e o formato que os componentes do protótipo usam.
 *
 * A API fala "nome, idadeAnos, fotoPrincipal, descricao..."; os componentes do protótipo
 * falam "name, age, image, story...". Em vez de reescrever todos os componentes agora,
 * este arquivo traduz. Quando a equipe validar o visual, os componentes podem passar a
 * usar o formato da API direto e este arquivo some.
 */
export function animalParaCartao(a) {
  return {
    id: a.slug,                        // a vitrine identifica o animal pelo slug (não expõe id)
    slug: a.slug,
    name: a.nome,
    age: a.idadeAnos == null ? "Idade não informada" : `${a.idadeAnos} ${a.idadeAnos === 1 ? "ano" : "anos"}`,
    size: a.porte ?? "",               // ⚠ "porte" ainda NÃO existe no backend (proposta, ver docs)
    personality: a.temperamento ?? "", // ⚠ "temperamento" ainda NÃO existe no backend (proposta)
    senior: a.idoso,
    image: a.fotoPrincipal,
    story: a.descricao ?? "",
    health: {
      medicacoes: a.medicacoes,
      condicoes: a.condicoesSaude,
      vacinas: a.vacinas,
    },
    disponivelParaAdocao: a.disponivelParaAdocao,
  };
}
