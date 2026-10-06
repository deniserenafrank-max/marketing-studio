// Serves the built dist/ for proof and audit scripts. Returns { url, close }.
import { preview } from 'vite';

export async function serveDist(port = 4173) {
  const server = await preview({ build: { outDir: process.env.OUT_DIR || 'dist' }, preview: { port, strictPort: true, host: '127.0.0.1', open: false }, logLevel: 'silent' });
  const url = `http://127.0.0.1:${port}/`;
  return { url, close: () => new Promise((r) => server.httpServer.close(() => r())) };
}
