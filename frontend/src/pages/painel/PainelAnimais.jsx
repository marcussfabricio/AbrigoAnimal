import { Link, useSearchParams } from 'react-router-dom';
import * as api from '../../api/animais';
import { ESPECIES, rotulo, SITUACOES, textoIdade } from '../../api/rotulos';
import useCarregar from '../../hooks/useCarregar';
import FotoAnimal from '../../components/pets/FotoAnimal';
import Carregando from '../../components/ui/Carregando';
import Vazio from '../../components/ui/Vazio';
import Paginacao from '../../components/ui/Paginacao';

const FILTROS = [
  { rotulo: 'Todos', params: {} },
  { rotulo: 'Disponíveis', params: { situacao: 'DISPONIVEL' } },
  { rotulo: 'Idosos', params: { idoso: 'true' } },
  { rotulo: 'Em tratamento', params: { situacao: 'EM_TRATAMENTO' } },
  { rotulo: 'Adotados', params: { situacao: 'ADOTADO' } },
  { rotulo: 'Cães', params: { especie: 'CAO' } },
  { rotulo: 'Gatos', params: { especie: 'GATO' } },
  { rotulo: 'Óbitos', params: { situacao: 'OBITO' } },
];

const cor = (s) => SITUACOES.find((x) => x.valor === s)?.cor ?? 'cinza';

export default function PainelAnimais() {
  const [params, setParams] = useSearchParams();
  const busca = params.get('busca') || '';
  const pagina = Math.max(0, Number.parseInt(params.get('pagina'), 10) || 0);
  const filtros = Object.fromEntries(params);
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => api.listar({ ...filtros, pagina, tamanho: 20, busca: busca.trim() || undefined }),
    [params.toString(), busca],
  );

  const ativo = (f) =>
    Object.keys(f.params).length
      ? Object.entries(f.params).every(([chave, valor]) => params.get(chave) === valor)
      : !params.get('situacao') && !params.get('idoso') && !params.get('especie');
  const alternar = (f) => {
    const novo = new URLSearchParams(params);
    novo.delete('pagina');
    if (!Object.keys(f.params).length) {
      ['situacao', 'idoso', 'especie'].forEach((chave) => novo.delete(chave));
    } else {
      Object.entries(f.params).forEach(([chave, valor]) =>
        ativo(f) ? novo.delete(chave) : novo.set(chave, valor),
      );
    }
    setParams(novo, { replace: true });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Animais</h1>
        <Link to="/painel/animais/novo" className="botao botao-principal">
          <i className="fa-solid fa-plus" aria-hidden="true" /> Cadastrar
        </Link>
      </div>

      <div className="busca">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          className="entrada"
          placeholder="Buscar por nome ou chip"
          value={busca}
          onChange={(e) => {
            const novo = new URLSearchParams(params);
            novo.delete('pagina');
            if (e.target.value) novo.set('busca', e.target.value);
            else novo.delete('busca');
            setParams(novo, { replace: true });
          }}
          aria-label="Buscar animal"
        />
      </div>

      <div className="chips chips-rolagem my-3" role="group" aria-label="Filtros">
        {FILTROS.map((f) => (
          <button
            key={f.rotulo}
            type="button"
            className="chip"
            aria-pressed={ativo(f)}
            onClick={() => alternar(f)}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      {erro ? (
        <Vazio icone="fa-wifi" titulo={erro.message}>
          <button className="botao botao-contorno" onClick={recarregar}>
            Tentar novamente
          </button>
        </Vazio>
      ) : carregando ? (
        <Carregando />
      ) : dados.itens.length === 0 ? (
        <Vazio titulo="Nenhum animal encontrado.">
          {params.size > 0 && (
            <button className="botao botao-contorno mt-2" onClick={() => setParams({})}>
              Limpar busca e filtros
            </button>
          )}
          <Link to="/painel/animais/novo" className="botao botao-principal mt-2">
            Cadastrar animal
          </Link>
        </Vazio>
      ) : (
        <>
          <p className="small texto-suave">
            {dados.total} {dados.total === 1 ? 'animal' : 'animais'}
          </p>
          <ul className="lista-animais">
            {dados.itens.map((a) => (
              <li key={a.id}>
                <Link to={`/painel/animais/${a.id}`} className="linha-animal">
                  <FotoAnimal
                    src={a.fotoPrincipal}
                    nome={a.nome}
                    especie={a.especie}
                    className="linha-animal-foto"
                  />
                  <span className="linha-animal-texto">
                    <strong>
                      {a.nome}
                      {a.idoso && (
                        <i
                          className="fa-solid fa-heart ms-2"
                          style={{ color: 'var(--laranja)', fontSize: '0.8em' }}
                          title="Idoso"
                        />
                      )}
                    </strong>
                    <small>
                      {rotulo(ESPECIES, a.especie)}
                      {a.idadeAnos != null ? ` · ${textoIdade(a.idadeAnos)}` : ''}
                      {a.ala ? ` · ${a.ala}` : ''}
                      {a.canil ? ` · canil ${a.canil}` : ''}
                    </small>
                    <span className="d-flex flex-wrap gap-1 mt-1">
                      <span className={`selo selo-${cor(a.situacao)}`}>
                        {rotulo(SITUACOES, a.situacao)}
                      </span>
                      {!a.visivelNaVitrine && a.situacao !== 'OBITO' && (
                        <span className="selo selo-cinza">
                          <i className="fa-solid fa-eye-slash" aria-hidden="true" /> Fora da vitrine
                        </span>
                      )}
                      {a.padrinhos > 0 && (
                        <span className="selo selo-verde">
                          <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />{' '}
                          {a.padrinhos}
                        </span>
                      )}
                      {!a.fotoPrincipal && <span className="selo selo-amarelo">Sem foto</span>}
                    </span>
                  </span>
                  <i className="fa-solid fa-chevron-right texto-suave" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {!erro && dados && (
        <Paginacao
          pagina={pagina}
          totalPaginas={dados.totalPaginas}
          ocupado={carregando}
          aoMudar={(valor) => {
            const novo = new URLSearchParams(params);
            novo.set('pagina', String(valor));
            setParams(novo);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </div>
  );
}
