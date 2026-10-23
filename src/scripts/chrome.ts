// site chrome: search palette, mobile drawer, coming-soon links
import { showToast } from './toast';

const soon = (name: string) => showToast(`${name} is coming soon`);
document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-soon]');
  if (t) soon(t.dataset.soon!);
});

// mobile drawer
const menu = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const setNav = (open: boolean) => {
  document.body.classList.toggle('nav-open', open);
  menu?.setAttribute('aria-expanded', String(open));
  menu?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menu?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
document.querySelector('[data-scrim]')?.addEventListener('click', () => setNav(false));
document.querySelectorAll('#sidebar a').forEach((a) => a.addEventListener('click', () => setNav(false)));
matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && setNav(false));

// search palette
const dialog = document.querySelector<HTMLDialogElement>('[data-palette]')!;
const input = dialog.querySelector<HTMLInputElement>('[data-palette-input]')!;
const items = [...dialog.querySelectorAll<HTMLLIElement>('[data-item]')];
const empty = dialog.querySelector<HTMLElement>('[data-palette-empty]')!;
let index = 0;

const visible = () => items.filter((i) => !i.hidden);
const select = (n: number) => {
  const list = visible();
  index = Math.max(0, Math.min(n, list.length - 1));
  items.forEach((i) => i.setAttribute('aria-selected', 'false'));
  list[index]?.setAttribute('aria-selected', 'true');
  list[index]?.scrollIntoView({ block: 'nearest' });
};
const filter = () => {
  const q = input.value.trim().toLowerCase();
  items.forEach((i) => (i.hidden = !!q && !i.dataset.item!.includes(q)));
  empty.hidden = visible().length > 0;
  select(0);
};
const go = (li?: HTMLLIElement) => {
  if (!li) return;
  dialog.close();
  if (li.dataset.href) location.href = li.dataset.href;
  else soon(li.querySelector('span')!.textContent!);
};
const open = () => {
  setNav(false);
  input.value = '';
  filter();
  dialog.showModal();
  input.focus();
};

document.querySelector('[data-search-open]')?.addEventListener('click', open);
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    dialog.open ? dialog.close() : open();
  }
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setNav(false);
});
input.addEventListener('input', filter);
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); select(index + 1); }
  if (e.key === 'ArrowUp') { e.preventDefault(); select(index - 1); }
  if (e.key === 'Enter') { e.preventDefault(); go(visible()[index]); }
});
items.forEach((li) => {
  li.addEventListener('click', () => go(li));
  li.addEventListener('mousemove', () => select(visible().indexOf(li)));
});
dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
