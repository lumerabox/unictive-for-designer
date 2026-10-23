// values read from the Pagination page of Unictive Design System 1.0: Number, Action, Rows-page and Page Number
export const types = ['01', '02', '03'] as const;
export const sizes = ['Large', 'Medium', 'Small'] as const;
export const perPageOptions = [10, 25, 50, 100];
export type Type = (typeof types)[number];
export type Size = (typeof sizes)[number];

export const typeName: Record<Type, string> = { '01': 'Rows per page', '02': 'Result count', '03': 'Previous and next' };
export const metrics = {
  Large: { h: 40, radius: 12, text: '18/24' },
  Medium: { h: 32, radius: 10, text: '16/24' },
  Small: { h: 24, radius: 8, text: '12/16' },
} as const;

// Page Number 9, Number 9, Action 36, Rows-page 6
export const variantCount = 9;
export const partCount = 51;

const chevron = {
  prev: 'M10 12L6 8L10 4',
  next: 'M6 12L10 8L6 4',
  first: 'M12 11.3333L8.66667 7.99996L12 4.66663M7.33333 11.3333L4 7.99996L7.33333 4.66663',
  last: 'M4 11.3333L7.33333 7.99996L4 4.66663M8.66667 11.3333L12 7.99996L8.66667 4.66663',
  down: 'M4 6L8 10L12 6',
};
const icon = (d: string) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// first, last and a window around the current page, with an ellipsis for each gap
export function pageItems(page: number, total: number): (number | null)[] {
  const keep = [...new Set([1, total, page - 1, page, page + 1])].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  keep.forEach((p, i) => {
    const prev = keep[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push(null);
    out.push(p);
  });
  return out;
}

export interface Opts {
  type?: Type;
  size?: Size;
  page?: number;
  items?: number;
  perPage?: number;
  open?: boolean;
  live?: boolean;
}

export function pages(o: Opts) {
  return Math.max(1, Math.ceil((o.items ?? 120) / (o.perPage ?? 10)));
}

export function render(o: Opts) {
  const { type = '01', size = 'Large', items = 120, perPage = 10, open = false, live = false } = o;
  const total = pages({ items, perPage });
  const page = Math.min(Math.max(1, o.page ?? 1), total);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(items, page * perPage);
  const act = (kind: 'first' | 'prev' | 'next' | 'last', to: number, off: boolean, text = '') =>
    `<button type="button" class="u-pg-act" data-act="${kind}" data-key="act-${kind}" data-page="${to}"${off ? ' disabled' : ''}${text ? '' : ` aria-label="${kind === 'first' ? 'First page' : 'Last page'}"`}>${kind === 'next' ? '' : kind === 'prev' ? icon(chevron.prev) : ''}${text ? `<span>${text}</span>` : icon(chevron[kind])}${kind === 'next' ? icon(chevron.next) : ''}</button>`;
  const prevText = type === '03' && size === 'Large' ? 'Prev' : 'Previous';
  const prev = act('prev', page - 1, page === 1, prevText);
  const next = act('next', page + 1, page === total, 'Next');
  let right: string;
  if (type === '03') right = `<div class="u-pg-group u-pg-pn">${prev}${next}</div>`;
  else {
    const nums = pageItems(page, total).map((p) =>
      p === null
        ? '<span class="u-pg-num" data-gap aria-hidden="true">...</span>'
        : `<button type="button" class="u-pg-num" data-page="${p}" data-key="num-${p}"${p === page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`,
    );
    right = `<div class="u-pg-group"><div class="u-pg-acts">${act('first', 1, page === 1)}${prev}</div><div class="u-pg-acts">${nums.join('')}</div><div class="u-pg-acts">${next}${act('last', total, page === total)}</div></div>`;
  }
  let left: string;
  if (type === '01') {
    const opts = perPageOptions.map((n) => `<li role="option" aria-selected="${n === perPage}" data-per="${n}" data-key="per-${n}" tabindex="-1">${n}</li>`).join('');
    left = `<div class="u-pg-rows"><span>Rows per page</span><div class="u-pg-select"><button type="button" class="u-pg-trigger" aria-haspopup="listbox" aria-expanded="${open}" aria-label="Rows per page, ${perPage}" data-key="rows">${perPage}${icon(open ? 'M12 10L8 6L4 10' : chevron.down)}</button>${open ? `<ul class="u-pg-menu" role="listbox">${opts}</ul>` : ''}</div></div>`;
  } else left = `<p class="u-pg-info">${type === '02' ? `Showing ${start}-${end} of ${items} results` : `${start} to ${end} of ${items} results`}</p>`;
  const data = live ? ` data-live data-c="pagination" data-opts='${JSON.stringify({ type, size, page, items, perPage, open })}'` : '';
  return `<nav class="u-pg" data-type="${type}" data-size="${size.toLowerCase()}" aria-label="Pagination"${data}>${left}${right}</nav>`;
}

export const chip = (o: { type: Type; size: Size }) => `Page Number · Type=${o.type} · Size=${o.size}`;

// one Number or Action part on its own, for the states tiles
export function part(kind: 'num' | 'act', state: 'default' | 'hover' | 'select' | 'disable', size: Size = 'Large') {
  const s = state === 'default' ? '' : ` data-state="${state}"`;
  const inner = kind === 'num' ? '1' : `<span>Next</span>${icon(chevron.next)}`;
  return `<span class="u-pg" data-size="${size.toLowerCase()}"><span class="u-pg-${kind}"${s}>${inner}</span></span>`;
}
