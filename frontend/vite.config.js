/* global process */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Caminho onde o site fica publicado:
  //   "/"                 → servido pelo Spring (integração final) ou `npm run dev`
  //   "/<nome-do-repo>/"  → prévia no GitHub Pages (a variável VITE_BASE é definida no workflow)
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    // Só importa quando VITE_USAR_API=true (integração).
    // O navegador conversa apenas com o Vite (porta 5173) e o Vite repassa estas rotas ao Spring (8080).
    // Para o navegador é tudo o MESMO endereço → cookie de login e CSRF funcionam sem configurar CORS.
    proxy: {
      '/api': 'http://localhost:8080',
      '/arquivos': 'http://localhost:8080',
    },
  },
})
