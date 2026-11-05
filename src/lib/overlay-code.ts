// code for developers: modal and popover classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { plainIcon, esc } from '../data/markup';
import { copy, type Header, type Align, type Footer as ModalFooter } from '../data/modal';
import { tour, type Arrow, type Size, type Footer as PopFooter } from '../data/popover';

const indent = (html: string, n = 1) => html.split('\n').map((l) => '  '.repeat(n) + l).join('\n');
const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

// modal

interface ModalOpts { header?: Header; description?: boolean; align?: Align; close?: boolean; footer?: ModalFooter }

const modalIcon: Partial<Record<Header, [string, Parameters<typeof plainIcon>[0]]>> = {
  Icon: ['', 'announcement-01-line'],
  Error: ['modal-icon-error', 'alert-circle-solid'],
  Warning: ['modal-icon-warning', 'alert-triangle-solid'],
  Success: ['modal-icon-success', 'check-circle-solid'],
  Info: ['modal-icon-info', 'info-circle-solid'],
};

function modalFooter(type: ModalFooter, confirm: string, dialog: boolean) {
  // inside a dialog the buttons close it, command="close" needs no script
  const close = dialog ? ' command="close" commandfor="__id__"' : '';
  const cancel = `<button type="button" class="btn btn-tertiary btn-neutral"${close}>Cancel</button>`;
  const ok = `<button type="button" class="btn"${close}>${esc(confirm)}</button>`;
  const lead = {
    'Icon + Text': [`<button type="button" class="modal-lead">${plainIcon('copy-04-line')}<span>Copy link</span></button>`],
    'Link Button': ['<button type="button" class="modal-link">Learn more</button>'],
    Indicator: ['<span class="modal-dots" aria-label="Step 1 of 3"><i aria-current="step"></i><i></i><i></i></span>'],
    Checkbox: ['<label class="choice"><input type="checkbox" class="checkbox" /><span>Don’t show this again</span></label>'],
  }[type as string] ?? [];
  const klass = cls('modal-footer', type === 'Horizontal' && 'modal-footer-fill', type === 'Vertical' && 'modal-footer-stack');
  return [`<div class="${klass}">`, ...lead.map((l) => '  ' + l), '  <div class="modal-actions">', `    ${cancel}`, `    ${ok}`, '  </div>', '</div>'].join('\n');
}

function modalMarkup(o: ModalOpts = {}, id = 'modal-rename', dialog = false) {
  const { header = 'Default', description = true, align = 'Left', close = true, footer = 'Default' } = o;
  const c = copy[header];
  const ic = modalIcon[header];
  const center = align === 'Center';
  const head = [
    `<div class="${cls('modal-header', center && 'modal-header-center')}">`,
    ...(ic ? [`  <span class="${cls('modal-icon', ic[0])}">${plainIcon(ic[1])}</span>`] : []),
    '  <div class="modal-titles">',
    `    <h2 class="modal-title" id="${id}-title">${esc(c.title)}</h2>`,
    ...(description ? [`    <p class="modal-desc">${esc(c.desc)}</p>`] : []),
    '  </div>',
    // the centered header has no close in the DS
    ...(close && !center ? [`  <button type="button" class="modal-close" aria-label="Close"${dialog ? ` command="close" commandfor="${id}"` : ''}>${plainIcon('x-close-line')}</button>`] : []),
    '</div>',
  ];
  const body = ['<div class="modal-body">', `  <p>${esc(c.body)}</p>`, '</div>'];
  const inner = [...head, ...body, modalFooter(footer, c.confirm, dialog).replaceAll('__id__', id)].join('\n');
  return dialog
    ? [`<dialog class="modal" id="${id}" aria-labelledby="${id}-title" closedby="any">`, indent(inner), '</dialog>'].join('\n')
    : [`<div class="modal" role="dialog" aria-labelledby="${id}-title">`, indent(inner), '</div>'].join('\n');
}

// a button that opens the dialog, command="show-modal" needs no script either
function modalTrigger(o: ModalOpts, id: string, label: string, btn = 'btn btn-tertiary btn-neutral') {
  return [`<button type="button" class="${btn}" command="show-modal" commandfor="${id}">${label}</button>`, modalMarkup(o, id, true)].join('\n');
}

export const modalCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['modal', 'Component', 'The 480 px card. On a dialog element it opens centered on overlay-slate'],
    ['modal-header', 'Part', 'An optional modal-icon, the modal-titles and a modal-close, over a soft divider'],
    ['modal-header-center', 'Modifier', 'Stacks the icon over centered text. The DS drops the close here'],
    ['modal-icon', 'Part', 'A 40 px icon box with an outline. Add modal-icon-error, -warning, -success or -info for a tinted status'],
    ['modal-titles', 'Part', 'The modal-title, Inter Medium 14/20, over the modal-desc, Inter Regular 12/16'],
    ['modal-close', 'Part', 'The 16 px close in the header'],
    ['modal-body', 'Part', 'The content, 16 / 20 px padding'],
    ['modal-footer', 'Part', 'Optional lead content on the left, modal-actions on the right'],
    ['modal-footer-fill', 'Modifier', 'Horizontal: the buttons share the width'],
    ['modal-footer-stack', 'Modifier', 'Vertical: full-width buttons, the main action on top'],
    ['modal-lead', 'Part', 'In the footer: an icon and a label, like Copy link'],
    ['modal-link', 'Part', 'In the footer: a link button'],
    ['modal-dots', 'Part', 'In the footer: step dots, aria-current="step" on the current one'],
    ['command="show-modal"', 'Attribute', 'On a button with commandfor="id" to open the dialog. command="close" closes it, closedby="any" lets Escape and the overlay close it too'],
  ],
  examples: [
    {
      id: 'ex-modal',
      title: 'Open a dialog',
      desc: 'A dialog with class modal opens on the overlay. The buttons close it with command, no script needed',
      html: modalTrigger({ header: 'Error' }, 'modal-delete', 'Delete files', 'btn btn-error'),
    },
    {
      id: 'ex-modal-headers',
      title: 'Headers',
      desc: 'Add a modal-icon for a status, or modal-header-center to stack it over the text',
      html: [modalMarkup({ header: 'Warning', footer: 'Checkbox' }, 'modal-leave'), modalMarkup({ header: 'Success', align: 'Center', footer: 'Vertical' }, 'modal-invite')].join('\n'),
      stack: true,
    },
    {
      id: 'ex-modal-footers',
      title: 'Footers',
      desc: 'Put a modal-lead, modal-link, modal-dots or a choice before the modal-actions',
      html: [modalMarkup({ header: 'Icon', footer: 'Icon + Text' }, 'modal-share'), modalMarkup({ header: 'Info', footer: 'Indicator', description: false }, 'modal-2fa')].join('\n'),
      stack: true,
    },
  ],
};

export function modalHtml(o: Required<ModalOpts>) {
  return modalMarkup(o, 'modal-dialog', true);
}

// popover

interface PopOpts { arrow?: Arrow | 'No'; size?: Size; header?: boolean; footer?: boolean; footerType?: PopFooter; icon?: boolean; description?: boolean; padding?: boolean; step?: number }

function popMarkup(o: PopOpts = {}, id = 'pop-tour', live = false) {
  const { arrow = 'Top Left', size = 'Medium', header = true, footer = true, footerType = 'Step', icon = true, description = true, padding = true, step = 0 } = o;
  const small = size === 'Small';
  const t = tour[Math.max(0, Math.min(tour.length - 1, step))];
  const last = step === tour.length - 1;
  const bs = small ? ' btn-sm' : '';
  const head = header ? [
    '<div class="popover-header">',
    ...(icon ? [`  <span class="popover-icon">${plainIcon('user-03-line')}</span>`] : []),
    '  <div class="popover-titles">',
    `    <h2 class="popover-title" id="${id}-title">${esc(t.title)}</h2>`,
    ...(description ? [`    <p class="popover-desc">${esc(t.desc)}</p>`] : []),
    '  </div>',
    `  <button type="button" class="popover-close" aria-label="Close"${live ? ` popovertarget="${id}" popovertargetaction="hide"` : ''}>${plainIcon('x-close-line')}</button>`,
    '</div>',
  ] : [];
  let foot: string[] = [];
  if (footer) {
    const back = step === 0 ? ' disabled' : '';
    if (footerType === 'Button Hug' || footerType === 'Button Fill') {
      foot = [
        `<div class="${cls('popover-footer', footerType === 'Button Fill' && 'popover-footer-fill')}">`,
        `  <button type="button" class="btn${bs} btn-tertiary btn-neutral"${back}>Back</button>`,
        `  <button type="button" class="btn${bs}">${last ? 'Done' : 'Next'}</button>`,
        '</div>',
      ];
    } else {
      const lead = footerType === 'Step'
        ? `<span class="popover-step">Step ${step + 1} of ${tour.length}</span>`
        : `<span class="popover-dots" aria-label="Step ${step + 1} of ${tour.length}">${tour.map((_, i) => `<i${i === step ? ' aria-current="step"' : ''}></i>`).join('')}</span>`;
      foot = [
        '<div class="popover-footer">',
        `  ${lead}`,
        `  <button type="button" class="btn${bs} btn-icon btn-tertiary btn-neutral" aria-label="Back"${back}>${plainIcon('arrow-narrow-left-line')}</button>`,
        `  <button type="button" class="btn${bs} btn-icon btn-tertiary btn-neutral" aria-label="${last ? 'Done' : 'Next'}">${plainIcon('arrow-right-line')}</button>`,
        '</div>',
      ];
    }
  }
  const body = [`<div class="${cls('popover-body', !padding && 'popover-flush')}">`, `  <p>${esc(t.body)}</p>`, '</div>'];
  const attrs = [`class="${cls('popover', small && 'popover-sm')}"`, live && 'popover', `id="${id}"`, arrow !== 'No' && `data-arrow="${slug(arrow)}"`, header ? `aria-labelledby="${id}-title"` : `aria-label="${esc(t.title)}"`].filter(Boolean).join(' ');
  return [`<div ${attrs}>`, ...[...head, ...body, ...foot].map((l) => '  ' + l), '</div>'].join('\n');
}

// a button and its popover. popovertarget opens it, a click outside or Escape closes it
function popTrigger(o: PopOpts, id: string, label: string) {
  return ['<span class="popover-trigger">', `  <button type="button" class="btn btn-tertiary btn-neutral" popovertarget="${id}">${label}</button>`, indent(popMarkup(o, id, true)), '</span>'].join('\n');
}

export const popoverCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['popover', 'Component', 'The 320 px card with Inter 14/20. Add the popover attribute to open it from a button'],
    ['popover-sm', 'Size', 'Small, 312 px with 12 px padding and smaller text'],
    ['popover-header', 'Part', 'An optional popover-icon, the popover-titles and a popover-close, over a soft divider'],
    ['popover-titles', 'Part', 'The popover-title, Inter Medium 16/24, over the popover-desc'],
    ['popover-close', 'Part', 'The 20 px ghost close. popovertargetaction="hide" closes the popover'],
    ['popover-body', 'Part', 'The content. Add popover-flush to drop the padding, for an image or a list'],
    ['popover-footer', 'Part', 'Buttons on the right. Add popover-footer-fill to share the width'],
    ['popover-step', 'Part', 'In the footer: Step 1 of 4 before the arrow buttons'],
    ['popover-dots', 'Part', 'In the footer: tour dots, aria-current="step" on the current one'],
    ['btn-icon', 'Modifier', 'A square icon-only btn, for the Back and Next arrows'],
    ['data-arrow', 'Attribute', 'top-left, top-center, top-right, bottom-…, left-top, left-center, left-bottom, right-…. Leave it off for no tail'],
    ['popover-trigger', 'Part', 'Wraps a button and a [popover]. The popover opens next to the button, on the side away from the tail'],
  ],
  examples: [
    {
      id: 'ex-popover',
      title: 'Open from a button',
      desc: 'popovertarget opens it, a click outside or Escape closes it. popover-trigger places it next to the button',
      html: popTrigger({ footerType: 'Button Hug' }, 'pop-invite', 'Invite people'),
      height: 280,
    },
    {
      id: 'ex-popover-tour',
      title: 'Tour footers',
      desc: 'popover-step or popover-dots before two btn-icon arrows walk people through a tour',
      html: [popMarkup({ arrow: 'Left Top', footerType: 'Step', step: 1 }, 'pop-step'), popMarkup({ arrow: 'Bottom Center', size: 'Small', footerType: 'Indicator', step: 2 }, 'pop-dots')].join('\n'),
    },
    {
      id: 'ex-popover-plain',
      title: 'Without header or footer',
      desc: 'Leave out the parts you don’t need. A popover always needs a name, aria-label works when there is no title',
      html: [popMarkup({ arrow: 'Top Center', size: 'Small', header: false, footer: false }, 'pop-plain'), popMarkup({ arrow: 'Right Center', size: 'Small', footerType: 'Button Fill', icon: false, description: false }, 'pop-fill')].join('\n'),
    },
  ],
};

export function popoverHtml(o: Required<PopOpts>) {
  return popTrigger(o, 'pop-tour', 'Take the tour');
}
