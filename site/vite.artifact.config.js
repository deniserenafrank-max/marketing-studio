// Single-file build for the private claude.ai artifact preview: one JS bundle (no code
// splitting) and one CSS file, which scripts/build-artifact.mjs then inlines into a page body
// without the document skeleton the artifact host adds itself.
import { defineConfig } from 'vite';
import { staticRooms } from './src/content/static-rooms-plugin.js';

export default defineConfig({
  base: './',
  plugins: [staticRooms()],
  build: {
    outDir: 'dist-artifact',
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 8192,
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
