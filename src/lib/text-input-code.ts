// code for developers: text input classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { icon20, xClose } from '../components/field/icons';
import { hasLeadIcon, hasTrailIcon, showsValue, type Size, type State, type Style, type Type } from '../data/text-input';

const icon = (d: string) => `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="${d}" /></svg>`;
const tagX = `<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="${xClose}" /></svg>`;
const options = ['IDR', 'USD', 'SGD'];

interface Input {
  id: string;
  type?: Type;
  label?: string;
  required?: boolean;
  optional?: boolean;
  caption?: string;
  size?: Size;
  style?: Style;
  placeholder?: string;
  value?: string;
  tags?: string[];
  leadIcon?: boolean;
  trailIcon?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  // texts for the addons and the dropdown segment
  addon?: string;
  inputType?: string;
}

// one field: label, the control with its addons and the caption, each part only when asked for
function input(a: Input) {
  const type = a.type ?? 'Default';
  const control = [
    'field-control',
    a.size === 'Large' && 'field-control-lg',
    a.size === 'Small' && 'field-control-sm',
    a.style === 'Contained' && 'field-control-contained',
  ].filter(Boolean).join(' ');
  const attrs = [
    `id="${a.id}"`,
    'class="field-input"',
    `type="${a.inputType ?? (type === 'Password' ? 'password' : 'text')}"`,
    a.placeholder && `placeholder="${a.placeholder}"`,
    a.value && `value="${a.value}"`,
    !a.label && `aria-label="${a.placeholder ?? 'Text'}"`,
    a.caption !== undefined && `aria-describedby="${a.id}-caption"`,
    a.invalid && 'aria-invalid="true"',
    a.disabled && 'disabled',
  ].filter(Boolean).join(' ');
  const select = (side: string) =>
    `<select class="field-select" aria-label="${side}"${a.disabled ? ' disabled' : ''}>${options.map((o) => `<option>${o}</option>`).join('')}</select>`;

  const inner = [
    type === 'Leading Dropdown' && select('Currency'),
    hasLeadIcon(type) && a.leadIcon !== false && icon(icon20.check),
    ...(type === 'Tag Input' ? (a.tags ?? []).map((t) => `<span class="field-tag">${t}<button type="button" aria-label="Remove ${t}"${a.disabled ? ' disabled' : ''}>${tagX}</button></span>`) : []),
    `<input ${attrs} />`,
    hasTrailIcon(type) && a.trailIcon !== false && icon(icon20.info),
    type === 'Trailing Dropdown' && select('Unit'),
  ].filter(Boolean) as string[];

  const lead = type === 'Leading Text' && `<span class="field-addon">${a.addon ?? 'https://'}</span>`;
  const trail =
    type === 'Trailing Button' ? `<button type="button" class="field-addon"${a.disabled ? ' disabled' : ''}>${icon(icon20.copy)}${a.addon ?? 'Copy'}</button>`
    : type === 'File Upload' ? `<label class="field-addon">${a.addon ?? 'Upload'}<input type="file"${a.disabled ? ' disabled' : ''} /></label>`
    : null;
  const group = Boolean(lead || trail);
  const pad = group ? '    ' : '  ';
  const box = [
    `<div class="${control}">`,
    ...inner.map((s) => `  ${s}`),
    '</div>',
  ].map((s) => pad + s);
  const label = a.label && `  <label class="field-label" for="${a.id}">${a.label}${a.required ? '<span class="field-req">*</span>' : ''}${a.optional ? '<span class="field-opt">(Optional)</span>' : ''}</label>`;
  return [
    '<div class="field">',
    label,
    group && '  <div class="field-group">',
    lead && `    ${lead}`,
    ...box,
    trail && `    ${trail}`,
    group && '  </div>',
    a.caption !== undefined && `  <div class="field-foot"><span class="field-caption" id="${a.id}-caption">${a.caption}</span></div>`,
    '</div>',
  ].filter(Boolean).join('\n');
}

export interface InputSpec {
  style: Style;
  size: Size;
  state: State;
  type: Type;
  label: boolean;
  required: boolean;
  optional: boolean;
  caption: boolean;
  leadIcon: boolean;
  trailIcon: boolean;
  text: string;
}

// the playground variant as html: focus is the browser's own state, so it reads like Placeholder
export function textInputHtml(s: InputSpec) {
  const tag = s.type === 'Tag Input';
  const pwd = s.type === 'Password';
  return input({
    id: 'text-input',
    type: s.type,
    label: s.label ? 'Label' : undefined,
    required: s.required,
    optional: s.optional,
    caption: s.caption ? 'Input caption' : undefined,
    size: s.size,
    style: s.style,
    placeholder: tag ? undefined : s.text,
    value: showsValue(s.state) && !tag ? (pwd ? 'password' : s.text) : undefined,
    tags: tag ? (s.state === 'Filled' ? ['Tag', 'Tag-02'] : ['Tag']) : undefined,
    leadIcon: s.leadIcon,
    trailIcon: s.trailIcon,
    invalid: s.state === 'Error',
    disabled: s.state === 'Disable',
  });
}

export const classes: ClassRow[] = [
  ['field', 'Component', 'Wrapper that stacks the label, the control and the caption row with 4 px gaps'],
  ['field-label', 'Part', 'Label above the control, Label 14/20. Point for at the input id'],
  ['field-req', 'Part', 'Red asterisk for a required field'],
  ['field-opt', 'Part', 'Grey (Optional) hint'],
  ['field-control', 'Component', 'The 40 px Outline frame around the input and its icons. Medium size'],
  ['field-control-lg', 'Size', 'Large, 48 px high'],
  ['field-control-sm', 'Size', 'Small, 32 px high with 16 px icons'],
  ['field-control-contained', 'Style', 'Grey fill without a border, addons in the group turn darker grey'],
  ['field-input', 'Part', 'The native input inside the frame, takes the free width'],
  ['field-group', 'Component', 'Row that joins a field control with a leading or trailing addon'],
  ['field-addon', 'Part', 'Leading text on a span, a trailing action on a button, or an upload on a label around the file input'],
  ['field-select', 'Part', 'Native select inside the frame for Leading and Trailing Dropdown, with the DS chevron'],
  ['field-tag', 'Part', 'Tag before the input of a Tag Input, with a remove button'],
  ['field-foot', 'Part', 'Row under the control for the caption'],
  ['field-caption', 'Part', 'Helper or error text, 12/16. Link it with aria-describedby'],
  ['aria-invalid="true"', 'Attribute', 'On the input. Error: red border and red caption'],
  ['disabled', 'Attribute', 'On the input, and on the addon button or select. Disabled look, no typing'],
];

export const examples: Example[] = [
  {
    id: 'ex-basic',
    title: 'Basic',
    desc: 'A label, the input and a caption. Keep the label short and put format rules in the caption',
    html: input({ id: 'email', label: 'Email', inputType: 'email', placeholder: 'name@company.com', caption: 'We send the receipt to this address', leadIcon: false, trailIcon: false }),
  },
  {
    id: 'ex-icons',
    title: 'With icons',
    desc: 'Put an svg before or after the input inside field-control. Icons are 20 px, 16 px on Small',
    html: input({ id: 'name', label: 'Full name', placeholder: 'Placeholder text', caption: 'Input caption' }),
  },
  {
    id: 'ex-sizes',
    title: 'Sizes',
    desc: 'Add field-control-lg or field-control-sm to the frame. Medium needs no class',
    html: (['Large', 'Medium', 'Small'] as Size[]).map((z) => input({ id: `size-${z.toLowerCase()}`, label: z, size: z, placeholder: 'Placeholder text' })).join('\n'),
    stack: true,
  },
  {
    id: 'ex-styles',
    title: 'Styles',
    desc: 'Outline sits on white surfaces. Add field-control-contained for a grey fill without a border',
    html: [input({ id: 'style-outline', label: 'Outline', placeholder: 'Placeholder text' }), input({ id: 'style-contained', label: 'Contained', style: 'Contained', placeholder: 'Placeholder text' })].join('\n'),
    stack: true,
  },
  {
    id: 'ex-password',
    title: 'Password',
    desc: 'type="password" hides the value. Add autocomplete="current-password" or "new-password" in your form',
    html: input({ id: 'password', type: 'Password', label: 'Password', required: true, value: 'password', caption: 'At least 8 characters' }),
  },
  {
    id: 'ex-leading-text',
    title: 'Leading text',
    desc: 'Wrap the frame in field-group and put a field-addon span before it for a fixed prefix',
    html: input({ id: 'website', type: 'Leading Text', label: 'Website', placeholder: 'www.company.com', addon: 'https://' }),
  },
  {
    id: 'ex-trailing-button',
    title: 'Trailing button',
    desc: 'A field-addon button after the frame runs an action on the value, like copy or apply',
    html: input({ id: 'invite', type: 'Trailing Button', label: 'Invite link', value: 'unictive.com/invite/8F2K', caption: 'Anyone with the link can join' }),
  },
  {
    id: 'ex-file-upload',
    title: 'File upload',
    desc: 'A label with field-addon around a file input opens the file picker. Show the picked name in the input from your app',
    html: input({ id: 'contract', type: 'File Upload', label: 'Contract', placeholder: 'No file chosen', caption: 'PDF up to 10 MB' }),
  },
  {
    id: 'ex-dropdowns',
    title: 'Leading and trailing dropdown',
    desc: 'A field-select inside the frame picks a unit or a currency next to the value',
    html: [input({ id: 'amount', type: 'Leading Dropdown', label: 'Amount', placeholder: '0.00' }), input({ id: 'price', type: 'Trailing Dropdown', label: 'Price', placeholder: '0.00' })].join('\n'),
    stack: true,
  },
  {
    id: 'ex-tags',
    title: 'Tag input',
    desc: 'field-tag spans sit before the input. Add a tag on Enter and remove it from the x button in your app',
    html: input({ id: 'skills', type: 'Tag Input', label: 'Skills', tags: ['Figma', 'Research'], placeholder: 'Add a skill' }),
  },
  {
    id: 'ex-error',
    title: 'Error',
    desc: 'Set aria-invalid="true" on the input and write what to fix in the caption. The border and the caption turn red',
    html: input({ id: 'phone', label: 'Phone number', required: true, value: '0812', caption: 'Enter at least 10 digits', invalid: true, leadIcon: false }),
  },
  {
    id: 'ex-disabled',
    title: 'Disabled',
    desc: 'Add disabled to the input when the value can’t change right now, and say why in the caption',
    html: [
      input({ id: 'locked', label: 'Outline', value: 'INV-2026-0142', caption: 'Set by the system', disabled: true }),
      input({ id: 'locked-c', label: 'Contained', style: 'Contained', type: 'Trailing Button', value: 'INV-2026-0142', caption: 'Set by the system', disabled: true }),
    ].join('\n'),
    stack: true,
  },
];
