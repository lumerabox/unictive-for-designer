// playground and live demos for the breadcrumbs, tab menu, pagination and stepper pages.
// a live component carries its options in data-opts and is re-rendered from them on every change
import * as bc from '../data/breadcrumbs';
import * as tabs from '../data/tab-menu';
import * as pg from '../data/pagination';
import * as st from '../data/stepper';
import { showToast } from './toast';

export default function init(signal: AbortSignal) {
  type Opts = Record<string, any>;
  const renderers: Record<string, (o: any) => string> = { breadcrumbs: bc.render, tabs: tabs.render, pagination: pg.render, stepper: st.render };
  const optsOf = (root: HTMLElement): Opts => JSON.parse(root.dataset.opts ?? '{}');

  function rerender(root: HTMLElement, patch: Opts, focusKey?: string) {
    const active = document.activeElement as HTMLElement | null;
    const key = focusKey ?? (active && root.contains(active) ? active.dataset.key : undefined);
    const opts = { ...optsOf(root), ...patch, live: true };
    const tmp = document.createElement('div');
    tmp.innerHTML = renderers[root.dataset.c!](opts);
    const next = tmp.firstElementChild as HTMLElement;
    root.replaceWith(next);
    if (key) next.querySelector<HTMLElement>(`[data-key="${key}"]:not(:disabled)`)?.focus();
    next.dispatchEvent(new CustomEvent('nav-change', { bubbles: true, detail: optsOf(next) }));
    return next;
  }

  const liveRoot = (el: Element | null, c: string) => el?.closest<HTMLElement>(`[data-live][data-c="${c}"]`) ?? null;
  const keyIndex = (el: HTMLElement) => Number(el.dataset.key!.split('-').pop());

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;

    // breadcrumbs: demo links never navigate, a parent crumb trims the trail back to it
    const crumb = t.closest<HTMLAnchorElement>('.u-crumb');
    if (crumb) {
      e.preventDefault();
      const root = liveRoot(crumb, 'breadcrumbs');
      if (root && !crumb.hasAttribute('aria-current')) rerender(root, { count: Math.max(2, keyIndex(crumb) + 1) }, crumb.dataset.key);
      else if (!root) showToast('Demo link, it doesn’t go anywhere');
      return;
    }

    const tab = t.closest<HTMLElement>('.u-tab');
    if (tab) {
      const root = liveRoot(tab, 'tabs');
      if (root) rerender(root, { active: keyIndex(tab) }, tab.dataset.key);
      return;
    }

    const pgRoot = liveRoot(t, 'pagination');
    if (pgRoot) {
      const btn = t.closest<HTMLElement>('button[data-page]');
      const per = t.closest<HTMLElement>('[data-per]');
      if (btn) rerender(pgRoot, { page: Number(btn.dataset.page) }, btn.dataset.key);
      else if (per) rerender(pgRoot, { perPage: Number(per.dataset.per), page: 1, open: false }, 'rows');
      else if (t.closest('.u-pg-trigger')) {
        const open = !optsOf(pgRoot).open;
        const next = rerender(pgRoot, { open }, 'rows');
        if (open) next.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
      }
      return;
    }
    // a click anywhere else closes an open rows menu
    document.querySelectorAll<HTMLElement>('[data-c="pagination"]').forEach((r) => optsOf(r).open && rerender(r, { open: false }));

    const step = t.closest<HTMLElement>('button.u-step');
    const stRoot = liveRoot(step, 'stepper');
    if (step && stRoot) rerender(stRoot, { current: keyIndex(step) }, `step-${keyIndex(step)}`);
  }, { signal });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;

    // tabs: arrows move and select, Home and End jump to the ends
    const tab = t.closest<HTMLElement>('.u-tab');
    const root = liveRoot(tab, 'tabs');
    if (tab && root) {
      const o = optsOf(root);
      const vertical = o.kind === 'Vertical';
      const step = { ArrowRight: vertical ? 0 : 1, ArrowLeft: vertical ? 0 : -1, ArrowDown: vertical ? 1 : 0, ArrowUp: vertical ? -1 : 0 }[e.key];
      let i = keyIndex(tab);
      if (step) i = (i + step + o.count) % o.count;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = o.count - 1;
      else return;
      e.preventDefault();
      rerender(root, { active: i }, `tab-${i}`);
      return;
    }

    // rows per page menu: arrows move, Enter picks, Escape closes
    const opt = t.closest<HTMLElement>('[data-per]');
    const pgRoot = liveRoot(t, 'pagination');
    if (pgRoot && optsOf(pgRoot).open) {
      if (e.key === 'Escape') {
        e.preventDefault();
        rerender(pgRoot, { open: false }, 'rows');
      } else if (opt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        ((e.key === 'ArrowDown' ? opt.nextElementSibling : opt.previousElementSibling) as HTMLElement | null)?.focus();
      } else if (opt && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        opt.click();
      }
    }
  }, { signal });

  // playground: the form picks the variant, the live preview keeps its own page, tab or step
  const form = document.querySelector<HTMLFormElement>('[data-playground]');
  if (form) {
    const kind = form.dataset.kind!;
    const host = form.querySelector<HTMLElement>('[data-host]')!;
    const chip = form.querySelector<HTMLElement>('[data-chip]')!;
    const el = <T extends Element = HTMLSelectElement>(k: string) => form.elements.namedItem(k) as unknown as T | null;
    const get = (k: string) => el(k)?.value ?? '';
    // toggles are checkboxes, Rounded is a true / false select
    const on = (k: string) => {
      const e = el<HTMLInputElement>(k);
      return e?.type === 'checkbox' ? e.checked : e?.value === 'true';
    };
    const root = () => host.firstElementChild as HTMLElement;

    function fromForm(): Opts {
      const keep = optsOf(root());
      if (kind === 'breadcrumbs') return { type: get('type'), count: Number(get('count')), rounded: on('rounded'), icon: on('icon'), dropdown: on('dropdown') };
      if (kind === 'tabs') {
        const k = get('kind') as tabs.Kind;
        const max = tabs.maxCount[k];
        for (const o of el('count')!.options) o.disabled = Number(o.value) > max;
        if (Number(get('count')) > max) el('count')!.value = String(max);
        el('style')!.disabled = k !== 'Pill';
        el('list')!.disabled = k !== 'Vertical';
        el('rounded')!.disabled = k === 'Line' || k === 'Vertical';
        const count = Number(get('count'));
        return { kind: k, count, active: Math.min(keep.active ?? 0, count - 1), rounded: on('rounded'), style: get('style'), list: get('list'), icon: on('icon'), badge: on('badge') };
      }
      if (kind === 'pagination') return { type: get('type'), size: get('size'), items: Number(get('items')), page: keep.page ?? 1, perPage: keep.perPage ?? 10, open: false };
      return { layout: get('layout'), type: get('indicator'), size: get('size'), rounded: on('rounded'), badge: on('badge'), current: keep.current ?? 1 };
    }

    function label(o: Opts) {
      if (kind === 'breadcrumbs') return bc.chip(o as any);
      if (kind === 'tabs') return tabs.chip(o as any);
      if (kind === 'pagination') return `${pg.chip(o as any)} · Page ${o.page} of ${pg.pages(o)}`;
      const done = o.current >= st.steps.length;
      return `${st.chip(o as any)} · ${done ? 'All steps done' : `Step ${o.current + 1} of ${st.steps.length}`}`;
    }

    function sync(o: Opts) {
      chip.textContent = label(o);
      if (kind === 'breadcrumbs') el('count')!.value = String(o.count);
      if (kind === 'stepper') {
        form!.querySelector<HTMLButtonElement>('[data-step-act="back"]')!.disabled = o.current <= 0;
        form!.querySelector<HTMLButtonElement>('[data-step-act="next"]')!.disabled = o.current >= st.steps.length;
      }
    }

    const apply = () => rerender(root(), fromForm());
    form.addEventListener('change', (e) => {
      if (!host.contains(e.target as Node)) apply();
    });
    host.addEventListener('nav-change', (e) => sync((e as CustomEvent<Opts>).detail));
    form.querySelectorAll<HTMLButtonElement>('[data-step-act]').forEach((b) =>
      b.addEventListener('click', () => {
        const o = optsOf(root());
        rerender(root(), { current: Math.min(st.steps.length, Math.max(0, o.current + (b.dataset.stepAct === 'next' ? 1 : -1))) });
      }),
    );
    apply();
  }
}
