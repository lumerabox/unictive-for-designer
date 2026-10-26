// playground and live demos for the checkbox, radio group, switch and rating pages
import { itemState } from '../data/rating';
import { setupCopy, type Copyable } from './controls-copy';
import { bare, labeled, group, ratingRow, copyPage, type ChoiceKind } from '../lib/figma/choice-copy';

export default function init(signal: AbortSignal) {
  const lower = (s: string) => s.toLowerCase();

  // rating: hover previews, click sets, arrows step, the same value again clears
  function setRating(r: HTMLElement, value: number, commit = true) {
    r.querySelectorAll<HTMLElement>('.u-rating-item').forEach((it, i) => (it.dataset.state = lower(itemState(i, value))));
    if (!commit) return;
    const max = Number(r.getAttribute('aria-valuemax') ?? 5);
    r.dataset.value = String(value);
    r.setAttribute('aria-valuenow', String(value));
    r.setAttribute('aria-valuetext', `${value} out of ${max}`);
  }

  function ratingAt(r: HTMLElement, e: PointerEvent | MouseEvent) {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.u-rating-item');
    if (!item) return null;
    const i = [...r.querySelectorAll('.u-rating-item')].indexOf(item);
    const box = item.getBoundingClientRect();
    const left = e.clientX - box.left < box.width / 2;
    return r.hasAttribute('data-half') && left ? i + 0.5 : i + 1;
  }

  function initRating(r: HTMLElement) {
    const off = () => r.dataset.disable === 'true';
    const emit = () => r.dispatchEvent(new CustomEvent('rating-change', { bubbles: true, detail: Number(r.dataset.value) }));
    r.addEventListener('pointermove', (e) => {
      if (off()) return;
      const v = ratingAt(r, e);
      if (v !== null) setRating(r, v, false);
    });
    r.addEventListener('pointerleave', () => setRating(r, Number(r.dataset.value), false));
    r.addEventListener('click', (e) => {
      if (off()) return;
      const v = ratingAt(r, e);
      if (v === null) return;
      setRating(r, v === Number(r.dataset.value) ? 0 : v);
      emit();
    });
    r.addEventListener('keydown', (e) => {
      if (off()) return;
      const step = r.hasAttribute('data-half') ? 0.5 : 1;
      const max = Number(r.getAttribute('aria-valuemax') ?? 5);
      const now = Number(r.dataset.value);
      const next = { ArrowRight: now + step, ArrowUp: now + step, ArrowLeft: now - step, ArrowDown: now - step, Home: 0, End: max }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      setRating(r, Math.min(max, Math.max(0, next)));
      emit();
    });
  }
  document.querySelectorAll<HTMLElement>('.u-rating[data-live]').forEach(initRating);

  // live checkbox, radio and switch: keep data-* in sync with the native input
  function syncControl(c: HTMLElement) {
    const input = c.querySelector<HTMLInputElement>('[data-part="input"]');
    if (!input) return;
    if (c.dataset.control === 'checkbox') c.dataset.state = input.indeterminate ? 'indeterminate' : input.checked ? 'select' : 'default';
    else c.dataset.select = String(input.checked);
  }
  document.querySelectorAll<HTMLElement>('[data-control]').forEach((c) => {
    const input = c.querySelector<HTMLInputElement>('[data-part="input"]');
    if (input && c.dataset.state === 'indeterminate') input.indeterminate = true;
  });
  document.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.dataset?.part !== 'input') return;
    if (input.type === 'radio') document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${input.name}"]`).forEach((r) => syncControl(r.closest('[data-control]')!));
    else syncControl(input.closest('[data-control]')!);
  }, { signal });

  // select all: the parent goes indeterminate when only some children are checked
  document.querySelectorAll<HTMLElement>('[data-select-all]').forEach((group) => {
    const parent = group.querySelector<HTMLInputElement>('[data-parent] [data-part="input"]')!;
    const kids = [...group.querySelectorAll<HTMLInputElement>('[data-child] [data-part="input"]')];
    const update = () => {
      const n = kids.filter((k) => k.checked).length;
      parent.checked = n === kids.length;
      parent.indeterminate = n > 0 && n < kids.length;
      syncControl(parent.closest('[data-control]')!);
    };
    parent.addEventListener('change', () => {
      kids.forEach((k) => {
        k.checked = parent.checked;
        syncControl(k.closest('[data-control]')!);
      });
    });
    kids.forEach((k) => k.addEventListener('change', update));
    update();
  });

  // playground
  const form = document.querySelector<HTMLFormElement>('[data-playground]');
  if (form) {
    const kind = form.dataset.kind!;
    const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;
    const chip = form.querySelector<HTMLElement>('[data-chip]')!;
    const measure = form.querySelector<HTMLElement>('[data-measure]');
    const el = <T extends Element = HTMLSelectElement>(k: string) => form.elements.namedItem(k) as unknown as T | null;
    const get = (k: string) => el(k)?.value ?? '';
    const on = (k: string) => el<HTMLInputElement>(k)?.checked ?? false;
    const set = (k: string, v: string) => {
      const s = el(k);
      if (s) s.value = v;
    };

    const sets: Record<string, string> = { checkbox: 'Checkbox', radio: 'Radio-group', switch: 'Switch' };
    const axis = kind === 'checkbox' ? 'state' : kind === 'radio' ? 'selected' : 'select';

    function applyChoice() {
      const labeled = get('component').endsWith('-label');
      const disabled = on('disabled');
      const size = labeled ? 'Medium' : get('size');
      el('size')!.disabled = labeled;
      el('position')!.disabled = !labeled;
      form!.querySelector<HTMLElement>('[data-bare]')!.hidden = labeled;
      form!.querySelector<HTMLElement>('[data-labeled]')!.hidden = !labeled;

      form!.querySelectorAll<HTMLElement>('[data-canvas] .u-choice').forEach((l) => {
        l.dataset.position = lower(get('position'));
        l.dataset.disable = String(disabled);
        const part = (n: string) => l.querySelector<HTMLElement>(`[data-part="${n}"]`)!;
        part('desc').hidden = !on('description');
        part('badge').hidden = !on('badge');
        part('button').hidden = !on('button');
      });
      form!.querySelectorAll<HTMLElement>('[data-canvas] [data-control]').forEach((c) => {
        const input = c.querySelector<HTMLInputElement>('[data-part="input"]')!;
        c.dataset.size = lower(size);
        c.dataset.disable = String(disabled);
        input.disabled = disabled;
        if (kind === 'checkbox') {
          input.checked = get('state') === 'Select';
          input.indeterminate = get('state') === 'Indeterminate';
        } else if (kind === 'radio') input.checked = get('selected') === input.value;
        else input.checked = get('select') === 'true';
        syncControl(c);
      });

      const head = labeled ? `${sets[kind]}-label · Position=${get('position')}` : `${sets[kind]} · Size=${size}`;
      const value = kind === 'checkbox' ? `State=${get('state')}` : kind === 'radio' ? `Selected=${get('selected') === 'none' ? 'None' : `Option ${get('selected')}`}` : `Select=${get('select')}`;
      chip.textContent = `${head} · ${value} · Disable=${disabled}`;
    }

    function applyRating() {
      const r = form!.querySelector<HTMLElement>('[data-canvas] .u-rating')!;
      const half = on('half');
      let value = Number(get('value'));
      // whole steps only when precision is off
      for (const o of el('value')!.options) o.disabled = !half && !Number.isInteger(Number(o.value));
      if (!half && !Number.isInteger(value)) {
        value = Math.ceil(value);
        set('value', String(value));
      }
      r.dataset.type = lower(get('type'));
      r.dataset.size = lower(get('size'));
      r.dataset.disable = String(on('disabled'));
      r.toggleAttribute('data-half', half);
      r.tabIndex = on('disabled') ? -1 : 0;
      r.setAttribute('aria-disabled', String(on('disabled')));
      setRating(r, value);
      chip.textContent = `Rating-items · Type=${get('type')} · Size=${get('size')} · Disable=${on('disabled')} · Value=${value}`;
    }

    function render() {
      if (kind === 'rating') applyRating();
      else applyChoice();
      if (measure) {
        const target = canvas.querySelector<HTMLElement>('[data-measure-target]:not([hidden])') ?? canvas.querySelector<HTMLElement>('.u-rating');
        const h = Math.round(target?.getBoundingClientRect().height ?? 20);
        measure.textContent = String(h);
        canvas.style.setProperty('--mh', `${h}px`);
      }
    }

    // the preview drives the form back, so the chip always names the variant on screen
    canvas.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.dataset.part !== 'input') return;
      if (kind === 'checkbox') set('state', input.checked ? 'Select' : 'Default');
      else if (kind === 'radio') set('selected', input.value);
      else set('select', String(input.checked));
      render();
    });
    canvas.addEventListener('rating-change', (e) => {
      set('value', String((e as CustomEvent<number>).detail));
      render();
    });
    canvas.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.u-choice-link')) e.preventDefault();
    });
    form.addEventListener('change', (e) => {
      if (!(e.target as HTMLElement).closest('[data-canvas]')) render();
    });

    // copy what the preview shows: variant axes from the form, texts read back from the canvas
    const stateName: Record<string, string> = { Default: 'Unchecked', Select: 'Checked', Indeterminate: 'Indeterminate' };
    function current(): Copyable {
      const disabled = on('disabled');
      const off = disabled ? ' · Disabled' : '';
      if (kind === 'rating') {
        const value = Number(get('value'));
        return { label: `${get('type')} rating · ${get('size')} · ${value}${off}`, spec: ratingRow(get('type'), get('size'), value, disabled) };
      }
      const k = kind as ChoiceKind;
      const labeledOn = get('component').endsWith('-label');
      const name = { checkbox: 'Checkbox', radio: 'Radio', switch: 'Switch' }[k];
      if (k === 'radio') {
        const sel = get('selected');
        const parts = labeledOn
          ? [...canvas.querySelectorAll<HTMLElement>('[data-labeled] .u-choice')].map((l, i) => labeled(k, get('position'), String(sel === String(i + 1)), disabled, texts(l)))
          : [1, 2, 3].map((n) => bare(k, get('size'), String(sel === String(n)), disabled));
        const head = labeledOn ? `Radio group · ${get('position')}` : `Radio group · ${get('size')}`;
        return { label: `${head} · ${sel === 'none' ? 'None selected' : `Option ${sel} selected`}${off}`, spec: group('Radio group', 'VERTICAL', 16, parts) };
      }
      const value = k === 'checkbox' ? get('state') : get('select');
      const valueName = k === 'checkbox' ? stateName[value] : value === 'true' ? 'On' : 'Off';
      if (!labeledOn) return { label: `${name} · ${get('size')} · ${valueName}${off}`, spec: { parts: [bare(k, get('size'), value, disabled)] } };
      const l = canvas.querySelector<HTMLElement>('[data-labeled] .u-choice')!;
      return { label: `${name} with label · ${get('position')} · ${valueName}${off}`, spec: { parts: [labeled(k, get('position'), value, disabled, texts(l))] } };
    }
    const texts = (l: HTMLElement) => {
      const part = (n: string) => l.querySelector<HTMLElement>(`[data-part="${n}"]`)!;
      const text = (n: string) => (part(n).hidden ? false : part(n).textContent!.trim());
      return { label: part('label-text').textContent!.trim(), desc: text('desc'), badge: text('badge'), button: text('button') };
    };
    setupCopy(copyPage[kind as ChoiceKind | 'rating'], { signal, current, canvas, chip, restoreChip: render });
    render();
  }
}
