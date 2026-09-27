/**
 * Formulário público de interesse — espelha o backend:
 *   POST /api/public/solicitacoes
 *   corpo: { tipo: "APADRINHAR"|"ADOTAR"|"OUTRO", animalSlug, nome, telefone, email,
 *            mensagem, consentimento: true, site: "" }
 *   resposta 201: { protocolo }
 *
 * Obs.: "site" é o campo isca antirrobô — deve existir escondido no formulário e ir vazio.
 * AINDA NÃO USADO pelas telas do esboço (o protótipo exige login de visitante; ver docs).
 */
import { ATRASO_MOCK_MS, USAR_API_REAL } from "./config";
import { requisicao } from "./cliente";

export async function enviarInteresse(formulario) {
  if (USAR_API_REAL) {
    return requisicao("/api/public/solicitacoes", { metodo: "POST", corpo: { site: "", ...formulario } });
  }
  await new Promise((ok) => setTimeout(ok, ATRASO_MOCK_MS));
  return { protocolo: crypto.randomUUID() };
}
