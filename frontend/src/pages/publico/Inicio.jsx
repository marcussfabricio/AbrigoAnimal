import { Link } from 'react-router-dom';
import caoIdoso from '../../assets/img/cao-idoso.webp';
import { listarAnimais } from '../../api/vitrine';
import { listarMural } from '../../api/mural';
import MuralFotos from '../../components/pets/MuralFotos';
import TrilhoVideos from '../../components/pets/Videos';
import useCarregar from '../../hooks/useCarregar';
import CartaoAnimal, { CartaoAnimalEsqueleto } from '../../components/pets/CartaoAnimal';
import { CONTATO, linkWhatsApp } from '../../utils/contato';
import './paginas.css';
import './Inicio.css';

export default function Inicio() {
  const animais = useCarregar(() => listarAnimais({ idoso: true, tamanho: 4 }));
  const mural = useCarregar(() => listarMural({ publico: true }));
  const videos = mural.dados?.itens.filter((item) => item.tipo === 'video') ?? [];
  const fotos = mural.dados?.itens.filter((item) => item.tipo === 'foto') ?? [];

  return (
    <div className="pagina-inicio">
      <section className="capa container" aria-labelledby="inicio-titulo">
        <div className="capa-texto">
          <span className="sobretitulo">
            <span className="ponto-verde" /> Abrigo Animal · Joinville
          </span>
          <h1 id="inicio-titulo">
            O focinho fica branco.
            <br />O amor <em>continua.</em>
          </h1>
          <p>
            Uma vida inteira de histórias. E muitas ainda para viver. Apadrinhe um animal idoso e
            faça parte dos próximos capítulos.
          </p>
          <div className="capa-acoes">
            <Link to="/animais?idoso=true" className="botao botao-principal botao-grande">
              Encontrar meu afilhado <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link to="/apadrinhamento" className="link-editorial">
              Como funciona o apadrinhamento
            </Link>
          </div>
          <span className="capa-nota">
            <i className="fa-regular fa-heart" aria-hidden="true" /> Presença, carinho e cuidado. No
            tempo deles.
          </span>
        </div>
        <figure className="capa-retrato">
          <img
            src={caoIdoso}
            alt="Cão idoso descansando em uma manta verde"
            width="900"
            height="900"
            fetchPriority="high"
          />
          <figcaption className="bilhete">
            <i className="fa-solid fa-heart" aria-hidden="true" />
            <span>
              Amor não tem idade.<small>Nem prazo para começar.</small>
            </span>
          </figcaption>
          <span className="capa-legenda">Imagem ilustrativa</span>
        </figure>
      </section>

      <div className="container manifesto">
        <span>Desde 2001, cuidando de vidas.</span>
        <p>
          Um abrigo é um começo.
          <br />
          <strong>Um vínculo muda a história.</strong>
        </p>
        <Link to="/sobre" className="link-editorial">
          Conheça o abrigo{' '}
          <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
        </Link>
      </div>

      <section className="container secao-editorial" aria-labelledby="amigos-titulo">
        <div className="cabeca-editorial">
          <div>
            <span className="sobretitulo">Conheça nossos idosos</span>
            <h2 id="amigos-titulo">
              Cada um tem seu jeito.
              <br />
              <em>Todos têm muito amor.</em>
            </h2>
          </div>
          <div>
            <p>
              Um olhar tranquilo, uma caminhada sem pressa, uma companhia para a vida. Conheça quem
              pode ser seu afilhado.
            </p>
            <Link to="/animais?idoso=true" className="link-editorial">
              Ver todos os idosos <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
        {animais.erro ? (
          <div className="estado-conteudo" role="status">
            <p>Não conseguimos carregar as histórias agora.</p>
            <button className="botao botao-contorno" onClick={animais.recarregar}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grade-animais">
            {animais.carregando
              ? [1, 2, 3, 4].map((i) => <CartaoAnimalEsqueleto key={i} />)
              : animais.dados?.itens.map((animal) => (
                  <CartaoAnimal key={animal.slug} animal={animal} />
                ))}
          </div>
        )}
        {!animais.carregando && !animais.erro && !animais.dados?.itens.length && (
          <p className="estado-conteudo">
            As histórias dos nossos idosos estarão aqui em breve.{' '}
            <Link to="/animais">Conheça os outros animais.</Link>
          </p>
        )}
      </section>

      <section
        className="container secao-editorial vinculo-inicio"
        aria-labelledby="vinculo-titulo"
      >
        <div>
          <span className="sobretitulo">O projeto de apadrinhamento</span>
          <h2 id="vinculo-titulo">
            Você não precisa levar para casa.
            <br />
            <em>Pode levar no coração.</em>
          </h2>
          <p>
            Seu afilhado continua acolhido no abrigo. Você se aproxima, acompanha sua história e
            combina com a equipe como participar dos cuidados.
          </p>
          <Link to="/apadrinhamento" className="botao botao-principal">
            Quero conhecer o projeto <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
        <ol className="lista-vinculo">
          <li>
            <span>01</span>
            <div>
              <h3>Encontre uma conexão</h3>
              <p>Veja as fotos, a história e os cuidados de cada animal.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Diga que quer participar</h3>
              <p>Preencha um formulário simples, sem precisar criar conta.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Construa esse vínculo</h3>
              <p>A equipe conversa com você sobre apoio, visitas e próximos passos.</p>
            </div>
          </li>
        </ol>
      </section>

      {videos.length > 0 && (
        <section className="container secao-editorial" aria-labelledby="videos-titulo">
          <div className="cabeca-editorial">
            <div>
              <span className="sobretitulo">O dia a dia, de pertinho</span>
              <h2 id="videos-titulo">
                Pequenos momentos.
                <br />
                <em>Grandes personalidades.</em>
              </h2>
            </div>
            <p>
              Um passeio, uma brincadeira ou uma soneca. Dê o play e conheça o jeitinho de cada um.
            </p>
          </div>
          <TrilhoVideos videos={videos} mostrarAnimal={false} />
        </section>
      )}

      <section className="container secao-editorial" aria-labelledby="ajuda-titulo">
        <div className="cabeca-editorial">
          <div>
            <span className="sobretitulo">Há espaço para o seu carinho</span>
            <h2 id="ajuda-titulo">Outros jeitos de estar perto.</h2>
          </div>
        </div>
        <div className="caminhos-leves">
          <Link to="/animais" className="caminho-leve">
            <i className="fa-solid fa-house" aria-hidden="true" />
            <h3>Abra a porta de casa.</h3>
            <p>Conheça os animais e converse com a equipe para uma adoção presencial.</p>
            <span>
              Quero adotar <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </span>
          </Link>
          <Link to="/como-ajudar#doacoes" className="caminho-leve">
            <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
            <h3>Cuide, do seu jeito.</h3>
            <p>Ração, cobertores, medicamentos ou seu tempo. Cada gesto ajuda na rotina.</p>
            <span>
              Quero ajudar <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </span>
          </Link>
          <div className="caminho-leve" id="role-do-abrigo">
            <i className="fa-solid fa-person-walking" aria-hidden="true" />
            <h3>Venha dar um rolê.</h3>
            <p>
              O Rolê do Abrigo acontece no último sábado do mês. Confirme a programação com a
              equipe.
            </p>
            <a
              className="link-editorial"
              href={linkWhatsApp('Olá! Gostaria de saber sobre o próximo Rolê do Abrigo.')}
              target="_blank"
              rel="noreferrer"
            >
              Saber sobre o rolê{' '}
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="mural" className="container secao-editorial" aria-labelledby="mural-titulo">
        <div className="cabeca-editorial">
          <div>
            <span className="sobretitulo">Mural do abrigo</span>
            <h2 id="mural-titulo">A vida que a gente cuida.</h2>
          </div>
          <a href={CONTATO.instagram} target="_blank" rel="noreferrer" className="link-editorial">
            Acompanhe no Instagram <i className="fa-brands fa-instagram" aria-hidden="true" />
          </a>
        </div>
        {mural.erro ? (
          <div className="estado-conteudo" role="status">
            <p>Não conseguimos carregar o mural agora.</p>
            <button className="botao botao-contorno" onClick={mural.recarregar}>
              Tentar novamente
            </button>
          </div>
        ) : mural.carregando ? (
          <p role="status">Carregando o mural…</p>
        ) : fotos.length > 0 ? (
          <MuralFotos fotos={fotos} />
        ) : (
          <p>Novos registros da rotina do abrigo estarão aqui em breve.</p>
        )}
      </section>

      <section className="container convite-editorial" aria-labelledby="convite-titulo">
        <span className="sobretitulo">Um novo capítulo</span>
        <h2 id="convite-titulo">
          Tem uma história
          <br />
          esperando <em>por você.</em>
        </h2>
        <Link to="/animais?idoso=true" className="botao botao-principal botao-grande">
          Quero apadrinhar um idoso <i className="fa-solid fa-heart" aria-hidden="true" />
        </Link>
        <Link to="/quero-ajudar" className="link-editorial">
          Ainda tenho dúvidas
        </Link>
      </section>
    </div>
  );
}
