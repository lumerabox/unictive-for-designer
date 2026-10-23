// values read from the Alert component set in Unictive Design System 1.0
import { icon, statusIcon, statuses, esc, slug, type Status } from './markup';

export { statuses };
export const sizes = ['Small', 'Medium', 'Large'] as const;
export const styles = ['Filled', 'Light', 'Stroke'] as const;
export type Size = (typeof sizes)[number];
export type Style = (typeof styles)[number];

// Size × Status × Style
export const variantCount = sizes.length * statuses.length * styles.length;

export const copy: Record<Status, { title: string; desc: string; action: string }> = {
  Error: { title: 'Payment failed', desc: 'Your card was declined. Check the details or use another card.', action: 'Try again' },
  Warning: { title: 'Storage almost full', desc: 'You’ve used 92% of your space. Free some up to keep uploading.', action: 'Manage' },
  Success: { title: 'Changes saved', desc: 'Your profile is up to date and visible to your team.', action: 'View' },
  Info: { title: 'New sign-in from Jakarta', desc: 'If this was you, there’s nothing to do. If not, secure your account.', action: 'Review' },
  Feature: { title: 'Smart filters are here', desc: 'Save any search as a filter and reuse it from the sidebar.', action: 'Try it' },
};

export interface Opts {
  size?: Size;
  status?: Status;
  style?: Style;
  icon?: boolean;
  close?: boolean;
  action?: boolean;
  second?: boolean;
  title?: string;
  desc?: string;
  live?: boolean;
}

export function render(o: Opts) {
  const { size = 'Large', status = 'Info', style = 'Light', close = true, action = true, second = true, live = false } = o;
  const c = copy[status];
  const title = esc(o.title ?? c.title);
  const large = size === 'Large';
  const is = size === 'Small' ? 16 : 20;
  const lead = o.icon === false ? '' : `<span class="u-alert-icon">${icon(statusIcon[status], is)}</span>`;
  const links = action
    ? `<span class="u-alert-actions"><button type="button" class="u-link" data-u>${esc(c.action)}</button>${large && second ? '<button type="button" class="u-link">Learn more</button>' : ''}</span>`
    : '';
  const body = large
    ? `<span class="u-alert-body"><span class="u-alert-text"><span class="u-alert-title">${title}</span><span class="u-alert-desc">${esc(o.desc ?? c.desc)}</span></span>${links}</span>`
    : `<span class="u-alert-body"><span class="u-alert-title">${title}</span>${links}</span>`;
  const x = close ? `<button type="button" class="u-x u-alert-close" aria-label="Dismiss" data-dismiss>${icon('x-close-line', is)}</button>` : '';
  const role = status === 'Error' || status === 'Warning' ? 'alert' : 'status';
  const data = live ? ` data-live data-c="alert" data-opts='${esc(JSON.stringify({ size, status, style, icon: o.icon !== false, close, action, second }))}'` : '';
  return `<div class="u-alert" role="${role}" data-size="${slug(size)}" data-status="${slug(status)}" data-style="${slug(style)}"${data}>${lead}${body}${x}</div>`;
}

export const chip = (o: { size: Size; status: Status; style: Style }) => `Alert · Size=${o.size} · Status=${o.status} · Style=${o.style}`;
