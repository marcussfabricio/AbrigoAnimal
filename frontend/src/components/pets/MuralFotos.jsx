import { useState } from 'react';
import Folha from '../ui/Folha';

export default function MuralFotos({ fotos }) {
  const [aberta, setAberta] = useState(null);
  return (
    <>
      <div className="mural-flutuante">
        {fotos.map((foto) => (
          <button
            key={foto.id}
            type="button"
            onClick={() => setAberta(foto)}
            aria-label={`Ampliar: ${foto.titulo}`}
          >
            <img src={foto.arquivo} alt={foto.titulo} loading="lazy" />
          </button>
        ))}
      </div>
      <Folha
        aberta={Boolean(aberta)}
        aoFechar={() => setAberta(null)}
        titulo={aberta?.titulo || 'Foto do mural'}
      >
        {aberta && <img className="foto-mural-ampliada" src={aberta.arquivo} alt={aberta.titulo} />}
      </Folha>
    </>
  );
}
