// code for developers: button classes and html examples. the css lives in global-css.ts
import type { Variant } from '../data/button';
import type { ClassRow, Example } from './code-types';

const sizeClass = { Large: 'btn-lg', Medium: 'btn-md', Small: 'btn-sm' } as const;
const chevron = { left: 'M15 18L9 12L15 6', right: 'M9 6L15 12L9 18' };
const icon = (side: 'left' | 'right') => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${chevron[side]}" /></svg>`;

// one button, inline when it has no icon
function btn(cls: string, label: string, o: { left?: boolean; right?: boolean; attrs?: string; tag?: 'button' | 'a' } = {}) {
  const tag = o.tag ?? 'button';
  const open = `<${tag} ${tag === 'a' ? 'href="#"' : 'type="button"'} class="${cls}"${o.attrs ? ' ' + o.attrs : ''}>`;
  if (!o.left && !o.right) return `${open}${label}</${tag}>`;
  return [open, o.left && `  ${icon('left')}`, `  <span>${label}</span>`, o.right && `  ${icon('right')}`, `</${tag}>`].filter(Boolean).join('\n');
}

export function buttonHtml(v: Variant) {
  const cls = ['btn', sizeClass[v.size], `btn-${v.style.toLowerCase()}`, `btn-${v.type.toLowerCase()}`, v.rounded && 'btn-rounded'].filter(Boolean).join(' ');
  return btn(cls, v.label, { left: v.leftIcon, right: v.rightIcon, attrs: v.state === 'Disable' ? 'disabled' : '' });
}

export const classes: ClassRow[] = [
  ['btn', 'Component', 'Base class. On its own it is a Medium, Primary, Main button'],
  ['btn-lg', 'Size', 'Large, 48 px high, label 16/24'],
  ['btn-md', 'Size', 'Medium, 40 px high, label 14/20. The default'],
  ['btn-sm', 'Size', 'Small, 32 px high, 6 px corners'],
  ['btn-primary', 'Style', 'Solid fill, the most emphasis. The default'],
  ['btn-secondary', 'Style', 'Light tinted fill, turns into an outline on hover'],
  ['btn-tertiary', 'Style', 'Outline, gets a tinted fill on hover'],
  ['btn-ghost', 'Style', 'Text only, gets a tinted fill on hover'],
  ['btn-main', 'Type', 'Brand blue. The default'],
  ['btn-neutral', 'Type', 'Grey, for supporting actions like Cancel or Back'],
  ['btn-error', 'Type', 'Red, for destructive actions like Delete'],
  ['btn-rounded', 'Modifier', 'Pill corners'],
  ['btn-block', 'Modifier', 'Fills the width of its parent'],
  ['btn-icon', 'Modifier', 'Square and icon only, put one svg inside and an aria-label on the button'],
  ['disabled', 'Attribute', 'Disabled look and no clicks. On a link use aria-disabled="true"'],
];


const styles = ['primary', 'secondary', 'tertiary', 'ghost'];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const row = (type: string) => styles.map((s) => btn(`btn btn-${s}${type ? ' btn-' + type : ''}`, cap(s))).join('\n');

export const examples: Example[] = [
  { id: 'ex-styles', title: 'Styles', desc: 'Four styles set the emphasis. Use one Primary per area, the others for less important actions', html: row('') },
  { id: 'ex-neutral', title: 'Neutral', desc: 'Add btn-neutral to any style for supporting actions', html: row('neutral') },
  { id: 'ex-error', title: 'Error', desc: 'Add btn-error to any style for actions that delete or can’t be undone', html: row('error') },
  { id: 'ex-sizes', title: 'Sizes', desc: 'Small for dense tables and toolbars, Large for the main action of a page', html: ['btn btn-sm', 'btn btn-md', 'btn btn-lg'].map((c, i) => btn(c, ['Small', 'Medium', 'Large'][i])).join('\n') },
  { id: 'ex-rounded', title: 'Rounded', desc: 'btn-rounded gives pill corners and works with every style and size', html: styles.map((s) => btn(`btn btn-${s} btn-rounded`, cap(s))).join('\n') },
  {
    id: 'ex-icons',
    title: 'With icons',
    desc: 'Put an svg before or after the label and wrap the label in a span. The icon follows the size and the text color',
    html: [btn('btn btn-secondary btn-neutral', 'Back', { left: true }), btn('btn btn-primary', 'Continue', { right: true })].join('\n'),
  },
  {
    id: 'ex-states',
    title: 'States',
    desc: 'Hover and focus are built in, move the pointer over the preview or press Tab. Add the disabled attribute to turn a button off',
    html: [btn('btn btn-primary', 'Default'), btn('btn btn-primary', 'Disabled', { attrs: 'disabled' }), btn('btn btn-tertiary', 'Disabled', { attrs: 'disabled' })].join('\n'),
  },
  { id: 'ex-block', title: 'Full width', desc: 'btn-block fills the parent, handy for forms and mobile sheets', html: [btn('btn btn-lg btn-primary btn-block', 'Sign in'), btn('btn btn-lg btn-secondary btn-neutral btn-block', 'Create account')].join('\n'), stack: true },
  {
    id: 'ex-link',
    title: 'As a link',
    desc: 'Use an a element when the button goes to another page. A link can’t be disabled, so add aria-disabled="true" instead',
    html: [btn('btn btn-tertiary btn-neutral', 'View invoice', { tag: 'a' }), btn('btn btn-tertiary btn-neutral', 'View invoice', { tag: 'a', attrs: 'aria-disabled="true"' })].join('\n'),
  },
];
