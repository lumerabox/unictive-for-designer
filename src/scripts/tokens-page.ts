// token pages: copy values, mode and format pickers, the token table filter, export copy and download
import { copy, pickers } from './foundations-page';

function library(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-token-lib]');
  if (!root) return;
  const form = root.querySelector('form')!;
  const count = root.querySelector<HTMLElement>('[data-token-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-token-empty]')!;
  const rows = [...root.querySelectorAll<HTMLElement>('.tr[data-c]')];
  const heads = [...root.querySelectorAll<HTMLElement>('.icon-cat')];
  const swaps = [...root.querySelectorAll<HTMLElement>('[data-slate]')];
  let mode = 'gray';

  // a collection can be opened from a link, /foundations/all-tokens/?c=neutral
  const c0 = new URLSearchParams(location.search).get('c');
  if (c0 && form.c.querySelector(`option[value="${c0}"]`)) form.c.value = c0;

  const filter = () => {
    const f = new FormData(form);
    const q = String(f.get('q') ?? '').trim().toLowerCase();
    const c = String(f.get('c'));
    const m = String(f.get('mode'));
    if (m !== mode) {
      mode = m;
      for (const el of swaps) {
        const v = el.dataset[m]!;
        if (el.classList.contains('tok-val')) {
          el.dataset.copy = v;
          el.querySelector('span')!.textContent = v;
          el.querySelector<HTMLElement>('.swatch')?.style.setProperty('--c', v);
        } else el.textContent = v;
      }
    }
    const shown = new Map<string, number>();
    for (const r of rows) {
      const on = (c === 'all' || r.dataset.c === c) && (!q || r.dataset.q!.includes(q));
      r.hidden = !on;
      if (on) shown.set(r.dataset.c!, (shown.get(r.dataset.c!) ?? 0) + 1);
    }
    heads.forEach((h) => (h.hidden = !shown.has(h.dataset.c!)));
    const n = [...shown.values()].reduce((a, b) => a + b, 0);
    count.textContent = `${n.toLocaleString('en')} ${n === 1 ? 'token' : 'tokens'}`;
    empty.hidden = n > 0;
    if (!n) empty.textContent = `No token matches “${q}”. Try a shorter word, like sub or brand.`;
  };

  let t = 0;
  form.addEventListener('input', () => {
    clearTimeout(t);
    t = window.setTimeout(filter, 80);
  }, { signal });
  filter();
}

function exports(signal: AbortSignal) {
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    const c = el.closest<HTMLElement>('[data-copy-code]');
    if (c) {
      const code = document.querySelector<HTMLElement>(`[data-code="${c.dataset.copyCode}"]`)!;
      copy(code.textContent!, c.closest('.export')!.querySelector('.subhead')!.textContent!);
    }
    const d = el.closest<HTMLElement>('[data-download]');
    if (d) {
      const a = Object.assign(document.createElement('a'), { href: d.dataset.download!, download: d.dataset.file! });
      a.click();
    }
  }, { signal });
}

export default function init(signal: AbortSignal) {
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
    if (b) copy(b.dataset.copy!, b.dataset.copyLabel ?? b.dataset.copy);
  }, { signal });
  pickers(signal);
  library(signal);
  exports(signal);
}
