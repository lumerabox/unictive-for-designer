// playground for the file upload page: the form drives the area and the card, a dropped file runs a fake upload
import { cardInfo, maxSizeMB, slug, type CardState } from '../data/file-upload';
import { stateIcon, close as closeIcon, refresh } from '../components/file-upload/icons';
import { setupCopy } from './controls-copy';
import type { Part } from '../lib/figma/controls';

const form = document.querySelector<HTMLFormElement>('[data-playground]')!;
const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;
const chip = form.querySelector<HTMLElement>('[data-chip]')!;
const area = form.querySelector<HTMLElement>('[data-area]')!;
const card = form.querySelector<HTMLElement>('[data-card]')!;
const zone = area.querySelector<HTMLElement>('[data-part="zone"]')!;
const input = area.querySelector<HTMLInputElement>('[data-part="input"]')!;

const field = <T extends Element>(k: string) => form.elements.namedItem(k) as unknown as T;
const get = (k: string) => field<HTMLSelectElement>(k).value;
const on = (k: string) => field<HTMLInputElement>(k).checked;
const part = (root: Element, n: string) => root.querySelector<HTMLElement>(`[data-part="${n}"]`)!;
const partsAll = (root: Element, n: string) => root.querySelectorAll<HTMLElement>(`[data-part="${n}"]`);

// the real file in play, if any
let file: { size: number } | null = null;
let pct = 0;
let timer = 0;

const fmt = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace(/\.0$/, '')}MB` : `${Math.max(1, Math.round(b / 1024))}KB`);

function info(state: CardState): [string, string?] {
  if (file && state === 'Loading') return ['Uploading', `${pct}%`];
  if (file && state === 'Finish') return ['Uploaded', fmt(file.size)];
  if (file && state === 'Failed' && file.size > maxSizeMB * 1024 * 1024) return [`Over ${maxSizeMB}MB. Pick a smaller file`];
  return cardInfo[state];
}

function render() {
  const size = get('areaSize');
  const disabled = get('disable') === 'true';
  area.dataset.size = size.toLowerCase();
  area.toggleAttribute('data-disabled', disabled);
  input.disabled = disabled;
  partsAll(area, 'large').forEach((el) => (el.hidden = size !== 'Large'));
  partsAll(area, 'small').forEach((el) => (el.hidden = size !== 'Small'));
  part(area, 'label').hidden = !on('label');
  part(area, 'req').hidden = !on('required');
  part(area, 'opt').hidden = !on('optional');
  part(area, 'caption').hidden = !on('caption');

  const cardSize = get('cardSize');
  const state = get('cardState') as CardState;
  const ic = cardSize === 'Large' ? 20 : 16;
  const act = cardSize === 'Large' ? 16 : 12;
  card.dataset.size = cardSize.toLowerCase();
  card.dataset.state = slug(state);
  const icon = part(card, 'icon');
  icon.setAttribute('viewBox', `0 0 ${ic} ${ic}`);
  const path = icon.querySelector('path')!;
  path.setAttribute('d', stateIcon[state][ic]);
  path.toggleAttribute('data-solid', state === 'Finish');
  for (const [n, d] of [['retry', refresh[act]], ['close', closeIcon[act]]] as const) {
    const svg = part(card, n).querySelector('svg')!;
    svg.setAttribute('viewBox', `0 0 ${act} ${act}`);
    svg.querySelector('path')!.setAttribute('d', d);
  }
  part(card, 'retry').hidden = state !== 'Failed';
  part(card, 'close').hidden = !on('close');
  part(card, 'name').textContent = get('name').trim() || 'File name';
  const [a, b] = info(state);
  part(card, 'info').textContent = a;
  part(card, 'extra').textContent = b ?? '';
  part(card, 'extra').hidden = part(card, 'dot').hidden = !b;

  if (!chip.classList.contains('copied')) chip.textContent = `Area: Size=${size} · Disable=${get("disable")} — Card: Size=${cardSize} · State=${state}`;
}

function setState(s: CardState) {
  field<HTMLSelectElement>('cardState').value = s;
  render();
}

function stop() {
  clearInterval(timer);
  timer = 0;
}

// fake progress, nothing is sent anywhere
function upload() {
  stop();
  card.hidden = false;
  if (file!.size > maxSizeMB * 1024 * 1024) return setState('Failed');
  pct = 0;
  setState('Loading');
  timer = window.setInterval(() => {
    pct = Math.min(100, pct + 4 + Math.round(Math.random() * 10));
    if (pct < 100) return render();
    stop();
    setState('Finish');
  }, 160);
}

function pick(files: FileList | null) {
  const f = files?.[0];
  if (!f || input.disabled) return;
  file = { size: f.size };
  field<HTMLInputElement>('name').value = f.name;
  upload();
}

input.addEventListener('change', () => {
  pick(input.files);
  input.value = '';
});
zone.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (!input.disabled) zone.setAttribute('data-over', '');
});
zone.addEventListener('dragleave', () => zone.removeAttribute('data-over'));
zone.addEventListener('drop', (e) => {
  e.preventDefault();
  zone.removeAttribute('data-over');
  pick(e.dataTransfer?.files ?? null);
});

part(card, 'retry').addEventListener('click', () => (file ? upload() : setState('Loading')));
part(card, 'close').addEventListener('click', () => {
  stop();
  card.hidden = true;
});

form.addEventListener('change', (e) => {
  const t = e.target as HTMLElement;
  if (t === input) return;
  // picking a state by hand ends the fake upload
  if ((t as HTMLSelectElement).name === 'cardState' || (t as HTMLSelectElement).name === 'cardSize') {
    if ((t as HTMLSelectElement).name === 'cardState') stop();
    card.hidden = false;
  }
  render();
});
form.addEventListener('input', (e) => {
  if (e.target !== input) render();
});
render();

// copy to figma: the area, plus the card in a column when it is shown (24 px, the stack gap)
function current() {
  const size = get('areaSize');
  const disabled = get('disable');
  const hide = [
    ...(on('label') ? [] : ['Label']),
    ...(on('required') ? [] : ['*']),
    ...(on('optional') ? [] : ['(Optional)']),
    ...(on('caption') ? [] : ['Caption']),
  ];
  const areaPart: Part = { variant: `File Upload Area / ${disabled} / ${size}`, hide };
  const areaLabel = `${size} area${disabled === 'true' ? ' · Disabled' : ''}`;
  if (card.hidden) return { label: areaLabel, spec: { parts: [areaPart] } };

  const cardSize = get('cardSize');
  const state = get('cardState') as CardState;
  const texts: Record<string, string> = { 'File name': get('name').trim() || 'File name' };
  // a real file swaps the sample numbers for its own
  const [a, b] = info(state);
  if (file && state === 'Loading' && b) texts['10%'] = b;
  if (file && state === 'Finish' && b) texts['32MB'] = b;
  if (file && state === 'Failed') texts['Upload failed. Try again'] = a;
  const cardPart: Part = { variant: `File Card / ${cardSize} / ${state}`, texts, hide: on('close') ? [] : ['x-close-line'] };
  return {
    label: `${areaLabel} + ${cardSize} card · ${state}`,
    spec: { parts: [areaPart, cardPart], wrap: { name: 'File Upload', dir: 'VERTICAL' as const, gap: 24, align: 'CENTER' as const } },
  };
}

setupCopy('file-upload', { current, canvas, chip, restoreChip: render });
