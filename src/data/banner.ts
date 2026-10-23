// values read from the Banner component set in Unictive Design System 1.0
import { icon, statusIcon, statuses, esc, slug, type Status } from './markup';

export { statuses };
export const types = ['Filled', 'Light', 'Stroke'] as const;
export const aligns = ['Center', 'Left'] as const;
export type Type = (typeof types)[number];
export type Align = (typeof aligns)[number];

// Type × Status × Align
export const variantCount = types.length * statuses.length * aligns.length;

export const copy: Record<Status, { title: string; desc: string; action: string }> = {
  Error: { title: 'Service disruption', desc: 'Payments may fail until 14:00 WIB', action: 'Status page' },
  Warning: { title: 'Trial ends in 3 days', desc: 'Pick a plan to keep your projects', action: 'See plans' },
  Success: { title: 'You’re back online', desc: 'Everything is synced', action: 'Dismiss' },
  Info: { title: 'Scheduled maintenance', desc: 'Sunday 02:00–04:00 WIB', action: 'Learn more' },
  Feature: { title: 'New: dark mode', desc: 'Switch it on in Settings', action: 'Try it' },
};

export interface Opts {
  type?: Type;
  status?: Status;
  align?: Align;
  description?: boolean;
  button?: boolean;
  title?: string;
  live?: boolean;
}

export function render(o: Opts) {
  const { type = 'Light', status = 'Info', align = 'Center', description = true, button = true, live = false } = o;
  const c = copy[status];
  const info = `<span class="u-banner-info"><span class="u-banner-title">${esc(o.title ?? c.title)}</span>${description ? `<i class="u-banner-dot" aria-hidden="true"></i><span class="u-banner-desc">${esc(c.desc)}</span>` : ''}</span>`;
  const link = button ? `<button type="button" class="u-link u-banner-link">${esc(c.action)}</button>` : '';
  const data = live ? ` data-live data-c="banner" data-opts='${esc(JSON.stringify({ type, status, align, description, button }))}'` : '';
  return `<div class="u-banner" role="${status === 'Error' ? 'alert' : 'status'}" data-type="${slug(type)}" data-status="${slug(status)}" data-align="${slug(align)}"${data}><span class="u-banner-item"><span class="u-banner-icon">${icon(statusIcon[status], 16)}</span>${info}${link}</span><button type="button" class="u-x u-banner-close" aria-label="Dismiss" data-dismiss>${icon('x-close-line', 20)}</button></div>`;
}

export const chip = (o: { type: Type; status: Status; align: Align }) => `Banner · Type=${o.type} · Status=${o.status} · Align=${o.align}`;
