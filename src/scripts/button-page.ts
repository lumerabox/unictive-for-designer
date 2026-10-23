import { defaultVariant, metrics, variantName, type Variant } from '../data/button';
import { showToast, pasteKey } from './toast';

type Clip = typeof import('../lib/figma/clipboard');
let clip: Clip | null = null;
const loadClip = () => import('../lib/figma/clipboard').then((m) => (clip = m));
('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(() => loadClip());

// copy event route keeps the write inside the click gesture, works in every browser
function writeClipboard(html: string, text: string) {
  let ok = false;
  const onCopy = (e: ClipboardEvent) => {
    e.clipboardData?.setData('text/html', html);
    e.clipboardData?.setData('text/plain', text);
    e.preventDefault();
    ok = true;
  };
  document.addEventListener('copy', onCopy);
  const sel = document.getSelection();
  const saved = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
  const holder = document.createElement('span');
  holder.textContent = text;
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;white-space:pre';
  document.body.append(holder);
  const range = document.createRange();
  range.selectNodeContents(holder);
  sel?.removeAllRanges();
  sel?.addRange(range);
  try { document.execCommand('copy'); } catch { ok = false; }
  sel?.removeAllRanges();
  if (saved) sel?.addRange(saved);
  holder.remove();
  document.removeEventListener('copy', onCopy);
  return ok;
}

const readable = (v: Variant) => `${v.size} · ${v.style} · ${v.type}${v.state === 'Default' ? '' : ' · ' + (v.state === 'Disable' ? 'Disabled' : v.state)}`;

async function copyToFigma(v: Variant): Promise<boolean> {
  if (!clip) {
    // first click before the encoder loaded: the async clipboard api still accepts a promise
    try {
      const item = new ClipboardItem({
        'text/html': loadClip().then((m) => new Blob([m.buildClipboardHTML(v)], { type: 'text/html' })),
        'text/plain': new Blob([variantName(v)], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([item]);
      copied(v);
      return true;
    } catch {
      showToast('Copy failed, try again');
      return false;
    }
  }
  const ok = writeClipboard(clip.buildClipboardHTML(v), variantName(v));
  ok ? copied(v) : showToast('Copy failed, try again');
  return ok;
}

function copied(v: Variant) {
  showToast(`<span>Copied ${readable(v)}</span><kbd>Paste in Figma with ${pasteKey()}</kbd>`);
  document.dispatchEvent(new CustomEvent('figma-copied'));
}

// playground
const form = document.querySelector<HTMLFormElement>('[data-playground]')!;
const preview = form.querySelector<HTMLElement>('[data-preview]')!;
const measure = form.querySelector<HTMLElement>('[data-measure]')!;
const chip = form.querySelector<HTMLElement>('[data-chip]')!;
const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;

function current(): Variant {
  const f = new FormData(form);
  return {
    size: f.get('size') as Variant['size'],
    style: f.get('style') as Variant['style'],
    type: f.get('type') as Variant['type'],
    state: f.get('state') as Variant['state'],
    rounded: f.has('rounded'),
    leftIcon: f.has('leftIcon'),
    rightIcon: f.has('rightIcon'),
    label: (f.get('label') as string).trim() || 'Button',
  };
}

function applyTo(el: HTMLElement, v: Variant) {
  el.dataset.size = v.size.toLowerCase();
  el.dataset.style = v.style.toLowerCase();
  el.dataset.type = v.type.toLowerCase();
  el.dataset.state = v.state.toLowerCase();
  el.dataset.rounded = String(v.rounded);
  el.querySelector<SVGElement>('[data-icon="left"]')!.toggleAttribute('hidden', !v.leftIcon);
  el.querySelector<SVGElement>('[data-icon="right"]')!.toggleAttribute('hidden', !v.rightIcon);
  el.querySelector('.u-btn-text')!.textContent = v.label;
}

let chipTimer = 0;
function render() {
  const v = current();
  applyTo(preview, v);
  // keep the preview interactive so hover shows the real hover state, disabled stays inert
  preview.toggleAttribute('disabled', v.state === 'Disable');
  const h = metrics[v.size].height;
  measure.textContent = String(h);
  canvas.style.setProperty('--mh', `${h}px`);
  clearTimeout(chipTimer);
  chip.classList.remove('copied');
  chip.textContent = `Size=${v.size} · Style=${v.style} · Type=${v.type} · State=${v.state}${v.rounded ? ' · Rounded' : ''}`;
  const url = new URL(location.href);
  url.searchParams.set('v', [v.size, v.style, v.type, v.state].join('-').toLowerCase() + (v.rounded ? '-r' : ''));
  history.replaceState(null, '', url);
}

function setForm(p: Partial<Variant>) {
  for (const [k, val] of Object.entries(p)) {
    const el = form.elements.namedItem(k) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) continue;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') el.checked = !!val;
    else el.value = String(val);
  }
  render();
}

// restore from ?v=large-primary-main-default
const fromUrl = new URL(location.href).searchParams.get('v');
if (fromUrl) {
  const [size, style, type, state, r] = fromUrl.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  const ok = (sel: string, val?: string) => !!val && [...(form.elements.namedItem(sel) as HTMLSelectElement).options].some((o) => o.value === val);
  setForm({
    ...(ok('size', size) && { size: size as Variant['size'] }),
    ...(ok('style', style) && { style: style as Variant['style'] }),
    ...(ok('type', type) && { type: type as Variant['type'] }),
    ...(ok('state', state) && { state: state as Variant['state'] }),
    rounded: r === 'R',
  });
} else render();

form.addEventListener('input', render);
form.addEventListener('change', render);

document.querySelectorAll<HTMLElement>('[data-copy-current]').forEach((b) =>
  b.addEventListener('click', async () => {
    if ((await copyToFigma(current())) && b.closest('.pg-foot')) flashChip();
  }),
);
preview.addEventListener('click', async () => {
  if (await copyToFigma(current())) flashChip();
});

function flashChip() {
  chip.classList.add('copied');
  chip.textContent = `Copied, paste in Figma with ${pasteKey()}`;
  clearTimeout(chipTimer);
  chipTimer = window.setTimeout(render, 2200);
}

// ⌘C anywhere on the page copies the playground variant unless text is selected or a field is focused
document.addEventListener('keydown', (e) => {
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'c') return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, dialog') || (getSelection()?.toString() ?? '') !== '') return;
  const inView = canvas.getBoundingClientRect();
  if (inView.bottom < 0 || inView.top > innerHeight) return;
  e.preventDefault();
  copyToFigma(current()).then((ok) => ok && flashChip());
});

// tiles copy their own variant
document.querySelectorAll<HTMLElement>('[data-copy]').forEach((tile) =>
  tile.addEventListener('click', () => {
    const p = JSON.parse(tile.dataset.copy!);
    const v: Variant = { ...defaultVariant, size: 'Medium', ...p };
    copyToFigma(v).then((ok) => {
      const hint = tile.querySelector<HTMLElement>('.copy-hint');
      if (!ok || !hint) return;
      tile.classList.add('done');
      hint.textContent = 'Copied';
      setTimeout(() => {
        tile.classList.remove('done');
        hint.textContent = 'Copy';
      }, 1600);
    });
  }),
);
