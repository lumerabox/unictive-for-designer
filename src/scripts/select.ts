// playground selects: the native select stays as the value source, the DS trigger and Dropdown-items panel replace its popup
import { paths } from '../components/dropdown/icons';

const proto = HTMLSelectElement.prototype;
const valueProp = Object.getOwnPropertyDescriptor(proto, 'value')!;
const indexProp = Object.getOwnPropertyDescriptor(proto, 'selectedIndex')!;
let open: (() => void) | null = null;

function enhance(sel: HTMLSelectElement, signal: AbortSignal) {
  const root = sel.closest<HTMLElement>('.select')!;
  if (root.dataset.enhanced) return;
  root.dataset.enhanced = '';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sel-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const label = root.querySelector('.visually-hidden') ?? root.closest('.field')?.querySelector('.label');
  if (label) trigger.setAttribute('aria-label', label.textContent!.trim());
  const value = document.createElement('span');
  value.className = 'sel-value';
  trigger.append(value);

  const panel = document.createElement('div');
  panel.className = 'u-dd-panel sel-panel';
  panel.setAttribute('role', 'listbox');
  panel.hidden = true;

  sel.before(trigger);
  root.append(panel);
  sel.tabIndex = -1;
  sel.setAttribute('aria-hidden', 'true');

  const sync = () => {
    value.textContent = sel.selectedOptions[0]?.textContent ?? '';
    trigger.disabled = sel.disabled;
  };
  Object.defineProperty(sel, 'value', { configurable: true, get() { return valueProp.get!.call(this); }, set(v) { valueProp.set!.call(this, v); sync(); } });
  Object.defineProperty(sel, 'selectedIndex', { configurable: true, get() { return indexProp.get!.call(this); }, set(v) { indexProp.set!.call(this, v); sync(); } });

  const rows = () => [...panel.querySelectorAll<HTMLButtonElement>('.u-dd-item:not([disabled])')];
  const build = () => {
    panel.replaceChildren(...[...sel.options].map((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'u-dd-item';
      b.dataset.type = 'default';
      b.dataset.size = 'small';
      b.dataset.state = o.disabled ? 'disable' : o.selected ? 'selected' : 'default';
      b.disabled = o.disabled;
      b.setAttribute('role', 'option');
      b.setAttribute('aria-selected', String(o.selected));
      b.innerHTML = `<span class="u-dd-text"><span class="u-dd-title"></span></span><svg class="u-dd-check" viewBox="0 0 16 16" aria-hidden="true"><path d="${paths.check}" fill-rule="evenodd" clip-rule="evenodd" /></svg>`;
      b.querySelector('.u-dd-title')!.textContent = o.textContent;
      b.addEventListener('click', () => pick(o.index));
      return b;
    }));
  };
  const close = (focus = false) => {
    if (panel.hidden) return;
    panel.hidden = true;
    root.removeAttribute('data-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (open === close) open = null;
    if (focus) trigger.focus();
  };
  const show = () => {
    open?.();
    build();
    panel.hidden = false;
    root.dataset.open = '';
    trigger.setAttribute('aria-expanded', 'true');
    open = close;
    (rows().find((r) => r.dataset.state === 'selected') ?? rows()[0])?.focus({ preventScroll: true });
    panel.querySelector<HTMLElement>('[data-state="selected"]')?.scrollIntoView({ block: 'nearest' });
  };
  const pick = (i: number) => {
    const changed = sel.selectedIndex !== i;
    sel.selectedIndex = i;
    close(true);
    if (changed) {
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  trigger.addEventListener('click', (e) => { e.preventDefault(); panel.hidden ? show() : close(); }, { signal });
  trigger.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); show(); }
  }, { signal });
  panel.addEventListener('keydown', (e) => {
    const list = rows();
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      list[e.key === 'Home' ? 0 : list.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') close();
  }, { signal });
  sel.form?.addEventListener('reset', () => setTimeout(sync), { signal });
  sync();
}

document.addEventListener('astro:page-load', () => {
  const ctrl = new AbortController();
  document.addEventListener('astro:before-swap', () => ctrl.abort(), { once: true });
  document.querySelectorAll<HTMLSelectElement>('.select select').forEach((s) => enhance(s, ctrl.signal));
  document.addEventListener('pointerdown', (e) => {
    if (open && !(e.target as HTMLElement).closest('.select[data-open]')) open();
  }, { signal: ctrl.signal });
});
