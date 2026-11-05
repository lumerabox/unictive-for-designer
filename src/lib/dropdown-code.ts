// code for developers: dropdown classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { paths } from '../components/dropdown/icons';
import { menuSamples, samples, type Size, type State, type Type } from '../data/dropdown';

const chevron = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 7.5L10 12.5L15 7.5" /></svg>';
const check = `<svg class="dropdown-item-check" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="${paths.check}" /></svg>`;
const info = `<span class="dropdown-item-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${paths.info}" /></svg></span>`;
const flag = `<svg class="dropdown-item-avatar" viewBox="0 0 32 32" aria-hidden="true"><path d="${paths.flagBase}" fill="#F0F0F0" /><path d="${paths.flagTop}" fill="#FF0000" /></svg>`;
const avatar = '<img class="dropdown-item-avatar" src="/code/avatar.png" alt="" />';

interface Item {
  type: Type;
  title: string;
  desc?: string;
  state?: State;
  icon?: boolean;
}

// one row: the lead for its type, the text and the check for a picked row. checkbox rows are labels around a checkbox
function item({ type, title, desc, state = 'Default', icon = true }: Item, indent = '') {
  const off = state === 'Disable';
  const on = state === 'Selected';
  const text = [
    '  <span class="dropdown-item-text">',
    `    <span class="dropdown-item-title">${title}</span>`,
    desc && `    <span class="dropdown-item-desc">${desc}</span>`,
    '  </span>',
  ];
  const rows = type === 'Checkbox'
    ? ['<label class="dropdown-item">', `  <input type="checkbox" class="checkbox"${on ? ' checked' : ''}${off ? ' disabled' : ''} />`, ...text, '</label>']
    : [
        `<li class="dropdown-item" role="option" aria-selected="${on}"${off ? ' aria-disabled="true"' : ''}>`,
        type === 'Default' && icon && `  ${info}`,
        type === 'Profile' && `  ${avatar}`,
        type === 'Country' && `  ${flag}`,
        ...text,
        `  ${check}`,
        '</li>',
      ];
  return rows.filter(Boolean).map((s) => indent + s).join('\n');
}

interface Menu {
  id: string;
  label?: string;
  type?: Type;
  size?: Size;
  value?: string;
  open?: boolean;
  items?: Item[];
  disabled?: boolean;
  invalid?: boolean;
  caption?: string;
}

// the field: label, the trigger and the menu under it
function dropdown({ id, label, type = 'Default', size = 'Small', value, open = false, items = [], disabled, invalid, caption }: Menu) {
  const lg = size === 'Large';
  const multi = type === 'Checkbox';
  const attrs = [
    `type="button" id="${id}"`,
    `class="field-control${lg ? ' field-control-lg' : ''}"`,
    `aria-haspopup="${multi ? 'true' : 'listbox'}" aria-expanded="${open}"`,
    items.length > 0 && `aria-controls="${id}-menu"`,
    caption && `aria-describedby="${id}-caption"`,
    invalid && 'aria-invalid="true"',
    disabled && 'disabled',
  ].filter(Boolean).join(' ');
  const menuTag = multi ? 'div' : 'ul';
  return [
    '<div class="field">',
    label && `  <label class="field-label" for="${id}">${label}</label>`,
    `  <div class="dropdown${lg ? ' dropdown-lg' : ''}">`,
    `    <button ${attrs}>`,
    `      <span class="field-value${value ? '' : ' field-placeholder'}">${value ?? 'Select an option'}</span>`,
    `      ${chevron}`,
    '    </button>',
    ...(items.length === 0 ? [] : [
      `    <${menuTag} class="dropdown-menu" id="${id}-menu"${multi ? '' : ' role="listbox"'}${label ? '' : ' aria-label="Options"'}${open ? '' : ' hidden'}>`,
      ...items.map((i) => item({ ...i, type, desc: lg ? i.desc : undefined }, '      ')),
      `    </${menuTag}>`,
    ]),
    '  </div>',
    caption && `  <div class="field-foot"><span class="field-caption" id="${id}-caption">${caption}</span></div>`,
    '</div>',
  ].filter(Boolean).join('\n');
}

// the playground variant: the open menu, or the single row
export interface DropdownSpec { type: Type; size: Size; state: State; menu: boolean; icon: boolean; description: boolean }
export function dropdownHtml(s: DropdownSpec) {
  const desc = (d: string) => (s.description ? d : undefined);
  if (!s.menu) return item({ type: s.type, title: samples[s.type].title, desc: s.size === 'Large' ? desc(samples[s.type].desc) : undefined, state: s.state, icon: s.icon });
  const sample = menuSamples[s.type];
  const items = sample.rows.map((r, i) => ({ type: s.type, title: i === 1 ? samples[s.type].title : r.title, desc: desc(r.desc), state: i === 1 ? s.state : 'Default' as State, icon: s.icon }));
  const picked = items.filter((i) => i.state === 'Selected').map((i) => i.title)[0];
  return dropdown({ id: sample.label.toLowerCase().replace(/\s+/g, '-'), label: sample.label, type: s.type, size: s.size, value: picked, open: true, items });
}

export const classes: ClassRow[] = [
  ['dropdown', 'Component', 'Wrapper around the trigger and the menu, the menu opens 8 px under it'],
  ['dropdown-lg', 'Size', 'Large rows: 48 px trigger, a description line and 32 px leads'],
  ['field-control', 'Part', 'The trigger, a button in the 40 px field frame. Toggle aria-expanded when it opens'],
  ['field-value', 'Part', 'The picked value in the trigger'],
  ['field-placeholder', 'Modifier', 'Grey text while nothing is picked'],
  ['dropdown-menu', 'Part', 'Panel of rows, 8 px padding, 12 px corners. Add hidden to close it'],
  ['dropdown-item', 'Component', 'One row, 36 px in Small. Hover fills it light grey'],
  ['dropdown-item-icon', 'Part', 'Icon lead for the Default type, boxed in Large'],
  ['dropdown-item-avatar', 'Part', 'Photo or flag lead, 20 px, 32 px in Large'],
  ['dropdown-item-text', 'Part', 'Column for the title and the description'],
  ['dropdown-item-title', 'Part', 'Row title, Medium weight in Large'],
  ['dropdown-item-desc', 'Part', 'Second line, 12/16. Large rows only'],
  ['dropdown-item-check', 'Part', 'Check at the end, shows on the picked row'],
  ['aria-selected="true"', 'Attribute', 'The picked row: grey fill and the check'],
  ['aria-disabled="true"', 'Attribute', 'A row people can’t pick, greyed out'],
];

const pay = menuSamples.Default.rows;
const people = menuSamples.Profile.rows;
const zones = menuSamples.Country.rows;
const alerts = menuSamples.Checkbox.rows;

export const examples: Example[] = [
  {
    id: 'ex-basic',
    title: 'Basic',
    desc: 'A button opens a listbox under it. Toggle aria-expanded and hidden from script, and set aria-selected on the picked row',
    html: dropdown({ id: 'payment', label: 'Payment method', value: pay[1].title, open: true, items: pay.map((r, i) => ({ type: 'Default', ...r, state: i === 1 ? 'Selected' : 'Default' })) }),
    height: 300,
  },
  {
    id: 'ex-closed',
    title: 'Closed',
    desc: 'The trigger shows a grey placeholder until something is picked, then the value',
    html: [dropdown({ id: 'method-empty', label: 'Payment method', items: [] }), dropdown({ id: 'method-filled', label: 'Payment method', value: 'Bank transfer', items: [] })].join('\n'),
  },
  {
    id: 'ex-large',
    title: 'Large',
    desc: 'dropdown-lg adds a description line and boxes the icon. Use it when the options need explaining',
    html: dropdown({ id: 'payment-lg', label: 'Payment method', size: 'Large', value: pay[1].title, open: true, items: pay.map((r, i) => ({ type: 'Default', ...r, state: i === 1 ? 'Selected' : 'Default' })) }),
    height: 380,
  },
  {
    id: 'ex-profile',
    title: 'People',
    desc: 'Put a photo before the name to pick a person. Leave alt empty, the name already says who it is',
    html: dropdown({ id: 'assignee', label: 'Assignee', type: 'Profile', size: 'Large', value: people[1].title, open: true, items: people.map((r, i) => ({ type: 'Profile', ...r, state: i === 1 ? 'Selected' : 'Default' })) }),
    height: 360,
  },
  {
    id: 'ex-country',
    title: 'Countries',
    desc: 'A flag lead for countries, regions and time zones',
    html: dropdown({ id: 'zone', label: 'Time zone', type: 'Country', value: zones[0].title, open: true, items: zones.map((r, i) => ({ type: 'Country', ...r, state: i === 0 ? 'Selected' : 'Default' })) }),
    height: 300,
  },
  {
    id: 'ex-multi',
    title: 'Pick several',
    desc: 'Rows become labels around a checkbox, so people can tick more than one. Show the count in the trigger',
    html: dropdown({ id: 'alerts', label: 'Notifications', type: 'Checkbox', value: '2 selected', open: true, items: alerts.map((r, i) => ({ type: 'Checkbox', ...r, state: i < 2 ? 'Selected' : 'Default' })) }),
    height: 300,
  },
  {
    id: 'ex-states',
    title: 'Row states',
    desc: 'Hover fills a row, aria-selected adds the check, aria-disabled greys out a row people can’t pick',
    html: dropdown({ id: 'plan', label: 'Plan', value: 'Business', open: true, items: [
      { type: 'Default', title: 'Starter', state: 'Default' },
      { type: 'Default', title: 'Business', state: 'Selected' },
      { type: 'Default', title: 'Enterprise', state: 'Disable' },
    ] }),
    height: 300,
  },
  {
    id: 'ex-field-states',
    title: 'Error and disabled',
    desc: 'aria-invalid="true" turns the border and the caption red. disabled greys out the trigger',
    html: [
      dropdown({ id: 'city', label: 'City', invalid: true, caption: 'Pick the city on your ID card', items: [] }),
      dropdown({ id: 'region', label: 'Region', value: 'DKI Jakarta', disabled: true, caption: 'Set by your company admin', items: [] }),
    ].join('\n'),
  },
];
