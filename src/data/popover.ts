// values read from the Popover page of Unictive Design System 1.0: Popover-header, Popover-footer and Popover
import { icon, btn, iconBtn, esc, slug } from './markup';

export const arrows = ['Top Left', 'Top Center', 'Top Right', 'Bottom Left', 'Bottom Center', 'Bottom Right', 'Left Top', 'Left Center', 'Left Bottom', 'Right Top', 'Right Center', 'Right Bottom'] as const;
export const sizes = ['Medium', 'Small'] as const;
export const footers = ['Button Hug', 'Button Fill', 'Step', 'Indicator'] as const;
export type Arrow = (typeof arrows)[number];
export type Size = (typeof sizes)[number];
export type Footer = (typeof footers)[number];

// Popover 48, Popover-header 2, Popover-footer 8
export const variantCount = 58;

// a four step product tour, the Step and Indicator footers walk through it
export const tour = [
  { title: 'Invite your team', desc: 'Work on files together', body: 'Add people by email. They get edit access to this project only.' },
  { title: 'Comment anywhere', desc: 'Leave feedback in context', body: 'Press C and click on the canvas to drop a comment. Mention someone with @.' },
  { title: 'Share a link', desc: 'Send a view-only copy', body: 'Links open without an account. Turn them off at any time in Share settings.' },
  { title: 'Track versions', desc: 'Nothing gets lost', body: 'Every save is kept for 30 days. Restore any version from the history panel.' },
];

export interface Opts {
  arrow?: Arrow | 'No';
  size?: Size;
  header?: boolean;
  footer?: boolean;
  footerType?: Footer;
  icon?: boolean;
  description?: boolean;
  padding?: boolean;
  step?: number;
  body?: string;
  live?: boolean;
}

export function render(o: Opts) {
  const { arrow = 'Top Left', size = 'Medium', header = true, footer = true, footerType = 'Step', description = true, padding = true, step = 0, live = false } = o;
  const small = size === 'Small';
  const t = tour[Math.max(0, Math.min(tour.length - 1, step))];
  const lead = o.icon === false ? '' : iconBtn('user-03-line', 'Team', small ? { size: 28, icon: 16 } : {});
  const x = iconBtn('x-close-line', 'Close', { size: 20, icon: 16, kind: 'ghost', attrs: 'data-pop-close' });
  const head = header
    ? `<div class="u-pop-head">${lead}<span class="u-pop-titles"><span class="u-pop-title">${esc(t.title)}</span>${description ? `<span class="u-pop-desc">${esc(t.desc)}</span>` : ''}</span>${x}</div>`
    : '';
  const bs = small ? 'Small' : 'Medium';
  let foot = '';
  if (footer) {
    if (footerType === 'Button Hug' || footerType === 'Button Fill') {
      foot = `${btn('Back', { size: bs, style: 'Tertiary', type: 'Neutral', attrs: `data-pop-step="-1"${step === 0 ? ' disabled' : ''}` })}${btn(step === tour.length - 1 ? 'Done' : 'Next', { size: bs, attrs: 'data-pop-step="1"' })}`;
    } else {
      const s = small ? { size: 28, icon: 16 } : {};
      const left = footerType === 'Step'
        ? `<span class="u-pop-step">Step ${step + 1} of ${tour.length}</span>`
        : `<span class="u-pop-dots" aria-label="Step ${step + 1} of ${tour.length}">${tour.map((_, i) => `<i${i === step ? ' data-on' : ''}></i>`).join('')}</span>`;
      foot = `${left}${iconBtn('arrow-narrow-left-line', 'Back', { ...s, disabled: step === 0, attrs: 'data-pop-step="-1"' })}${iconBtn('arrow-right-line', step === tour.length - 1 ? 'Done' : 'Next', { ...s, attrs: 'data-pop-step="1"' })}`;
    }
    foot = `<div class="u-pop-foot" data-type="${slug(footerType)}">${foot}</div>`;
  }
  const tail = arrow === 'No' ? '' : '<i class="u-tail" aria-hidden="true"></i>';
  const data = live ? ` data-live data-c="popover" data-opts='${esc(JSON.stringify({ arrow, size, header, footer, footerType, icon: o.icon !== false, description, padding, step }))}'` : '';
  return `<div class="u-pop u-float" role="dialog" aria-label="${esc(t.title)}" data-arrow="${slug(arrow)}" data-size="${slug(size)}"${data}>${tail}<div class="u-pop-content">${head}<div class="u-pop-slot" data-padding="${padding}">${o.body ?? `<p>${esc(t.body)}</p>`}</div>${foot}</div></div>`;
}

export const chip = (o: { arrow: string; size: Size; padding: boolean }) => `Popover · Arrow=${o.arrow} · Size=${o.size} · Slot Padding=${o.padding}`;
