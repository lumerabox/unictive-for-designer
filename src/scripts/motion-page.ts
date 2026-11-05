// motion foundation and animation pages: curve and duration demos, replay buttons, reveal playgrounds
import { copy } from './foundations-page';
import { motionHtml } from '../data/motion';

type Motion = {
  init: (root?: Element | Document) => void;
  replay: (el: Element) => void;
  destroy: (el?: Element) => void;
};
declare global {
  interface Window { UnictiveMotion?: Motion }
}

// the page runs the same public motion.js people download, loaded once and kept across navigations
let loading: Promise<Motion> | undefined;
const motion = () =>
  (loading ??= new Promise<Motion>((resolve, reject) => {
    if (window.UnictiveMotion) return resolve(window.UnictiveMotion);
    const s = Object.assign(document.createElement('script'), { src: '/code/motion.js' });
    s.onload = () => resolve(window.UnictiveMotion!);
    s.onerror = reject;
    document.head.append(s);
  }));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const card = '<span class="mo-card"><b></b><i></i><i></i></span>';

function playground(form: HTMLFormElement, m: Motion, signal: AbortSignal) {
  const kind = form.dataset.kind as 'block' | 'text';
  const host = form.querySelector<HTMLElement>('[data-host]')!;
  const fromOpts = form.querySelector<HTMLElement>('[data-from-opts]');
  const children = form.querySelector<HTMLInputElement>('[name="children"]');

  const read = () => {
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? '');
    const preset = get('preset');
    const image = preset.startsWith('reveal');
    const vars: Record<string, string> = {};
    if (get('ease')) vars['--motion-ease'] = `var(--${get('ease')})`;
    if (get('duration')) vars['--motion-duration'] = `var(--${get('duration')})`;
    if (get('distance')) vars['--motion-distance'] = get('distance');
    if (get('stagger')) vars['--motion-stagger'] = get('stagger');
    return {
      preset,
      kind: kind === 'text' ? ('text' as const) : image ? ('image' as const) : ('block' as const),
      children: !image && f.has('children'),
      from: get('from'),
      text: get('text').trim() || 'Design that moves with purpose',
      vars,
    };
  };

  const draw = () => {
    const o = read();
    if (fromOpts) fromOpts.hidden = o.preset !== 'reveal-clip';
    if (children) children.disabled = o.kind === 'image';
    const attrs = `data-motion="${o.preset}"${o.preset === 'reveal-clip' ? ` data-motion-from="${o.from}"` : ''}${o.children ? ' data-motion-children' : ''} style="${Object.entries(o.vars).map(([k, v]) => `${k}: ${v}`).join('; ')}"`;
    const old = host.firstElementChild;
    if (old) m.destroy(old);
    host.innerHTML =
      o.kind === 'text' ? `<p class="mo-text" ${attrs}>${esc(o.text)}</p>`
      : o.kind === 'image' ? `<figure class="mo-frame" ${attrs}><div class="m-media mo-img mo-img-1"></div></figure>`
      : o.children ? `<ul class="mo-row" ${attrs}>${`<li>${card}</li>`.repeat(3)}</ul>`
      : `<div ${attrs}>${card}</div>`;
    m.init(host);
    m.replay(host.firstElementChild!);
  };

  let t: number | undefined;
  form.addEventListener('change', draw, { signal });
  form.addEventListener('input', (e) => {
    if ((e.target as HTMLInputElement).name !== 'text') return;
    clearTimeout(t);
    t = window.setTimeout(draw, 350);
  }, { signal });
  const again = () => m.replay(host.firstElementChild!);
  form.querySelector('[data-pg-replay]')!.addEventListener('click', again, { signal });
  form.querySelector('[data-canvas]')!.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') again(); }, { signal });
  form.querySelector('[data-motion-copy]')!.addEventListener('click', () => copy(motionHtml(read()), 'HTML'), { signal });
  draw();
}

export default async function init(signal: AbortSignal) {
  const touch = matchMedia('(hover: none)').matches;
  // anything with data-copy-value copies on click; curves and durations also play on tap where there is no hover
  document.querySelectorAll<HTMLElement>('[data-copy-value]').forEach((el) =>
    el.addEventListener('click', () => {
      copy(el.dataset.copyValue!, el.dataset.copyWhat);
      // the example-style copy button says copied for a moment, like on component pages
      const label = el.matches('.ex-copy') ? el.querySelector('span') : null;
      if (label) {
        el.classList.add('done');
        label.textContent = 'Copied';
        setTimeout(() => { el.classList.remove('done'); label.textContent = 'Copy'; }, 1600);
      }
      if (touch && el.matches('[data-ease-tile]')) el.classList.toggle('is-playing');
      if (touch && el.matches('[data-dur-row]')) el.classList.toggle('is-end');
    }, { signal }),
  );
  document.querySelector('[data-play-durs]')?.addEventListener('click', () => {
    const rows = [...document.querySelectorAll<HTMLElement>('[data-dur-row]')];
    const end = !rows[0]?.classList.contains('is-end');
    rows.forEach((r) => r.classList.toggle('is-end', end));
  }, { signal });
  document.querySelectorAll<HTMLElement>('[data-dl]').forEach((b) =>
    b.addEventListener('click', () => {
      Object.assign(document.createElement('a'), { href: b.dataset.dl!, download: b.dataset.dlName! }).click();
    }, { signal }),
  );
  document.querySelectorAll<HTMLElement>('[data-toggle-press]').forEach((b) =>
    b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')), { signal }),
  );
  document.querySelectorAll('.mo-stage a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault(), { signal }));

  // compare: three lanes race the picked curves
  const cmp = document.querySelector<HTMLFormElement>('[data-ease-compare]');
  if (cmp) {
    const lanes = cmp.querySelector<HTMLElement>('[data-lanes]')!;
    const sync = () => {
      const f = new FormData(cmp);
      lanes.style.setProperty('--t', String(f.get('t')));
      [0, 1, 2].forEach((i) => {
        const sel = cmp.querySelector<HTMLSelectElement>(`[name="e${i}"]`)!;
        cmp.querySelector<HTMLElement>(`[data-lane="${i}"]`)!.style.setProperty('--e', sel.value);
        cmp.querySelector<HTMLElement>(`[data-lane-name="${i}"]`)!.textContent = sel.selectedOptions[0].textContent;
      });
    };
    cmp.addEventListener('change', () => { lanes.classList.remove('is-end'); sync(); }, { signal });
    cmp.querySelector('[data-lanes-play]')!.addEventListener('click', () => lanes.classList.toggle('is-end'), { signal });
    sync();
  }

  if (!document.querySelector('[data-motion], [data-motion-scroll], [data-motion-pg], [data-motion-magnetic], [data-motion-tilt], [data-motion-spotlight], [data-motion-ripple]')) return;
  const m = await motion();
  if (signal.aborted) return;
  m.init();
  signal.addEventListener('abort', () => m.destroy());

  document.querySelectorAll<HTMLElement>('[data-replay]').forEach((b) =>
    b.addEventListener('click', () => {
      const el = b.closest('.tile')?.querySelector('[data-motion]');
      if (el) m.replay(el);
    }, { signal }),
  );
  // pointing at a demo again replays it, the replay buttons stay for touch and keyboard
  const onHover = (t: Element, play: () => void) =>
    t.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') play(); }, { signal });
  document.querySelectorAll('.tile:has([data-replay]), [data-hover-replay]').forEach((t) =>
    onHover(t, () => {
      const el = t.querySelector('[data-motion]');
      if (el) m.replay(el);
    }),
  );
  const hero = () => document.querySelectorAll('[data-hero] [data-motion]').forEach((el) => m.replay(el));
  document.querySelector('[data-replay-hero]')?.addEventListener('click', hero, { signal });
  const heroBox = document.querySelector('[data-hero]');
  if (heroBox) onHover(heroBox, hero);
  document.querySelectorAll<HTMLFormElement>('[data-motion-pg]').forEach((f) => playground(f, m, signal));
}
