/**
 * API PÚBLICA de animais (vitrine) — espelha o backend:
 *   GET /api/public/animais?especie&sexo&idoso&pagina&tamanho → Pagina<AnimalPublicoResponse>
 *   GET /api/public/animais/{slug}                            → AnimalPublicoResponse
 *
 * As funções devolvem SEMPRE o mesmo formato, venha do mock ou do backend.
 * É esse contrato que permite trocar um pelo outro sem mexer nas telas.
 */
import { ATRASO_MOCK_MS, USAR_API_REAL } from "./config";
import { query, requisicao } from "./cliente";
import { animaisMock } from "./mock/animais";

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

export async function listarAnimais({ especie, sexo, idoso, pagina = 0, tamanho = 24 } = {}) {
  if (USAR_API_REAL) {
    return requisicao("/api/public/animais" + query({ especie, sexo, idoso, pagina, tamanho }));
  }
  await esperar(ATRASO_MOCK_MS);
  const filtrados = animaisMock.filter((a) =>
    (!especie || a.especie === especie) &&
    (!sexo || a.sexo === sexo) &&
    (idoso === undefined || idoso === null || a.idoso === idoso));
  const inicio = pagina * tamanho;
  return {
    itens: filtrados.slice(inicio, inicio + tamanho),
    pagina,
    tamanho,
    total: filtrados.length,
    totalPaginas: Math.ceil(filtrados.length / tamanho),
  };
}

export async function buscarAnimal(slug) {
  if (USAR_API_REAL) {
    return requisicao(`/api/public/animais/${encodeURIComponent(slug)}`);
  }
  await esperar(ATRASO_MOCK_MS);
  const animal = animaisMock.find((a) => a.slug === slug);
  if (!animal) throw new Error("Animal não encontrado");
  return animal;
}
