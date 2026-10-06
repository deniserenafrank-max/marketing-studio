import { renderAll } from './render-static.js';

// Injects the readable no-JS version of every room (rendered from copy.js) into index.html
// wherever <!--@room:id--> appears. One copy source feeds both the static document and the
// interactive rooms.
export function staticRooms() {
  return {
    name: 'static-rooms',
    transformIndexHtml(html) {
      const parts = renderAll();
      return html.replace(/<!--@room:([a-z-]+)-->/g, (m, id) => parts[id] ?? m);
    },
  };
}
