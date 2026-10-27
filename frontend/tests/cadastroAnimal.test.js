import test from 'node:test';
import assert from 'node:assert/strict';
import { concluirCadastro } from '../src/utils/cadastroAnimal.js';

function cenario() {
  const chamadas = [];
  let falharFoto = true;
  const api = {
    async criar(dados) {
      chamadas.push('criar');
      return { ...dados, id: 'animal-1', versao: 0, visivelNaVitrine: true };
    },
    async editar(id, dados) {
      chamadas.push('editar');
      return { ...dados, id, visivelNaVitrine: true };
    },
    async enviarFoto(id, arquivo) {
      chamadas.push(arquivo);
      if (arquivo === 'segunda' && falharFoto) {
        falharFoto = false;
        throw Error('Sem conexão');
      }
      return { id, versao: 1, visivelNaVitrine: true };
    },
    async definirVitrine(id, visivel) {
      chamadas.push('vitrine');
      return { id, visivelNaVitrine: visivel };
    },
  };
  return {
    api,
    chamadas,
    dados: { nome: 'Teste' },
    visivel: false,
    fotos: [
      { chave: 'a', blob: 'primeira', principal: true },
      { chave: 'b', blob: 'segunda' },
    ],
    progresso: { animal: null, fotosEnviadas: new Set() },
  };
}

test('retoma upload sem recriar animal nem reenviar foto confirmada', async () => {
  const c = cenario();
  await assert.rejects(concluirCadastro(c), /Sem conexão/);
  assert.equal(c.progresso.animal.id, 'animal-1');
  const salvo = await concluirCadastro(c);
  assert.equal(salvo.visivelNaVitrine, false);
  assert.equal(c.chamadas.filter((x) => x === 'criar').length, 1);
  assert.equal(c.chamadas.filter((x) => x === 'primeira').length, 1);
  assert.equal(c.chamadas.filter((x) => x === 'segunda').length, 2);
});

test('falha na criação não marca cadastro como concluído', async () => {
  const c = cenario();
  c.api.criar = async () => {
    throw Error('Indisponível');
  };
  await assert.rejects(concluirCadastro(c), /Indisponível/);
  assert.equal(c.progresso.animal, null);
  assert.equal(c.progresso.fotosEnviadas.size, 0);
});

test('retoma visibilidade sem reenviar fotos confirmadas', async () => {
  const c = cenario();
  c.fotos = c.fotos.slice(0, 1);
  const definir = c.api.definirVitrine;
  c.api.definirVitrine = async () => {
    throw Error('Falha na vitrine');
  };
  await assert.rejects(concluirCadastro(c), /Falha na vitrine/);
  c.api.definirVitrine = definir;
  await concluirCadastro(c);
  assert.equal(c.chamadas.filter((x) => x === 'criar').length, 1);
  assert.equal(c.chamadas.filter((x) => x === 'primeira').length, 1);
});
