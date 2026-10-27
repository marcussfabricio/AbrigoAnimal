import { VACINAS_COMUNS, dataPorIdade, idadePorData } from '../../api/rotulos';

export const VAZIO = {
  nome: '',
  especie: 'CAO',
  sexo: null,
  idadeAnos: null,
  idoso: false,
  cor: '',
  porte: null,
  temperamento: [],
  ala: null,
  canil: '',
  chip: '',
  castrado: false,
  medicacaoContinua: false,
  medicacoes: '',
  condicoesSaude: '',
  vacinas: [],
  vacinasOutras: '',
  descricao: '',
  visivelNaVitrine: true,
};

/** "V8/V10, Antirrábica, Giárdia" → chips conhecidos + texto livre */
export function separarVacinas(texto) {
  const partes = (texto || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    vacinas: partes.filter((p) => VACINAS_COMUNS.includes(p)),
    vacinasOutras: partes.filter((p) => !VACINAS_COMUNS.includes(p)).join(', '),
  };
}

/** Estado da tela → corpo que o backend espera (AnimalRequest). */
export function paraApi(f, original) {
  const idadeMudou = idadePorData(original?.dataNascimentoEstimada) !== f.idadeAnos;
  return {
    nome: f.nome.trim(),
    especie: f.especie,
    sexo: f.sexo || 'INDEFINIDO',
    cor: f.cor.trim() || null,
    // Só recalcula a data se a idade mudou: evita "andar" a data a cada edição.
    dataNascimentoEstimada: idadeMudou
      ? dataPorIdade(f.idadeAnos)
      : (original?.dataNascimentoEstimada ?? null),
    castrado: f.castrado,
    chip: f.chip.trim() || null,
    canil: f.canil.trim() || null,
    ala: f.ala,
    idoso: f.idoso,
    medicacaoContinua: f.medicacaoContinua,
    descricao: f.descricao.trim() || null,
    medicacoes: f.medicacaoContinua ? f.medicacoes.trim() || null : null,
    condicoesSaude: f.condicoesSaude.trim() || null,
    vacinas:
      [...f.vacinas, ...f.vacinasOutras.split(',').map((s) => s.trim())]
        .filter(Boolean)
        .join(', ') || null,
    // Proposta D3: o backend ainda não guarda porte/temperamento (ignora campos desconhecidos).
    porte: f.porte,
    temperamento: f.temperamento,
    versao: original?.versao,
  };
}
