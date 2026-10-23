// shared behaviour for every doc page: token copy, on-this-page scrollspy
import { showToast } from './toast';

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
addEventListener('scroll', spy, { passive: true });
addEventListener('resize', spy);
spy();
