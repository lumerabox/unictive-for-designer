// values read from the Stepper page of Unictive Design System 1.0: Step-variant, Stepper-horizontal and Stepper-vertical
export const indicators = ['Filled', 'Stroke', 'Shape-01', 'Shape-02'] as const;
export const sizes = ['Large', 'Small'] as const;
export const states = ['Default', 'Active', 'Finish'] as const;
export const layouts = [
  ['h01', 'Horizontal 01 · bar after'],
  ['h02', 'Horizontal 02 · inline'],
  ['h03', 'Horizontal 03 · centered'],
  ['h04', 'Horizontal 04 · top bar'],
  ['v01', 'Vertical 01 · line'],
  ['v02', 'Vertical 02 · card'],
] as const;
export type Indicator = (typeof indicators)[number];
export type Size = (typeof sizes)[number];
export type State = (typeof states)[number];
export type Layout = (typeof layouts)[number][0];

// Step-variant 48, Stepper-horizontal 24, Stepper-vertical 12
export const variantCount = 84;

export const steps = [
  { label: 'Step 01', name: 'Account' },
  { label: 'Step 02', name: 'Company' },
  { label: 'Step 03', name: 'Payment' },
  { label: 'Step 04', name: 'Review' },
];
const badgeText: Record<State, string> = { Finish: 'Done', Active: 'In progress', Default: 'Pending' };

const check = '<svg class="u-step-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function indicator(state: State, n: number, o: { type?: Indicator; size?: Size; rounded?: boolean } = {}) {
  const { type = 'Filled', size = 'Large', rounded = true } = o;
  const shape = type.startsWith('Shape');
  const inner = shape ? '<i class="u-step-dot"></i>' : state === 'Finish' ? check : `<span>${String(n).padStart(2, '0')}</span>`;
  return `<span class="u-step-ind" data-type="${type.toLowerCase()}" data-state="${state.toLowerCase()}" data-size="${size.toLowerCase()}" data-rounded="${rounded}">${inner}</span>`;
}

export interface Opts {
  layout?: Layout;
  type?: Indicator;
  size?: Size;
  rounded?: boolean;
  badge?: boolean;
  current?: number;
  steps?: { label: string; name: string }[];
  live?: boolean;
}

export const stateOf = (i: number, current: number): State => (i < current ? 'Finish' : i === current ? 'Active' : 'Default');

export function render(o: Opts) {
  const { layout = 'h01', type = 'Filled', size = 'Large', rounded = true, badge = true, current = 1, steps: ss = steps, live = false } = o;
  const vertical = layout.startsWith('v');
  const items = ss.map((s, i) => {
    const st = stateOf(i, current);
    const ind = indicator(st, i + 1, { type, size, rounded });
    const text = `<span class="u-step-text"><span class="u-step-label">${s.label}</span><span class="u-step-name">${s.name}</span>${badge ? `<span class="u-step-badge">${badgeText[st]}</span>` : ''}</span>`;
    const last = i === ss.length - 1;
    const bar = (cls = '') => `<span class="u-step-bar${cls}"><i></i></span>`;
    let body: string;
    if (layout === 'h01') body = `<span class="u-step-head">${ind}${last ? '' : bar()}</span>${text}`;
    else if (layout === 'h02') body = `<span class="u-step-row">${ind}${text}</span>${last ? '' : bar()}`;
    else if (layout === 'h03') body = `<span class="u-step-head">${bar(i === 0 ? ' is-off' : ' is-in')}${ind}${bar(last ? ' is-off' : ' is-out')}</span>${text}`;
    else if (layout === 'h04') body = `${bar(' is-top')}<span class="u-step-row">${ind}${text}</span>`;
    else if (layout === 'v01') body = `<span class="u-step-head">${ind}${last ? '' : bar()}</span>${text}`;
    else body = `${ind}${text}`;
    const tag = live && st === 'Finish' ? 'button type="button"' : 'li';
    const close = tag === 'li' ? 'li' : 'button';
    const inner = `<${tag} class="u-step" data-state="${st.toLowerCase()}" data-step="${i}" data-key="step-${i}"${st === 'Active' ? ' aria-current="step"' : ''}>${body}</${close}>`;
    return tag === 'li' ? inner : `<li class="u-step-li">${inner}</li>`;
  });
  const data = live ? ` data-live data-c="stepper" data-opts='${JSON.stringify({ layout, type, size, rounded, badge, current })}'` : '';
  return `<ol class="u-stepper" data-layout="${layout}" data-orient="${vertical ? 'v' : 'h'}" data-size="${size.toLowerCase()}" aria-label="Progress"${data}>${items.join('')}</ol>`;
}

export function chip(o: { layout: Layout; type: Indicator; size: Size; rounded: boolean }) {
  const set = o.layout.startsWith('v') ? 'Stepper-vertical' : 'Stepper-horizontal';
  return `${set} · Type=${o.layout.slice(1)} · Size=${o.size} · Step=${o.type} · Rounded=${o.rounded}`;
}
