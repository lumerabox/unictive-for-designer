// copy to figma for the input control pages (dropdown, date picker, file upload, checkbox, radio group, switch, rating).
// a page passes what its playground shows; tiles carry their own spec in data-copy='{"label":"…","spec":{…}}'
import type { CopySpec } from '../lib/figma/controls';
import { writeClipboard, writeClipboardLater } from './figma-copy';
import { showToast, pasteKey } from './toast';

export interface Copyable {
  label: string; // shown in the toast, e.g. "Medium · Selected"
  spec: CopySpec;
}

type Controls = typeof import('../lib/figma/controls');

export function setupCopy(page: string, opts: { signal: AbortSignal; current: () => Copyable; canvas: HTMLElement; chip?: HTMLElement; restoreChip?: () => void }) {
  let lib: Controls | null = null;
  let template: Awaited<ReturnType<Controls['loadTemplate']>> | null = null;
  const load = () =>
    import('../lib/figma/controls').then(async (m) => {
      template = await m.loadTemplate(page);
      lib = m;
      return m;
    });
  ('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(() => load());

  async function copy(c: Copyable) {
    const ok = lib && template
      ? writeClipboard(lib.buildHTML(template, c.spec), c.label)
      : await writeClipboardLater(load().then((m) => m.buildHTML(template!, c.spec)), c.label);
    if (ok) {
      showToast(`<span>Copied ${c.label}</span><kbd>Paste in Figma with ${pasteKey()}</kbd>`);
      document.dispatchEvent(new CustomEvent('figma-copied'));
    } else showToast('Copy failed, try again');
    return ok;
  }

  let chipTimer = 0;
  function flashChip() {
    const chip = opts.chip;
    if (!chip) return;
    chip.classList.add('copied');
    chip.textContent = `Copied, paste in Figma with ${pasteKey()}`;
    clearTimeout(chipTimer);
    chipTimer = window.setTimeout(() => {
      chip.classList.remove('copied');
      opts.restoreChip?.();
    }, 2200);
  }

  document.querySelectorAll<HTMLElement>('[data-copy-current]').forEach((b) =>
    b.addEventListener('click', async () => {
      if ((await copy(opts.current())) && b.closest('.pg-foot')) flashChip();
    }),
  );

  // ⌘C copies the playground variant unless text is selected or a field is focused
  document.addEventListener('keydown', (e) => {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'c') return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, dialog') || (getSelection()?.toString() ?? '') !== '') return;
    const r = opts.canvas.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    e.preventDefault();
    copy(opts.current()).then((ok) => ok && flashChip());
  }, { signal: opts.signal });

  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((tile) =>
    tile.addEventListener('click', () => {
      copy(JSON.parse(tile.dataset.copy!)).then((ok) => {
        const hint = tile.querySelector<HTMLElement>('.copy-hint');
        if (!ok || !hint) return;
        tile.classList.add('done');
        hint.textContent = 'Copied';
        setTimeout(() => {
          tile.classList.remove('done');
          hint.textContent = 'Copy';
        }, 1600);
      });
    }),
  );

  return { copy };
}
