// playgrounds for the Icon Button, Link Button, Compact Button and Social Button pages.
// a playground form is read as a whole into options, and the preview is drawn again from the same render the page used
import * as actions from '../data/actions';
import { showToast } from './toast';

export default function init(signal: AbortSignal) {
  type Opts = Record<string, any>;

  const kinds: Record<string, { render: (o: Opts) => string; chip: (o: Opts) => string; done: (o: Opts) => string }> = {
    icon: { render: (o) => actions.iconButton({ ...o, live: true }), chip: (o) => actions.iconChip(o as any), done: (o) => `${actions.glyphs.find(([g]) => g === o.glyph)?.[1] ?? 'Action'}, done` },
    link: { render: (o) => actions.linkButton({ ...o, live: true }), chip: (o) => actions.linkChip(o as any), done: () => 'Link followed. Demo only, nothing opened' },
    compact: { render: (o) => actions.compactButton({ ...o, live: true }), chip: (o) => actions.compactChip(o as any), done: () => 'Closed. Demo only, nothing changed' },
    social: { render: (o) => actions.socialButton({ ...o, live: true }), chip: (o) => actions.socialChip(o as any), done: (o) => `Signing in with ${o.brand}. Demo only` },
  };

  // every named control: checkboxes are booleans, everything else a string
  function read(form: HTMLFormElement): Opts {
    const o: Opts = {};
    for (const c of Array.from(form.elements) as HTMLInputElement[]) {
      if (!c.name) continue;
      o[c.name] = c.type === 'checkbox' ? c.checked : c.value;
    }
    return o;
  }

  const forms = new Map<HTMLFormElement, Opts>();
  function draw(form: HTMLFormElement) {
    const kind = kinds[form.dataset.kind!];
    const o = read(form);
    forms.set(form, o);
    form.querySelector<HTMLElement>('[data-host]')!.innerHTML = kind.render(o);
    form.querySelector<HTMLElement>('[data-chip]')!.textContent = kind.chip(o);
  }

  document.querySelectorAll<HTMLFormElement>('[data-playground]').forEach((form) => {
    form.addEventListener('input', (e) => {
      if (!(e.target as HTMLElement).closest('[data-host]')) draw(form);
    }, { signal });
    draw(form);
  });

  // the preview is a real button: clicking it shows what would happen, Active compact buttons toggle off and on
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const host = t.closest('[data-host]');
    const b = t.closest<HTMLButtonElement>('button');
    if (!host || !b || b.disabled) return;
    const form = host.closest<HTMLFormElement>('[data-playground]')!;
    const kind = form.dataset.kind!;
    if (kind === 'compact' && forms.get(form)?.state === 'Active') {
      const on = b.dataset.state === 'active';
      b.dataset.state = on ? 'default' : 'active';
      b.setAttribute('aria-pressed', String(!on));
      return;
    }
    showToast(kinds[kind].done(forms.get(form) ?? {}));
  }, { signal });
}
