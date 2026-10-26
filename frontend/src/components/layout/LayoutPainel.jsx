import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.webp';
import { useSessao } from '../../context/Sessao';
import '../../pages/painel/painel.css';

const ABAS = [
  { para: '/painel', texto: 'Início', icone: 'fa-house', fim: true },
  { para: '/painel/animais', texto: 'Animais', icone: 'fa-paw' },
  { para: '/painel/mural', texto: 'Mural', icone: 'fa-photo-film' },
  { para: '/painel/solicitacoes', texto: 'Pedidos', icone: 'fa-inbox' },
  { para: '/painel/padrinhos', texto: 'Padrinhos', icone: 'fa-hand-holding-heart' },
];

/**
 * Painel da equipe pensado para o celular:
 * barra com cinco abas no rodapé, ao alcance do polegar.
 * No computador, as abas viram uma barra lateral.
 */
export default function LayoutPainel() {
  const { usuario, sair } = useSessao();
  const { pathname } = useLocation();
  const noFormulario = /\/animais\/(novo|[^/]+)$/.test(pathname) && pathname !== '/painel/animais';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`painel ${noFormulario ? 'painel-formulario' : ''}`}>
      <header className="painel-topo">
        <Link to="/painel" className="marca">
          <img src={logo} alt="" width="36" height="36" />
          <strong>Painel</strong>
        </Link>
        <div className="d-flex align-items-center gap-1">
          <Link to="/" className="botao botao-texto" target="_blank" title="Abrir o site público">
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            <span className="d-none d-sm-inline">Ver site</span>
          </Link>
          <button
            type="button"
            className="botao botao-texto"
            onClick={sair}
            title={`Sair (${usuario?.email})`}
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            <span className="d-none d-sm-inline">Sair</span>
          </button>
        </div>
      </header>

      <nav className="painel-abas" aria-label="Painel">
        <NavLink
          to="/painel/animais/novo"
          className="painel-cadastrar"
          aria-label="Cadastrar animal"
          title="Cadastrar animal"
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          <span>Cadastrar</span>
        </NavLink>
        {ABAS.map((a) => (
          <NavLink
            key={a.para}
            to={a.para}
            end={a.fim || a.destaque}
            className={`painel-aba ${a.destaque ? 'painel-aba-destaque' : ''}`}
          >
            <i className={`fa-solid ${a.icone}`} aria-hidden="true" />
            <span>{a.texto}</span>
          </NavLink>
        ))}
      </nav>

      <main className="painel-conteudo">
        <Outlet />
      </main>
    </div>
  );
}
