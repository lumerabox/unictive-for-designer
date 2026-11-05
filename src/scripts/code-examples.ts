// developer docs on component pages: preview and html tabs, copy, the global.css download, live counters
import { copy } from './foundations-page';

export function codeExamples() {
  document.querySelectorAll<HTMLElement>('[data-ex]').forEach((ex) => {
    const tabs = ex.querySelectorAll<HTMLElement>('[data-ex-tab]');
    tabs.forEach((t) => t.addEventListener('click', () => {
      tabs.forEach((o) => o.setAttribute('aria-selected', String(o === t)));
      ex.querySelectorAll<HTMLElement>('[data-ex-panel]').forEach((p) => (p.hidden = p.dataset.exPanel !== t.dataset.exTab));
    }));
    const btn = ex.querySelector<HTMLElement>('[data-ex-copy]')!;
    btn.addEventListener('click', async () => {
      await copy(ex.querySelector('.ex-code')!.textContent!, `${btn.dataset.exCopy} HTML`);
      btn.classList.add('done');
      btn.querySelector('span')!.textContent = 'Copied';
      setTimeout(() => {
        btn.classList.remove('done');
        btn.querySelector('span')!.textContent = 'Copy';
      }, 1600);
    });
    // links in previews stay on the page, counters follow what is typed
    ex.querySelectorAll('.ex-stage a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
    // indeterminate has no attribute, the snippets mark it with data-indeterminate
    ex.querySelectorAll<HTMLInputElement>('.ex-stage [data-indeterminate]').forEach((i) => (i.indeterminate = true));
    // triggers open and close what they control, a row picks its value
    ex.querySelectorAll<HTMLElement>('.ex-stage [aria-expanded][aria-controls]').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      document.getElementById(b.getAttribute('aria-controls')!)?.toggleAttribute('hidden', !open);
    }));
    ex.querySelectorAll<HTMLElement>('.ex-stage [role="listbox"] > .dropdown-item').forEach((row) => row.addEventListener('click', () => {
      if (row.getAttribute('aria-disabled') === 'true') return;
      row.parentElement!.querySelectorAll('[role="option"]').forEach((o) => o.setAttribute('aria-selected', String(o === row)));
      const value = row.closest('.dropdown')?.querySelector('.field-value');
      if (value) {
        value.textContent = row.querySelector('.dropdown-item-title')!.textContent;
        value.classList.remove('field-placeholder');
      }
    }));
    ex.querySelectorAll<HTMLElement>('.ex-stage .calendar-grid').forEach((g) => g.addEventListener('click', (e) => {
      const d = (e.target as HTMLElement).closest('.calendar-day');
      if (!d || d.classList.contains('calendar-day-muted') || g.querySelector('[class*="calendar-day-range"]')) return;
      g.querySelectorAll('[aria-selected]').forEach((o) => o.removeAttribute('aria-selected'));
      d.setAttribute('aria-selected', 'true');
    }));
    // drop zones light up while a file is dragged over, nothing is uploaded
    ex.querySelectorAll<HTMLElement>('.ex-stage .upload').forEach((z) => {
      const on = (v: boolean) => (e: Event) => {
        e.preventDefault();
        z.classList.toggle('upload-dragover', v);
      };
      z.addEventListener('dragover', on(true));
      z.addEventListener('dragleave', on(false));
      z.addEventListener('drop', on(false));
    });
    // tabs pick their panel, arrows move along the list. page numbers move the current page
    ex.querySelectorAll<HTMLElement>('.ex-stage [role="tablist"]').forEach((list) => {
      const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
      const pick = (tab: HTMLElement) => {
        tabs.forEach((o) => {
          o.setAttribute('aria-selected', String(o === tab));
          o.tabIndex = o === tab ? 0 : -1;
          const panel = o.getAttribute('aria-controls');
          if (panel) document.getElementById(panel)?.toggleAttribute('hidden', o !== tab);
        });
        tab.focus();
      };
      tabs.forEach((t) => t.addEventListener('click', () => pick(t)));
      list.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(e.target as HTMLElement);
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (i < 0 || !step) return;
        e.preventDefault();
        pick(tabs[(i + step + tabs.length) % tabs.length]);
      });
    });
    ex.querySelectorAll<HTMLElement>('.ex-stage button.pagination-item').forEach((b) => b.addEventListener('click', () => {
      b.closest('.pagination')!.querySelectorAll('[aria-current]').forEach((o) => o.removeAttribute('aria-current'));
      b.setAttribute('aria-current', 'page');
    }));
    // command="show-modal" and "close" need no script, older browsers get the same from these clicks
    if (!('commandForElement' in HTMLButtonElement.prototype))
      ex.querySelectorAll<HTMLButtonElement>('.ex-stage [commandfor]').forEach((b) => b.addEventListener('click', () => {
        const d = document.getElementById(b.getAttribute('commandfor')!) as HTMLDialogElement | null;
        if (b.getAttribute('command') === 'show-modal') d?.showModal();
        else if (b.getAttribute('command') === 'close') d?.close();
      }));
    ex.querySelectorAll<HTMLTextAreaElement>('.ex-stage textarea[maxlength]').forEach((t) => {
      const c = t.closest('.field')?.querySelector('.field-counter');
      if (c) t.addEventListener('input', () => (c.textContent = `${[...t.value].length}/${t.maxLength} Characters`));
    });
  });
  document.querySelector<HTMLElement>('[data-css-download]')?.addEventListener('click', (e) => {
    const d = e.currentTarget as HTMLElement;
    Object.assign(document.createElement('a'), { href: d.dataset.cssDownload!, download: 'global.css' }).click();
  });
}
