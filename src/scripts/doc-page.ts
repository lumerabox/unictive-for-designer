// shared behaviour for every doc page: token copy, on-this-page scrollspy, sidebar state, page script
import { showToast } from './toast';
import { sectionOfPath } from '../data/nav';

const pages = import.meta.glob<{ default: (signal: AbortSignal) => void }>(['./*-page.ts', '!./doc-page.ts']);
let ctrl: AbortController | undefined;

function init(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-token]').forEach((b) =>
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.token!);
        showToast(`Copied ${b.dataset.token}`);
      } catch {
        showToast('Copy failed');
      }
    }),
  );

  // the sidebar persists across navigations, so its current item follows the url
  document.querySelectorAll<HTMLAnchorElement>('#sidebar a').forEach((a) => {
    if (a.pathname === location.pathname) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // top nav and drawer sections persist too: the current one is the first path segment
  const part = (p: string) => sectionOfPath(p.split('/')[1]);
  document.querySelectorAll<HTMLAnchorElement>('.topnav a, .drawer-nav a').forEach((a) => {
    if (part(a.pathname) === part(location.pathname)) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // the sidebar only lists the groups of the current section
  document.querySelectorAll<HTMLElement>('#sidebar [data-section]').forEach((g) => {
    g.hidden = g.dataset.section !== part(location.pathname);
  });
}

document.addEventListener('astro:page-load', async () => {
  ctrl?.abort();
  ctrl = new AbortController();
  const { signal } = ctrl;
  init(signal);
  const center = document.querySelector<HTMLElement>('.center[data-script]');
  const load = center && pages[`./${center.dataset.script}-page.ts`];
  if (!load) return;
  const mod = await load();
  if (!signal.aborted) mod.default(signal);
});
