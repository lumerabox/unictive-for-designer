// playground for the text input and text area pages: one live preview per type, the form drives its variant
import { showsValue, slug, statesFor, metrics as inputMetrics, type State, type Type } from '../data/text-input';
import { metrics as areaMetrics, maxLength } from '../data/text-area';
import { writeClipboard, writeClipboardLater } from './figma-copy';
import { showToast, pasteKey } from './toast';

const form = document.querySelector<HTMLFormElement>('[data-playground]')!;
const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;
const chip = form.querySelector<HTMLElement>('[data-chip]')!;
const measure = form.querySelector<HTMLElement>('[data-measure]')!;
const previews = [...form.querySelectorAll<HTMLElement>('[data-preview]')];
const isArea = previews[0]?.dataset.kind === 'area';
const selects = ['style', 'type', 'size', 'state'].filter((k) => form.elements.namedItem(k));
const toggles = ['label', 'required', 'optional', 'caption', 'leadIcon', 'trailIcon', 'counter'].filter((k) => form.elements.namedItem(k));
const stateSel = form.elements.namedItem('state') as HTMLSelectElement;

const get = (k: string) => (form.elements.namedItem(k) as HTMLSelectElement | null)?.value ?? '';
const on = (k: string) => (form.elements.namedItem(k) as HTMLInputElement | null)?.checked ?? false;
const text = () => get('text').trim() || 'Placeholder text';

// password ships Filled and Error only, the other states are disabled while it is picked
function syncStates() {
  if (isArea) return;
  const allowed = statesFor(get('type') as Type);
  for (const o of stateSel.options) o.disabled = !allowed.includes(o.value as State);
  if (!allowed.includes(stateSel.value as State)) stateSel.value = allowed[0];
}

let applied = '';
function render() {
  syncStates();
  const state = get('state') as State;
  const size = get('size');
  const type = get('type');
  const key = `${state}|${text()}`;
  for (const p of previews) {
    p.hidden = !isArea && p.dataset.type !== slug(type);
    p.dataset.style = get('style').toLowerCase();
    p.dataset.size = size.toLowerCase();
    p.dataset.state = state.toLowerCase();
    const part = (n: string) => p.querySelector<HTMLElement>(`[data-part="${n}"]`);
    part('label')?.toggleAttribute('hidden', !on('label'));
    part('req')?.toggleAttribute('hidden', !on('required'));
    part('opt')?.toggleAttribute('hidden', !on('optional'));
    part('caption')?.toggleAttribute('hidden', !on('caption'));
    part('counter')?.toggleAttribute('hidden', !on('counter'));
    part('foot')?.toggleAttribute('hidden', isArea && !on('caption') && !on('counter'));
    part('lead-icon')?.toggleAttribute('hidden', !on('leadIcon'));
    part('trail-icon')?.toggleAttribute('hidden', !on('trailIcon'));
    const input = part('input') as HTMLInputElement | HTMLTextAreaElement | null;
    if (!input) continue;
    input.disabled = state === 'Disable';
    const tag = p.dataset.type === 'tag-input';
    if (!tag) input.placeholder = text();
    // only reset what was typed when the state or the text control changes
    if (key !== applied) {
      const pwd = input.type === 'password';
      input.value = !showsValue(state) || (tag && state !== 'Typing') ? '' : pwd ? 'password' : text();
    }
    count(p);
  }
  applied = key;

  const h = isArea ? areaMetrics[size as keyof typeof areaMetrics].height : inputMetrics[size as keyof typeof inputMetrics].height;
  measure.textContent = String(h);
  canvas.style.setProperty('--mh', `${h}px`);
  const live = previews.find((p) => !p.hidden)!;
  const box = live.querySelector<HTMLElement>('.u-field-box')!;
  canvas.style.setProperty('--mt', `${box.getBoundingClientRect().top - live.getBoundingClientRect().top}px`);

  if (!chip.classList.contains('copied')) chip.textContent = selects.map((k) => `${k[0].toUpperCase() + k.slice(1)}=${get(k)}`).join(' · ');
  const url = new URL(location.href);
  url.searchParams.set('v', selects.map((k) => slug(get(k))).join('.'));
  history.replaceState(null, '', url);
}

function count(p: HTMLElement) {
  const c = p.querySelector<HTMLElement>('[data-part="counter"]');
  const input = p.querySelector<HTMLTextAreaElement>('[data-part="input"]');
  if (c && input) c.textContent = `${[...input.value].length}/${maxLength} Characters`;
}

// restore from ?v=outline.medium.focus.leading-text
const fromUrl = new URL(location.href).searchParams.get('v')?.split('.') ?? [];
selects.forEach((k, i) => {
  const sel = form.elements.namedItem(k) as HTMLSelectElement;
  const match = [...sel.options].find((o) => slug(o.value) === fromUrl[i]);
  if (match) sel.value = match.value;
});

form.addEventListener('change', render);
form.addEventListener('input', (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('[data-preview]')) return count(t.closest<HTMLElement>('[data-preview]')!);
  render();
});
render();

// copy to figma
type Fields = typeof import('../lib/figma/fields');
type Spec = { style: string; size: string; state: string; type?: string; label?: boolean; required?: boolean; optional?: boolean; caption?: boolean; counter?: boolean; leadIcon?: boolean; trailIcon?: boolean; text?: string };
let fields: Fields | null = null;
let template: Awaited<ReturnType<Fields['loadTemplate']>> | null = null;
const load = () =>
  import('../lib/figma/fields').then(async (m) => {
    fields = m;
    template = await m.loadTemplate();
    return m;
  });
('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(() => load());

const component = isArea ? 'Text Area' : 'Text Input';
const nameOf = (s: Spec) => [component, s.style, s.size, s.state, ...(isArea ? [] : [s.type ?? 'Default'])].join(' / ');
const optsOf = (s: Spec) => ({
  name: nameOf(s),
  label: s.label ?? true, required: s.required ?? true, optional: s.optional ?? true, caption: s.caption ?? true,
  counter: s.counter ?? true, leadIcon: s.leadIcon ?? true, trailIcon: s.trailIcon ?? true, text: s.text ?? 'Placeholder text',
});
const readable = (s: Spec) => [s.size, s.style, ...(isArea ? [] : [s.type ?? 'Default']), ...(s.state === 'Placeholder' ? [] : [s.state === 'Disable' ? 'Disabled' : s.state])].join(' · ');

function playgroundSpec(): Spec {
  return {
    style: get('style'), size: get('size'), state: get('state'), type: get('type') || undefined,
    label: on('label'), required: on('required'), optional: on('optional'), caption: on('caption'),
    counter: on('counter'), leadIcon: on('leadIcon'), trailIcon: on('trailIcon'), text: text(),
  };
}

async function copyToFigma(s: Spec) {
  const o = optsOf(s);
  const ok = fields && template
    ? writeClipboard(fields.buildFieldHTML(template, o), o.name)
    : await writeClipboardLater(load().then((m) => m.buildFieldHTML(template!, o)), o.name);
  if (ok) {
    showToast(`<span>Copied ${readable(s)}</span><kbd>Paste in Figma with ${pasteKey()}</kbd>`);
    document.dispatchEvent(new CustomEvent('figma-copied'));
  } else showToast('Copy failed, try again');
  return ok;
}

let chipTimer = 0;
function flashChip() {
  chip.classList.add('copied');
  chip.textContent = `Copied, paste in Figma with ${pasteKey()}`;
  clearTimeout(chipTimer);
  chipTimer = window.setTimeout(() => {
    chip.classList.remove('copied');
    render();
  }, 2200);
}

document.querySelectorAll<HTMLElement>('[data-copy-current]').forEach((b) =>
  b.addEventListener('click', async () => {
    if ((await copyToFigma(playgroundSpec())) && b.closest('.pg-foot')) flashChip();
  }),
);

// ⌘C copies the playground variant unless text is selected or a field is focused
document.addEventListener('keydown', (e) => {
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'c') return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, dialog') || (getSelection()?.toString() ?? '') !== '') return;
  const r = canvas.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  e.preventDefault();
  copyToFigma(playgroundSpec()).then((ok) => ok && flashChip());
});

document.querySelectorAll<HTMLElement>('[data-copy]').forEach((tile) =>
  tile.addEventListener('click', () => {
    copyToFigma(JSON.parse(tile.dataset.copy!)).then((ok) => {
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
