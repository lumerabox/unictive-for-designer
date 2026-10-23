// values read from the Breadcrumbs and Base Items component sets in Unictive Design System 1.0
export const types = ['Arrow', 'Double Arrow', 'Slash', 'Dot'] as const;
export const counts = ['2', '3', '4', '5'] as const;
export type Type = (typeof types)[number];

// Type × Count × Rounded, plus the 6 Base Items (State × Stroke)
export const variantCount = types.length * counts.length * 2;
export const baseCount = 6;

export const labels = ['Home', 'Projects', 'Unictive DS', 'Components', 'Breadcrumbs'];

// separator icons, 12 px (slash 16 px), icon/soft-400
const sep: Record<Type, string> = {
  Arrow: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Double Arrow': '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 8.5L5.5 6L3 3.5M6.5 8.5L9 6L6.5 3.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  Slash: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.66667 14.6667L11.3333 1.33337" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  Dot: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="1.5" fill="currentColor"/></svg>',
};
const home = '<svg class="u-crumb-home" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8.65487 1.84267C8.42065 1.6605 8.30354 1.56941 8.17423 1.5344C8.06013 1.50351 7.93987 1.50351 7.82577 1.5344C7.69646 1.56941 7.57935 1.6605 7.34513 1.84267L2.82359 5.35942C2.52135 5.5945 2.37022 5.71204 2.26135 5.85924C2.16491 5.98963 2.09307 6.13652 2.04935 6.2927C2 6.46901 2 6.66046 2 7.04337V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14H5.46667C5.65335 14 5.74669 14 5.818 13.9637C5.88072 13.9317 5.93171 13.8807 5.96367 13.818C6 13.7467 6 13.6533 6 13.4667V9.06666C6 8.69329 6 8.5066 6.07266 8.364C6.13658 8.23855 6.23857 8.13657 6.36401 8.07265C6.50661 7.99999 6.6933 7.99999 7.06667 7.99999H8.93333C9.3067 7.99999 9.49339 7.99999 9.63599 8.07265C9.76144 8.13657 9.86342 8.23855 9.92734 8.364C10 8.5066 10 8.69329 10 9.06666V13.4667C10 13.6533 10 13.7467 10.0363 13.818C10.0683 13.8807 10.1193 13.9317 10.182 13.9637C10.2533 14 10.3466 14 10.5333 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V7.04337C14 6.66046 14 6.46901 13.9506 6.2927C13.9069 6.13652 13.8351 5.98963 13.7386 5.85924C13.6298 5.71204 13.4787 5.5945 13.1764 5.35942L8.65487 1.84267Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const down = '<svg class="u-crumb-down" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export interface Opts {
  type?: Type;
  count?: number;
  rounded?: boolean;
  icon?: boolean;
  dropdown?: boolean;
  labels?: string[];
  // false leaves the last item as a parent, for the states tiles
  current?: boolean;
  // force a state on item i, for the states tiles
  force?: Record<number, 'hover'>;
  live?: boolean;
}

export function render(o: Opts) {
  const { type = 'Arrow', count = 3, rounded = false, icon = false, dropdown = false, labels: ls = labels, force = {}, live = false } = o;
  const items = ls.slice(0, count).map((t, i) => {
    const current = i === count - 1 && o.current !== false;
    const parts = `${i === 0 && icon ? home : ''}<span>${t}</span>${current && dropdown ? down : ''}`;
    const item = `<a class="u-crumb" href="#"${current ? ' aria-current="page"' : ''}${force[i] ? ` data-state="${force[i]}"` : ''} data-key="crumb-${i}">${parts}</a>`;
    return `<li>${i > 0 ? `<span class="u-crumbs-sep" aria-hidden="true">${sep[type]}</span>` : ''}${item}</li>`;
  });
  const data = live ? ` data-live data-c="breadcrumbs" data-opts='${JSON.stringify({ type, count, rounded, icon, dropdown })}'` : '';
  return `<nav class="u-crumbs" data-rounded="${rounded}" aria-label="Breadcrumb"${data}><ol>${items.join('')}</ol></nav>`;
}

export const chip = (o: Required<Pick<Opts, 'type' | 'count' | 'rounded'>>) => `Breadcrumbs · Type=${o.type} · Count=${o.count} · Rounded=${o.rounded}`;
