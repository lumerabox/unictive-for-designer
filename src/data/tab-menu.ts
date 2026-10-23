// values read from the Tab Menu page of Unictive Design System 1.0:
// Line-tabs, Segmented-tabs, Pill-tabs and Tab-menu-vertical, each built from its own Base-item set
export const kinds = ['Line', 'Segmented', 'Pill', 'Vertical'] as const;
export const pillStyles = ['Filled', 'Stroke'] as const;
export const listTypes = ['Card', 'List'] as const;
export type Kind = (typeof kinds)[number];

// most tabs a set offers: Line-tabs Quantity 01–05 is 2–6 tabs, the others Count 2–5
export const maxCount: Record<Kind, number> = { Line: 6, Segmented: 5, Pill: 5, Vertical: 5 };
export const setName: Record<Kind, string> = { Line: 'Line-tabs', Segmented: 'Segmented-tabs', Pill: 'Pill-tabs', Vertical: 'Tab-menu-vertical' };

// composite sets 5 + 8 + 8 + 8, base items 3 + 4 + 8 + 3
export const variantCount = 29;
export const baseCount = 18;

export const labels = ['Overview', 'Activity', 'Members', 'Billing', 'Settings', 'Logs'];

const info = '<svg class="u-tab-icon" data-for="line" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 13.3333V10M10 6.66667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const heart = '<svg class="u-tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10.7407 2C13.0889 2 14.6667 4.235 14.6667 6.32C14.6667 10.5425 8.11852 14 8 14C7.88148 14 1.33334 10.5425 1.33334 6.32C1.33334 4.235 2.91111 2 5.25926 2C6.60741 2 7.48889 2.6825 8 3.2825C8.51111 2.6825 9.39259 2 10.7407 2Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export interface Opts {
  kind?: Kind;
  count?: number;
  active?: number;
  rounded?: boolean;
  style?: (typeof pillStyles)[number];
  list?: (typeof listTypes)[number];
  icon?: boolean;
  badge?: boolean;
  title?: string;
  labels?: string[];
  force?: Record<number, 'hover'>;
  live?: boolean;
}

export function render(o: Opts) {
  const { kind = 'Line', active = 0, rounded = true, style = 'Filled', list = 'Card', icon = false, badge = false, title = 'Menu', labels: ls = labels, force = {}, live = false } = o;
  const count = Math.min(o.count ?? 3, maxCount[kind]);
  const vertical = kind === 'Vertical';
  const svg = kind === 'Line' || vertical ? info : heart;
  const tabs = ls.slice(0, count).map((t, i) => {
    const on = i === active;
    const state = force[i] ? ` data-state="${force[i]}"` : '';
    return `<button type="button" class="u-tab" role="tab" aria-selected="${on}" tabindex="${on ? 0 : -1}"${state} data-key="tab-${i}">${icon ? svg : ''}<span class="u-tab-text">${t}</span>${badge ? `<span class="u-tab-badge">${i + 2}</span>` : ''}</button>`;
  });
  const data = live ? ` data-live data-c="tabs" data-opts='${JSON.stringify({ kind, count, active, rounded, style, list, icon, badge })}'` : '';
  const head = vertical ? `<p class="u-tabs-title">${title}</p>` : '';
  return `<div class="u-tabs" data-kind="${kind.toLowerCase()}" data-rounded="${rounded}" data-style="${style.toLowerCase()}" data-list="${list.toLowerCase()}"${data}>${head}<div class="u-tabs-list" role="tablist" aria-label="${vertical ? title : 'Sections'}"${vertical ? ' aria-orientation="vertical"' : ''}>${tabs.join('')}</div></div>`;
}

export function chip(o: Required<Pick<Opts, 'kind' | 'count' | 'rounded' | 'style' | 'list'>>) {
  const k = o.kind;
  if (k === 'Line') return `Line-tabs · Quantity=0${o.count - 1}`;
  if (k === 'Vertical') return `Tab-menu-vertical · Type=${o.list} · Count=${o.count}`;
  return `${setName[k]} · Count=${o.count} · Rounded=${o.rounded}${k === 'Pill' ? ` · Style=${o.style}` : ''}`;
}
