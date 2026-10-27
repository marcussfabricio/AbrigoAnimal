import test from 'node:test';
import assert from 'node:assert/strict';
import { carregarTodasPaginas } from '../src/utils/paginacao.js';

test('inclui animais além do limite de uma página da API', async () => {
  const paginas = [];
  const resultado = await carregarTodasPaginas(async (pagina) => {
    paginas.push(pagina);
    return { itens: [{ id: pagina }], totalPaginas: 3 };
  });
  assert.deepEqual(paginas, [0, 1, 2]);
  assert.deepEqual(
    resultado.map((animal) => animal.id),
    [0, 1, 2],
  );
});

test('falha em uma página não apresenta um resumo incompleto como sucesso', async () => {
  await assert.rejects(
    carregarTodasPaginas(async (pagina) => {
      if (pagina === 1) throw new Error('Sem conexão');
      return { itens: [], totalPaginas: 2 };
    }),
    /Sem conexão/,
  );
});
