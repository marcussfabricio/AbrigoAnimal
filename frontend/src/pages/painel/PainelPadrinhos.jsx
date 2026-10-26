import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as pessoas from '../../api/pessoas';
import * as apadrinhamentos from '../../api/apadrinhamentos';
import * as animais from '../../api/animais';
import { rotulo, TIPOS_APOIO } from '../../api/rotulos';
import useCarregar from '../../hooks/useCarregar';
import { useAvisos } from '../../context/Avisos';
import { mascaraTelefone, dataBR } from '../../utils/formato';
import Carregando from '../../components/ui/Carregando';
import Vazio from '../../components/ui/Vazio';
import Folha from '../../components/ui/Folha';
import { CampoTexto, GrupoChips } from '../../components/ui/Campos';
import FotoAnimal from '../../components/pets/FotoAnimal';
import Paginacao from '../../components/ui/Paginacao';
import { numeroWhatsApp } from '../../utils/contato';

const PESSOA_VAZIA = { nome: '', telefone: '', email: '', observacoes: '', consentimento: false };

/** Ficha da pessoa: afilhados + vincular a um novo animal. */
function FichaPessoa({ pessoa, aoFechar, aoEditar, animalInicial }) {
  const avisar = useAvisos();
  const vinculos = useCarregar(() => apadrinhamentos.listar({ pessoaId: pessoa.id }), [pessoa.id]);
  const [vinculando, setVinculando] = useState(Boolean(animalInicial));
  const [busca, setBusca] = useState('');
  const [escolhido, setEscolhido] = useState(animalInicial || null);
  const [ocupado, setOcupado] = useState(false);
  const [paginaAnimal, setPaginaAnimal] = useState(0);
  const [tipo, setTipo] = useState('AFETIVO');
  const opcoes = useCarregar(
    () =>
      vinculando
        ? animais.listar({ busca: busca || undefined, tamanho: 20, pagina: paginaAnimal })
        : Promise.resolve(null),
    [vinculando, busca, paginaAnimal],
  );

  const vincular = async () => {
    if (ocupado) return;
    setOcupado(true);
    try {
      await apadrinhamentos.criar({ pessoaId: pessoa.id, animalId: escolhido.id, tipoApoio: tipo });
      avisar.sucesso(`${pessoa.nome.split(' ')[0]} agora apadrinha ${escolhido.nome}`);
      setVinculando(false);
      setEscolhido(null);
      vinculos.recarregar();
    } catch (e) {
      avisar.erro(e.message);
    } finally {
      setOcupado(false);
    }
  };

  const encerrar = async (v) => {
    if (ocupado) return;
    if (!window.confirm(`Encerrar o apadrinhamento de ${v.animalNome}?`)) return;
    setOcupado(true);
    try {
      await apadrinhamentos.encerrar(v.id);
      vinculos.recarregar();
    } catch (e) {
      avisar.erro(e.message);
    } finally {
      setOcupado(false);
    }
  };

  const ativos = (vinculos.dados ?? []).filter((v) => v.ativo);
  const antigos = (vinculos.dados ?? []).filter((v) => !v.ativo);

  return (
    <Folha aberta aoFechar={() => !ocupado && aoFechar()} titulo={pessoa.nome}>
      <p className="small texto-suave mb-3">
        {[pessoa.telefone, pessoa.email].filter(Boolean).join(' · ')}
        {pessoa.observacoes && <span className="d-block mt-1">{pessoa.observacoes}</span>}
      </p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          className="botao botao-contorno"
          disabled={ocupado}
          onClick={() => aoEditar(pessoa)}
        >
          Editar dados
        </button>
        {numeroWhatsApp(pessoa.telefone) && (
          <a
            className="botao botao-verde"
            href={`https://wa.me/${numeroWhatsApp(pessoa.telefone)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        )}
      </div>

      <h3 className="h6">Afilhados</h3>
      {vinculos.erro ? (
        <div role="alert">
          <p>Não foi possível carregar os afilhados.</p>
          <button className="botao botao-contorno" onClick={vinculos.recarregar}>
            Tentar novamente
          </button>
        </div>
      ) : vinculos.carregando && !vinculos.dados ? (
        <Carregando />
      ) : ativos.length === 0 ? (
        <p className="texto-suave small">Nenhum afilhado ativo.</p>
      ) : (
        <ul className="list-unstyled d-grid gap-2">
          {ativos.map((v) => (
            <li key={v.id} className="vinculo">
              <span>
                <strong>{v.animalNome}</strong>
                <small className="d-block texto-suave">
                  {rotulo(TIPOS_APOIO, v.tipoApoio)} · desde {dataBR(v.dataInicio)}
                </small>
              </span>
              <button
                type="button"
                className="botao botao-texto"
                disabled={ocupado}
                onClick={() => encerrar(v)}
              >
                Encerrar
              </button>
            </li>
          ))}
        </ul>
      )}
      {antigos.length > 0 && (
        <p className="small texto-suave">
          Anteriores: {antigos.map((v) => `${v.animalNome} (até ${dataBR(v.dataFim)})`).join(', ')}
        </p>
      )}

      {!vinculando ? (
        <button
          type="button"
          className="botao botao-principal botao-bloco mt-2"
          onClick={() => setVinculando(true)}
        >
          <i className="fa-solid fa-link" aria-hidden="true" /> Vincular a um animal
        </button>
      ) : (
        <div className="cartao-interno mt-2 p-3">
          {!escolhido ? (
            <>
              <input
                className="entrada mb-2"
                type="search"
                placeholder="Buscar animal pelo nome"
                aria-label="Buscar animal para apadrinhar"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPaginaAnimal(0);
                }}
                autoFocus
              />
              {opcoes.erro ? (
                <div role="alert">
                  <p>Não foi possível buscar os animais.</p>
                  <button className="botao botao-contorno" onClick={opcoes.recarregar}>
                    Tentar novamente
                  </button>
                </div>
              ) : opcoes.carregando ? (
                <Carregando />
              ) : (
                !opcoes.dados?.itens.some((animal) => animal.situacao !== 'OBITO') && (
                  <p>Nenhum animal disponível nesta página. Tente outra busca ou página.</p>
                )
              )}
              <ul className="list-unstyled d-grid gap-1 mb-0 escolha-animal">
                {(opcoes.carregando || opcoes.erro ? [] : (opcoes.dados?.itens ?? []))
                  .filter((a) => a.situacao !== 'OBITO')
                  .map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        className="linha-animal"
                        onClick={() => setEscolhido(a)}
                      >
                        <FotoAnimal
                          src={a.fotoPrincipal}
                          nome={a.nome}
                          especie={a.especie}
                          className="linha-animal-foto"
                        />
                        <span className="linha-animal-texto">
                          <strong>{a.nome}</strong>
                          {a.idoso && <small>Idoso</small>}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
              {!opcoes.erro && (
                <Paginacao
                  pagina={paginaAnimal}
                  totalPaginas={opcoes.dados?.totalPaginas}
                  ocupado={opcoes.carregando}
                  aoMudar={setPaginaAnimal}
                />
              )}
            </>
          ) : (
            <>
              <p>
                Apadrinhar <strong>{escolhido.nome}</strong>{' '}
                <button
                  type="button"
                  className="botao-link"
                  disabled={ocupado}
                  onClick={() => setEscolhido(null)}
                >
                  trocar
                </button>
              </p>
              <GrupoChips
                rotulo="Tipo de apoio"
                opcoes={TIPOS_APOIO}
                valor={tipo}
                aoMudar={(v) => v && setTipo(v)}
              />
              <button
                type="button"
                className="botao botao-principal botao-bloco"
                onClick={vincular}
                disabled={
                  ocupado ||
                  vinculos.carregando ||
                  Boolean(vinculos.erro) ||
                  ativos.some((vinculo) => vinculo.animalId === escolhido.id)
                }
              >
                {ocupado
                  ? 'Salvando…'
                  : ativos.some((vinculo) => vinculo.animalId === escolhido.id)
                    ? 'Este vínculo já está ativo'
                    : 'Confirmar apadrinhamento'}
              </button>
            </>
          )}
          <button
            type="button"
            className="botao botao-texto botao-bloco mt-1"
            onClick={() => setVinculando(false)}
            disabled={ocupado}
          >
            Cancelar
          </button>
        </div>
      )}
    </Folha>
  );
}

export default function PainelPadrinhos() {
  const [params, setParams] = useSearchParams();
  const avisar = useAvisos();
  const [busca, setBusca] = useState('');
  const [ficha, setFicha] = useState(null);
  const [pagina, setPagina] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [alterado, setAlterado] = useState(false);
  const [duplicadas, setDuplicadas] = useState([]);
  const [animalInicial, setAnimalInicial] = useState(() =>
    params.get('animalId')
      ? { id: params.get('animalId'), nome: params.get('animalNome') || 'Animal do pedido' }
      : null,
  );
  // Vindo de um pedido (?novo=1&nome=...): abre o cadastro já preenchido.
  const [nova, setNova] = useState(() =>
    params.get('novo')
      ? {
          ...PESSOA_VAZIA,
          nome: params.get('nome') || '',
          telefone: params.get('telefone') || '',
          email: params.get('email') || '',
          consentimento: true,
        }
      : null,
  );
  const [erros, setErros] = useState({});
  const lista = useCarregar(
    () => pessoas.listar({ busca: busca.trim() || undefined, pagina, tamanho: 20 }),
    [busca, pagina],
  );
  const fecharCadastro = () => {
    if (salvando || (alterado && !window.confirm('Descartar as alterações deste cadastro?')))
      return;
    setNova(null);
    setDuplicadas([]);
    setAlterado(false);
  };

  useEffect(() => {
    if (params.get('novo')) setParams({}, { replace: true });
  }, [params, setParams]);

  const salvarPessoa = async (e, permitirDuplicada = false) => {
    e?.preventDefault();
    if (salvando) return;
    const invalidos = {};
    if (!nova.nome.trim()) invalidos.nome = 'Informe o nome';
    if (!nova.telefone.trim() && !nova.email.trim())
      invalidos.telefone = 'Informe telefone ou e-mail';
    if (nova.telefone && !/^\d{10,11}$/.test(nova.telefone.replace(/\D/g, '')))
      invalidos.telefone = 'Informe o telefone completo, com DDD';
    if (nova.email && !/^\S+@\S+\.\S+$/.test(nova.email.trim()))
      invalidos.email = 'Confira o e-mail';
    if (!nova.consentimento) invalidos.consentimento = 'Confirme a autorização da pessoa';
    setErros(invalidos);
    if (Object.keys(invalidos).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setSalvando(true);
    try {
      if (!nova.id && !permitirDuplicada) {
        const contatos = [nova.email.trim(), nova.telefone].filter(Boolean);
        const encontrados = await Promise.all(contatos.map((busca) => pessoas.listar({ busca })));
        const iguais = [
          ...new Map(
            encontrados
              .flatMap((resultado) => resultado.itens)
              .filter(
                (pessoa) =>
                  (nova.email.trim() &&
                    pessoa.email?.trim().toLowerCase() === nova.email.trim().toLowerCase()) ||
                  (nova.telefone &&
                    pessoa.telefone?.replace(/\D/g, '') === nova.telefone.replace(/\D/g, '')),
              )
              .map((pessoa) => [pessoa.id, pessoa]),
          ).values(),
        ];
        if (iguais.length) {
          setDuplicadas(iguais);
          return;
        }
      }
      const p = await pessoas.salvar(
        { ...nova, nome: nova.nome.trim(), email: nova.email.trim() },
        nova.id,
      );
      avisar.sucesso(nova.id ? 'Dados atualizados' : 'Pessoa cadastrada');
      setNova(null);
      setAlterado(false);
      setDuplicadas([]);
      setErros({});
      lista.recarregar();
      setFicha(p);
    } catch (err) {
      setErros(err.campos || {});
      avisar.erro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Padrinhos</h1>
        <button
          type="button"
          className="botao botao-principal"
          onClick={() => {
            setNova(PESSOA_VAZIA);
            setAnimalInicial(null);
            setErros({});
            setAlterado(false);
            setDuplicadas([]);
          }}
        >
          <i className="fa-solid fa-user-plus" aria-hidden="true" /> Nova pessoa
        </button>
      </div>

      <div className="busca mb-3">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          className="entrada"
          placeholder="Nome, telefone ou e-mail"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(0);
          }}
          aria-label="Buscar pessoa"
        />
      </div>

      {lista.erro ? (
        <Vazio icone="fa-wifi" titulo="Não foi possível carregar os padrinhos.">
          <button className="botao botao-contorno" onClick={lista.recarregar}>
            Tentar novamente
          </button>
        </Vazio>
      ) : lista.carregando ? (
        <Carregando />
      ) : lista.dados.itens.length === 0 ? (
        <Vazio
          icone="fa-hand-holding-heart"
          titulo={
            busca ? 'Nenhuma pessoa encontrada nesta busca.' : 'Ninguém cadastrado nesta página.'
          }
        >
          {busca ? (
            <button
              className="botao botao-contorno"
              onClick={() => {
                setBusca('');
                setPagina(0);
              }}
            >
              Limpar busca
            </button>
          ) : (
            <p className="small">Cadastre os padrinhos que hoje estão nos termos em papel.</p>
          )}
        </Vazio>
      ) : (
        <ul className="lista-pedidos">
          {lista.dados.itens.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="pedido"
                onClick={() => {
                  setAnimalInicial(null);
                  setFicha(p);
                }}
              >
                <strong>{p.nome}</strong>
                <small className="texto-suave">
                  {[p.telefone, p.email].filter(Boolean).join(' · ')}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!lista.erro && (
        <Paginacao
          pagina={pagina}
          totalPaginas={lista.dados?.totalPaginas}
          ocupado={lista.carregando}
          aoMudar={setPagina}
        />
      )}

      {ficha && (
        <FichaPessoa
          pessoa={ficha}
          animalInicial={animalInicial}
          aoFechar={() => setFicha(null)}
          aoEditar={(pessoa) => {
            setFicha(null);
            setNova({
              ...PESSOA_VAZIA,
              ...pessoa,
              telefone: pessoa.telefone || '',
              email: pessoa.email || '',
              observacoes: pessoa.observacoes || '',
              consentimento: Boolean(pessoa.consentimento || pessoa.consentimentoEm),
            });
            setErros({});
            setAlterado(false);
            setDuplicadas([]);
          }}
        />
      )}

      <Folha
        aberta={Boolean(nova)}
        aoFechar={fecharCadastro}
        titulo={nova?.id ? 'Editar pessoa' : 'Nova pessoa'}
      >
        {nova && (
          <form
            onSubmit={salvarPessoa}
            onChange={() => {
              setAlterado(true);
              setDuplicadas([]);
            }}
            noValidate
          >
            {animalInicial && (
              <p className="aviso-rascunho">
                Pedido para apadrinhar {animalInicial.nome}. Após salvar, confirme o vínculo.
              </p>
            )}
            <fieldset disabled={salvando}>
              <CampoTexto
                rotulo="Nome"
                obrigatorio
                value={nova.nome}
                onChange={(e) => setNova({ ...nova, nome: e.target.value })}
                erro={erros.nome}
                autoCapitalize="words"
              />
              <CampoTexto
                rotulo="Telefone"
                type="tel"
                inputMode="tel"
                value={nova.telefone}
                onChange={(e) => setNova({ ...nova, telefone: mascaraTelefone(e.target.value) })}
                erro={erros.telefone}
              />
              <CampoTexto
                rotulo="E-mail"
                type="email"
                inputMode="email"
                value={nova.email}
                onChange={(e) => setNova({ ...nova, email: e.target.value })}
                erro={erros.email}
              />
              <CampoTexto
                rotulo="Observações"
                multilinha
                rows={2}
                value={nova.observacoes}
                onChange={(e) => setNova({ ...nova, observacoes: e.target.value })}
              />
              <label className="consentimento mb-3">
                <input
                  type="checkbox"
                  checked={nova.consentimento}
                  aria-invalid={erros.consentimento ? 'true' : undefined}
                  onChange={(e) => setNova({ ...nova, consentimento: e.target.checked })}
                />
                <span>
                  A pessoa autorizou guardar estes dados (termo assinado ou formulário do site).
                </span>
              </label>
              {erros.consentimento && (
                <p className="campo-erro" role="alert">
                  {erros.consentimento}
                </p>
              )}
            </fieldset>
            {duplicadas.length > 0 && (
              <div className="cartao-interno p-3 mb-3" role="status">
                <p>
                  Já existe uma pessoa com este telefone ou e-mail. Confira antes de criar outro
                  cadastro.
                </p>
                {duplicadas.map((pessoa) => (
                  <button
                    key={pessoa.id}
                    type="button"
                    className="botao botao-verde botao-bloco mb-2"
                    onClick={() => {
                      setNova(null);
                      setFicha(pessoa);
                      setDuplicadas([]);
                      setAlterado(false);
                    }}
                  >
                    Usar cadastro de {pessoa.nome}
                  </button>
                ))}
                <button
                  type="button"
                  className="botao botao-contorno botao-bloco"
                  disabled={salvando}
                  onClick={() => salvarPessoa(null, true)}
                >
                  É outra pessoa: cadastrar mesmo assim
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={salvando}
              className="botao botao-principal botao-grande botao-bloco"
            >
              {salvando ? 'Salvando…' : 'Salvar dados'}
            </button>
          </form>
        )}
      </Folha>
    </div>
  );
}
