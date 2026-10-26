// playground for the dropdown page: one item preview and one live menu, the form drives both
import { heightOf, menuCopy, menuSamples, rowCopy, samples, slug, stateName, states, type Size, type State, type Type } from '../data/dropdown';
import { setupCopy } from './controls-copy';

export default function init(signal: AbortSignal) {
  const form = document.querySelector<HTMLFormElement>('[data-playground]')!;
  const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;
  const chip = form.querySelector<HTMLElement>('[data-chip]')!;
  const measure = form.querySelector<HTMLElement>('[data-measure]')!;
  const itemView = form.querySelector<HTMLElement>('[data-view="item"]')!;
  const menu = form.querySelector<HTMLElement>('[data-view="menu"]')!;
  const preview = itemView.querySelector<HTMLElement>('[data-preview]')!;
  const trigger = menu.querySelector<HTMLButtonElement>('[data-part="trigger"]')!;
  const field = menu.querySelector<HTMLElement>('.u-dd-trigger')!;
  const valueEl = menu.querySelector<HTMLElement>('[data-part="value"]')!;
  const rows = [...menu.querySelectorAll<HTMLButtonElement>('.u-dd-item')];
  const textInput = form.elements.namedItem('text') as HTMLInputElement;
  const selects = ['type', 'size', 'state'];

  const get = (k: string) => (form.elements.namedItem(k) as HTMLSelectElement).value;
  const on = (k: string) => (form.elements.namedItem(k) as HTMLInputElement).checked;
  const part = (el: HTMLElement, n: string) => el.querySelector<HTMLElement>(`[data-part="${n}"]`)!;

  function paint(el: HTMLElement, type: Type, size: Size, state: State, title: string, desc: string) {
    el.dataset.type = slug(type);
    el.dataset.size = slug(size);
    el.dataset.state = slug(state);
    el.toggleAttribute('aria-disabled', state === 'Disable');
    if (el.getAttribute('role') === 'option') el.setAttribute('aria-selected', String(state === 'Selected'));
    part(el, 'title').textContent = title;
    part(el, 'desc').textContent = desc;
    part(el, 'icon').toggleAttribute('hidden', !on('icon'));
    part(el, 'desc').toggleAttribute('hidden', !on('description'));
  }

  function setOpen(open: boolean) {
    menu.toggleAttribute('data-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    field.dataset.state = open ? 'focus' : 'filled';
  }

  function syncValue() {
    const picked = rows.filter((r) => r.dataset.state === 'selected');
    const many = get('type') === 'Checkbox';
    valueEl.toggleAttribute('data-ph', picked.length === 0);
    valueEl.textContent = picked.length === 0 ? 'Select an option' : many && picked.length > 1 ? `${picked.length} selected` : part(picked[0], 'title').textContent!;
  }

  const chipText = () => (chip.textContent = selects.map((k) => `${k[0].toUpperCase() + k.slice(1)}=${stateName(get(k))}`).join(' · '));

  let lastType = '';
  function render() {
    const type = get('type') as Type;
    const size = get('size') as Size;
    const state = get('state') as State;
    // a new type brings its own sample title
    if (type !== lastType && lastType) textInput.value = samples[type].title;
    lastType = type;
    const title = textInput.value.trim() || samples[type].title;

    paint(preview, type, size, state, title, samples[type].desc);
    const sample = menuSamples[type];
    part(field, 'label').textContent = sample.label;
    rows.forEach((r, i) => {
      const row = sample.rows[i];
      paint(r, type, size, i === 1 ? state : 'Default', i === 1 ? title : row.title, row.desc);
    });
    menu.dataset.size = slug(size);
    field.dataset.size = size === 'Large' ? 'large' : 'medium';
    syncValue();

    const inMenu = on('menu');
    menu.hidden = !inMenu;
    itemView.hidden = inMenu;
    const h = heightOf(type, size);
    measure.textContent = String(h);
    canvas.style.setProperty('--mh', `${h}px`);
    measure.style.lineHeight = `${h}px`;

    if (!chip.classList.contains('copied')) chipText();
    const url = new URL(location.href);
    url.searchParams.set('v', selects.map((k) => slug(get(k))).join('.'));
    history.replaceState(null, '', url);
  }

  // restore from ?v=profile.large.selected
  const fromUrl = new URL(location.href).searchParams.get('v')?.split('.') ?? [];
  selects.forEach((k, i) => {
    const sel = form.elements.namedItem(k) as HTMLSelectElement;
    const match = [...sel.options].find((o) => slug(o.value) === fromUrl[i]);
    if (match) sel.value = match.value;
  });
  textInput.value = samples[get('type') as Type].title;
  lastType = get('type');

  form.addEventListener('change', render);
  form.addEventListener('input', render);
  render();

  // the menu works like a real one: the field toggles it, a row picks, checkbox rows pick several
  trigger.addEventListener('click', () => setOpen(!menu.hasAttribute('data-open')));
  rows.forEach((r) =>
    r.addEventListener('click', () => {
      if (r.dataset.state === 'disable') return;
      if (get('type') === 'Checkbox') {
        r.dataset.state = r.dataset.state === 'selected' ? 'default' : 'selected';
      } else {
        for (const o of rows) if (o.dataset.state !== 'disable') o.dataset.state = o === r ? 'selected' : 'default';
        setOpen(false);
        trigger.focus();
      }
      for (const o of rows) o.setAttribute('aria-selected', String(o.dataset.state === 'selected'));
      syncValue();
    }),
  );
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.hasAttribute('data-open')) {
      setOpen(false);
      trigger.focus();
    }
  });

  // copy to figma: the open menu copies as a panel of its rows as picked, otherwise the single row
  const stateOf = (el: HTMLElement) => states.find((x) => slug(x) === el.dataset.state) ?? 'Default';
  const rowOf = (el: HTMLElement) => ({
    type: get('type') as Type, size: get('size') as Size, state: stateOf(el),
    title: part(el, 'title').textContent ?? '', desc: part(el, 'desc').textContent ?? '',
    icon: on('icon'), description: on('description'),
  });
  setupCopy('dropdown', {
    signal,
    current: () => (on('menu') ? menuCopy(rows.map(rowOf)) : rowCopy(rowOf(preview))),
    canvas,
    chip,
    restoreChip: chipText,
  });
}
