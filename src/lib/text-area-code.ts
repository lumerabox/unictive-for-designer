// code for developers: text area classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { maxLength, showsValue, type Size, type State, type Style } from '../data/text-area';

interface Area {
  id: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  caption?: string;
  counter?: boolean;
  size?: Size;
  style?: Style;
  placeholder?: string;
  value?: string;
  invalid?: boolean;
  disabled?: boolean;
}

// one field: label, text area, caption and counter, each part only when asked for
function area(a: Area) {
  const cls = ['textarea', a.size === 'Small' && 'textarea-sm', a.style === 'Contained' && 'textarea-contained'].filter(Boolean).join(' ');
  const foot = a.caption !== undefined || a.counter;
  const attrs = [
    `id="${a.id}"`,
    `class="${cls}"`,
    a.placeholder && `placeholder="${a.placeholder}"`,
    a.counter && `maxlength="${maxLength}"`,
    !a.label && `aria-label="${a.placeholder ?? 'Text'}"`,
    a.caption !== undefined && `aria-describedby="${a.id}-caption"`,
    a.invalid && 'aria-invalid="true"',
    a.disabled && 'disabled',
  ].filter(Boolean).join(' ');
  const label = a.label && `  <label class="field-label" for="${a.id}">${a.label}${a.required ? '<span class="field-req">*</span>' : ''}${a.optional ? '<span class="field-opt">(Optional)</span>' : ''}</label>`;
  return [
    '<div class="field">',
    label,
    `  <textarea ${attrs}>${a.value ?? ''}</textarea>`,
    foot && '  <div class="field-foot">',
    a.caption !== undefined && `    <span class="field-caption" id="${a.id}-caption">${a.caption}</span>`,
    a.counter && `    <span class="field-counter">${[...(a.value ?? '')].length}/${maxLength} Characters</span>`,
    foot && '  </div>',
    '</div>',
  ].filter(Boolean).join('\n');
}

export interface AreaSpec {
  style: Style;
  size: Size;
  state: State;
  label: boolean;
  required: boolean;
  optional: boolean;
  caption: boolean;
  counter: boolean;
  text: string;
}

// the playground variant as html: focus is the browser's own state, so it reads like Placeholder
export function textAreaHtml(s: AreaSpec) {
  return area({
    id: 'message',
    label: s.label ? 'Label' : undefined,
    required: s.required,
    optional: s.optional,
    caption: s.caption ? 'Input caption' : undefined,
    counter: s.counter,
    size: s.size,
    style: s.style,
    placeholder: s.text,
    value: showsValue(s.state) ? s.text : undefined,
    invalid: s.state === 'Error',
    disabled: s.state === 'Disable',
  });
}

export const classes: ClassRow[] = [
  ['field', 'Component', 'Wrapper that stacks the label, the control and the caption row with 4 px gaps'],
  ['field-label', 'Part', 'Label above the control, Label 14/20. Point for at the text area id'],
  ['field-req', 'Part', 'Red asterisk for a required field'],
  ['field-opt', 'Part', 'Grey (Optional) hint'],
  ['textarea', 'Component', 'The text area, Outline and 120 px high. People can drag it taller'],
  ['textarea-sm', 'Size', 'Small, 80 px high'],
  ['textarea-contained', 'Style', 'Grey fill without a border, for denser or tinted layouts'],
  ['field-foot', 'Part', 'Row under the control for the caption and the counter'],
  ['field-caption', 'Part', 'Helper or error text, 12/16. Link it with aria-describedby'],
  ['field-counter', 'Part', 'Character count, 10/12, sits on the right'],
  ['aria-invalid="true"', 'Attribute', 'Error: red border and red caption'],
  ['disabled', 'Attribute', 'Disabled look, no typing'],
];

const lorem = 'The invoice arrived two days late, but support sorted it out quickly';

export const examples: Example[] = [
  {
    id: 'ex-basic',
    title: 'Basic',
    desc: 'A label, the text area and a caption. Keep the label short and put the extra help in the caption',
    html: area({ id: 'notes', label: 'Notes', placeholder: 'Add a note for the team', caption: 'Only visible to your team' }),
  },
  {
    id: 'ex-sizes',
    title: 'Sizes',
    desc: 'Large fits a few sentences, Small suits short notes in dense forms',
    html: [area({ id: 'size-lg', label: 'Large', placeholder: 'Placeholder text' }), area({ id: 'size-sm', label: 'Small', size: 'Small', placeholder: 'Placeholder text' })].join('\n'),
  },
  {
    id: 'ex-styles',
    title: 'Styles',
    desc: 'Outline sits on white surfaces. Add textarea-contained for a grey fill without a border',
    html: [area({ id: 'style-outline', label: 'Outline', placeholder: 'Placeholder text' }), area({ id: 'style-contained', label: 'Contained', style: 'Contained', placeholder: 'Placeholder text' })].join('\n'),
  },
  {
    id: 'ex-required',
    title: 'Required and optional',
    desc: 'Mark the few fields people must fill with an asterisk, or the few they can skip with (Optional). Add required to the text area for browser validation',
    html: [area({ id: 'reason', label: 'Reason', required: true, placeholder: 'Why are you cancelling?' }), area({ id: 'extra', label: 'Anything else', optional: true, placeholder: 'Tell us more' })].join('\n'),
  },
  {
    id: 'ex-counter',
    title: 'With a counter',
    desc: `maxlength stops typing at ${maxLength} characters. The counter is plain text, update it from your app when the value changes. Type in the preview to try it`,
    html: area({ id: 'feedback', label: 'Feedback', placeholder: 'Tell us what worked and what didn’t', caption: 'Visible to the design team only', counter: true }),
  },
  {
    id: 'ex-error',
    title: 'Error',
    desc: 'Set aria-invalid="true" and write what to fix in the caption. The border and the caption turn red',
    html: area({ id: 'address', label: 'Delivery address', required: true, value: 'Jl. Sudirman', caption: 'Add the building number and the postal code', invalid: true }),
  },
  {
    id: 'ex-disabled',
    title: 'Disabled',
    desc: 'Add the disabled attribute when the value can’t change right now, and say why in the caption',
    html: [area({ id: 'locked', label: 'Outline', value: lorem, caption: 'Locked after the invoice was sent', disabled: true }), area({ id: 'locked-c', label: 'Contained', style: 'Contained', value: lorem, caption: 'Locked after the invoice was sent', disabled: true })].join('\n'),
  },
  {
    id: 'ex-no-label',
    title: 'Without a label',
    desc: 'When the context already names the field, like a comment box, drop the label and keep an aria-label for screen readers',
    html: area({ id: 'comment', size: 'Small', placeholder: 'Write a comment' }),
  },
];
