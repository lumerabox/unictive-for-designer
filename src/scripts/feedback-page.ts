// playgrounds and live demos for the feedback and overlay pages: alert, banner, badge, progress bar, tooltip, modal and popover.
// a playground form is read as a whole into options, and the preview is drawn again from the same render() the page used
import * as alert from '../data/alert';
import * as banner from '../data/banner';
import * as badge from '../data/badge';
import * as progress from '../data/progress-bar';
import * as tooltip from '../data/tooltip';
import * as modal from '../data/modal';
import * as popover from '../data/popover';
import { iconBtn, btn } from '../data/markup';
import { showToast } from './toast';

export default function init(signal: AbortSignal) {
  type Opts = Record<string, any>;
  const optsOf = (el: HTMLElement): Opts => JSON.parse(el.dataset.opts ?? '{}');
  const fromHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.firstElementChild as HTMLElement;
  };

  const tipTrigger = (o: Opts) => `<span class="u-anchor">${iconBtn('alert-circle-line', 'More info', { attrs: 'aria-describedby="pg-tip"' })}${tooltip.render({ ...o, id: 'pg-tip' })}</span>`;
  const popTrigger = (o: Opts) => `<span class="u-anchor">${btn('Take the tour', { style: 'Tertiary', type: 'Neutral', attrs: 'data-pop-trigger aria-expanded="true"' })}${popover.render({ ...o, live: true }).replace('class="u-pop u-float"', 'class="u-pop u-float is-open"')}</span>`;

  const kinds: Record<string, { render: (o: Opts) => string; chip: (o: Opts) => string; sync?: (form: HTMLFormElement, o: Opts) => void }> = {
    alert: {
      render: (o) => alert.render({ ...o, live: true }),
      chip: (o) => alert.chip(o as any),
      sync: (f, o) => (el(f, 'second')!.disabled = o.size !== 'Large'),
    },
    banner: { render: (o) => banner.render({ ...o, live: true }), chip: (o) => banner.chip(o as any) },
    badge: {
      render: badge.render,
      chip: (o) => badge.chip(o as any),
      sync: (f, o) => {
        el(f, 'number')!.disabled = o.type === 'Icon';
        el(f, 'left')!.disabled = el(f, 'right')!.disabled = o.type !== 'Icon';
      },
    },
    progress: {
      render: (o) => progress.render({ ...o, live: true }),
      chip: (o) => `${progress.chip(o as any)} · ${o.state === 'On Progress' ? `${Math.round(o.value)}%` : '100%'}`,
      sync: (f, o) => (el(f, 'value')!.disabled = o.state !== 'On Progress'),
    },
    tooltip: {
      render: tipTrigger,
      chip: (o) => tooltip.chip(o as any),
      sync: (f, o) => (el(f, 'icon')!.disabled = el(f, 'close')!.disabled = o.type === 'Default'),
    },
    modal: {
      render: modal.render,
      chip: (o) => modal.chip(o as any),
      sync: (f, o) => (el(f, 'close')!.disabled = o.align === 'Center'),
    },
    popover: {
      render: popTrigger,
      chip: (o) => `${popover.chip(o as any)} · Step ${(o.step ?? 0) + 1} of ${popover.tour.length}`,
      sync: (f, o) => (el(f, 'footerType')!.disabled = !o.footer),
    },
  };

  function el(form: HTMLFormElement, name: string) {
    return form.elements.namedItem(name) as HTMLInputElement | null;
  }

  // every named control: checkboxes are booleans, "true" / "false" selects too, ranges are numbers
  function read(form: HTMLFormElement): Opts {
    const o: Opts = {};
    for (const c of Array.from(form.elements) as HTMLInputElement[]) {
      if (!c.name) continue;
      if (c.type === 'checkbox') o[c.name] = c.checked;
      else if (c.type === 'range') o[c.name] = Number(c.value);
      else if (c.value === 'true' || c.value === 'false') o[c.name] = c.value === 'true';
      else if (c.value !== '') o[c.name] = c.value;
    }
    return o;
  }

  const forms = new Map<HTMLFormElement, Opts>();

  function draw(form: HTMLFormElement, patch: Opts = {}) {
    const kind = kinds[form.dataset.kind!];
    const o = { ...read(form), ...patch };
    forms.set(form, o);
    kind.sync?.(form, o);
    form.querySelector<HTMLElement>('[data-host]')!.innerHTML = kind.render(o);
    form.querySelector<HTMLElement>('[data-chip]')!.textContent = kind.chip(o);
    form.querySelector<HTMLElement>('[data-restore]')?.setAttribute('hidden', '');
    const out = form.querySelector<HTMLElement>('[data-out]');
    if (out) out.textContent = `${o.value}%`;
  }

  document.querySelectorAll<HTMLFormElement>('[data-playground]').forEach((form) => {
    form.addEventListener('input', (e) => {
      if (!(e.target as HTMLElement).closest('[data-host]')) draw(form, form.dataset.kind === 'popover' ? { step: forms.get(form)?.step ?? 0 } : {});
    });
    draw(form);
  });

  /* dismiss: alerts and banners fade out; in a playground a Show again button brings them back, tiles come back by themselves */
  function dismiss(target: HTMLElement) {
    target.classList.add('is-leaving');
    const form = target.closest<HTMLFormElement>('[data-playground]');
    setTimeout(() => {
      target.hidden = true;
      if (form) {
        const again = form.querySelector<HTMLElement>('[data-restore]');
        again?.removeAttribute('hidden');
        again?.focus();
      } else
        setTimeout(() => {
          target.hidden = false;
          requestAnimationFrame(() => target.classList.remove('is-leaving'));
        }, 1200);
    }, 160);
  }

  /* progress: a fake upload that runs to 100% and lands on Success */
  let uploading = 0;
  signal.addEventListener('abort', () => clearInterval(uploading));
  function upload(form: HTMLFormElement, button: HTMLButtonElement) {
    if (uploading) return;
    el(form, 'state')!.value = 'On Progress';
    let v = 0;
    button.disabled = true;
    uploading = window.setInterval(() => {
      v = Math.min(100, v + 4 + Math.random() * 9);
      el(form, 'value')!.value = String(Math.round(v));
      if (v >= 100) {
        clearInterval(uploading);
        uploading = 0;
        el(form, 'state')!.value = 'Success';
        button.disabled = false;
      }
      draw(form);
    }, 180);
  }

  /* modal: a native dialog built from the playground, or from data-modal on the button */
  function openModal(o: Opts, opener: HTMLElement) {
    const dialog = document.createElement('dialog');
    dialog.className = 'u-dialog';
    dialog.innerHTML = modal.render({ ...o, id: 'live-modal' });
    dialog.setAttribute('aria-labelledby', 'live-modal-title');
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      dialog.remove();
      opener.focus();
    });
    dialog.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === dialog) dialog.close();
      else if (t.closest('[data-modal-confirm]')) {
        dialog.close();
        showToast(`${t.closest('button')!.textContent?.trim()}, done. Demo only, nothing changed`);
      } else if (t.closest('[data-modal-close]')) dialog.close();
    });
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-modal-confirm]')?.focus();
  }

  /* popover: the trigger toggles it, steps re-render it, Escape and outside clicks close it */
  function setPop(pop: HTMLElement, open: boolean) {
    pop.classList.toggle('is-open', open);
    pop.parentElement?.querySelector('[data-pop-trigger]')?.setAttribute('aria-expanded', String(open));
  }
  function stepPop(pop: HTMLElement, by: number) {
    const o = optsOf(pop);
    const step = (o.step ?? 0) + by;
    const form = pop.closest<HTMLFormElement>('[data-playground]');
    if (step >= popover.tour.length) {
      setPop(pop, false);
      showToast('Tour finished');
      if (form) setTimeout(() => draw(form, { step: 0 }), 200);
      return;
    }
    const s = Math.max(0, step);
    if (form) draw(form, { step: s });
    else {
      const next = fromHtml(popover.render({ ...o, step: s, live: true }));
      next.classList.add('is-open');
      pop.replaceWith(next);
    }
    const host = form?.querySelector('[data-host]') ?? document;
    host.querySelector<HTMLElement>(`.u-pop [data-pop-step="${by > 0 ? 1 : -1}"]:not(:disabled)`)?.focus();
  }

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const form = t.closest<HTMLFormElement>('[data-playground]');

    const x = t.closest<HTMLElement>('[data-dismiss]');
    if (x) return dismiss(x.closest<HTMLElement>('.u-alert, .u-banner')!);
    if (t.closest('[data-restore]') && form) return draw(form);
    const start = t.closest<HTMLButtonElement>('[data-upload]');
    if (start && form) return upload(form, start);
    const open = t.closest<HTMLElement>('[data-open-modal]');
    if (open) return openModal(open.dataset.modal ? JSON.parse(open.dataset.modal) : forms.get(form!) ?? {}, open);
    if (t.closest('.u-modal [data-modal-close], .u-modal [data-modal-confirm]') && !t.closest('dialog')) return showToast('Open the modal to try its buttons');

    const trigger = t.closest<HTMLElement>('[data-pop-trigger]');
    if (trigger) {
      const pop = trigger.parentElement!.querySelector<HTMLElement>('.u-pop')!;
      return setPop(pop, !pop.classList.contains('is-open'));
    }
    const pop = t.closest<HTMLElement>('.u-pop[data-live]');
    if (pop) {
      const step = t.closest<HTMLElement>('[data-pop-step]');
      if (step) stepPop(pop, Number(step.dataset.popStep));
      else if (t.closest('[data-pop-close]')) setPop(pop, false);
      return;
    }
    document.querySelectorAll<HTMLElement>('.u-pop[data-live].is-open').forEach((p) => !p.closest('[data-playground]') && setPop(p, false));

    if (t.closest('[data-tip-close]')) t.closest<HTMLElement>('.u-tip')?.classList.remove('is-open');
  }, { signal });

  /* tooltips: 300 ms after hover, straight away on focus, gone on leave, blur or Escape */
  let tipTimer = 0;
  const tipOf = (t: EventTarget | null) => (t as HTMLElement | null)?.closest?.('[data-tip-trigger]')?.parentElement?.querySelector<HTMLElement>('.u-tip[data-live]') ?? null;
  const showTip = (tip: HTMLElement | null, delay: number) => {
    clearTimeout(tipTimer);
    if (tip) tipTimer = window.setTimeout(() => tip.classList.add('is-open'), delay);
  };
  const hideTip = (tip: HTMLElement | null) => {
    clearTimeout(tipTimer);
    tip?.classList.remove('is-open');
  };
  document.addEventListener('pointerover', (e) => showTip(tipOf(e.target), 300), { signal });
  document.addEventListener('pointerout', (e) => {
    const tip = tipOf(e.target);
    if (tip && !(e.relatedTarget as HTMLElement | null)?.closest?.('[data-tip-trigger]')) hideTip(tip);
  }, { signal });
  document.addEventListener('focusin', (e) => showTip(tipOf(e.target), 0), { signal });
  document.addEventListener('focusout', (e) => hideTip(tipOf(e.target)), { signal });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll<HTMLElement>('.u-tip.is-open').forEach(hideTip);
    const pop = document.querySelector<HTMLElement>('.u-pop[data-live].is-open:focus-within') ?? document.querySelector<HTMLElement>('.u-pop[data-live].is-open');
    if (pop) {
      setPop(pop, false);
      pop.parentElement?.querySelector<HTMLElement>('[data-pop-trigger]')?.focus();
    }
  }, { signal });
}
