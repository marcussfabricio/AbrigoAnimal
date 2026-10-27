/** Retoma etapas confirmadas após falhas de rede, sem criar outro animal. */
export async function concluirCadastro({ api, dados, fotos, visivel, progresso }) {
  if (!progresso.animal) {
    progresso.animal = await api.criar(dados);
  } else {
    progresso.animal = await api.editar(progresso.animal.id, {
      ...dados,
      versao: progresso.animal.versao,
    });
  }
  const ordem = [...fotos].sort((a, b) => Number(b.principal) - Number(a.principal));
  for (const foto of ordem) {
    if (progresso.fotosEnviadas.has(foto.chave)) continue;
    progresso.animal = await api.enviarFoto(progresso.animal.id, foto.blob);
    progresso.fotosEnviadas.add(foto.chave);
  }
  if (progresso.animal.visivelNaVitrine !== visivel) {
    progresso.animal = await api.definirVitrine(progresso.animal.id, visivel);
  }
  return progresso.animal;
}
