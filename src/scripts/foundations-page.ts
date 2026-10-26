// foundation pages: copy values, brand and weight pickers, type preview text, icon library
import { showToast } from './toast';

const copy = async (text: string, what = text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${what}`);
  } catch {
    showToast('Copy failed');
  }
};

// radios with data-pick="<group>" show the [data-pick-block="<group>:<value>"] that matches
function pickers(signal: AbortSignal) {
  document.querySelectorAll<HTMLInputElement>('input[data-pick]').forEach((r) =>
    r.addEventListener(
      'change',
      () => {
        const g = r.dataset.pick!;
        document.querySelectorAll<HTMLElement>(`[data-pick-block^="${g}:"]`).forEach((b) => (b.hidden = b.dataset.pickBlock !== `${g}:${r.value}`));
      },
      { signal },
    ),
  );
}

function typePreview(signal: AbortSignal) {
  const input = document.querySelector<HTMLInputElement>('[data-type-text]');
  if (!input) return;
  const samples = [...document.querySelectorAll<HTMLElement>('.type-sample')];
  input.addEventListener('input', () => samples.forEach((s) => (s.textContent = input.value.trim() || s.dataset.default!)), { signal });
}

type IconData = { categories: string[]; icons: [name: string, cat: number, line: string, solid: string][] };
let iconData: Promise<IconData> | undefined;

function icons(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-icons]');
  if (!root) return;
  const grid = root.querySelector<HTMLElement>('[data-icon-grid]')!;
  const count = root.querySelector<HTMLElement>('[data-icon-count]')!;
  const form = root.querySelector<HTMLFormElement>('form')!;
  iconData ??= fetch('/icons/icons.json').then((r) => r.json());

  const svg = (inner: string, solid: boolean, size: number) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"${solid ? '' : ' stroke-width="2"'} aria-hidden="true">${inner}</svg>`;

  let data: IconData | undefined;
  const draw = () => {
    if (!data) return;
    const f = new FormData(form);
    const q = String(f.get('q') ?? '').trim().toLowerCase();
    const solid = f.get('style') === 'solid';
    const size = Number(f.get('size'));
    const cat = String(f.get('cat'));
    const list = data.icons.filter(([n, c, , s]) => (cat === 'all' || String(c) === cat) && (!q || n.includes(q) || data.categories[c].toLowerCase().includes(q)) && (!solid || s));
    count.textContent = `${list.length.toLocaleString('en')} ${list.length === 1 ? 'icon' : 'icons'}`;
    if (!list.length) {
      grid.innerHTML = `<p class="icon-empty">No icon matches “${q.replace(/[<&]/g, '')}”. Try a shorter word, like arrow or file.</p>`;
      return;
    }
    let html = '';
    let last = -1;
    for (const [n, c, l, s] of list) {
      if (c !== last && !q) {
        const total = list.filter((i) => i[1] === c).length;
        html += `<p class="icon-cat"><span class="label">${data.categories[c]}</span><span class="label muted">${total}</span></p>`;
      }
      last = c;
      html += `<button type="button" class="icon-tile" data-icon="${n}" title="Copy ${n} as SVG">${svg(solid ? s : l, solid, size)}<span>${n}</span></button>`;
    }
    grid.innerHTML = html;
  };

  let t = 0;
  form.addEventListener('input', () => {
    clearTimeout(t);
    t = window.setTimeout(draw, 80);
  }, { signal });
  form.addEventListener('submit', (e) => e.preventDefault(), { signal });
  grid.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-icon]');
    if (!b || !data) return;
    const icon = data.icons.find(([n]) => n === b.dataset.icon)!;
    const solid = new FormData(form).get('style') === 'solid';
    const out = svg(solid ? icon[3] : icon[2], solid, 24)
      .replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"')
      .replace(/currentColor/g, '#171717');
    copy(out, `${icon[0]}${solid ? ' solid' : ''}. Paste it into Figma or code`);
  }, { signal });

  iconData.then((d) => {
    if (signal.aborted) return;
    data = d;
    draw();
  }).catch(() => (grid.innerHTML = '<p class="icon-empty">The icon library didn’t load. Reload the page to try again.</p>'));
}

export default function init(signal: AbortSignal) {
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
    if (b) copy(b.dataset.copy!, b.dataset.copyLabel ?? b.dataset.copy);
  }, { signal });
  pickers(signal);
  typePreview(signal);
  icons(signal);
}
