// asset pages: filter the grid, copy an asset so it pastes into Figma at its design size
import { showToast, pasteKey } from './toast';

const cache = new Map<string, Promise<string>>();

const toDataUrl = (blob: Blob) =>
  new Promise<string>((ok, fail) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = fail;
    r.readAsDataURL(blob);
  });

// svg files copy as they are; png files are wrapped in an svg so Figma pastes them at `size` px, not at the export scale
function markup(file: string, size: number) {
  let p = cache.get(file);
  if (!p) {
    p = fetch(file).then(async (r) => {
      if (!r.ok) throw new Error(String(r.status));
      if (file.endsWith('.svg')) return r.text();
      const url = await toDataUrl(await r.blob());
      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image width="${size}" height="${size}" xlink:href="${url}"/></svg>`;
    });
    cache.set(file, p);
    p.catch(() => cache.delete(file));
  }
  return p;
}

export default function init(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-assets]');
  if (!root) return;
  const form = root.querySelector('form')!;
  const count = root.querySelector<HTMLElement>('[data-asset-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-asset-empty]')!;
  const tiles = [...root.querySelectorAll<HTMLElement>('.asset-tile')];
  const heads = [...root.querySelectorAll<HTMLElement>('.icon-cat')];
  const unit = root.dataset.unit!;
  const size = Number(root.dataset.paste);

  const filter = () => {
    const f = new FormData(form);
    const q = String(f.get('q') ?? '').trim().toLowerCase();
    const cat = String(f.get('cat') ?? 'all');
    const shown = new Map<string, number>();
    for (const t of tiles) {
      const on = (cat === 'all' || t.dataset.cat === cat) && (!q || t.dataset.name!.includes(q));
      t.hidden = !on;
      if (on) shown.set(t.dataset.cat!, (shown.get(t.dataset.cat!) ?? 0) + 1);
    }
    // category labels show only while browsing, like the icon library
    heads.forEach((h) => (h.hidden = !!q || !shown.has(h.dataset.cat!)));
    const n = [...shown.values()].reduce((a, b) => a + b, 0);
    count.textContent = `${n.toLocaleString('en')} ${unit}`;
    empty.hidden = n > 0;
    if (!n) empty.textContent = `Nothing matches “${q}”. Try a shorter word.`;
  };

  let t = 0;
  form.addEventListener('input', () => {
    clearTimeout(t);
    t = window.setTimeout(filter, 80);
  }, { signal });

  root.addEventListener('click', async (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-asset]');
    if (!b) return;
    try {
      // safari keeps the user gesture only when the clipboard write starts synchronously
      // emoji go out as unicode text, so they paste as an editable text layer
      const text = b.dataset.text ? Promise.resolve(b.dataset.text) : markup(b.dataset.asset!, size);
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text.then((s) => new Blob([s], { type: 'text/plain' })) })]);
      showToast(`Copied ${b.dataset.label}. Press <kbd>${pasteKey()}</kbd> in Figma${b.dataset.text ? ' or code' : ''}`);
    } catch {
      showToast('Copy failed');
    }
  }, { signal });
}
