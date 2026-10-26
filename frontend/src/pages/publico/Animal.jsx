import { useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { buscarAnimal } from '../../api/vitrine';
import { PORTES, rotulo, SEXOS, textoIdade } from '../../api/rotulos';
import useCarregar from '../../hooks/useCarregar';
import FotoAnimal from '../../components/pets/FotoAnimal';
import Carregando from '../../components/ui/Carregando';
import Vazio from '../../components/ui/Vazio';
import { useAvisos } from '../../context/Avisos';
import { linkWhatsApp } from '../../utils/contato';
import './paginas.css';

function Galeria({ animal }) {
  const [atual, setAtual] = useState(0);
  const trilho = useRef(null);
  const fotos = animal.fotos?.length ? animal.fotos : [null];

  const aoRolar = () => {
    const t = trilho.current;
    if (t) setAtual(Math.round(t.scrollLeft / t.clientWidth));
  };

  return (
    <div className="galeria">
      <div className="galeria-trilho" ref={trilho} onScroll={aoRolar}>
        {fotos.map((src, i) => (
          <div className="galeria-item" key={src ?? i}>
            <FotoAnimal
              src={src}
              nome={animal.nome}
              especie={animal.especie}
              carregamento={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
      {fotos.length > 1 && (
        <div className="galeria-controles">
          <button
            type="button"
            className="botao botao-contorno botao-icone"
            aria-label="Foto anterior"
            disabled={atual === 0}
            onClick={() =>
              trilho.current.scrollTo({
                left: (atual - 1) * trilho.current.clientWidth,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              })
            }
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          </button>
          <span aria-live="polite">
            Foto {atual + 1} de {fotos.length}
          </span>
          <button
            type="button"
            className="botao botao-contorno botao-icone"
            aria-label="Próxima foto"
            disabled={atual === fotos.length - 1}
            onClick={() =>
              trilho.current.scrollTo({
                left: (atual + 1) * trilho.current.clientWidth,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              })
            }
          >
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function Info({ icone, rotulo: r, valor }) {
  return (
    <div className="info">
      <i className={`fa-solid ${icone}`} aria-hidden="true" />
      <span>
        <small>{r}</small>
        <strong>{valor}</strong>
      </span>
    </div>
  );
}

export default function Animal() {
  const { state } = useLocation();
  const voltar = /^\/animais(?:\?|$)/.test(state?.voltar || '') ? state.voltar : '/animais';
  const { slug } = useParams();
  const avisar = useAvisos();
  const { dados: a, carregando, erro } = useCarregar(() => buscarAnimal(slug), [slug]);

  if (carregando) return <Carregando />;
  if (erro)
    return (
      <div className="container secao">
        <Vazio
          titulo={
            erro.status === 404
              ? 'Este animal não está mais na vitrine.'
              : 'Não foi possível carregar.'
          }
        >
          <p>Talvez ele já tenha encontrado um lar!</p>
          <Link to="/animais" className="botao botao-principal">
            Ver outros animais
          </Link>
        </Vazio>
      </div>
    );

  const ele = a.sexo === 'FEMEA' ? 'ela' : 'ele';
  const dele = a.sexo === 'FEMEA' ? 'dela' : 'dele';
  const temSaude = a.medicacoes || a.condicoesSaude || a.vacinas;

  const compartilhar = async () => {
    const dadosLink = { title: `${a.nome} | Abrigo Animal Joinville`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(dadosLink);
      else {
        await navigator.clipboard.writeText(dadosLink.url);
        avisar.sucesso('Link copiado. É só colar no WhatsApp!');
      }
    } catch {
      /* a pessoa cancelou o compartilhamento */
    }
  };

  return (
    <article className="pagina-animal">
      <div className="container pagina-animal-grade">
        <div>
          <div className="d-flex justify-content-between align-items-center py-3">
            <Link to={voltar} className="botao botao-texto ps-0">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Voltar aos animais
            </Link>
            <button
              type="button"
              className="botao botao-contorno botao-icone"
              onClick={compartilhar}
              aria-label="Compartilhar"
            >
              <i className="fa-solid fa-share-nodes" aria-hidden="true" />
            </button>
          </div>
          <Galeria animal={a} />
        </div>

        <div className="pagina-animal-texto">
          <div className="d-flex flex-wrap gap-2 mb-2">
            {a.idoso && (
              <span className="selo selo-laranja">
                <i className="fa-solid fa-heart" aria-hidden="true" /> Idos
                {a.sexo === 'FEMEA' ? 'a' : 'o'}
              </span>
            )}
            {!a.disponivelParaAdocao && (
              <span className="selo selo-amarelo">Disponível só para apadrinhamento</span>
            )}
          </div>
          <h1 className="pagina-animal-nome">{a.nome}</h1>

          <div className="infos">
            <Info
              icone={a.especie === 'GATO' ? 'fa-cat' : 'fa-dog'}
              rotulo="Espécie"
              valor={a.especie === 'GATO' ? 'Gato' : 'Cão'}
            />
            <Info
              icone="fa-venus-mars"
              rotulo="Sexo"
              valor={rotulo(SEXOS, a.sexo) === 'Não sei' ? 'Não informado' : rotulo(SEXOS, a.sexo)}
            />
            <Info icone="fa-cake-candles" rotulo="Idade" valor={textoIdade(a.idadeAnos)} />
            {a.porte && <Info icone="fa-ruler" rotulo="Porte" valor={rotulo(PORTES, a.porte)} />}
            <Info
              icone="fa-scissors"
              rotulo={a.sexo === 'FEMEA' ? 'Castrada' : 'Castrado'}
              valor={a.castrado ? 'Sim' : 'Ainda não'}
            />
            {a.cor && <Info icone="fa-palette" rotulo="Cor" valor={a.cor} />}
          </div>

          {a.idoso && (
            <div className="destaque-idoso">
              <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
              <p className="mb-0">
                Cada idade tem seu encanto. Como padrinho ou madrinha, você pode acompanhar {ele}
                de perto e combinar visitas e cuidados com a equipe, respeitando seu ritmo.
              </p>
            </div>
          )}

          {a.descricao && (
            <section className="mt-4">
              <h2 className="h5">Sobre {ele}</h2>
              <p className="texto-longo">{a.descricao}</p>
            </section>
          )}

          {a.temperamento?.length > 0 && (
            <section className="mt-4">
              <h2 className="h5">Jeito {dele}</h2>
              <div className="chips">
                {a.temperamento.map((t) => (
                  <span key={t} className="chip chip-pequeno">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(temSaude || a.medicacaoContinua) && (
            <section className="mt-4 cartao cartao-corpo">
              <h2 className="h5">
                <i
                  className="fa-solid fa-stethoscope me-2"
                  style={{ color: 'var(--verde)' }}
                  aria-hidden="true"
                />
                Saúde
              </h2>
              {a.medicacaoContinua && (
                <p className="mb-2">
                  <span className="selo selo-verde">Usa medicação contínua</span>
                </p>
              )}
              {a.medicacoes && (
                <p className="mb-2">
                  <strong>Medicações:</strong> {a.medicacoes}
                </p>
              )}
              {a.condicoesSaude && (
                <p className="mb-2">
                  <strong>Cuidados:</strong> {a.condicoesSaude}
                </p>
              )}
              {a.vacinas && (
                <p className="mb-0">
                  <strong>Vacinas:</strong> {a.vacinas}
                </p>
              )}
            </section>
          )}

          <div className="acoes-animal">
            <Link
              to={`/animais/${a.slug}/interesse?tipo=APADRINHAR`}
              className="botao botao-principal botao-grande"
            >
              <i className="fa-solid fa-heart" aria-hidden="true" /> Apadrinhar
            </Link>
            {a.disponivelParaAdocao && (
              <a
                href={linkWhatsApp(
                  `Olá! Quero conhecer ${a.nome} para uma adoção presencial. Podemos combinar uma visita?`,
                )}
                target="_blank"
                rel="noreferrer"
                className="botao botao-verde botao-grande"
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true" /> Quero adotar
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
