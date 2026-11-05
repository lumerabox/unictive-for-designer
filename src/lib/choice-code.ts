// code for developers: checkbox, radio and switch classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';

export type Kind = 'checkbox' | 'radio' | 'switch';
type Size = 'Medium' | 'Small';

interface Control {
  kind: Kind;
  size?: Size;
  checked?: boolean;
  mixed?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  aria?: string;
}

// the native input, classed
function control(c: Control) {
  const cls = c.size === 'Small' ? `${c.kind} ${c.kind}-sm` : c.kind;
  return [
    `<input type="${c.kind === 'radio' ? 'radio' : 'checkbox'}"`,
    c.kind === 'switch' && 'role="switch"',
    `class="${cls}"`,
    c.name && `name="${c.name}"`,
    c.value && `value="${c.value}"`,
    c.checked && 'checked',
    c.mixed && 'data-indeterminate',
    c.disabled && 'disabled',
    c.aria && `aria-label="${c.aria}"`,
  ].filter(Boolean).join(' ') + ' />';
}

interface Label {
  title: string;
  desc?: string;
  badge?: string;
  link?: string;
  end?: boolean;
}

// a control inside its label, with the optional description, badge and link
function choice(c: Control, l: Label, indent = '') {
  return [
    `<label class="choice${l.end ? ' choice-end' : ''}">`,
    `  ${control(c)}`,
    '  <span class="choice-body">',
    `    <span class="choice-title">${l.title}${l.badge ? `<span class="choice-badge">${l.badge}</span>` : ''}</span>`,
    l.desc && `    <span class="choice-desc">${l.desc}</span>`,
    l.link && `    <a href="#" class="choice-link">${l.link}</a>`,
    '  </span>',
    '</label>',
  ].filter(Boolean).map((s) => indent + s).join('\n');
}

const group = (legend: string, items: string[], row = false) =>
  [`<fieldset class="choice-group${row ? ' choice-group-row' : ''}">`, `  <legend class="field-label">${legend}</legend>`, ...items, '</fieldset>'].join('\n');

const lines = (...s: string[]) => s.join('\n');

// the playground variant as html: bare controls or the label, with the texts on screen
export interface ChoiceSpec {
  kind: Kind;
  labeled: boolean;
  size: Size;
  end: boolean;
  disabled: boolean;
  value: string; // checkbox: Default, Select, Indeterminate. radio: none, 1, 2, 3. switch: true, false
  texts: Label[];
}
export function choiceHtml(s: ChoiceSpec) {
  const base = { kind: s.kind, disabled: s.disabled };
  if (s.kind === 'radio') {
    const radios = [1, 2, 3].map((n) => ({ ...base, name: 'option', value: String(n), checked: s.value === String(n) }));
    if (!s.labeled) return group('Options', radios.map((r, i) => `  ${control({ ...r, size: s.size, aria: `Option ${i + 1}` })}`), true);
    return group('Options', radios.map((r, i) => choice(r, { ...s.texts[i], end: s.end }, '  ')));
  }
  const c: Control = { ...base, checked: s.value === 'Select' || s.value === 'true', mixed: s.value === 'Indeterminate' };
  return s.labeled ? choice(c, { ...s.texts[0], end: s.end }) : control({ ...c, size: s.size, aria: 'Label' });
}

const common: ClassRow[] = [
  ['choice', 'Component', 'Label around a control and its text, up to 360 px wide. The control sits on the left'],
  ['choice-end', 'Modifier', 'Puts the control on the right, the Right position in Figma'],
  ['choice-body', 'Part', 'Column for the title, description and link'],
  ['choice-title', 'Part', 'Label text, Label 14/20'],
  ['choice-badge', 'Part', 'Small light badge after the title'],
  ['choice-desc', 'Part', 'Helper text, 12/16'],
  ['choice-link', 'Part', 'Link button under the text, 12/16 brand'],
  ['choice-group', 'Component', 'Fieldset that stacks choices 16 px apart. Put the question in a legend'],
  ['choice-group-row', 'Modifier', 'Lays the group out in a row, 24 px apart'],
];

const terms = { title: 'I agree to the terms of service', desc: 'You can read them any time from Settings' };

export const checkbox = {
  classes: [
    ['checkbox', 'Component', 'Native checkbox drawn as the DS box, 20 px'],
    ['checkbox-sm', 'Size', 'Small, 16 px'],
    ['checked', 'Attribute', 'Checked: brand fill with a white check'],
    ['indeterminate', 'Property', 'Partly checked. HTML has no attribute for it, set input.indeterminate = true from script'],
    ['disabled', 'Attribute', 'Grey box, no clicks'],
    ...common,
  ] as ClassRow[],
  examples: [
    {
      id: 'ex-basic',
      title: 'Basic',
      desc: 'Unchecked, checked and indeterminate. A checkbox on its own needs an aria-label',
      html: lines(control({ kind: 'checkbox', aria: 'Unchecked' }), control({ kind: 'checkbox', checked: true, aria: 'Checked' }), control({ kind: 'checkbox', mixed: true, aria: 'Indeterminate' })),
    },
    {
      id: 'ex-sizes',
      title: 'Sizes',
      desc: 'Medium next to body text and in forms, Small in dense tables and lists',
      html: lines(control({ kind: 'checkbox', checked: true, aria: 'Medium' }), control({ kind: 'checkbox', size: 'Small', checked: true, aria: 'Small' })),
    },
    {
      id: 'ex-disabled',
      title: 'Disabled',
      desc: 'Add the disabled attribute. Each state keeps its shape in grey',
      html: lines(control({ kind: 'checkbox', disabled: true, aria: 'Unchecked' }), control({ kind: 'checkbox', checked: true, disabled: true, aria: 'Checked' }), control({ kind: 'checkbox', mixed: true, disabled: true, aria: 'Indeterminate' })),
    },
    {
      id: 'ex-label',
      title: 'With a label',
      desc: 'Wrap the input and its text in a label so a click on the text toggles it too',
      html: choice({ kind: 'checkbox' }, terms),
    },
    {
      id: 'ex-extras',
      title: 'Badge and link',
      desc: 'Add a badge for a status like New, and a link for more detail. Keep the link short',
      html: choice({ kind: 'checkbox', checked: true }, { title: 'Two-step verification', badge: 'Recommended', desc: 'Ask for a code when someone signs in on a new device', link: 'Learn more' }),
    },
    {
      id: 'ex-end',
      title: 'Control on the right',
      desc: 'choice-end moves the box to the right, for settings lists where the text leads',
      html: choice({ kind: 'checkbox', checked: true }, { title: 'Email me product updates', desc: 'One email a month, unsubscribe any time', end: true }),
    },
    {
      id: 'ex-group',
      title: 'Group',
      desc: 'A fieldset with a legend names the question. People can pick any number of options',
      html: group('Notifications', [
        choice({ kind: 'checkbox', name: 'notify', value: 'email', checked: true }, { title: 'Email', desc: 'A weekly summary of account activity' }, '  '),
        choice({ kind: 'checkbox', name: 'notify', value: 'push', checked: true }, { title: 'Push', desc: 'Alerts on this device' }, '  '),
        choice({ kind: 'checkbox', name: 'notify', value: 'sms' }, { title: 'SMS', desc: 'Only for security codes' }, '  '),
      ]),
    },
    {
      id: 'ex-select-all',
      title: 'Select all',
      desc: 'The parent shows indeterminate while only some children are checked. Update its checked and indeterminate from script when a child changes',
      html: lines(
        choice({ kind: 'checkbox', mixed: true }, { title: 'All files' }),
        '<div class="choice-group" style="padding-left: 32px">',
        choice({ kind: 'checkbox', checked: true }, { title: 'Invoices' }, '  '),
        choice({ kind: 'checkbox' }, { title: 'Receipts' }, '  '),
        choice({ kind: 'checkbox', checked: true }, { title: 'Contracts' }, '  '),
        '</div>',
      ),
      stack: true,
    },
  ] as Example[],
};

const plans = [
  { title: 'Standard delivery', desc: '3 to 5 working days, free' },
  { title: 'Express delivery', desc: 'Next working day, Rp 25.000' },
  { title: 'Pick up in store', desc: 'Ready in 2 hours' },
];
const radioGroup = (o: { size?: Size; disabled?: boolean; end?: boolean; labels?: boolean; name: string }) =>
  group('Delivery', plans.map((p, i) => {
    const c: Control = { kind: 'radio', name: o.name, value: String(i + 1), checked: i === 0, disabled: o.disabled, size: o.size };
    return o.labels === false ? `  ${control({ ...c, aria: p.title })}` : choice(c, { title: p.title, desc: p.desc, end: o.end }, '  ');
  }), o.labels === false);

export const radio = {
  classes: [
    ['radio', 'Component', 'Native radio drawn as the DS ring, 20 px'],
    ['radio-sm', 'Size', 'Small, 16 px'],
    ['checked', 'Attribute', 'Picked: the ring thickens to 4 px in brand blue'],
    ['name', 'Attribute', 'Radios that share a name form one group, only one can be picked'],
    ['disabled', 'Attribute', 'Grey ring, no clicks'],
    ...common,
  ] as ClassRow[],
  examples: [
    {
      id: 'ex-basic',
      title: 'Basic',
      desc: 'A fieldset with a legend and radios that share a name. Pick one option by default when there is a sensible choice',
      html: radioGroup({ name: 'delivery' }),
    },
    {
      id: 'ex-sizes',
      title: 'Sizes',
      desc: 'Medium next to body text and in forms, Small in dense tables and filters',
      html: lines(control({ kind: 'radio', name: 'size', checked: true, aria: 'Medium' }), control({ kind: 'radio', size: 'Small', name: 'size-sm', checked: true, aria: 'Small' })),
    },
    {
      id: 'ex-disabled',
      title: 'Disabled',
      desc: 'Add disabled to one radio, or to the fieldset to turn off the whole group',
      html: lines(control({ kind: 'radio', name: 'off', disabled: true, aria: 'Off' }), control({ kind: 'radio', name: 'off-on', checked: true, disabled: true, aria: 'On' })),
    },
    {
      id: 'ex-end',
      title: 'Control on the right',
      desc: 'choice-end moves every radio to the right, for option lists where the text leads',
      html: radioGroup({ name: 'delivery-end', end: true }),
    },
    {
      id: 'ex-extras',
      title: 'Badge and link',
      desc: 'A badge marks the option most people pick, a link opens more detail',
      html: group('Plan', [
        choice({ kind: 'radio', name: 'plan', value: 'monthly' }, { title: 'Monthly', desc: 'Rp 99.000 per month' }, '  '),
        choice({ kind: 'radio', name: 'plan', value: 'yearly', checked: true }, { title: 'Yearly', badge: 'Save 20%', desc: 'Rp 950.000 per year', link: 'Compare plans' }, '  '),
      ]),
    },
    {
      id: 'ex-row',
      title: 'In a row',
      desc: 'choice-group-row lays short options side by side',
      html: group('Size', ['S', 'M', 'L'].map((s, i) => choice({ kind: 'radio', name: 'shirt', value: s, checked: i === 1 }, { title: s }, '  ')), true),
    },
  ] as Example[],
};

export const switchCode = {
  classes: [
    ['switch', 'Component', 'Native checkbox drawn as the DS switch, 36 × 20. Add role="switch"'],
    ['switch-sm', 'Size', 'Small, 28 × 16'],
    ['checked', 'Attribute', 'On: brand track, knob on the right'],
    ['disabled', 'Attribute', 'Grey knob, no clicks'],
    ...common,
  ] as ClassRow[],
  examples: [
    {
      id: 'ex-basic',
      title: 'Basic',
      desc: 'Off and on. A switch takes effect right away, so use it for settings, not for form answers',
      html: lines(control({ kind: 'switch', aria: 'Off' }), control({ kind: 'switch', checked: true, aria: 'On' })),
    },
    {
      id: 'ex-sizes',
      title: 'Sizes',
      desc: 'Medium for settings pages and forms, Small for dense lists and table rows',
      html: lines(control({ kind: 'switch', checked: true, aria: 'Medium' }), control({ kind: 'switch', size: 'Small', checked: true, aria: 'Small' })),
    },
    {
      id: 'ex-disabled',
      title: 'Disabled',
      desc: 'Add the disabled attribute. The knob keeps its position and turns grey',
      html: lines(control({ kind: 'switch', disabled: true, aria: 'Off' }), control({ kind: 'switch', checked: true, disabled: true, aria: 'On' })),
    },
    {
      id: 'ex-label',
      title: 'With a label',
      desc: 'Settings usually lead with the text, so add choice-end to put the switch on the right',
      html: choice({ kind: 'switch', checked: true }, { title: 'Dark mode', desc: 'Follow the system setting at night', end: true }),
    },
    {
      id: 'ex-extras',
      title: 'Badge and link',
      desc: 'A badge flags a beta or a new setting, a link explains what it changes',
      html: choice({ kind: 'switch' }, { title: 'Smart replies', badge: 'Beta', desc: 'Suggest short answers to new messages', link: 'How it works', end: true }),
    },
    {
      id: 'ex-group',
      title: 'Settings list',
      desc: 'A fieldset groups related settings under one legend',
      html: group('Privacy', [
        choice({ kind: 'switch', checked: true }, { title: 'Show my profile', desc: 'People in your company can find you', end: true }, '  '),
        choice({ kind: 'switch' }, { title: 'Share activity', desc: 'Let teammates see when you are online', end: true }, '  '),
        choice({ kind: 'switch', checked: true, disabled: true }, { title: 'Security alerts', desc: 'Always on for admin accounts', end: true }, '  '),
      ]),
    },
  ] as Example[],
};
