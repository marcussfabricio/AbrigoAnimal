import { USAR_API_REAL } from './config';
import { FOTOS_DEMO, VIDEOS_INICIAIS } from './mock/dados-iniciais';
import { EVENTO_DADOS } from './mock/banco';
import { novoId } from '../utils/id';

const BANCO = 'abrigo-mural';
const TABELA = 'publicacoes';
const SINAL = 'abrigo:mural-atualizado';
const urls = new Map();
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];

export function validarArquivo(arquivo) {
  if (!arquivo || !TIPOS.includes(arquivo.type)) {
    throw new Error('Escolha uma foto JPG, PNG ou WebP, ou um vídeo MP4 ou WebM.');
  }
  const limite = arquivo.type.startsWith('video/') ? 50 : 10;
  if (!arquivo.size || arquivo.size > limite * 1024 * 1024) {
    throw new Error(`O arquivo precisa ter conteúdo e no máximo ${limite} MB.`);
  }
}

function abrir() {
  if (USAR_API_REAL) {
    return Promise.reject(
      new Error('O mural ainda precisa ser conectado ao servidor para receber arquivos.'),
    );
  }
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(BANCO, 1);
    pedido.onupgradeneeded = () => {
      const tabela = pedido.result.createObjectStore(TABELA, { keyPath: 'id' });
      const fotos = ['mural1', 'mural2', 'mural3', 'mural4'].map((chave, indice) => ({
        id: chave,
        tipo: 'foto',
        titulo: `Animais e rotina do abrigo, foto ${indice + 1}`,
        arquivo: FOTOS_DEMO[chave],
      }));
      [...fotos, ...VIDEOS_INICIAIS.map((video) => ({ ...video, tipo: 'video' }))].forEach(
        (item, indice) =>
          tabela.add({
            ...item,
            publicado: true,
            criadoEm: indice,
            atualizadoEm: indice,
          }),
      );
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
    pedido.onblocked = () => reject(new Error('Feche outras abas do painel e tente novamente.'));
  });
}

/** Arquivo e informações são gravados juntos: falhas não deixam publicações pela metade. */
async function operar(modo, acao) {
  const banco = await abrir();
  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(TABELA, modo);
    let resultado;
    try {
      resultado = acao(transacao.objectStore(TABELA));
    } catch (erro) {
      banco.close();
      reject(erro);
      return;
    }
    transacao.oncomplete = () => {
      banco.close();
      resolve(resultado?.result);
    };
    transacao.onabort = transacao.onerror = () => {
      banco.close();
      reject(
        new Error(
          transacao.error?.name === 'QuotaExceededError'
            ? 'O armazenamento está cheio. Remova arquivos antigos ou escolha um arquivo menor.'
            : 'Não foi possível salvar o mural. Tente novamente.',
        ),
      );
    };
  });
}

function sinalizar() {
  window.dispatchEvent(new Event(EVENTO_DADOS));
  try {
    localStorage.setItem(SINAL, novoId());
  } catch {
    // A gravação principal já terminou; o sinal entre abas é apenas complementar.
  }
}

window.addEventListener('storage', (evento) => {
  if (evento.key === SINAL) window.dispatchEvent(new Event(EVENTO_DADOS));
});

function apresentar(item) {
  if (!item.blob) {
    // Resolve os arquivos incluídos no site novamente após atualizações do build.
    const video = VIDEOS_INICIAIS.find((inicial) => inicial.id === item.id);
    if (video) return { ...item, arquivo: video.arquivo, poster: video.poster };
    if (FOTOS_DEMO[item.id]) return { ...item, arquivo: FOTOS_DEMO[item.id] };
    return item;
  }
  const anterior = urls.get(item.id);
  if (!anterior || anterior.versao !== item.atualizadoEm) {
    if (anterior) URL.revokeObjectURL(anterior.url);
    urls.set(item.id, { versao: item.atualizadoEm, url: URL.createObjectURL(item.blob) });
  }
  const dados = { ...item };
  delete dados.blob;
  return { ...dados, arquivo: urls.get(item.id).url };
}

export async function listarMural({ publico = false } = {}) {
  if (USAR_API_REAL && publico) return { itens: [] };
  const itens = await operar('readonly', (tabela) => tabela.getAll());
  return {
    itens: itens
      .filter((item) => !publico || item.publicado)
      .sort((a, b) => b.criadoEm - a.criadoEm)
      .map(apresentar),
  };
}

export async function salvarPublicacao({ id, titulo, publicado, arquivo }) {
  const texto = titulo.trim();
  if (!texto || texto.length > 100) throw new Error('Informe um título de até 100 caracteres.');
  const anterior = id ? await operar('readonly', (tabela) => tabela.get(id)) : null;
  if (id && !anterior) throw new Error('Esta publicação foi removida. Atualize a lista.');
  if (!anterior || arquivo) validarArquivo(arquivo);
  const agora = Date.now();
  const item = {
    ...anterior,
    id: id || novoId(),
    titulo: texto,
    publicado: Boolean(publicado),
    criadoEm: anterior?.criadoEm ?? agora,
    atualizadoEm: agora,
  };
  if (arquivo) {
    item.blob = arquivo;
    item.tipo = arquivo.type.startsWith('video/') ? 'video' : 'foto';
    delete item.arquivo;
    delete item.poster;
    delete item.youtubeId;
    delete item.animalId;
  }
  await operar('readwrite', (tabela) => tabela.put(item));
  sinalizar();
  return apresentar(item);
}

export async function excluirPublicacao(id) {
  await operar('readwrite', (tabela) => tabela.delete(id));
  const anterior = urls.get(id);
  if (anterior) URL.revokeObjectURL(anterior.url);
  urls.delete(id);
  sinalizar();
}
