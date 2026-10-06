// One polite live region for the whole journey. Announcements are queued so a key toast and an
// achievement never talk over each other; the region is cleared between messages so repeated
// text is read again.
let region;
let queue = [];
let busy = false;

function ensure() {
  if (region) return region;
  region = document.getElementById('announcer');
  if (!region) {
    region = document.createElement('div');
    region.id = 'announcer';
    region.className = 'sr-only';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }
  return region;
}

function drain() {
  if (busy || queue.length === 0) return;
  busy = true;
  const text = queue.shift();
  const el = ensure();
  el.textContent = '';
  window.setTimeout(() => {
    el.textContent = text;
    window.setTimeout(() => {
      busy = false;
      drain();
    }, Math.min(4000, 900 + text.length * 40));
  }, 50);
}

export function announce(text) {
  if (!text) return;
  queue.push(text);
  drain();
}
