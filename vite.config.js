import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' faz os caminhos dos assets serem relativos, o que é
// essencial para funcionar em GitHub Pages (o site não fica na raiz
// do domínio, fica em usuario.github.io/nome-do-repo/).
export default defineConfig({
  plugins: [react()],
  base: './'
});
