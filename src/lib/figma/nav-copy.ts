// copy specs for the breadcrumbs, tab menu, pagination and stepper pages, from the options the live previews render from.
// each set's shell comes from the DS composite, its items are swapped in from the base item sets
import type { CopySpec, Part } from './controls';
import { labels as crumbLabels, type Type as CrumbType } from '../../data/breadcrumbs';
import { labels as tabLabels, type Kind } from '../../data/tab-menu';
import { pageItems, pages, type Type as PgType, type Size as PgSize } from '../../data/pagination';
import { steps, stateOf, type Layout, type Indicator, type Size as StSize } from '../../data/stepper';

export const copyPage = { breadcrumbs: 'breadcrumbs', tabs: 'tab-menu', pagination: 'pagination', stepper: 'stepper' } as const;

const sepName: Record<CrumbType, string> = { Arrow: 'chevron-right-line', 'Double Arrow': 'chevron-right-double-line', Slash: 'slash-divider-line', Dot: 'Dot' };

export function breadcrumbsSpec(o: { type: CrumbType; count: number; rounded: boolean; icon: boolean; dropdown: boolean }): CopySpec {
  const shell = `Breadcrumbs / ${o.type} / 2 / ${o.rounded}`;
  const parts: Part[] = [];
  crumbLabels.slice(0, o.count).forEach((label, i) => {
    const current = i === o.count - 1;
    if (i) parts.push({ variant: `${shell} > ${sepName[o.type]}` });
    const hide = [...(i === 0 && o.icon ? [] : ['home-05-line']), ...(current && o.dropdown ? [] : ['chevron-down-line'])];
    parts.push({ variant: `Crumb / ${current ? 'Active' : 'Default'} / ${o.rounded}`, texts: { Home: label }, hide });
  });
  return { parts: [{ variant: shell, fill: [{ path: '', parts }] }] };
}

export function tabsSpec(o: { kind: Kind; count: number; active: number; rounded: boolean; style: string; list: string; icon: boolean; badge: boolean }): CopySpec {
  const items = tabLabels.slice(0, o.count);
  const off = (icon: string, chevron = true) => [...(o.icon ? [] : [icon]), ...(o.badge ? [] : ['Badge']), ...(chevron ? ['chevron-right-line'] : [])];
  const item = (i: number): Part => {
    const on = i === o.active;
    const badge = String(i + 2);
    if (o.kind === 'Line') return { variant: `Line-tab / ${on ? 'Active' : 'Default'}`, texts: { Preview: items[i], '99': badge }, hide: off('info-circle-line') };
    if (o.kind === 'Vertical') return { variant: `Vertical-tab / ${on ? 'Active' : 'Default'}`, texts: { Preview: items[i], '99': badge }, hide: off('info-circle-line') };
    const variant = o.kind === 'Segmented' ? `Segmented-tab / ${on} / ${o.rounded}` : `Pill-tab / ${o.style} / ${on} / ${o.rounded}`;
    return { variant, texts: { 'Tab-01': items[i], '99': badge }, hide: off('heart-rounded-line', false) };
  };
  const parts = items.map((_, i) => item(i));
  if (o.kind === 'Line') return { parts: [{ variant: 'Line-tabs / 01', fill: [{ path: '', parts }] }] };
  if (o.kind === 'Vertical') return { parts: [{ variant: `Tab-menu-vertical / ${o.list} / 2`, fill: [{ path: 'List', parts }] }] };
  return { parts: [{ variant: `${o.kind}-tabs / 2 / ${o.rounded}`, fill: [{ path: '', parts }] }] };
}

export function paginationSpec(o: { type: PgType; size: PgSize; page: number; items: number; perPage: number }): CopySpec {
  const total = pages(o);
  const page = Math.min(Math.max(1, o.page), total);
  const start = (page - 1) * o.perPage + 1;
  const end = Math.min(o.items, page * o.perPage);
  const action = (type: 'First' | 'Previous' | 'Next' | 'Last', disabled: boolean, texts?: Record<string, string>): Part => ({ variant: `Action / ${type} / false / ${o.size} / ${disabled}`, texts });
  const first = page === 1, last = page === total;
  const texts: Record<string, string> = {
    '10': String(o.perPage),
    'Showing 1-10 of 120 results': `Showing ${start}-${end} of ${o.items} results`,
    '1 to 5 of 50 results': `${start} to ${end} of ${o.items} results`,
  };
  const variant = `Page Number / ${o.type} / ${o.size}`;
  if (o.type === '03') {
    const prev = action('Previous', first, o.size === 'Large' ? { Previous: 'Prev' } : undefined);
    return { parts: [{ variant, texts, swap: [{ path: 'Action + Number', index: 0, part: prev }, { path: 'Action + Number', index: 1, part: action('Next', last) }] }] };
  }
  const nums = pageItems(page, total).map((p): Part => ({ variant: `Number / ${o.size} / ${p === page ? 'Select' : 'Default'}`, texts: { '1': p === null ? '...' : String(p) } }));
  return {
    parts: [{
      variant,
      texts,
      swap: [
        { path: 'Action + Number > Action#0', index: 0, part: action('First', first) },
        { path: 'Action + Number > Action#0', index: 1, part: action('Previous', first) },
        { path: 'Action + Number > Action#1', index: 0, part: action('Next', last) },
        { path: 'Action + Number > Action#1', index: 1, part: action('Last', last) },
      ],
      fill: [{ path: 'Action + Number > Number', parts: nums }],
    }],
  };
}

const gaps: Record<Layout, number> = { h01: 8, h02: 12, h03: 0, h04: 8, v01: 0, v02: 4 };
const badgeText = { Finish: 'Done', Active: 'In progress', Default: 'Pending' };

export function stepperSpec(o: { layout: Layout; type: Indicator; size: StSize; rounded: boolean; badge: boolean; current: number }): CopySpec {
  const vertical = o.layout.startsWith('v');
  const set = vertical ? 'Stepper-vertical' : 'Stepper-horizontal';
  const parts = steps.map((s, i): Part => {
    const state = stateOf(i, o.current);
    const lastStep = i === steps.length - 1;
    const hide = o.badge ? [] : ['Badge'];
    if (lastStep && (o.layout === 'h01' || o.layout === 'v01')) hide.push('Step Variant + Bar Progress > Bar-progress');
    if (lastStep && o.layout === 'h02') hide.push('Bar-progress');
    if (o.layout === 'h03' && i === 0) hide.push('Step Variant + Bar Progress > Bar#0 > Bar-progress');
    if (o.layout === 'h03' && lastStep) hide.push('Step Variant + Bar Progress > Bar#1 > Bar-progress');
    const n = String(i + 1).padStart(2, '0');
    return {
      variant: `${set} / ${o.layout.slice(1)} / ${state} / ${o.size}`,
      texts: { 'Step-01': s.label, 'Stepper Name': s.name, Badge: badgeText[state] },
      hide,
      swap: [{ path: 'Step-variant', part: { variant: `Step-variant / ${state} / ${o.type} / ${o.size} / ${o.rounded}`, texts: { '01': n } } }],
    };
  });
  return { parts, wrap: { name: 'Stepper', dir: vertical ? 'VERTICAL' : 'HORIZONTAL', gap: gaps[o.layout] } };
}
