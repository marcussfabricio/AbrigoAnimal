import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMural, salvarPublicacao, excluirPublicacao, validarArquivo } from '../../api/mural';
import { useAvisos } from '../../context/Avisos';
import useCarregar from '../../hooks/useCarregar';
import Folha from '../../components/ui/Folha';
import { CampoTexto, Interruptor } from '../../components/ui/Campos';
import Carregando from '../../components/ui/Carregando';
import './mural.css';

function Previa({ item, ...props }) {
  return item.tipo === 'video' ? (
    <video
      src={item.arquivo}
      poster={item.poster}
      controls
      playsInline
      preload="metadata"
      aria-label={item.titulo || 'Prévia do vídeo'}
      {...props}
    />
  ) : (
    <img src={item.arquivo} alt={item.titulo || 'Prévia da foto'} {...props} />
  );
}

export default function PainelMural() {
  const { dados, carregando, erro, recarregar } = useCarregar(() => listarMural());
  const [editor, setEditor] = useState(null);
  const [remover, setRemover] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [erroAcao, setErroAcao] = useState('');
  const avisar = useAvisos();
  const itens = dados?.itens ?? [];

  const excluir = async () => {
    setOcupado(true);
    setErroAcao('');
    try {
      await excluirPublicacao(remover.id);
      setRemover(null);
      recarregar();
      avisar.sucesso('Publicação excluída.');
    } catch (falha) {
      setErroAcao(falha.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="gestao-mural">
      <div className="mural-cabecalho">
        <div>
          <h1>Mural</h1>
          <p>Fotos e vídeos do dia a dia para a página inicial.</p>
        </div>
        <button className="botao botao-principal" onClick={() => setEditor({})}>
          <i className="fa-solid fa-plus" aria-hidden="true" /> Adicionar
        </button>
      </div>
      <Link to="/#mural" className="link-editorial">
        Ver na página inicial{' '}
        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
      </Link>
      {erro ? (
        <div className="estado-conteudo" role="alert">
          <p>{erro.message}</p>
          <button className="botao botao-contorno" onClick={recarregar}>
            Tentar novamente
          </button>
        </div>
      ) : carregando ? (
        <Carregando />
      ) : itens.length === 0 ? (
        <div className="estado-conteudo">
          <h2>O primeiro momento começa aqui.</h2>
          <p>Adicione uma foto ou um vídeo para apresentar a rotina do abrigo.</p>
          <button className="botao botao-principal" onClick={() => setEditor({})}>
            Adicionar foto ou vídeo
          </button>
        </div>
      ) : (
        <>
          <p className="mural-contagem" aria-live="polite">
            {itens.filter((item) => item.publicado).length} publicações visíveis ·{' '}
            {itens.filter((item) => !item.publicado).length} ocultas
          </p>
          <ul className="mural-publicacoes">
            {itens.map((item) => (
              <li className="mural-publicacao" key={item.id}>
                <div className="mural-miniatura">
                  {item.tipo === 'foto' || item.poster ? (
                    <img src={item.poster || item.arquivo} alt="" loading="lazy" />
                  ) : (
                    <i className="fa-solid fa-film" aria-hidden="true" />
                  )}
                </div>
                <div className="mural-informacoes">
                  <span>
                    {item.tipo === 'foto' ? 'Foto' : 'Vídeo'} ·{' '}
                    {item.publicado ? 'Visível no site' : 'Oculta'}
                  </span>
                  <h2>{item.titulo}</h2>
                </div>
                <div className="mural-acoes">
                  <button
                    className="botao botao-contorno"
                    onClick={() => setEditor(item)}
                    aria-label={`Editar ${item.titulo}`}
                  >
                    Editar
                  </button>
                  <button
                    className="botao botao-texto"
                    onClick={() => {
                      setRemover(item);
                      setErroAcao('');
                    }}
                    aria-label={`Excluir ${item.titulo}`}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {editor && (
        <EditorMural
          item={editor}
          aoFechar={() => setEditor(null)}
          aoSalvar={() => {
            setEditor(null);
            recarregar();
          }}
        />
      )}
      <Folha
        aberta={Boolean(remover)}
        aoFechar={() => !ocupado && setRemover(null)}
        titulo="Excluir publicação?"
      >
        <p>“{remover?.titulo}” será removida do mural. Esta ação não pode ser desfeita.</p>
        {erroAcao && (
          <p role="alert" className="campo-erro">
            {erroAcao}
          </p>
        )}
        <div className="mural-botoes">
          <button
            className="botao botao-contorno"
            disabled={ocupado}
            onClick={() => setRemover(null)}
          >
            Cancelar
          </button>
          <button className="botao botao-principal" disabled={ocupado} onClick={excluir}>
            {ocupado ? 'Excluindo…' : 'Excluir publicação'}
          </button>
        </div>
      </Folha>
    </div>
  );
}

function EditorMural({ item, aoFechar, aoSalvar }) {
  const [titulo, setTitulo] = useState(item.titulo || '');
  const [publicado, setPublicado] = useState(item.publicado ?? true);
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(item.arquivo ? item : null);
  const [pronto, setPronto] = useState(Boolean(item.id));
  const [alterado, setAlterado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const urlTemporaria = useRef(null);
  const avisar = useAvisos();

  useEffect(
    () => () => {
      if (urlTemporaria.current) URL.revokeObjectURL(urlTemporaria.current);
    },
    [],
  );

  const fechar = () => {
    if (salvando) return;
    if (alterado && !window.confirm('Descartar as alterações desta publicação?')) return;
    aoFechar();
  };

  const selecionar = (evento) => {
    const escolhido = evento.target.files?.[0];
    evento.target.value = '';
    if (!escolhido) return;
    try {
      validarArquivo(escolhido);
      if (urlTemporaria.current) URL.revokeObjectURL(urlTemporaria.current);
      urlTemporaria.current = URL.createObjectURL(escolhido);
      setArquivo(escolhido);
      setPrevia({
        tipo: escolhido.type.startsWith('video/') ? 'video' : 'foto',
        arquivo: urlTemporaria.current,
      });
      setPronto(false);
      setAlterado(true);
      setErro('');
    } catch (falha) {
      setErro(falha.message);
    }
  };

  const salvar = async (evento) => {
    evento.preventDefault();
    if (!pronto || salvando) return;
    setSalvando(true);
    setErro('');
    try {
      await salvarPublicacao({ id: item.id, titulo, publicado, arquivo });
      avisar.sucesso(
        publicado ? 'Publicação salva na página inicial.' : 'Publicação salva como oculta.',
      );
      aoSalvar();
    } catch (falha) {
      setErro(falha.message);
      setSalvando(false);
    }
  };

  return (
    <Folha aberta aoFechar={fechar} titulo={item.id ? 'Editar publicação' : 'Nova publicação'}>
      <form className="mural-editor" onSubmit={salvar}>
        <fieldset disabled={salvando}>
          <label className="mural-arquivo">
            <strong>{previa ? 'Trocar arquivo' : 'Escolher foto ou vídeo'}</strong>
            <span>Fotos JPG, PNG ou WebP até 10 MB. Vídeos MP4 ou WebM até 50 MB.</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={selecionar}
              aria-label="Foto ou vídeo"
            />
          </label>
          {previa && (
            <div className="mural-previa">
              <Previa
                key={previa.arquivo}
                item={previa}
                {...(previa.tipo === 'video'
                  ? { onLoadedMetadata: () => setPronto(true) }
                  : { onLoad: () => setPronto(true) })}
                onError={() => {
                  setPronto(false);
                  setErro(
                    'Não foi possível abrir este arquivo. Escolha outra foto ou um vídeo compatível com o navegador.',
                  );
                }}
              />
            </div>
          )}
          <CampoTexto
            rotulo="Título ou descrição da imagem"
            dica="Descreva o momento. Este texto também ajuda quem usa leitor de tela."
            obrigatorio
            maxLength={100}
            value={titulo}
            onChange={(evento) => {
              setTitulo(evento.target.value);
              setAlterado(true);
            }}
          />
          <Interruptor
            titulo="Mostrar na página inicial"
            descricao="Desative para guardar sem exibir no site."
            marcado={publicado}
            aoMudar={(valor) => {
              setPublicado(valor);
              setAlterado(true);
            }}
          />
        </fieldset>
        {erro && (
          <p className="campo-erro" role="alert">
            {erro}
          </p>
        )}
        {!previa && <p className="texto-suave">Escolha um arquivo para continuar.</p>}
        <div className="mural-botoes">
          <button
            type="button"
            className="botao botao-contorno"
            disabled={salvando}
            onClick={fechar}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="botao botao-principal"
            disabled={salvando || !pronto || !titulo.trim()}
          >
            {salvando ? 'Salvando…' : publicado ? 'Salvar e publicar' : 'Salvar como oculta'}
          </button>
        </div>
      </form>
    </Folha>
  );
}
