/**
 * Cliente HTTP único do front. Toda chamada ao backend passa por aqui.
 * (Só é usado quando USAR_API_REAL = true.)
 *
 * Cuida de 3 coisas que TODAS as chamadas precisam:
 *  1. cookie de sessão  → credentials: "include" (o navegador envia o cookie de login sozinho)
 *  2. proteção CSRF     → em POST/PUT/DELETE, copia o cookie XSRF-TOKEN para o header X-XSRF-TOKEN
 *  3. erros padronizados → o backend responde { title, detail, campos } (Problem Details)
 */

export class ErroApi extends Error {
  constructor(status, corpo) {
    super(corpo?.detail || corpo?.title || `Erro ${status}`);
    this.status = status;
    this.campos = corpo?.campos || {}; // erros por campo do formulário (400)
  }
}

function lerCookie(nome) {
  return document.cookie.split("; ").find((c) => c.startsWith(nome + "="))?.split("=")[1];
}

export async function requisicao(caminho, { metodo = "GET", corpo, formulario } = {}) {
  const headers = {};
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (metodo !== "GET") {
    const token = lerCookie("XSRF-TOKEN");
    if (token) headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  const resposta = await fetch(caminho, {
    method: metodo,
    headers,
    credentials: "include",
    body: formulario ?? (corpo !== undefined ? JSON.stringify(corpo) : undefined),
  });

  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new ErroApi(resposta.status, dados);
  return dados;
}

/** Monta a query string ignorando filtros vazios: { especie: "CAO", idoso: null } → "?especie=CAO" */
export function query(params = {}) {
  const pares = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return pares.length ? "?" + new URLSearchParams(pares).toString() : "";
}
