// code for developers: alert, banner, badge, progress and tooltip classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { plainIcon, statusIcon, esc, type Status } from '../data/markup';
import { copy as alertCopy, type Size as AlertSize, type Style as AlertStyle } from '../data/alert';
import { copy as bannerCopy, type Type as BannerType, type Align } from '../data/banner';
import type { Size as BadgeSize, Type as BadgeType, Color, Style as BadgeStyle } from '../data/badge';
import type { State } from '../data/progress-bar';
import { sample, arrowKey, type Type as TipType, type Arrow, type Size as TipSize } from '../data/tooltip';

const indent = (html: string, n = 1) => html.split('\n').map((l) => '  '.repeat(n) + l).join('\n');
const statusCls: Record<Status, string> = { Error: 'error', Warning: 'warning', Success: 'success', Info: 'info', Feature: 'feature' };
const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

// alert

interface AlertOpts { size?: AlertSize; status?: Status; style?: AlertStyle; icon?: boolean; action?: boolean; second?: boolean; close?: boolean; title?: string }

function alertMarkup(o: AlertOpts = {}) {
  const { size = 'Medium', status = 'Info', style = 'Light', icon = true, action = true, second = true, close = true } = o;
  const c = alertCopy[status];
  const large = size === 'Large';
  const title = esc(o.title ?? c.title);
  const actions = action ? [`<div class="alert-actions">`, `  <button type="button" class="alert-action">${esc(c.action)}</button>`, ...(large && second ? ['  <button type="button" class="alert-action">Learn more</button>'] : []), '</div>'] : [];
  const body = large
    ? ['<div class="alert-body">', '  <div class="alert-text">', `    <p class="alert-title">${title}</p>`, `    <p class="alert-desc">${esc(c.desc)}</p>`, '  </div>', ...actions.map((l) => '  ' + l), '</div>']
    : ['<div class="alert-body">', `  <p class="alert-title">${title}</p>`, ...actions.map((l) => '  ' + l), '</div>'];
  const klass = cls('alert', size === 'Small' && 'alert-sm', large && 'alert-lg', `alert-${statusCls[status]}`, style === 'Filled' && 'alert-filled', style === 'Stroke' && 'alert-stroke');
  const role = status === 'Error' || status === 'Warning' ? 'alert' : 'status';
  return [
    `<div class="${klass}" role="${role}">`,
    ...(icon ? [`  ${plainIcon(statusIcon[status])}`] : []),
    ...body.map((l) => '  ' + l),
    ...(close ? [`  <button type="button" class="alert-close" aria-label="Dismiss">${plainIcon('x-close-line')}</button>`] : []),
    '</div>',
  ].join('\n');
}

export const alertCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['alert', 'Component', 'The container, 360 px wide. Medium and Light by default, in information colors'],
    ['alert-error', 'Status', 'Error colors. Also alert-warning, alert-success, alert-info and alert-feature'],
    ['alert-filled', 'Style', 'White text on the status color, for problems that block the task'],
    ['alert-stroke', 'Style', 'A white alert with a stroke/soft-200 outline, only the icon in the status color'],
    ['alert-sm', 'Size', 'Small, 32 px, Inter 12/16 and 16 px icons'],
    ['alert-lg', 'Size', 'Large, a Medium title over a description, with up to two actions'],
    ['alert-body', 'Part', 'Holds the title and actions in a row, a column at Large'],
    ['alert-text', 'Part', 'At Large: the alert-title and alert-desc, 4 px apart'],
    ['alert-title', 'Part', 'One line, cut with an ellipsis below Large'],
    ['alert-desc', 'Part', 'The description, text/sub-600 in Stroke'],
    ['alert-actions', 'Part', 'Link buttons, 12 px apart. The first one is underlined'],
    ['alert-action', 'Part', 'One link button'],
    ['alert-close', 'Part', 'The dismiss button, its icon at 48% until hovered'],
    ['role="alert"', 'Attribute', 'On Error and Warning, so screen readers announce it. Use role="status" for the rest'],
  ],
  examples: [
    {
      id: 'ex-alert',
      title: 'Alert',
      desc: 'An svg icon, the alert-body and a close button. Pick the status with one class',
      html: alertMarkup({ status: 'Success' }),
    },
    {
      id: 'ex-alert-large',
      title: 'Large with actions',
      desc: 'alert-lg adds a description under the title and room for two actions',
      html: alertMarkup({ size: 'Large', status: 'Error' }),
    },
    {
      id: 'ex-alert-styles',
      title: 'Styles',
      desc: 'Light by default. alert-filled for blocking problems, alert-stroke on busy white pages',
      html: [alertMarkup({ status: 'Warning', style: 'Filled', action: false }), alertMarkup({ status: 'Warning', action: false }), alertMarkup({ status: 'Warning', style: 'Stroke', action: false })].join('\n'),
      stack: true,
    },
    {
      id: 'ex-alert-small',
      title: 'Small',
      desc: 'alert-sm for forms and toolbars where space is tight',
      html: alertMarkup({ size: 'Small', status: 'Feature', style: 'Stroke' }),
    },
  ],
};

export function alertHtml(o: Required<Omit<AlertOpts, 'title'>>) {
  return alertMarkup(o);
}

// banner

interface BannerOpts { type?: BannerType; status?: Status; align?: Align; description?: boolean; button?: boolean }

function bannerMarkup(o: BannerOpts = {}) {
  const { type = 'Light', status = 'Info', align = 'Center', description = true, button = true } = o;
  const c = bannerCopy[status];
  const klass = cls('banner', `banner-${statusCls[status]}`, type === 'Filled' && 'banner-filled', type === 'Stroke' && 'banner-stroke', align === 'Left' && 'banner-left');
  return [
    `<div class="${klass}" role="${status === 'Error' ? 'alert' : 'status'}">`,
    '  <div class="banner-content">',
    `    ${plainIcon(statusIcon[status])}`,
    '    <p class="banner-text">',
    `      <span class="banner-title">${esc(c.title)}</span>`,
    ...(description ? [`      <span class="banner-desc">${esc(c.desc)}</span>`] : []),
    '    </p>',
    ...(button ? [`    <a class="banner-link" href="#">${esc(c.action)}${plainIcon('arrow-right-line')}</a>`] : []),
    '  </div>',
    `  <button type="button" class="banner-close" aria-label="Dismiss">${plainIcon('x-close-line')}</button>`,
    '</div>',
  ].join('\n');
}

export const bannerCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['banner', 'Component', 'A full-width strip, 44 px tall with 48 px side padding. Light, centered and information colored by default'],
    ['banner-error', 'Status', 'Error colors. Also banner-warning, banner-success, banner-info and banner-feature'],
    ['banner-filled', 'Type', 'White text on the status color, for outages and anything urgent'],
    ['banner-stroke', 'Type', 'White with a stroke/soft-200 outline, for busy pages'],
    ['banner-left', 'Align', 'Start the content at the left edge instead of the center'],
    ['banner-content', 'Part', 'The icon, text and link, 12 px apart. Wraps on narrow screens'],
    ['banner-text', 'Part', 'Holds banner-title and banner-desc'],
    ['banner-title', 'Part', 'The title, Inter Medium'],
    ['banner-desc', 'Part', 'The description, after a 2 px dot'],
    ['banner-link', 'Part', 'A link with an arrow, Inter Medium 12/16'],
    ['banner-close', 'Part', 'The dismiss button, its icon at 48% until hovered'],
  ],
  examples: [
    {
      id: 'ex-banner',
      title: 'Banner',
      desc: 'Put it at the top of the page, above the header. Below 768 px the text stacks under the title',
      html: bannerMarkup({ status: 'Warning' }),
    },
    {
      id: 'ex-banner-types',
      title: 'Types',
      desc: 'Light by default. banner-filled for outages, banner-stroke when the page around it is busy',
      html: [bannerMarkup({ type: 'Filled', status: 'Error' }), bannerMarkup({ type: 'Stroke', status: 'Feature' })].join('\n'),
      stack: true,
    },
    {
      id: 'ex-banner-left',
      title: 'Left aligned',
      desc: 'banner-left lines the content up with a left-aligned page header',
      html: bannerMarkup({ status: 'Success', align: 'Left', button: false }),
    },
  ],
};

export function bannerHtml(o: Required<BannerOpts>) {
  return bannerMarkup(o);
}

// badge

interface BadgeOpts { size?: BadgeSize; type?: BadgeType; color?: Color; style?: BadgeStyle; number?: boolean; rounded?: boolean; left?: boolean; right?: boolean; text?: string }

function badgeMarkup(o: BadgeOpts = {}) {
  const { size = 'Medium', type = 'Basic', color = 'Main', style = 'Light', rounded = false, left = true, right = true } = o;
  const number = !!o.number && type !== 'Icon';
  const klass = cls('badge', size === 'Small' && 'badge-sm', color !== 'Main' && `badge-${color.toLowerCase()}`, style !== 'Light' && `badge-${style.toLowerCase()}`, type === 'Dot' && 'badge-dot', number && 'badge-number', rounded && 'badge-rounded');
  const text = esc(number ? '99' : (o.text ?? 'Badge'));
  if (type !== 'Icon') return `<span class="${klass}">${text}</span>`;
  return `<span class="${klass}">${left ? plainIcon('alert-circle-line') : ''}${text}${right ? plainIcon('x-close-line') : ''}</span>`;
}

export const badgeCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['badge', 'Component', 'A 20 px pill, Inter Medium 12/16. Light and Main (brand) by default'],
    ['badge-neutral', 'Color', 'Also badge-green, badge-orange, badge-blue and badge-red'],
    ['badge-filled', 'Style', 'White text on the color'],
    ['badge-stroke', 'Style', 'A 1 px outline in the color, no fill'],
    ['badge-white', 'Style', 'Colored text on white, for badges on tinted surfaces'],
    ['badge-sm', 'Size', 'Small, 16 px and Inter 10/12'],
    ['badge-rounded', 'Style', 'Full round corners instead of 6 px'],
    ['badge-dot', 'Type', 'A 4 px dot before the text, for live and presence states'],
    ['badge-number', 'Type', 'A count. Keeps a square minimum width for one digit'],
    ['svg', 'Part', 'An icon on either side, 12 px or 10 px at Small'],
  ],
  examples: [
    {
      id: 'ex-badge',
      title: 'Colors',
      desc: 'Text goes straight in the span. Pick a color class, Main needs none',
      html: (['Main', 'Neutral', 'Green', 'Orange', 'Blue', 'Red'] as const).map((c) => badgeMarkup({ color: c, text: c })).join('\n'),
    },
    {
      id: 'ex-badge-styles',
      title: 'Styles',
      desc: 'Light by default, badge-filled, badge-stroke and badge-white for the rest',
      html: (['Filled', 'Light', 'Stroke', 'White'] as const).map((s) => badgeMarkup({ color: 'Green', style: s, text: s })).join('\n'),
    },
    {
      id: 'ex-badge-types',
      title: 'Dot, number and icon',
      desc: 'badge-dot for live states, badge-number for counts, an svg on either side for removable tags',
      html: [badgeMarkup({ type: 'Dot', color: 'Green', rounded: true, text: 'Online' }), badgeMarkup({ type: 'Basic', color: 'Red', style: 'Filled', number: true, rounded: true }), badgeMarkup({ type: 'Icon', color: 'Blue', text: 'Design' })].join('\n'),
    },
    {
      id: 'ex-badge-small',
      title: 'Small',
      desc: 'badge-sm next to small text, in tables and dense lists',
      html: [badgeMarkup({ size: 'Small', color: 'Orange', text: 'Pending' }), badgeMarkup({ size: 'Small', type: 'Dot', color: 'Neutral', style: 'Stroke', text: 'Draft' })].join('\n'),
    },
  ],
};

export function badgeHtml(o: Required<Omit<BadgeOpts, 'text'>>) {
  return badgeMarkup(o);
}

// progress

const progressIcon: Record<State, 'loading-01-line' | 'check-circle-line' | 'x-circle-line'> = { 'On Progress': 'loading-01-line', Success: 'check-circle-line', Error: 'x-circle-line' };

function progressMarkup(o: { state?: State; value?: number; label?: boolean; icon?: boolean; info?: boolean; title?: string } = {}) {
  const { state = 'On Progress', label = true, icon = true, info = true, title = 'Uploading report.pdf' } = o;
  const value = state === 'On Progress' ? Math.round(o.value ?? 40) : 100;
  const note = state === 'Error' ? 'Upload failed, check your connection and try again' : `${value} MB of 100 MB`;
  const id = `progress-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
  return [
    `<div class="${cls('progress', state === 'Success' && 'progress-success', state === 'Error' && 'progress-error')}">`,
    ...(label ? ['  <div class="progress-label">', `    <span class="progress-title" id="${id}">${esc(title)}</span>`, `    <span class="progress-value">${value}%${icon ? plainIcon(progressIcon[state]) : ''}</span>`, '  </div>'] : []),
    `  <progress class="progress-bar" value="${value}" max="100"${label ? ` aria-labelledby="${id}"` : ` aria-label="${esc(title)}"`}></progress>`,
    ...(info ? [`  <p class="progress-info">${note}</p>`] : []),
    '</div>',
  ].join('\n');
}

const ring = (v: number, size = '') => `<div class="${cls('progress-ring', size)}" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" style="--value: ${v}">${v}%</div>`;

export const progressCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['progress', 'Component', 'A 400 px column: label row, bar and info, 8 px apart. Brand fill while running'],
    ['progress-success', 'State', 'Success green fill and check icon'],
    ['progress-error', 'State', 'Error red fill, icon and info text'],
    ['progress-label', 'Part', 'The title and the value on one row, Inter 12/16'],
    ['progress-title', 'Part', 'The file or task name, Medium, cut with an ellipsis'],
    ['progress-value', 'Part', 'The percentage and a 12 px state icon. The loading icon spins'],
    ['progress-bar', 'Part', 'A native progress element, 6 px on bg/soft-200. Works on its own too'],
    ['progress-info', 'Part', 'Size or an error message under the bar, Inter 10/12'],
    ['progress-ring', 'Component', 'Circular progress, 80 px. Set --value from 0 to 100 inline'],
    ['progress-ring-md', 'Size', 'Medium, 64 px. progress-ring-sm is 48 px'],
  ],
  examples: [
    {
      id: 'ex-progress',
      title: 'Progress bar',
      desc: 'Update value on the progress element as the task runs, and the number in progress-value with it',
      html: progressMarkup({ value: 64 }),
    },
    {
      id: 'ex-progress-states',
      title: 'Success and error',
      desc: 'Swap in progress-success or progress-error when the task ends, with the matching icon',
      html: [progressMarkup({ state: 'Success' }), progressMarkup({ state: 'Error' })].join('\n'),
      stack: true,
    },
    {
      id: 'ex-progress-bar',
      title: 'Bar only',
      desc: 'The bar on its own, for compact rows. Give it an aria-label',
      html: '<progress class="progress-bar" value="30" max="100" aria-label="Profile complete"></progress>',
    },
    {
      id: 'ex-progress-ring',
      title: 'Circular',
      desc: 'progress-ring with --value for dashboards and onboarding. Keep the number inside short',
      html: [ring(75), ring(50, 'progress-ring-md'), ring(25, 'progress-ring-sm')].join('\n'),
    },
  ],
};

export function progressHtml(o: { state: State; value: number; label: boolean; icon: boolean; info: boolean }) {
  return progressMarkup(o);
}

// tooltip

interface TipOpts { type?: TipType; arrow?: Arrow; size?: TipSize; dark?: boolean; icon?: boolean; close?: boolean; text?: string }

function tipMarkup(o: TipOpts = {}, id = 'tip-share') {
  const { type = 'Default', arrow = 'Bottom Center', size = 'Small', dark = true, icon = true, close = true } = o;
  const klass = cls('tooltip', type === 'Description' && 'tooltip-rich', size === 'Large' && 'tooltip-lg', !dark && 'tooltip-light');
  const data = arrow === 'No' ? '' : ` data-arrow="${arrow === 'Left' || arrow === 'Right' ? arrow.toLowerCase() : arrowKey(arrow)}"`;
  if (type === 'Default') return `<span class="${klass}" role="tooltip" id="${id}"${data}>${esc(o.text ?? sample.text)}</span>`;
  return [
    `<span class="${klass}" role="tooltip" id="${id}"${data}>`,
    ...(icon ? [`  ${plainIcon('alert-circle-line')}`] : []),
    '  <span class="tooltip-body">',
    `    <span class="tooltip-title">${esc(o.text ?? sample.title)}</span>`,
    `    <span class="tooltip-text">${esc(sample.desc)}</span>`,
    '  </span>',
    ...(close ? [`  <button type="button" class="tooltip-close" aria-label="Close">${plainIcon('x-close-line')}</button>`] : []),
    '</span>',
  ].join('\n');
}

// a trigger with its tooltip, shown on hover and focus
function trigger(o: TipOpts, id: string, label = 'Share') {
  return ['<span class="tooltip-trigger">', `  <button type="button" class="btn btn-md btn-secondary btn-neutral" aria-describedby="${id}"><span>${label}</span></button>`, indent(tipMarkup(o, id)), '</span>'].join('\n');
}

export const tooltipCode: { classes: ClassRow[]; examples: Example[] } = {
  classes: [
    ['tooltip', 'Component', 'Dark, Small and one line of Inter 12/16, at most 240 px wide'],
    ['tooltip-light', 'Theme', 'White with sub-600 text, for dark surfaces'],
    ['tooltip-lg', 'Size', 'Large, Inter 14/20 and a bigger tail'],
    ['tooltip-rich', 'Type', 'An icon, a title and text and a close button, 268 px wide'],
    ['tooltip-body', 'Part', 'In a rich tooltip: the tooltip-title over the tooltip-text'],
    ['tooltip-close', 'Part', 'Closes a rich tooltip'],
    ['data-arrow', 'Attribute', 'top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, left or right. Leave it off for no tail'],
    ['tooltip-trigger', 'Part', 'Wraps a trigger and its tooltip. Shows it 300 ms after hover, straight away on focus, on the side away from the tail'],
    ['role="tooltip"', 'Attribute', 'On the tooltip, with an id the trigger points at through aria-describedby'],
  ],
  examples: [
    {
      id: 'ex-tooltip',
      title: 'On hover and focus',
      desc: 'Wrap the trigger and the tooltip in tooltip-trigger. Hover or tab to the button',
      html: trigger({ arrow: 'Bottom Center' }, 'tip-share'),
      height: 120,
    },
    {
      id: 'ex-tooltip-arrows',
      title: 'Arrows',
      desc: 'data-arrow puts the tail on an edge. In a tooltip-trigger the tooltip opens on the opposite side',
      html: (['Top Left', 'Top Center', 'Bottom Right', 'Left', 'Right'] as const).map((a, i) => tipMarkup({ arrow: a, text: a }, `tip-arrow-${i}`)).join('\n'),
    },
    {
      id: 'ex-tooltip-rich',
      title: 'Rich',
      desc: 'tooltip-rich for a short explanation with a title. Add tooltip-light on dark surfaces',
      html: [tipMarkup({ type: 'Description', arrow: 'Top Left' }, 'tip-rich'), tipMarkup({ type: 'Description', arrow: 'Left', size: 'Large', dark: false }, 'tip-rich-light')].join('\n'),
    },
  ],
};

export function tooltipHtml(o: Required<Omit<TipOpts, 'text'>>) {
  return tipMarkup(o);
}
