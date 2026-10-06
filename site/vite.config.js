import { defineConfig } from 'vite';
import { renderAll } from './src/content/render-static.js';

// Injects the readable no-JS version of every room (rendered from src/content/copy.js) into
// index.html wherever <!--@room:id--> appears. One copy source feeds both the static document
// and the interactive rooms.
function staticRooms() {
  return {
    name: 'static-rooms',
    transformIndexHtml(html) {
      const parts = renderAll();
      return html.replace(/<!--@room:([a-z-]+)-->/g, (m, id) => parts[id] ?? m);
    },
  };
}

// Relative base so the built site works from any folder (GitHub Pages subpath, a private
// artifact preview, or the root of hometownrealtorsoftexas.com).
export default defineConfig({
  base: './',
  plugins: [staticRooms()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
  server: { port: 5173, strictPort: true, host: '127.0.0.1' },
});
