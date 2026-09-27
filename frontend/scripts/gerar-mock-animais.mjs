// Gera src/api/mock/animais.js a partir de src/data/dogs.js (formato do backend).
// Uso: node scripts/gerar-mock-animais.mjs > src/api/mock/animais.js
import { dogs } from "../src/data/dogs.js";
const sexo = (n) => /a$/.test(n) && !["Joca"].includes(n) ? "FEMEA" : "MACHO";
const slug = (n, i) => n.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + (0x3f2a10 + i).toString(16);
const out = dogs.map((d, i) => ({
  nome: d.name,
  slug: slug(d.name, i),
  especie: "CAO",
  sexo: sexo(d.name),
  cor: null,
  idadeAnos: parseInt(d.age),
  castrado: true,
  idoso: d.senior,
  medicacaoContinua: d.senior,
  descricao: d.story,
  medicacoes: d.senior ? "Medicação de uso contínuo (exemplo)." : null,
  condicoesSaude: d.senior ? "Acompanhamento veterinário regular (exemplo)." : null,
  vacinas: "V10 e antirrábica em dia (exemplo).",
  disponivelParaAdocao: true,
  fotoPrincipal: d.image,
  fotos: [d.image],
  porte: d.size,
  temperamento: d.personality,
}));
const header = `/**
 * Dados de EXEMPLO no mesmo formato que o backend devolve em GET /api/public/animais
 * (record AnimalPublicoResponse do módulo vitrine). Gerado a partir de src/data/dogs.js.
 *
 * ⚠ "porte" e "temperamento" NÃO existem no backend ainda: o protótipo mostra essas
 *   informações, então ficaram aqui como PROPOSTA para a equipe validar.
 */
`;
process.stdout.write(header + "export const animaisMock = " + JSON.stringify(out, null, 2) + ";\n");
