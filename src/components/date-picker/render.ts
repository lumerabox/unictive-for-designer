// date rows as an html string, shared by the server render and the playground script
import { monthGrid, keyOf, today as t } from '../../data/date-picker';

export interface Marks {
  start?: number | null;
  end?: number | null;
  hover?: number | null;
  today?: number | null;
  live?: boolean;
}

export const todayKey = keyOf(t.y, t.m, t.d);

export function rowsHTML(y: number, m: number, { start = null, end = null, hover = null, today = todayKey, live = false }: Marks = {}) {
  const lo = start && end ? Math.min(start, end) : null;
  const hi = start && end ? Math.max(start, end) : null;
  const tag = live ? 'button' : 'span';
  return monthGrid(y, m)
    .map((row) => {
      const cells = row.map((c) => {
        const sel = !c.off && (c.key === start || c.key === end);
        const state = c.off ? 'off' : sel ? 'select' : c.key === today ? 'today' : c.key === hover ? 'hover' : 'default';
        let band = '';
        if (lo && hi && lo !== hi && !c.off && c.key >= lo && c.key <= hi) band = c.key === lo ? 'start' : c.key === hi ? 'end' : 'in';
        const attrs = live ? ` type="button" data-key="${c.key}"${c.off ? ' tabindex="-1"' : ''} aria-pressed="${sel}"` : '';
        return `<${tag} class="u-cal-cell" data-state="${state}"${band ? ` data-band="${band}"` : ''}${attrs}><span>${c.d}</span></${tag}>`;
      });
      return `<div class="u-cal-row">${cells.join('')}</div>`;
    })
    .join('');
}
