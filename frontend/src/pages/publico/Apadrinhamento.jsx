import { Link } from 'react-router-dom';
import caoIdoso from '../../assets/img/cao-idoso.webp';
import { linkWhatsApp } from '../../utils/contato';

const DUVIDAS = [
  [
    'Preciso levar o animal para casa?',
    'Não. Seu afilhado continua acolhido no abrigo. O vínculo pode acontecer por meio de apoio aos cuidados, visitas e passeios combinados com a equipe.',
  ],
  [
    'Como funciona a contribuição?',
    'Converse com a equipe sobre as necessidades do animal e a forma de contribuir. Ao enviar o formulário, você registra seu interesse; nenhum pagamento é cobrado pelo site nesta etapa.',
  ],
  [
    'Posso visitar meu afilhado?',
    'Sim. Combine a visita com a equipe para respeitar a rotina, a saúde e o ritmo do animal.',
  ],
  [
    'O apadrinhamento é confirmado na hora?',
    'O formulário inicia a conversa. A equipe retorna pelos contatos informados e orienta os próximos passos. O retorno pode levar um tempo enquanto cuidamos dos animais.',
  ],
];

export default function Apadrinhamento() {
  return (
    <div className="pagina-apadrinhamento">
      <section className="container projeto-capa">
        <div>
          <span className="sobretitulo">Projeto de apadrinhamento</span>
          <h1>
            Um focinho branco.
            <br />
            <em>Um novo vínculo.</em>
          </h1>
          <p>
            Para um animal idoso, ter alguém por perto faz diferença. Seja essa presença na vida de
            quem ainda tem tanto para compartilhar.
          </p>
          <Link to="/animais?idoso=true" className="botao botao-principal botao-grande">
            Encontrar meu afilhado <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
          <a className="link-editorial" href="#como-apadrinhar">
            Entenda como participar <i className="fa-solid fa-arrow-down" aria-hidden="true" />
          </a>
        </div>
        <figure>
          <img
            src={caoIdoso}
            alt="Cão idoso descansando, representando o projeto de apadrinhamento"
            width="900"
            height="900"
          />
          <figcaption>Imagem ilustrativa · Cada idade merece cuidado.</figcaption>
        </figure>
      </section>
      <section className="container secao-editorial vinculo-inicio" id="como-apadrinhar">
        <div>
          <span className="sobretitulo">Simples, próximo e com carinho</span>
          <h2>
            O primeiro passo
            <br />
            <em>é conhecer.</em>
          </h2>
          <p>
            Apadrinhar é acompanhar uma vida. A equipe ajuda a encontrar uma forma de participar que
            respeite você e as necessidades do animal.
          </p>
        </div>
        <ol className="lista-vinculo">
          <li>
            <span>01</span>
            <div>
              <h3>Escolha seu afilhado</h3>
              <p>Conheça sua história, personalidade e cuidados de saúde.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Envie seu interesse</h3>
              <p>
                Na página do animal, toque em “Apadrinhar” e deixe um contato. Não é preciso criar
                conta.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Converse com a equipe</h3>
              <p>Combinem o apoio e as visitas. Cada vínculo começa com essa conversa.</p>
            </div>
          </li>
        </ol>
      </section>
      <section className="container secao-editorial">
        <div className="cabeca-editorial">
          <div>
            <span className="sobretitulo">O que esse vínculo pode trazer</span>
            <h2>
              Cuidado que faz parte
              <br />
              <em>do dia a dia.</em>
            </h2>
          </div>
        </div>
        <div className="caminhos-leves">
          <article className="caminho-leve">
            <i className="fa-solid fa-bowl-food" aria-hidden="true" />
            <h3>Apoio aos cuidados</h3>
            <p>
              Contribua com alimentação, conforto e outras necessidades, conforme a orientação da
              equipe.
            </p>
          </article>
          <article className="caminho-leve">
            <i className="fa-solid fa-paw" aria-hidden="true" />
            <h3>Tempo de qualidade</h3>
            <p>
              Visitas e passeios no ritmo do seu afilhado, respeitando sua saúde e personalidade.
            </p>
          </article>
          <article className="caminho-leve">
            <i className="fa-regular fa-heart" aria-hidden="true" />
            <h3>Uma história em comum</h3>
            <p>Conheça melhor seu afilhado e acompanhe sua vida em contato com o abrigo.</p>
          </article>
        </div>
      </section>
      <section className="container secao-editorial duvidas-projeto">
        <div>
          <span className="sobretitulo">Antes de começar</span>
          <h2>
            Vamos tirar
            <br />
            <em>suas dúvidas?</em>
          </h2>
          <a
            className="link-editorial"
            href={linkWhatsApp('Olá! Tenho uma dúvida sobre o apadrinhamento de um idoso.')}
            target="_blank"
            rel="noreferrer"
          >
            Conversar com a equipe <i className="fa-brands fa-whatsapp" aria-hidden="true" />
          </a>
        </div>
        <div>
          {DUVIDAS.map(([titulo, texto]) => (
            <details key={titulo}>
              <summary>
                {titulo}
                <i className="fa-solid fa-plus" aria-hidden="true" />
              </summary>
              <p>{texto}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="container convite-editorial">
        <h2>
          Seu próximo amigo
          <br />
          <em>pode estar aqui.</em>
        </h2>
        <Link to="/animais?idoso=true" className="botao botao-principal botao-grande">
          Conhecer os idosos <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
