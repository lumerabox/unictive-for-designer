// shared behaviour for every doc page: token copy, on-this-page scrollspy, sidebar state, page script
import { showToast } from './toast';

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
  const part = (p: string) => p.split('/')[1];
  document.querySelectorAll<HTMLAnchorElement>('.topnav a, .drawer-nav a').forEach((a) => {
    if (part(a.pathname) === part(location.pathname)) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc]')];
  const sections = links.map((a) => document.getElementById(a.dataset.toc!)).filter((s): s is HTMLElement => !!s);
  const spy = () => {
    if (!sections.length) return;
    const y = innerHeight * 0.3;
    let active = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= y) active = s;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = sections[sections.length - 1];
    links.forEach((a) => a.classList.toggle('active', a.dataset.toc === active.id));
  };
  addEventListener('scroll', spy, { passive: true, signal });
  addEventListener('resize', spy, { signal });
  spy();
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
