// values read from the Modal page of Unictive Design System 1.0: Modal-header, Modal-footer, Modal and Overlay
import { icon, btn, esc, slug, type IconName } from './markup';

export const headers = ['Default', 'Icon', 'Error', 'Warning', 'Success', 'Info'] as const;
export const aligns = ['Left', 'Center'] as const;
export const footers = ['Default', 'Icon + Text', 'Link Button', 'Indicator', 'Checkbox', 'Horizontal', 'Vertical'] as const;
export type Header = (typeof headers)[number];
export type Align = (typeof aligns)[number];
export type Footer = (typeof footers)[number];

// Modal-header 24, Modal-footer 7, Modal 1, Overlay 1
export const variantCount = 33;

const headIcon: Partial<Record<Header, [IconName, string]>> = {
  Error: ['alert-circle-solid', 'error'],
  Warning: ['alert-triangle-solid', 'warning'],
  Success: ['check-circle-solid', 'success'],
  Info: ['info-circle-solid', 'info'],
};

// sample content per header type, so every example reads like a real dialog
export const copy: Record<Header, { title: string; desc: string; body: string; confirm: string }> = {
  Default: { title: 'Rename project', desc: 'The new name shows up for everyone on the team', body: 'Project names can be up to 40 characters. Links to the old name keep working.', confirm: 'Rename' },
  Icon: { title: 'Share an update', desc: 'Post a short note to the project feed', body: 'Updates are visible to every member and can be edited for 15 minutes after posting.', confirm: 'Post' },
  Error: { title: 'Delete 3 files?', desc: 'This can’t be undone', body: 'The files are removed for everyone, including shared links and earlier versions.', confirm: 'Delete' },
  Warning: { title: 'Leave without saving?', desc: 'You have unsaved changes', body: 'Your edits to “Q3 report” will be lost if you leave now.', confirm: 'Leave' },
  Success: { title: 'Invite sent', desc: 'We emailed dimas@unictive.com', body: 'They’ll get access as soon as they accept. You can resend the invite from Members.', confirm: 'Done' },
  Info: { title: 'Two-step sign-in', desc: 'Keep your account safe', body: 'Each sign-in from a new device asks for a code from your authenticator app.', confirm: 'Turn on' },
};

export interface Opts {
  header?: Header;
  description?: boolean;
  align?: Align;
  close?: boolean;
  footer?: Footer;
  body?: string;
  id?: string;
}

export function head(o: Opts) {
  const { header = 'Default', description = true, align = 'Left', close = true } = o;
  const c = copy[header];
  const st = headIcon[header];
  const box = header === 'Icon'
    ? `<span class="u-modal-icon" data-kind="outline">${icon('announcement-01-line', 20)}</span>`
    : st ? `<span class="u-modal-icon" data-status="${st[1]}">${icon(st[0], 20)}</span>` : '';
  const titles = `<span class="u-modal-titles"><span class="u-modal-title"${o.id ? ` id="${o.id}-title"` : ''}>${esc(c.title)}</span>${description ? `<span class="u-modal-desc">${esc(c.desc)}</span>` : ''}</span>`;
  // the centered header has no close in the DS
  const x = close && align === 'Left' ? `<button type="button" class="u-modal-close" aria-label="Close" data-modal-close>${icon('x-close-line', 16)}</button>` : '';
  return `<div class="u-modal-head" data-align="${slug(align)}">${box}${titles}${x}</div>`;
}

export function foot(type: Footer = 'Default', confirm = 'Confirm') {
  const cancel = btn('Cancel', { style: 'Tertiary', type: 'Neutral', attrs: 'data-modal-close' });
  const ok = btn(confirm, { attrs: 'data-modal-confirm' });
  let lead = '';
  if (type === 'Icon + Text') lead = `<button type="button" class="u-modal-lead">${icon('copy-04-line', 20)}<span>Copy link</span></button>`;
  if (type === 'Link Button') lead = '<button type="button" class="u-link u-modal-linkbtn" data-u>Learn more</button>';
  if (type === 'Indicator') lead = '<span class="u-modal-dots" aria-label="Step 1 of 3"><i data-on></i><i></i><i></i></span>';
  if (type === 'Checkbox') lead = '<label class="u-modal-check"><input type="checkbox" /><span>Don’t show this again</span></label>';
  const actions = type === 'Vertical' ? `${ok}${cancel}` : `${cancel}${ok}`;
  return `<div class="u-modal-foot" data-type="${slug(type)}">${lead}<span class="u-modal-actions">${actions}</span></div>`;
}

export function render(o: Opts) {
  const { header = 'Default', footer = 'Default' } = o;
  const c = copy[header];
  const label = o.id ? ` aria-labelledby="${o.id}-title"` : '';
  return `<div class="u-modal" role="dialog" aria-modal="true"${label}>${head(o)}<div class="u-modal-body">${o.body ?? `<p>${esc(c.body)}</p>`}</div>${foot(footer, c.confirm)}</div>`;
}

export const chip = (o: { header: Header; description: boolean; align: Align; footer: Footer }) =>
  `Modal · Header=${o.header} · Description=${o.description} · Align=${o.align} · Footer=${o.footer}`;
