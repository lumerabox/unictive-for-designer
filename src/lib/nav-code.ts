// code for developers: breadcrumb, tabs, pagination and stepper classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { pageItems } from '../data/pagination';
import type * as Bc from '../data/breadcrumbs';
import type * as Tm from '../data/tab-menu';
import type * as Pg from '../data/pagination';
import type * as St from '../data/stepper';
import { labels as crumbLabels } from '../data/breadcrumbs';
import { labels as tabLabels } from '../data/tab-menu';
import { steps as stepList } from '../data/stepper';

const indent = (html: string, n = 1) => html.split('\n').map((l) => '  '.repeat(n) + l).join('\n');
const icons = {
  home: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8.65487 1.84267C8.42065 1.6605 8.30354 1.56941 8.17423 1.5344C8.06013 1.50351 7.93987 1.50351 7.82577 1.5344C7.69646 1.56941 7.57935 1.6605 7.34513 1.84267L2.82359 5.35942C2.52135 5.5945 2.37022 5.71204 2.26135 5.85924C2.16491 5.98963 2.09307 6.13652 2.04935 6.2927C2 6.46901 2 6.66046 2 7.04337V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14H5.46667C5.65335 14 5.74669 14 5.818 13.9637C5.88072 13.9317 5.93171 13.8807 5.96367 13.818C6 13.7467 6 13.6533 6 13.4667V9.06666C6 8.69329 6 8.5066 6.07266 8.364C6.13658 8.23855 6.23857 8.13657 6.36401 8.07265C6.50661 7.99999 6.6933 7.99999 7.06667 7.99999H8.93333C9.3067 7.99999 9.49339 7.99999 9.63599 8.07265C9.76144 8.13657 9.86342 8.23855 9.92734 8.364C10 8.5066 10 8.69329 10 9.06666V13.4667C10 13.6533 10 13.7467 10.0363 13.818C10.0683 13.8807 10.1193 13.9317 10.182 13.9637C10.2533 14 10.3466 14 10.5333 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V7.04337C14 6.66046 14 6.46901 13.9506 6.2927C13.9069 6.13652 13.8351 5.98963 13.7386 5.85924C13.6298 5.71204 13.4787 5.5945 13.1764 5.35942L8.65487 1.84267Z"/></svg>',
  down: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>',
  info: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13.3333V10M10 6.66667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z"/></svg>',
  heart: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.7407 2C13.0889 2 14.6667 4.235 14.6667 6.32C14.6667 10.5425 8.11852 14 8 14C7.88148 14 1.33334 10.5425 1.33334 6.32C1.33334 4.235 2.91111 2 5.25926 2C6.60741 2 7.48889 2.6825 8 3.2825C8.51111 2.6825 9.39259 2 10.7407 2Z"/></svg>',
  prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 12L6 8l4-4"/></svg>',
  next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12l4-4-4-4"/></svg>',
  first: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12 11.33L8.67 8 12 4.67M7.33 11.33L4 8l3.33-3.33"/></svg>',
  last: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 11.33L7.33 8 4 4.67m4.67 6.66L12 8 8.67 4.67"/></svg>',
};

// breadcrumb

function crumbs(labels: string[], o: { cls?: string; home?: boolean; menu?: boolean } = {}) {
  const items = labels.map((t, i) => {
    const last = i === labels.length - 1;
    const lead = i === 0 && o.home ? icons.home : '';
    if (!last) return `  <li><a class="breadcrumb-item" href="#">${lead}${t}</a></li>`;
    return `  <li><a class="breadcrumb-item" href="#" aria-current="page">${lead}${t}${o.menu ? icons.down : ''}</a></li>`;
  });
  return [`<nav class="breadcrumb${o.cls ? ' ' + o.cls : ''}" aria-label="Breadcrumb">`, '  <ol>', ...items.map((l) => '  ' + l), '  </ol>', '</nav>'].join('\n');
}

export const breadcrumbCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['breadcrumb', 'Component', 'The nav around an ol. Arrow separators, 12 px between items, Inter 14/20'],
    ['breadcrumb-double', 'Separator', 'Double arrow separators, for dense headers'],
    ['breadcrumb-slash', 'Separator', 'Slash separators, 16 px'],
    ['breadcrumb-dot', 'Separator', 'Dot separators, for short trails in cards and panels'],
    ['breadcrumb-rounded', 'Style', 'Each crumb in a 28 px pill with a stroke/soft-200 outline'],
    ['breadcrumb-item', 'Part', 'One link. text/sub-600, darkens on hover. A leading svg sits 6 px from the text'],
    ['aria-current="page"', 'Attribute', 'On the last item: brand color and Medium weight. Brand outline when rounded'],
  ],
  examples: [
    {
      id: 'ex-breadcrumb',
      title: 'Breadcrumb',
      desc: 'An ol of links inside a nav with an aria-label. The separators are drawn by the css, so the list holds only the links',
      html: crumbs(['Home', 'Projects', 'Unictive DS', 'Breadcrumbs'], { home: true }),
    },
    {
      id: 'ex-breadcrumb-separators',
      title: 'Separators',
      desc: 'Add breadcrumb-double, breadcrumb-slash or breadcrumb-dot to the nav. Keep one separator across a product',
      html: ['breadcrumb-double', 'breadcrumb-slash', 'breadcrumb-dot'].map((c) => crumbs(['Home', 'Orders', 'INV-2041'], { cls: c })).join('\n'),
      stack: true,
    },
    {
      id: 'ex-breadcrumb-rounded',
      title: 'Rounded',
      desc: 'breadcrumb-rounded wraps each crumb in a pill, for toolbars where the trail should read as buttons',
      html: crumbs(['Home', 'Projects', 'Unictive DS'], { cls: 'breadcrumb-rounded', home: true }),
    },
    {
      id: 'ex-breadcrumb-menu',
      title: 'Current page with a menu',
      desc: 'A chevron after the current page hints at a menu of sibling pages. Open it with the Dropdown menu',
      html: crumbs(['Home', 'Settings', 'Billing'], { home: true, menu: true }),
    },
  ],
};

// tabs

function tabList(labels: string[], o: { cls?: string; icon?: string; badges?: boolean; selected?: number; panels?: string; label?: string } = {}) {
  const { selected = 0 } = o;
  const vertical = o.cls?.includes('tabs-vertical');
  const tabs = labels.map((t, i) => {
    const on = i === selected;
    const ctrl = o.panels ? ` id="${o.panels}-tab-${i}" aria-controls="${o.panels}-${i}"` : '';
    const badge = o.badges ? `<span class="tab-badge">${i + 2}</span>` : '';
    return `  <button type="button" class="tab" role="tab" aria-selected="${on}"${on ? '' : ' tabindex="-1"'}${ctrl}>${o.icon ?? ''}${t}${badge}</button>`;
  });
  return [`<div class="tabs${o.cls ? ' ' + o.cls : ''}" role="tablist" aria-label="${o.label ?? 'Sections'}"${vertical ? ' aria-orientation="vertical"' : ''}>`, ...tabs, '</div>'].join('\n');
}

function side(card: boolean) {
  return [`<nav class="tabs-side${card ? ' tabs-side-card' : ''}">`, '  <p class="tabs-title">Settings</p>', indent(tabList(['Profile', 'Notifications', 'Billing', 'Security'], { cls: 'tabs-vertical', icon: icons.info, label: 'Settings' })), '</nav>'].join('\n');
}

export const tabsCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['tabs', 'Component', 'The tablist. Line tabs by default: 16 px apart on a stroke/sub-300 base line'],
    ['tabs-segmented', 'Type', 'Tabs in a bg/weak-50 track, the selected one on white with a shadow'],
    ['tabs-pill', 'Type', 'Separate 36 px pills 8 px apart. The selected one fills bg/surface-800'],
    ['tabs-pill-stroke', 'Style', 'With tabs-pill: no fill, an outline marks the selected pill'],
    ['tabs-square', 'Style', 'With segmented or pill: 12 px corners instead of full round'],
    ['tabs-vertical', 'Type', 'A column of 36 px tabs for side menus, inside tabs-side'],
    ['tabs-side', 'Part', 'The 217 px side menu around a tabs-title and a tabs-vertical list'],
    ['tabs-side-card', 'Style', 'With tabs-side: a white card with a stroke/soft-200 frame and a line under the title'],
    ['tabs-title', 'Part', 'The title of a side menu, Inter Medium 12/16'],
    ['tab', 'Part', 'One tab, a button with role="tab". A leading svg is 20 px, 16 px in segmented and pill'],
    ['tab-badge', 'Part', 'A count after the label'],
    ['aria-selected="true"', 'Attribute', 'On the selected tab. Line tabs show the 3 px brand underline'],
  ],
  examples: [
    {
      id: 'ex-tabs',
      title: 'Line tabs with panels',
      desc: 'Each tab points at its panel with aria-controls, hidden hides the rest. Click a tab or use the arrow keys',
      html: [
        '<div>',
        indent(tabList(['Overview', 'Activity', 'Members', 'Billing'], { panels: 'project' })),
        ...['Overview', 'Activity', 'Members', 'Billing'].map((t, i) => `  <div id="project-${i}" role="tabpanel" aria-labelledby="project-tab-${i}"${i ? ' hidden' : ''} style="padding-top: 16px; font-size: 14px; color: var(--color-text-sub-600)">${t} of the project</div>`),
        '</div>',
      ].join('\n'),
    },
    {
      id: 'ex-tabs-parts',
      title: 'Icon and badge',
      desc: 'Put an svg before the label and a tab-badge after it. Use the icon on every tab or none',
      html: tabList(['Overview', 'Activity', 'Members'], { icon: icons.info, badges: true }),
    },
    {
      id: 'ex-tabs-segmented',
      title: 'Segmented',
      desc: 'For views of the same data, like a list and a grid. Add tabs-square for 12 px corners',
      html: [tabList(['Day', 'Week', 'Month'], { cls: 'tabs-segmented', label: 'Range' }), tabList(['List', 'Board', 'Calendar'], { cls: 'tabs-segmented tabs-square', icon: icons.heart, label: 'View' })].join('\n'),
      stack: true,
    },
    {
      id: 'ex-tabs-pill',
      title: 'Pill',
      desc: 'Filters and categories above content. Filled by default, tabs-pill-stroke outlines only the selected one',
      html: [tabList(['All', 'Unread', 'Mentions'], { cls: 'tabs-pill', badges: true, label: 'Filter' }), tabList(['All', 'Unread', 'Mentions'], { cls: 'tabs-pill tabs-pill-stroke', label: 'Filter' })].join('\n'),
      stack: true,
    },
    {
      id: 'ex-tabs-vertical',
      title: 'Vertical',
      desc: 'A side menu for settings and long forms. tabs-side-card frames it, leave it off for a plain list',
      html: [side(true), side(false)].join('\n'),
    },
  ],
};

// pagination

function pager(o: { cls?: string; left: 'rows' | 'count' | 'range'; page?: number; total?: number; prevNext?: boolean; prevText?: string; items?: number; perPage?: number }) {
  const { page = 1, items = 120, perPage = 10 } = o;
  const total = o.total ?? Math.max(1, Math.ceil(items / perPage));
  const start = (page - 1) * perPage + 1;
  const end = Math.min(items, page * perPage);
  const act = (kind: 'first' | 'prev' | 'next' | 'last', text = '') => {
    const off = (kind === 'first' || kind === 'prev') ? page === 1 : page === total;
    const label = text ? '' : ` aria-label="${kind === 'first' ? 'First' : 'Last'} page"`;
    const inner = kind === 'next' ? `${text}${icons.next}` : kind === 'prev' ? `${icons.prev}${text}` : icons[kind];
    return `<button type="button" class="pagination-action${text ? '' : ' pagination-icon'}"${label}${off ? ' disabled' : ''}>${inner}</button>`;
  };
  const left = {
    rows: [
      '<label class="pagination-rows">',
      '  Rows per page',
      '  <select class="pagination-select">',
      ...[10, 25, 50, 100].map((n) => `    <option${n === perPage ? ' selected' : ''}>${n}</option>`),
      '  </select>',
      '</label>',
    ],
    count: [`<p class="pagination-info">Showing ${start}-${end} of ${items} results</p>`],
    range: [`<p class="pagination-info">${start} to ${end} of ${items} results</p>`],
  }[o.left];
  let right: string[];
  if (o.prevNext) right = ['<div class="pagination-list">', `  ${act('prev', o.prevText ?? 'Previous')}`, `  ${act('next', 'Next')}`, '</div>'];
  else {
    const nums = pageItems(page, total).map((p) =>
      p === null ? '<span class="pagination-item" aria-hidden="true">...</span>' : `<button type="button" class="pagination-item"${p === page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`);
    right = [
      '<div class="pagination-group">',
      '  <div class="pagination-list">', `    ${act('first')}`, `    ${act('prev', 'Previous')}`, '  </div>',
      '  <div class="pagination-list">', ...nums.map((n) => '    ' + n), '  </div>',
      '  <div class="pagination-list">', `    ${act('next', 'Next')}`, `    ${act('last')}`, '  </div>',
      '</div>',
    ];
  }
  return [`<nav class="pagination${o.cls ? ' ' + o.cls : ''}" aria-label="Pagination">`, ...[...left, ...right].map((l) => '  ' + l), '</nav>'].join('\n');
}

export const paginationCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['pagination', 'Component', 'The nav. Info or rows per page on the left, page buttons on the right. Large, 40 px'],
    ['pagination-md', 'Size', 'Medium, 32 px and Inter 16/24'],
    ['pagination-sm', 'Size', 'Small, 24 px and Inter 12/16, for tables in cards and panels'],
    ['pagination-group', 'Part', 'Holds the first and previous, page and next and last clusters, 16 px apart'],
    ['pagination-list', 'Part', 'One cluster of buttons, 4 px apart'],
    ['pagination-item', 'Part', 'A page number button. A span with the same class is the ... gap'],
    ['pagination-action', 'Part', 'Previous, next, first or last. The svg goes on the side it points to'],
    ['pagination-icon', 'Modifier', 'With pagination-action: a square, icon only button. Give it an aria-label'],
    ['pagination-info', 'Part', 'The result count, text/sub-600'],
    ['pagination-rows', 'Part', 'A label around the Rows per page text and its select'],
    ['pagination-select', 'Part', 'A native select, 100 px wide, 78 px at Small'],
    ['aria-current="page"', 'Attribute', 'On the current page: a stroke/soft-200 outline'],
    ['disabled', 'Attribute', 'On an action at either end: text/soft-400, not clickable'],
  ],
  examples: [
    {
      id: 'ex-pagination',
      title: 'Rows per page',
      desc: 'Type 01, for tables. First, last and the pages around the current one, with ... for each gap',
      html: pager({ left: 'rows', page: 1 }),
    },
    {
      id: 'ex-pagination-count',
      title: 'Result count',
      desc: 'Type 02 shows how many results the page holds. Previous turns on once people leave page 1',
      html: pager({ left: 'count', page: 2 }),
    },
    {
      id: 'ex-pagination-prev-next',
      title: 'Previous and next',
      desc: 'Type 03 drops the page numbers, for feeds and short lists',
      html: pager({ left: 'range', prevNext: true }),
    },
    {
      id: 'ex-pagination-sizes',
      title: 'Sizes',
      desc: 'pagination-md for most tables, pagination-sm for tables in cards and side panels',
      html: [pager({ cls: 'pagination-md', left: 'count', page: 3, total: 8 }), pager({ cls: 'pagination-sm', left: 'rows', page: 3, total: 8 })].join('\n'),
      stack: true,
    },
  ],
};

// stepper

const stepNames = ['Account', 'Company', 'Payment', 'Review'];
const badgeText = ['Done', 'In progress', 'Pending'];

function stepper(o: { cls?: string; current?: number; badge?: boolean; names?: string[] } = {}) {
  const { current = 1, badge = true, names = stepNames } = o;
  const steps = names.map((name, i) => {
    const state = i < current ? 0 : i === current ? 1 : 2;
    const attrs = state === 0 ? ' class="step step-done"' : state === 1 ? ' class="step" aria-current="step"' : ' class="step"';
    return [
      `<li${attrs}>`,
      `  <span class="step-indicator">${String(i + 1).padStart(2, '0')}</span>`,
      '  <span class="step-text">',
      `    <span class="step-label">Step ${String(i + 1).padStart(2, '0')}</span>`,
      `    <span class="step-name">${name}</span>`,
      ...(badge ? [`    <span class="step-badge">${badgeText[state]}</span>`] : []),
      '  </span>',
      '</li>',
    ].join('\n');
  });
  return [`<ol class="stepper${o.cls ? ' ' + o.cls : ''}" aria-label="Progress">`, ...steps.map((s) => indent(s)), '</ol>'].join('\n');
}

export const stepperCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['stepper', 'Component', 'The ol. Horizontal, a bar after each indicator and the text below. Large 40 px indicators'],
    ['stepper-inline', 'Layout', 'Text beside the indicator, a short bar to the next step'],
    ['stepper-center', 'Layout', 'Bars on both sides of a centered indicator, centered text'],
    ['stepper-bar', 'Layout', 'A 4 px bar on top of each step'],
    ['stepper-vertical', 'Layout', 'A column, with a 2 px line under each indicator'],
    ['stepper-cards', 'Layout', 'A column of 240 px cards, the current one on bg/weak-50'],
    ['stepper-stroke', 'Indicator', 'Outlined indicators until a step is done'],
    ['stepper-ring', 'Indicator', 'An outline with a dot inside, no number'],
    ['stepper-dot', 'Indicator', 'A filled indicator with a white dot inside, no number'],
    ['stepper-square', 'Style', 'Square indicators, 12 px corners, 8 px at Small'],
    ['stepper-sm', 'Size', 'Small, 32 px indicators and Inter 12/16 names'],
    ['step', 'Part', 'One li. Default until it is done or current'],
    ['step-done', 'State', 'A finished step: success green with a check, its bar filled'],
    ['aria-current="step"', 'Attribute', 'The step in progress: information blue, its bar partly filled'],
    ['step-indicator', 'Part', 'The number. The css swaps it for a check once the step is done'],
    ['step-text', 'Part', 'Holds step-label, step-name and an optional step-badge'],
    ['step-label', 'Part', 'Small text above the name, text/sub-600'],
    ['step-name', 'Part', 'The step name, Medium. text/sub-600 on steps not reached yet'],
    ['step-badge', 'Part', 'A status pill under the name'],
  ],
  examples: [
    {
      id: 'ex-stepper',
      title: 'Horizontal',
      desc: 'Mark finished steps with step-done and the current one with aria-current="step". The bars follow on their own',
      html: stepper(),
    },
    {
      id: 'ex-stepper-inline',
      title: 'Inline',
      desc: 'stepper-inline puts the text beside each indicator, for wide headers with few steps',
      html: stepper({ cls: 'stepper-inline', current: 2, badge: false, names: stepNames.slice(0, 3) }),
    },
    {
      id: 'ex-stepper-center',
      title: 'Centered',
      desc: 'stepper-center centers each step under its indicator, with bars on both sides',
      html: stepper({ cls: 'stepper-center', current: 2 }),
    },
    {
      id: 'ex-stepper-bar',
      title: 'Top bar',
      desc: 'stepper-bar draws a 4 px bar on top of each step, the text sits beside the indicator',
      html: stepper({ cls: 'stepper-bar stepper-sm', current: 1, badge: false }),
    },
    {
      id: 'ex-stepper-vertical',
      title: 'Vertical',
      desc: 'stepper-vertical for side panels and long forms. stepper-cards turns each step into a card',
      html: [stepper({ cls: 'stepper-vertical', current: 1, badge: false, names: stepNames.slice(0, 3) }), stepper({ cls: 'stepper-cards stepper-sm', current: 1, badge: false, names: stepNames.slice(0, 3) })].join('\n'),
    },
    {
      id: 'ex-stepper-indicators',
      title: 'Indicators',
      desc: 'stepper-stroke outlines the indicators, stepper-ring and stepper-dot draw a dot instead of the number. Add stepper-square for square ones',
      html: ['stepper-stroke', 'stepper-ring', 'stepper-dot stepper-square'].map((c) => stepper({ cls: `${c} stepper-sm`, current: 1, badge: false })).join('\n'),
      stack: true,
    },
  ],
};

// the playground variant as html, from the same options the live preview renders from

const crumbCls: Record<Bc.Type, string> = { Arrow: '', 'Double Arrow': 'breadcrumb-double', Slash: 'breadcrumb-slash', Dot: 'breadcrumb-dot' };
export function breadcrumbHtml(o: { type: Bc.Type; count: number; rounded: boolean; icon: boolean; dropdown: boolean }) {
  const cls = [crumbCls[o.type], o.rounded && 'breadcrumb-rounded'].filter(Boolean).join(' ');
  return crumbs(crumbLabels.slice(0, o.count), { cls, home: o.icon, menu: o.dropdown });
}

export function tabsHtml(o: { kind: Tm.Kind; count: number; active: number; rounded: boolean; style: string; list: string; icon: boolean; badge: boolean }) {
  const square = !o.rounded && (o.kind === 'Segmented' || o.kind === 'Pill') ? ' tabs-square' : '';
  const cls = { Line: '', Segmented: 'tabs-segmented', Pill: `tabs-pill${o.style === 'Stroke' ? ' tabs-pill-stroke' : ''}`, Vertical: 'tabs-vertical' }[o.kind] + square;
  const icon = o.icon ? (o.kind === 'Line' || o.kind === 'Vertical' ? icons.info : icons.heart) : undefined;
  const list = tabList(tabLabels.slice(0, o.count), { cls: cls.trim(), icon, badges: o.badge, selected: o.active, label: o.kind === 'Vertical' ? 'Menu' : undefined });
  if (o.kind !== 'Vertical') return list;
  return [`<nav class="tabs-side${o.list === 'Card' ? ' tabs-side-card' : ''}">`, '  <p class="tabs-title">Menu</p>', indent(list), '</nav>'].join('\n');
}

export function paginationHtml(o: { type: Pg.Type; size: Pg.Size; page: number; items: number; perPage: number }) {
  const cls = { Large: '', Medium: 'pagination-md', Small: 'pagination-sm' }[o.size];
  const left = ({ '01': 'rows', '02': 'count', '03': 'range' } as const)[o.type];
  return pager({ cls, left, page: o.page, items: o.items, perPage: o.perPage, prevNext: o.type === '03', prevText: o.size === 'Large' ? 'Prev' : 'Previous' });
}

const layoutCls: Record<St.Layout, string> = { h01: '', h02: 'stepper-inline', h03: 'stepper-center', h04: 'stepper-bar', v01: 'stepper-vertical', v02: 'stepper-cards' };
const indicatorCls: Record<St.Indicator, string> = { Filled: '', Stroke: 'stepper-stroke', 'Shape-01': 'stepper-ring', 'Shape-02': 'stepper-dot' };
export function stepperHtml(o: { layout: St.Layout; type: St.Indicator; size: St.Size; rounded: boolean; badge: boolean; current: number }) {
  const cls = [layoutCls[o.layout], indicatorCls[o.type], !o.rounded && 'stepper-square', o.size === 'Small' && 'stepper-sm'].filter(Boolean).join(' ');
  return stepper({ cls, current: o.current, badge: o.badge, names: stepList.map((s) => s.name) });
}
