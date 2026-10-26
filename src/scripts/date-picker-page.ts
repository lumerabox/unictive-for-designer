// playground for the date picker page: the form picks the variant, the calendar picks real dates
import { rowsHTML, todayKey } from '../components/date-picker/render';
import { keyOf, months, today, formatDate, formatRange, pickerCopy, optsLabel, type Align } from '../data/date-picker';
import { setupCopy } from './controls-copy';

export default function init(signal: AbortSignal) {
  const form = document.querySelector<HTMLFormElement>('[data-dp-playground]')!;
  const canvas = form.querySelector<HTMLElement>('[data-canvas]')!;
  const chip = form.querySelector<HTMLElement>('[data-chip]')!;
  const pickers = [...form.querySelectorAll<HTMLElement>('[data-preview]')];

  const get = (k: string) => (form.elements.namedItem(k) as HTMLSelectElement).value;
  const set = (k: string, v: string) => ((form.elements.namedItem(k) as HTMLSelectElement).value = v);
  const on = (k: string) => (form.elements.namedItem(k) as HTMLInputElement).checked;

  const s = {
    y: today.y, m: today.m,
    start: null as number | null, end: null as number | null,
    saved: { start: null as number | null, end: null as number | null },
    value: '', rail: null as string | null, chip: null as string | null, yearOpen: false,
  };

  const parts = (k: number) => ({ y: Math.floor(k / 10000), m: Math.floor(k / 100) % 100, d: k % 100 });
  const fromDate = (d: Date) => keyOf(d.getFullYear(), d.getMonth(), d.getDate());
  const shift = (k: number, days = 0, mos = 0, yrs = 0) => {
    const p = parts(k);
    return fromDate(new Date(p.y + yrs, p.m + mos, p.d + days));
  };
  function view(k: number) {
    const p = parts(k);
    s.y = p.y;
    s.m = p.m;
  }

  // rail presets end on today, the DS uses Jul 8 2026 as today
  function preset(name: string): [number, number] {
    const t = todayKey;
    const dow = new Date(today.y, today.m, today.d).getDay();
    switch (name) {
      case 'Last 7 days': return [shift(t, -6), t];
      case 'Last 30 days': return [shift(t, -29), t];
      case 'Last 3 months': return [shift(t, 1, -3), t];
      case 'Last 6 months': return [shift(t, 1, -6), t];
      case 'Last years': return [shift(t, 1, 0, -1), t];
      case 'This week': return [shift(t, -dow), shift(t, 6 - dow)];
      default: return [keyOf(today.y, today.m, 1), fromDate(new Date(today.y, today.m + 1, 0))];
    }
  }

  // date preset chips under the single calendar, the multi-day ones need a range
  function chipRange(name: string): [number, number | null] {
    const t = todayKey;
    switch (name) {
      case 'Yesterday': return [shift(t, -1), null];
      case 'Tomorrow': return [shift(t, 1), null];
      case 'Last 7 Days': return [shift(t, -6), t];
      case 'Last 14 Days': return [shift(t, -13), t];
      default: return [t, null];
    }
  }

  const multiple = () => get('multiple') === 'true';
  const opts = () => ({ time: on('time'), actions: on('actions'), presets: on('presets') });

  function renderPicker(p: HTMLElement) {
    const multi = p.hasAttribute('data-multiple');
    const open = get('calendar') === 'true';
    const range = on('range') || multi;
    p.dataset.align = get('align').toLowerCase();
    p.hidden = (get('multiple') === 'true') !== multi;
    p.toggleAttribute('data-open', open);
    const part = (n: string) => p.querySelector<HTMLElement>(`[data-part="${n}"]`)!;
    part('label').hidden = !on('label');
    part('req').hidden = !on('required');
    part('panel').hidden = !open;
    part('control').setAttribute('aria-expanded', String(open));
    for (const k of ['time', 'actions', 'presets'] as const) {
      const sec = p.querySelector<HTMLElement>(`[data-part="${k}"]`);
      if (sec) sec.hidden = !on(k);
    }
    const field = p.querySelector<HTMLElement>('.u-field')!;
    field.dataset.state = open ? 'focus' : s.value ? 'filled' : 'placeholder';
    const val = part('value');
    val.textContent = s.value || 'Select date';
    val.toggleAttribute('data-ph', !s.value);

    p.querySelectorAll<HTMLElement>('.u-cal-month').forEach((pane, i) => {
      const y = i ? (s.m === 11 ? s.y + 1 : s.y) : s.y;
      const m = (s.m + i) % 12;
      pane.querySelector('[data-part="title"]')!.textContent = multi ? `${months[m]} ${y}` : months[m];
      const yr = pane.querySelector('[data-part="year"]');
      if (yr) yr.textContent = String(y);
      pane.querySelector('.u-cal-years')?.toggleAttribute('data-open', s.yearOpen);
      pane.querySelectorAll<HTMLElement>('[data-year]').forEach((o) => o.toggleAttribute('data-on', Number(o.dataset.year) === y));
      pane.querySelector('[data-part="grid"]')!.innerHTML = rowsHTML(y, m, { start: s.start, end: range ? s.end : null, today: todayKey, live: true });
    });
    p.querySelectorAll<HTMLElement>('[data-preset]').forEach((o) => o.toggleAttribute('data-on', o.dataset.preset === s.rail));
    p.querySelectorAll<HTMLElement>('[data-quick]').forEach((o) => o.toggleAttribute('data-on', o.dataset.quick === s.chip));
    const info = p.querySelector<HTMLElement>('[data-part="info"]');
    if (info) {
      info.hidden = !(s.start && s.end);
      if (s.start && s.end) info.querySelector('[data-part="info-text"]')!.textContent = formatRange(Math.min(s.start, s.end), Math.max(s.start, s.end));
    }
  }

  function render() {
    // multiple has no time field and no preset chips
    for (const k of ['time', 'presets']) (form.elements.namedItem(k) as HTMLInputElement).disabled = multiple();
    pickers.forEach(renderPicker);
    if (!chip.classList.contains('copied')) chipText();
    fit();
  }

  const chipText = () => (chip.textContent = [`Alight=${get('align')}`, `Calendar=${get('calendar')}`, `Multiple=${get('multiple')}`, ...optsLabel(multiple(), opts())].join(' · '));

  function close(revert: boolean) {
    if (revert) Object.assign(s, s.saved);
    s.yearOpen = false;
    set('calendar', 'false');
    render();
  }

  function apply() {
    const range = on('range') || get('multiple') === 'true';
    if (s.start && range && s.end) {
      const [a, b] = [Math.min(s.start, s.end), Math.max(s.start, s.end)];
      s.value = a === b ? formatDate(a) : formatRange(a, b);
    } else if (s.start) s.value = formatDate(s.start);
    s.saved = { start: s.start, end: s.end };
    close(false);
  }

  function pick(k: number) {
    const range = on('range') || get('multiple') === 'true';
    s.rail = null;
    s.chip = null;
    if (!range) {
      s.start = k;
      s.end = null;
    } else if (!s.start || s.end) {
      s.start = k;
      s.end = null;
    } else s.end = k;
    // an outside date moves the calendar to its month
    const p = parts(k);
    const multi = get('multiple') === 'true';
    const next = (s.m + 1) % 12;
    if (p.m === s.m || (multi && p.m === next)) return;
    view(multi && p.m !== (s.m + 11) % 12 ? shift(k, 0, -1) : k);
  }

  // without action buttons a finished pick applies right away
  const done = () => !on('actions') && !!s.start && (!(on('range') || multiple()) || !!s.end);

  canvas.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    const picker = el.closest<HTMLElement>('.u-dp');
    if (!picker) {
      if (get('calendar') === 'true') close(true);
      return;
    }
    if (el.closest('[data-part="control"]')) {
      if (get('calendar') === 'true') close(true);
      else {
        s.saved = { start: s.start, end: s.end };
        set('calendar', 'true');
        render();
      }
      return;
    }
    const cell = el.closest<HTMLElement>('[data-key]');
    const act = el.closest<HTMLElement>('[data-act]')?.dataset.act;
    const year = el.closest<HTMLElement>('[data-year]')?.dataset.year;
    const pre = el.closest<HTMLElement>('[data-preset]')?.dataset.preset;
    const quick = el.closest<HTMLElement>('[data-quick]')?.dataset.quick;
    if (year) {
      s.y = Number(year);
      s.yearOpen = false;
    } else if (cell) {
      pick(Number(cell.dataset.key));
      if (done()) return apply();
    } else if (quick) {
      const [a, b] = chipRange(quick);
      if (b) (form.elements.namedItem('range') as HTMLInputElement).checked = true;
      // a one-day chip in range mode is a finished range of one day
      [s.start, s.end] = [a, b ?? (on('range') ? a : null)];
      s.chip = quick;
      view(a);
      if (done()) return apply();
    } else if (pre) {
      [s.start, s.end] = preset(pre);
      s.rail = pre;
      s.chip = null;
      // show the start month when the range fits in the two panes
      const a = parts(s.start);
      const b = parts(s.end);
      view((b.y - a.y) * 12 + b.m - a.m <= 1 ? keyOf(a.y, a.m, 1) : shift(keyOf(b.y, b.m, 1), 0, -1));
    } else if (act === 'prev' || act === 'next') view(shift(keyOf(s.y, s.m, 1), 0, act === 'prev' ? -1 : 1));
    else if (act === 'year') s.yearOpen = !s.yearOpen;
    else if (act === 'apply') return apply();
    else if (act === 'cancel') return close(true);
    else if (act === 'clear') {
      s.start = s.end = null;
      s.rail = null;
      s.chip = null;
      s.value = '';
    } else if (s.yearOpen && !el.closest('.u-cal-years')) s.yearOpen = false;
    else return;
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && get('calendar') === 'true' && canvas.contains(document.activeElement)) close(true);
  }, { signal });

  form.addEventListener('change', (e) => {
    const name = (e.target as HTMLInputElement).name;
    // switching to multiple keeps the range rail meaningful, a single date drops its end
    if (name === 'range' && !on('range')) {
      s.end = null;
      s.chip = null;
    }
    render();
  });

  // wide calendars shrink to fit their tile or the canvas
  function fit() {
    document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
      el.style.zoom = '1';
      const host = el.parentElement!;
      const cs = getComputedStyle(host);
      const room = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const child = el.firstElementChild instanceof HTMLElement && !el.firstElementChild.hidden ? el.firstElementChild : [...el.children].find((c) => !(c as HTMLElement).hidden) as HTMLElement;
      const w = child?.scrollWidth ?? el.scrollWidth;
      if (w > room && room > 0) el.style.zoom = String(room / w);
    });
  }
  const ro = new ResizeObserver(fit);
  ro.observe(document.body);
  signal.addEventListener('abort', () => ro.disconnect());
  render();

  // copy to figma: the DS variant for the form axes, with the field's label, required mark and applied value
  setupCopy('date-picker', {
    signal,
    current: () => pickerCopy({
      align: get('align') as Align, calendar: get('calendar') === 'true', multiple: get('multiple') === 'true',
      label: on('label'), required: on('required'), value: s.value, ...opts(),
    }),
    canvas,
    chip,
    restoreChip: chipText,
  });
}
