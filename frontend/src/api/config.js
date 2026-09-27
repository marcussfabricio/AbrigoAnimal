/**
 * Chave única que decide de onde vêm os dados:
 *   - false (padrão): dados de exemplo (mock), sem backend. É o modo do esboço.
 *   - true: chama o backend Spring de verdade (/api/...).
 *
 * Para ligar: criar o arquivo frontend/.env.local com a linha  VITE_USAR_API=true
 * Nenhuma tela precisa mudar: elas só conhecem as funções de src/api/.
 */
export const USAR_API_REAL = import.meta.env.VITE_USAR_API === "true";

/** Simula a demora de rede no modo mock, para as telas já tratarem "carregando". */
export const ATRASO_MOCK_MS = 300;
