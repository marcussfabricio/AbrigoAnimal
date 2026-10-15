import { Link } from 'react-router-dom';
import heroCao from '../../assets/img/hero-cao-gravata.webp';
import imgRole from '../../assets/img/role-do-abrigo.webp';
import mural1 from '../../assets/img/mural-1.webp';
import mural2 from '../../assets/img/mural-2.webp';
import mural3 from '../../assets/img/mural-3.webp';
import mural4 from '../../assets/img/mural-4.webp';
import { listarAnimais, listarVideos } from '../../api/vitrine';
import TrilhoVideos from '../../components/pets/Videos';
import useCarregar from '../../hooks/useCarregar';
import CartaoAnimal, { CartaoAnimalEsqueleto } from '../../components/pets/CartaoAnimal';
import { CONTATO } from '../../utils/contato';
import './paginas.css';

/** Rolê do Abrigo: último sábado de cada mês. Calcula a próxima data. */
function proximoRole() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  for (let m = 0; m < 3; m++) {
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + m + 1, 0);
    const sabado = new Date(fim);
    sabado.setDate(fim.getDate() - ((fim.getDay() + 1) % 7));
    if (sabado >= hoje) return sabado;
  }
  return null;
}

const PASSOS = [
  {
    icone: 'fa-magnifying-glass',
    titulo: 'Escolha um afilhado',
    texto: 'Conheça os animais, principalmente os idosos, que quase nunca são adotados.',
  },
  {
    icone: 'fa-pen-to-square',
    titulo: 'Conte que quer ajudar',
    texto: 'Preencha um formulário rápido. Não precisa criar conta.',
  },
  {
    icone: 'fa-phone',
    titulo: 'A equipe fala com você',
    texto: 'Combinamos o apoio: visitas, passeios, contribuição livre ou tudo junto.',
  },
];

export default function Inicio() {
  const idosos = useCarregar(() => listarAnimais({ idoso: true, tamanho: 8 }));
  const todos = useCarregar(() => listarAnimais({ tamanho: 4 }));
  const videos = useCarregar(() => listarVideos({ tamanho: 10 }));
  const role = proximoRole();

  return (
    <>
      <section className="hero">
        <div className="container hero-grade">
          <div>
            <span className="sobretitulo">
              <i className="fa-solid fa-paw" aria-hidden="true" /> Desde 2001 em Joinville
            </span>
            <h1 className="hero-titulo">
              Transforme uma vida: <span className="destaque">adote ou apadrinhe.</span>
            </h1>
            <p className="hero-texto">
              Cuidamos de centenas de cães e gatos. Muitos são idosos e esperam alguém para chamar
              de seu, nem que seja aos sábados.
            </p>
            <div className="hero-acoes">
              <Link to="/animais" className="botao botao-principal botao-grande">
                Conhecer os animais <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
              <Link to="/animais?idoso=true" className="botao botao-contorno botao-grande">
                <i className="fa-solid fa-heart" aria-hidden="true" /> Apadrinhar um idoso
              </Link>
            </div>
          </div>
          <div className="hero-imagem">
            <div className="hero-circulo">
              <img
                src={heroCao}
                alt="Cão do abrigo usando gravata, sorrindo"
                width="683"
                height="1024"
              />
            </div>
            <span className="hero-bolha">
              <i className="fa-solid fa-heart" aria-hidden="true" /> Adoção responsável
            </span>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <div className="cabeca-secao">
            <div>
              <span className="sobretitulo">Quem mais precisa</span>
              <h2 className="titulo-secao">Eles esperam há mais tempo</h2>
              <p className="texto-suave mb-0">
                Idosos raramente são adotados. Um padrinho faz toda a diferença na rotina deles.
              </p>
            </div>
            <Link to="/animais?idoso=true" className="botao botao-texto d-none d-md-inline-flex">
              Ver todos <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <div className="trilho">
            {idosos.carregando
              ? [1, 2, 3].map((i) => <CartaoAnimalEsqueleto key={i} />)
              : idosos.dados?.itens.map((a) => <CartaoAnimal key={a.slug} animal={a} />)}
          </div>
          <Link
            to="/animais?idoso=true"
            className="botao botao-contorno botao-bloco mt-3 d-md-none"
          >
            Ver todos os idosos
          </Link>
        </div>
      </section>

      {videos.dados?.itens.length > 0 && (
        <section className="secao pt-0">
          <div className="container">
            <span className="sobretitulo">
              <i className="fa-brands fa-youtube" aria-hidden="true" /> Vídeos do abrigo
            </span>
            <h2 className="titulo-secao">Veja quem está esperando</h2>
            <p className="texto-suave">
              Um vídeo curto mostra o jeito de cada um melhor que qualquer foto.
            </p>
            <TrilhoVideos videos={videos.dados.itens} />
          </div>
        </section>
      )}

      <section className="secao faixa-verde">
        <div className="container">
          <span className="sobretitulo">Apadrinhamento</span>
          <h2 className="titulo-secao">Como funciona</h2>
          <p className="texto-suave">
            A contribuição é livre. Dá para apoiar com carinho (visitas e passeios), com dinheiro ou
            com os dois. Um animal pode ter vários padrinhos.
          </p>
          <ol className="passos">
            {PASSOS.map((p, i) => (
              <li key={p.titulo} className="passo">
                <span className="passo-icone">
                  <i className={`fa-solid ${p.icone}`} aria-hidden="true" />
                </span>
                <div>
                  <strong>
                    {i + 1}. {p.titulo}
                  </strong>
                  <p>{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/animais?idoso=true" className="botao botao-principal botao-grande">
            Quero apadrinhar <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="secao" id="role-do-abrigo">
        <div className="container">
          <div className="role cartao">
            <figure className="role-imagem">
              <img src={imgRole} alt="Pessoas passeando com cães em uma trilha" loading="lazy" />
              <figcaption>Imagem ilustrativa</figcaption>
            </figure>
            <div className="role-texto">
              <span className="sobretitulo">
                <i className="fa-solid fa-person-walking" aria-hidden="true" /> Rolê do Abrigo
              </span>
              <h2 className="titulo-secao">Passeie com um dos nossos cães</h2>
              <p className="texto-suave">
                No último sábado de cada mês, você vai até o abrigo, escolhe um cão e passeia com
                ele pelos campos ao redor. Para eles, é o melhor dia do mês.
              </p>
              {role && (
                <div className="role-data">
                  <span className="role-dia">
                    <small>
                      {role.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </small>
                    <strong>{role.getDate()}</strong>
                  </span>
                  <span>
                    <small className="texto-suave d-block">Próximo rolê</small>
                    <strong>
                      {role.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </strong>
                  </span>
                </div>
              )}
              <a
                className="botao botao-contorno mt-3"
                href={CONTATO.mapa}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-location-dot" aria-hidden="true" /> Como chegar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="secao pt-0">
        <div className="container">
          <div className="cabeca-secao">
            <div>
              <span className="sobretitulo">Para adoção</span>
              <h2 className="titulo-secao">Encontre seu novo amigo</h2>
            </div>
          </div>
          <div className="grade-animais">
            {todos.carregando
              ? [1, 2, 3, 4].map((i) => <CartaoAnimalEsqueleto key={i} />)
              : todos.dados?.itens.map((a) => <CartaoAnimal key={a.slug} animal={a} />)}
          </div>
          <div className="text-center mt-4">
            <Link to="/animais" className="botao botao-principal botao-grande">
              Ver todos os animais
            </Link>
          </div>
        </div>
      </section>

      <section className="secao pt-0">
        <div className="container">
          <span className="sobretitulo">
            <i className="fa-brands fa-instagram" aria-hidden="true" /> Por dentro do abrigo
          </span>
          <h2 className="titulo-secao">O dia a dia dos nossos amigos</h2>
          <div className="mural">
            {[mural1, mural2, mural3, mural4].map((src, i) => (
              <a
                key={src}
                href={CONTATO.instagram}
                target="_blank"
                rel="noreferrer"
                className="mural-foto"
              >
                <img src={src} alt={`Foto do abrigo ${i + 1}`} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="secao pt-0">
        <div className="container">
          <div className="faixa-alerta">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
            <div>
              <h2 className="h5 mb-1">Maus-tratos a animais é crime</h2>
              <p className="mb-2">
                Viu ou suspeita de abuso? Saiba como denunciar pelos canais oficiais.
              </p>
              <Link to="/denuncia" className="botao botao-perigo">
                Como denunciar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
