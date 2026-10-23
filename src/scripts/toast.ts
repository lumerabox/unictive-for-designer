let timer = 0;

export function showToast(html: string, ms = 2600) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(timer);
  timer = window.setTimeout(() => el.classList.remove('show'), ms);
}

export const pasteKey = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘V' : 'Ctrl+V');
