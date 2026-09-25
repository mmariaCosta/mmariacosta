import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // Vite 8 usa Oxc por padrão — não coloca 'esbuild'
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 800,
  },
});