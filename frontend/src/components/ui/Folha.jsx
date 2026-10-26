import { useEffect, useEffectEvent, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * "Folha" que sobe do rodapé (bottom sheet): padrão de celular para menus e confirmações.
 * Fecha com o botão, tocando fora ou com Esc.
 *
 * É desenhada direto no <body> (portal): se ficasse dentro do cabeçalho, que usa
 * backdrop-filter, o "position: fixed" passaria a valer só dentro do cabeçalho
 * e a folha apareceria cortada no topo da tela.
 */
export default function Folha({ aberta, aoFechar, titulo, children }) {
  const idTitulo = useId();
  const dialogo = useRef(null);
  const fechar = useEffectEvent(aoFechar);

  useEffect(() => {
    if (!aberta) return;
    const anterior = document.activeElement;
    const raiz = document.getElementById('root');
    const inerteAntes = raiz?.inert;
    if (raiz) raiz.inert = true;
    const focaveis = () =>
      [
        ...dialogo.current.querySelectorAll(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ),
      ].filter((elemento) => elemento.getClientRects().length > 0);
    focaveis()[0]?.focus();
    const tecla = (e) => {
      if (e.key === 'Escape') fechar();
      if (e.key !== 'Tab') return;
      const elementos = focaveis();
      const primeiro = elementos[0];
      const ultimo = elementos.at(-1);
      if (!primeiro) {
        e.preventDefault();
        dialogo.current.focus();
      } else if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener('keydown', tecla);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
      if (raiz) raiz.inert = inerteAntes;
      if (anterior?.isConnected) anterior.focus();
    };
  }, [aberta]);

  if (!aberta) return null;
  return createPortal(
    <div className="folha-fundo" onClick={aoFechar}>
      <div
        className="folha"
        ref={dialogo}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <h2 id={idTitulo} className="h5 mb-0">
            {titulo}
          </h2>
          <button
            type="button"
            className="botao botao-texto botao-icone"
            onClick={aoFechar}
            aria-label="Fechar"
          >
            <i className="fa-solid fa-xmark fa-lg" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
