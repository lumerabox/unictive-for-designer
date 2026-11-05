// global.css for developers: theme additions and one block per component, plus the same rules for the docs previews
import { tailwind } from './tokens-export';
import { paths } from '../data/rating';

const host = new URL(import.meta.env.SITE).host;
const head = `/* Unictive Design System 1.0 · global.css · ${host} */
@import "tailwindcss";
@import "./unictive-tailwind.css"; /* Foundations → Export → Tailwind v4 */
`;

const theme = `
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --ease-unictive: cubic-bezier(0.2, 0, 0, 1);

  /* control stroke: neutral buttons and field borders read #dedede in the component sets, the variable export gives #d1d1d1 */
  --color-stroke-control: #dedede;
`;

const base = `
@layer base {
  body {
    font-family: var(--font-sans);
    color: var(--color-text-strong-950);
    -webkit-font-smoothing: antialiased;
  }
}
`;

const button = `
  .btn {
    --btn-h: 40px;
    --btn-px: var(--spacing-10);
    --btn-r: var(--radius-8);
    --btn-icon: 20px;
    --btn-stroke: 1.92;
    --btn-text: var(--text-label-sm);
    --btn-leading: var(--text-label-sm--line-height);
    --btn-tracking: var(--text-label-sm--letter-spacing);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-8);
    height: var(--btn-h);
    padding: 0 calc(var(--btn-px) + var(--spacing-4));
    border: 0;
    border-radius: var(--btn-r);
    font: 500 var(--btn-text) / var(--btn-leading) var(--font-sans);
    letter-spacing: var(--btn-tracking);
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    background: var(--btn-bg);
    color: var(--btn-fg);
    box-shadow: inset 0 0 0 1px var(--btn-bd);
    transition: background-color 120ms var(--ease-unictive), color 120ms var(--ease-unictive), box-shadow 120ms var(--ease-unictive);
  }
  /* the label keeps 4 px of its own inset, an icon sits on the padding edge */
  .btn > svg:first-child { margin-left: calc(var(--spacing-4) * -1); }
  .btn > svg:last-child { margin-right: calc(var(--spacing-4) * -1); }
  .btn > svg {
    width: var(--btn-icon);
    height: var(--btn-icon);
    flex: none;
    stroke: currentColor;
    stroke-width: var(--btn-stroke);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* size, btn-md is the base size above */
  .btn-lg { --btn-h: 48px; --btn-px: var(--spacing-12); --btn-icon: 24px; --btn-stroke: 2; --btn-text: var(--text-label-md); --btn-leading: var(--text-label-md--line-height); --btn-tracking: var(--text-label-md--letter-spacing); }
  .btn-sm { --btn-h: 32px; --btn-px: var(--spacing-8); --btn-r: var(--radius-6); --btn-icon: 16px; --btn-stroke: 2.4; }
  .btn-rounded { --btn-r: var(--radius-full); }
  .btn-block { display: flex; width: 100%; }
  .btn-icon { width: var(--btn-h); padding: 0; }
  .btn-icon > svg:only-child { margin: 0; fill: none; }

  /* type */
  .btn, .btn-main { --btn-base: var(--color-brand-core-base); --btn-base-hover: var(--color-brand-core-dark); --btn-lighter: var(--color-brand-core-lighter); --btn-tint: var(--color-brand-core-base); --btn-tint-hover: var(--color-brand-core-base); --btn-line: var(--color-brand-core-base); }
  .btn-neutral { --btn-base: var(--color-bg-surface-800); --btn-base-hover: var(--color-bg-strong-950); --btn-lighter: var(--color-bg-weak-50); --btn-tint: var(--color-text-sub-600); --btn-tint-hover: var(--color-text-strong-950); --btn-line: var(--color-stroke-control); }
  .btn-error { --btn-base: var(--color-state-error-base); --btn-base-hover: var(--color-state-error-dark); --btn-lighter: var(--color-state-error-lighter); --btn-tint: var(--color-state-error-base); --btn-tint-hover: var(--color-state-error-base); --btn-line: var(--color-state-error-base); }

  /* style: default look, then the hover look */
  .btn, .btn-primary { --btn-bg: var(--btn-base); --btn-fg: var(--color-text-white-0); --btn-bd: transparent; --btn-bg-h: var(--btn-base-hover); --btn-fg-h: var(--color-text-white-0); --btn-bd-h: transparent; }
  .btn-secondary { --btn-bg: var(--btn-lighter); --btn-fg: var(--btn-tint); --btn-bd: transparent; --btn-bg-h: transparent; --btn-fg-h: var(--btn-tint-hover); --btn-bd-h: var(--btn-line); }
  .btn-tertiary { --btn-bg: transparent; --btn-fg: var(--btn-tint); --btn-bd: var(--btn-line); --btn-bg-h: var(--btn-lighter); --btn-fg-h: var(--btn-tint-hover); --btn-bd-h: transparent; }
  .btn-ghost { --btn-bg: transparent; --btn-fg: var(--btn-tint); --btn-bd: transparent; --btn-bg-h: var(--btn-lighter); --btn-fg-h: var(--btn-tint-hover); --btn-bd-h: transparent; }

  /* state */
  @media (hover: hover) {
    .btn:not(:disabled, [aria-disabled="true"]):hover { background: var(--btn-bg-h); color: var(--btn-fg-h); box-shadow: inset 0 0 0 1px var(--btn-bd-h); }
  }
  .btn:disabled, .btn[aria-disabled="true"] { background: var(--color-bg-weak-50); color: var(--color-text-disabled-300); box-shadow: none; cursor: not-allowed; }
  .btn[aria-disabled="true"] { pointer-events: none; }
  .btn:focus-visible { outline: 2px solid var(--color-brand-core-alpha-16); outline-offset: 2px; }
`;

const field = `
  .field { display: grid; gap: var(--spacing-4); min-width: 0; }
  .field-label {
    display: flex;
    gap: var(--spacing-2);
    font: 500 var(--text-label-sm) / var(--text-label-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-label-sm--letter-spacing);
    color: var(--color-text-strong-950);
    white-space: nowrap;
  }
  .field-req { color: var(--color-state-error-base); }
  .field-opt { color: var(--color-text-soft-400); }
  .field-foot {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    font: 400 var(--text-paragraph-xs) / var(--text-paragraph-xs--line-height) var(--font-sans);
    color: var(--color-text-sub-600);
  }
  .field-caption { flex: 1; min-width: 0; }
  .field-counter { margin-left: auto; font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); white-space: nowrap; }
  .field:has([aria-invalid="true"]) .field-caption { color: var(--color-state-error-base); }

  /* text area */
  .textarea {
    --field-bg: var(--color-bg-white-0);
    --field-bd: var(--color-stroke-control);
    --field-fg: var(--color-text-strong-950);
    --field-ph: var(--color-text-soft-400);

    display: block;
    width: 100%;
    height: 120px;
    min-height: 80px;
    margin: 0;
    padding: var(--spacing-10) var(--spacing-12);
    border: 0;
    border-radius: var(--radius-8);
    outline: 0;
    background: var(--field-bg);
    box-shadow: inset 0 0 0 1px var(--field-bd);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    color: var(--field-fg);
    caret-color: var(--color-text-strong-950);
    resize: vertical;
    transition: box-shadow 120ms var(--ease-unictive), background-color 120ms var(--ease-unictive);
  }
  .textarea::placeholder { color: var(--field-ph); opacity: 1; }
  /* the DS resize mark, Chrome and Safari */
  .textarea::-webkit-resizer { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M9.11111 2L2 9.11111M10 6.44444L6.44444 10' stroke='%235c5c5c'/%3E%3C/svg%3E") right 2px bottom 2px / 12px no-repeat; }
  .textarea-sm { height: 80px; }
  .textarea-contained { --field-bg: var(--color-bg-weak-50); --field-bd: transparent; }

  .textarea:focus:not([aria-invalid="true"]) { --field-bd: var(--color-brand-core-base); }
  .textarea[aria-invalid="true"] { --field-bd: var(--color-state-error-base); }
  .textarea:disabled { --field-bg: var(--color-bg-weak-50); --field-fg: var(--color-text-sub-600); --field-ph: var(--color-text-soft-400); cursor: not-allowed; -webkit-text-fill-color: var(--field-fg); }
  .textarea-contained:disabled { --field-fg: var(--color-text-disabled-300); --field-ph: var(--color-text-disabled-300); }
  .textarea:disabled::placeholder { -webkit-text-fill-color: var(--field-ph); }

  /* field control: the 40 px frame of a dropdown, a date picker or any input with an icon */
  .field-control {
    --field-bg: var(--color-bg-white-0);
    --field-bd: var(--color-stroke-control);
    --field-fg: var(--color-text-strong-950);
    --field-ph: var(--color-text-soft-400);
    --field-ic: var(--color-icon-sub-600);
    --field-icon: 20px;

    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0 var(--spacing-12);
    border: 0;
    border-radius: var(--radius-8);
    background: var(--field-bg);
    box-shadow: inset 0 0 0 1px var(--field-bd);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    color: var(--field-fg);
    text-align: left;
    transition: box-shadow 120ms var(--ease-unictive), background-color 120ms var(--ease-unictive);
  }
  button.field-control { cursor: pointer; }
  .field-control-lg { height: 48px; }
  .field-control-sm { height: 32px; --field-icon: 16px; }
  .field-control-contained { --field-bg: var(--color-bg-weak-50); --field-bd: transparent; }
  .field-control > svg { width: var(--field-icon); height: var(--field-icon); flex: none; color: var(--field-ic); stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: rotate 160ms var(--ease-unictive); }
  .field-value { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .field-placeholder { color: var(--field-ph); }
  .field-input { flex: 1; min-width: 0; height: 100%; margin: 0; padding: 0; border: 0; outline: 0; background: transparent; font: inherit; letter-spacing: inherit; color: inherit; caret-color: var(--color-text-strong-950); }
  .field-input::placeholder { color: var(--field-ph); opacity: 1; }

  .field-control:is(:focus-within, [aria-expanded="true"]):not([aria-invalid="true"]) { --field-bd: var(--color-brand-core-base); }
  .field-control:focus-visible { outline: 0; }
  .field-control[aria-invalid="true"], .field-control:has([aria-invalid="true"]) { --field-bd: var(--color-state-error-base); }
  .field-control:is(:disabled, :has(:disabled)) { --field-bg: var(--color-bg-weak-50); --field-fg: var(--color-text-sub-600); --field-ph: var(--color-text-sub-600); --field-ic: #a4a4a4; cursor: not-allowed; }
  .field-control-contained:is(:disabled, :has(:disabled)) { --field-fg: var(--color-text-disabled-300); --field-ph: var(--color-text-disabled-300); --field-ic: var(--color-icon-disabled-300); }

  /* text input group: a field control between addons, like a leading text or a trailing button */
  .field-group {
    --addon-bg: var(--color-bg-white-0);
    --addon-bd: var(--color-stroke-control);

    display: flex;
    width: 100%;
    border-radius: var(--radius-8);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
  }
  .field-group:has(> .field-control-contained) { --addon-bg: var(--color-bg-soft-200); --addon-bd: transparent; }
  .field-group > .field-control { flex: 1; min-width: 0; border-radius: 0; }
  .field-group > .field-control:first-child { border-radius: var(--radius-8) 0 0 var(--radius-8); }
  .field-group > .field-control:last-child { border-radius: 0 var(--radius-8) var(--radius-8) 0; }
  .field-addon {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    flex: none;
    margin: 0;
    padding: 0 var(--spacing-12);
    border: 0;
    background: var(--addon-bg);
    font: inherit;
    letter-spacing: inherit;
    color: var(--color-text-strong-950);
    white-space: nowrap;
    transition: background-color 120ms var(--ease-unictive);
  }
  .field-addon:first-child { border-radius: var(--radius-8) 0 0 var(--radius-8); box-shadow: inset 1px 0 var(--addon-bd), inset 0 1px var(--addon-bd), inset 0 -1px var(--addon-bd); }
  .field-addon:last-child { border-radius: 0 var(--radius-8) var(--radius-8) 0; box-shadow: inset -1px 0 var(--addon-bd), inset 0 1px var(--addon-bd), inset 0 -1px var(--addon-bd); }
  .field-addon:is(button, label) { font-weight: 500; cursor: pointer; }
  .field-addon > svg { width: 20px; height: 20px; flex: none; color: var(--color-icon-sub-600); stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .field-addon > input[type="file"] { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
  .field-addon:focus-visible, .field-addon:has(:focus-visible) { outline: 2px solid var(--color-brand-core-alpha-16); outline-offset: -2px; }
  @media (hover: hover) {
    .field-addon:is(button, label):not(:disabled, :has(:disabled)):hover { --addon-bg: var(--color-bg-weak-50); }
  }
  .field-group:has(:disabled) > .field-addon { color: var(--color-text-disabled-300); cursor: not-allowed; }
  .field-group:has(:disabled) > .field-addon > svg { color: var(--color-icon-disabled-300); }

  /* dropdown segment inside a field control, a native select with the DS chevron */
  .field-select {
    flex: none;
    height: 100%;
    margin: 0;
    padding: 0 calc(var(--field-icon) + var(--spacing-4)) 0 0;
    border: 0;
    outline: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%235c5c5c' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") right center / var(--field-icon) no-repeat;
    font: inherit;
    letter-spacing: inherit;
    color: var(--color-text-strong-950);
    appearance: none;
    cursor: pointer;
  }
  .field-select:disabled { color: var(--field-fg); cursor: not-allowed; opacity: 1; }

  /* tags before the input of a tag input */
  .field-control:has(> .field-tag:first-child) { padding-left: var(--spacing-8); }
  .field-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    flex: none;
    height: 24px;
    padding: 0 var(--spacing-4) 0 6px;
    border-radius: var(--radius-4);
    box-shadow: inset 0 0 0 1px var(--color-stroke-control);
    font-size: var(--text-paragraph-xs);
    line-height: var(--text-paragraph-xs--line-height);
    letter-spacing: 0;
    color: var(--color-text-strong-950);
    white-space: nowrap;
  }
  .field-tag > button { display: grid; place-items: center; width: 12px; height: 12px; margin: 0; padding: 0; border: 0; background: none; color: #a4a4a4; cursor: pointer; }
  .field-tag svg { width: 12px; height: 12px; stroke: currentColor; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
  .field-control:has(:disabled) .field-tag { color: var(--field-ph); }
  .field-control:has(:disabled) .field-tag > button { pointer-events: none; }
`;

// svg as a css url, for masks and small marks
const svg = (body: string, box = 20) =>
  `url("data:image/svg+xml,${`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${box} ${box}'>${body}</svg>`.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23')}")`;

const choice = `
  /* checkbox: a native input drawn like the DS box, 1.4 px line on a 20 px grid */
  .checkbox {
    --check-line: var(--color-icon-soft-400);
    --check-box: transparent;
    --check-on: var(--color-brand-core-base);
    --check-bw: 1.8px;
    --check-sw: 1.4px;

    appearance: none;
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    border: var(--check-bw) solid transparent;
    border-radius: 6.5px;
    background: var(--check-box) center / 100% no-repeat border-box;
    background-clip: padding-box;
    box-shadow: inset 0 0 0 var(--check-sw) var(--check-line);
    vertical-align: middle;
    cursor: pointer;
    transition: background-color 120ms var(--ease-unictive), box-shadow 120ms var(--ease-unictive);
  }
  .checkbox:checked, .checkbox:indeterminate { border-radius: 5.3px; background-color: var(--check-on); box-shadow: none; }
  .checkbox:checked { background-image: ${svg(`<path d='M6.25 10L8.75 12.5L13.75 7.5' fill='none' stroke='white' stroke-width='1.667' stroke-linecap='round' stroke-linejoin='round'/>`)}; }
  .checkbox:indeterminate { background-image: ${svg(`<path d='M6.667 10H13.333' fill='none' stroke='white' stroke-width='1.667' stroke-linecap='round'/>`)}; }
  .checkbox-sm { width: 16px; height: 16px; --check-bw: 1.3px; border-radius: 5.2px; }
  .checkbox-sm:checked, .checkbox-sm:indeterminate { border-radius: 4.1px; }
  .checkbox:disabled { --check-line: var(--color-icon-disabled-300); --check-box: var(--color-bg-weak-50); --check-on: var(--color-icon-disabled-300); cursor: not-allowed; }

  /* radio: 1 px ring, 4 px brand ring when picked */
  .radio {
    --radio-c: var(--color-icon-soft-400);
    --radio-on: var(--color-brand-core-base);
    --radio-ring: 1px;
    --radio-ring-on: 4px;

    appearance: none;
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    background: none;
    box-shadow: inset 0 0 0 var(--radio-ring) var(--radio-c);
    vertical-align: middle;
    cursor: pointer;
    transition: box-shadow 120ms var(--ease-unictive);
  }
  .radio:checked { box-shadow: inset 0 0 0 var(--radio-ring-on) var(--radio-on); }
  .radio-sm { width: 16px; height: 16px; border-width: 1.6px; --radio-ring: 0.8px; --radio-ring-on: 3.2px; }
  .radio:disabled { --radio-c: var(--color-icon-disabled-300); --radio-on: var(--color-icon-disabled-300); cursor: not-allowed; }

  /* switch: a checkbox with role="switch", the knob is drawn in the background */
  .switch {
    --switch-track: var(--color-bg-soft-200);
    --switch-knob: var(--color-bg-white-0);
    --switch-size: 16px;

    appearance: none;
    flex: none;
    width: 36px;
    height: 20px;
    margin: 0;
    border: 0;
    border-radius: var(--radius-full);
    background: radial-gradient(circle closest-side, var(--switch-knob) calc(100% - 0.5px), transparent) 2px 50% / var(--switch-size) var(--switch-size) no-repeat var(--switch-track);
    vertical-align: middle;
    cursor: pointer;
    transition: background-color 160ms var(--ease-unictive), background-position 160ms var(--ease-unictive);
  }
  .switch:checked { --switch-track: var(--color-brand-core-base); background-position: calc(100% - 2px) 50%; }
  .switch-sm { width: 28px; height: 16px; --switch-size: 12px; }
  .switch:disabled { --switch-track: var(--color-bg-soft-200); --switch-knob: var(--color-icon-disabled-300); cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) { .switch { transition: none; } }

  .checkbox:focus-visible, .radio:focus-visible, .switch:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }

  /* choice: a control with a label, description, badge and link */
  .choice {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-12);
    width: 100%;
    max-width: 360px;
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    color: var(--color-text-strong-950);
    cursor: pointer;
  }
  .choice-end > :is(.checkbox, .radio, .switch) { order: 1; }
  .choice:has(:disabled) { cursor: not-allowed; }
  .choice-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-4); }
  .choice-title { display: flex; align-items: center; gap: var(--spacing-4); font-weight: 500; letter-spacing: var(--text-label-sm--letter-spacing); }
  .choice-badge { display: inline-flex; align-items: center; height: 16px; padding: 2px var(--spacing-8); border-radius: var(--radius-full); background: var(--color-brand-core-lighter); color: var(--color-brand-core-base); font: 500 var(--text-paragraph-2xs) / var(--text-paragraph-2xs--line-height) var(--font-sans); letter-spacing: 0; }
  .choice-desc { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); color: var(--color-text-sub-600); }
  .choice-link { margin-top: var(--spacing-4); font: 500 var(--text-paragraph-xs) / var(--text-paragraph-xs--line-height) var(--font-sans); color: var(--color-brand-core-base); text-decoration: none; }
  .choice-link:hover { text-decoration: underline; }

  /* a group of choices under one legend */
  .choice-group { display: grid; gap: var(--spacing-16); min-width: 0; margin: 0; padding: 0; border: 0; }
  .choice-group > legend { margin-bottom: var(--spacing-12); padding: 0; }
  .choice-group-row { grid-auto-flow: column; justify-content: start; gap: var(--spacing-24); }
`;

// rating masks: star line and halves are fills, heart lines and full shapes carry a stroke that stays even across sizes
const fill = (d: string) => svg(`<path d='${d}'/>`);
const stroked = (d: string, w: number, f = true) => svg(`<path d='${d}' fill='${f ? 'black' : 'none'}' stroke='black' stroke-width='${w}' stroke-linecap='round' stroke-linejoin='round'/>`);
const star = paths.Star;
const heart = paths.Heart;
const rating = `
  /* rating: each item is a mask, filled with the idle grey or the accent */
  .rating {
    --rating-idle: var(--color-icon-disabled-300);
    --rating-on: var(--color-state-away-base);
    --rating-size: 20px;
    --rating-line: ${fill(star.line)};
    --rating-half: ${fill(star.half)};
    --rating-full: ${stroked(star.full, 1)};

    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--radius-4);
  }
  .rating-sm { --rating-size: 12px; --rating-full: ${stroked(star.full, 1.333)}; gap: var(--spacing-2); }
  .rating-lg { --rating-size: 28px; --rating-full: ${stroked(star.full, 0.714)}; }
  .rating-heart { --rating-on: var(--color-state-error-base); --rating-line: ${stroked(heart.line, 1.4, false)}; --rating-half: ${fill(heart.half)}; --rating-full: ${stroked(heart.full, 1)}; }
  .rating-heart.rating-sm { --rating-line: ${stroked(heart.line, 2, false)}; --rating-full: ${stroked(heart.full, 1.333)}; }
  .rating-heart.rating-lg { --rating-line: ${stroked(heart.line, 1.143, false)}; --rating-full: ${stroked(heart.full, 0.714)}; }

  .rating-item {
    appearance: none;
    flex: none;
    display: block;
    width: var(--rating-size);
    height: var(--rating-size);
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--rating-idle);
    mask: var(--rating-line) center / 100% no-repeat;
    transition: background-color 120ms var(--ease-unictive);
  }
  input.rating-item { cursor: pointer; }
  .rating-item-half { background: var(--rating-on); mask-image: var(--rating-line), var(--rating-half); }
  .rating-item-full, .rating-item:checked, .rating-item:has(~ .rating-item:checked) { background: var(--rating-on); mask-image: var(--rating-full); }

  /* radios: hover previews the score up to the pointer */
  @media (hover: hover) {
    .rating:hover > input.rating-item:not(:disabled) { background: var(--rating-idle); mask-image: var(--rating-line); }
    .rating:hover > input.rating-item:not(:disabled):is(:hover, :has(~ .rating-item:hover)) { background: var(--rating-on); mask-image: var(--rating-full); }
  }
  .rating:has(:focus-visible) { outline: 2px solid var(--color-brand-core-base); outline-offset: 4px; }

  /* disabled items are the filled grey shape whatever the value */
  .rating > .rating-item:disabled, .rating[aria-disabled="true"] > .rating-item { background: var(--rating-idle); mask-image: var(--rating-full); cursor: not-allowed; }
`;

const dropdown = `
  /* dropdown: a field control that opens a menu of items under it */
  .dropdown { position: relative; display: grid; }
  .dropdown > .field-control[aria-expanded="true"] > svg:last-child { rotate: 180deg; }
  .dropdown-menu {
    position: absolute;
    z-index: 10;
    top: calc(100% + var(--spacing-8));
    left: 0;
    right: 0;
    display: grid;
    gap: var(--spacing-4);
    max-height: 320px;
    margin: 0;
    padding: var(--spacing-8);
    overflow-y: auto;
    list-style: none;
    border-radius: var(--radius-12);
    background: var(--color-bg-white-0);
    box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200), 0 16px 32px -12px rgb(14 18 27 / 0.1);
  }
  .dropdown-menu[hidden] { display: none; }
  .dropdown-lg .dropdown-menu { max-height: 400px; border-radius: var(--radius-16); }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    width: 100%;
    margin: 0;
    padding: var(--spacing-8);
    border: 0;
    border-radius: var(--radius-10);
    background: transparent;
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    color: var(--color-text-strong-950);
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms var(--ease-unictive);
  }
  .dropdown-item:hover, .dropdown-item[aria-selected="true"], .dropdown-item:has(> .checkbox:checked) { background: var(--color-bg-weak-50); }
  .dropdown-item:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: -2px; }
  .dropdown-item:is(:disabled, [aria-disabled="true"], :has(> :disabled)) { background: transparent; color: var(--color-text-disabled-300); cursor: not-allowed; }

  .dropdown-item-icon { display: flex; flex: none; color: var(--color-icon-sub-600); }
  .dropdown-item-icon > svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
  .dropdown-item-avatar { flex: none; width: 20px; height: 20px; border-radius: var(--radius-full); background: var(--color-bg-weak-50); object-fit: cover; }
  .dropdown-item > svg.dropdown-item-avatar { background: none; }
  .dropdown-item-text { flex: 1; min-width: 0; display: grid; gap: var(--spacing-2); }
  .dropdown-item-desc { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; color: var(--color-text-sub-600); }
  .dropdown-item-check { display: none; flex: none; width: 16px; height: 16px; fill: var(--color-icon-sub-600); }
  .dropdown-item[aria-selected="true"] > .dropdown-item-check { display: block; }
  .dropdown-item:is(:disabled, [aria-disabled="true"], :has(> :disabled)) :is(.dropdown-item-icon, .dropdown-item-desc) { color: var(--color-text-disabled-300); }
  .dropdown-item:is(:disabled, [aria-disabled="true"]) .dropdown-item-avatar { opacity: 0.5; }

  /* large rows: a description line, 32 px leads and a boxed icon */
  .dropdown-lg .dropdown-item { gap: var(--spacing-12); padding: var(--spacing-10) var(--spacing-12); border-radius: var(--radius-12); }
  .dropdown-lg .dropdown-item-title { font-weight: 500; }
  .dropdown-lg .dropdown-item-avatar { width: 32px; height: 32px; }
  .dropdown-lg .dropdown-item-icon { padding: var(--spacing-8); border-radius: var(--radius-12); background: var(--color-bg-white-0); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .dropdown-lg .dropdown-item-icon > svg { width: 24px; height: 24px; }
`;

const datepicker = `
  /* date picker: a field control that opens a calendar under it */
  .datepicker { position: relative; display: grid; }
  .datepicker > .calendar { position: absolute; z-index: 10; top: calc(100% + var(--spacing-4)); left: 0; }
  .datepicker-end > .calendar { left: auto; right: 0; }
  .datepicker > .calendar[hidden] { display: none; }

  .calendar {
    display: flex;
    width: 320px;
    border-radius: var(--radius-12);
    background: var(--color-bg-white-0);
    box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    color: var(--color-text-strong-950);
    text-align: left;
  }
  :where(.calendar button) { margin: 0; padding: 0; border: 0; background: none; font: inherit; letter-spacing: inherit; color: inherit; cursor: pointer; }
  .calendar button:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 1px; }
  .calendar svg { display: block; flex: none; }
  .calendar-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-12); padding-bottom: var(--spacing-12); }
  .calendar-month { display: flex; flex-direction: column; flex: none; width: 320px; }

  /* header: month, year and the arrows */
  .calendar-head { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-8); padding: var(--spacing-12) var(--spacing-16); }
  .calendar-title { display: flex; align-items: center; gap: var(--spacing-8); font: 500 var(--text-label-md) / var(--text-label-md--line-height) var(--font-sans); letter-spacing: var(--text-label-md--letter-spacing); white-space: nowrap; }
  .calendar-year { display: flex; align-items: center; gap: var(--spacing-6); padding: var(--spacing-6) var(--spacing-10); border-radius: var(--radius-8); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); font: 500 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans); letter-spacing: var(--text-paragraph-sm--letter-spacing); }
  .calendar-year > svg { width: 12px; height: 12px; color: var(--color-icon-sub-600); stroke: currentColor; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
  .calendar-navs { display: flex; gap: var(--spacing-8); }
  .calendar-nav { display: flex; padding: var(--spacing-2); border-radius: var(--radius-6); color: var(--color-icon-sub-600); transition: background-color 120ms var(--ease-unictive); }
  .calendar-nav > svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.667; stroke-linecap: round; stroke-linejoin: round; }
  .calendar-nav:hover { background: var(--color-bg-weak-50); color: var(--color-text-strong-950); }

  /* weekdays and dates, the grid starts on sunday */
  .calendar-weekdays, .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); padding: 0 var(--spacing-12); }
  .calendar-weekdays { margin-top: var(--spacing-4); }
  .calendar-weekdays > span { height: 40px; display: grid; place-items: center; font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; color: var(--color-text-soft-400); }
  /* a 1 px line 12 px under the weekdays, the dates 12 px under it */
  .calendar-grid { margin-top: var(--spacing-12); padding-top: 13px; box-shadow: inset 0 1px var(--color-stroke-soft-200); }
  .calendar-day { position: relative; z-index: 0; height: 40px; display: grid; place-items: center; }
  .calendar-day::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    width: 40px;
    margin: auto;
    border-radius: var(--radius-full);
    background: var(--day-bg, transparent);
    transition: background-color 120ms var(--ease-unictive);
  }
  .calendar-day:hover { --day-bg: var(--color-bg-weak-50); }
  .calendar-day-muted { color: var(--color-text-soft-400); }
  .calendar-day[aria-current="date"] { --day-bg: var(--color-brand-core-lighter); color: var(--color-brand-core-base); font-weight: 500; }
  .calendar-day[aria-selected="true"] { --day-bg: var(--color-brand-core-base); color: var(--color-text-white-0); font-weight: 500; }
  .calendar button.calendar-day:focus-visible { outline: 0; }
  .calendar-day:focus-visible::before { box-shadow: 0 0 0 2px var(--color-bg-white-0), 0 0 0 4px var(--color-brand-core-base); }

  /* range: a light band between the start and the end, rounded at the row ends */
  .calendar-day-range { background: var(--color-brand-core-alpha-10); }
  .calendar-day-range-start { background: linear-gradient(to right, transparent 50%, var(--color-brand-core-alpha-10) 50%); }
  .calendar-day-range-end { background: linear-gradient(to left, transparent 50%, var(--color-brand-core-alpha-10) 50%); }
  .calendar-day-range:nth-child(7n + 1) { border-radius: var(--radius-8) 0 0 var(--radius-8); }
  .calendar-day-range:nth-child(7n) { border-radius: 0 var(--radius-8) var(--radius-8) 0; }

  /* sections under the dates: time, actions, presets */
  .calendar-section { display: flex; gap: var(--spacing-8); padding: var(--spacing-12) var(--spacing-12) 0; box-shadow: inset 0 1px var(--color-stroke-soft-200); }
  .calendar-section > .btn, .calendar-section > .field { flex: 1; }
  .calendar-presets { flex-wrap: wrap; justify-content: center; }
  .calendar-chip { padding: var(--spacing-8) var(--spacing-12); border-radius: var(--radius-8); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; white-space: nowrap; transition: background-color 120ms var(--ease-unictive); }
  .calendar-chip:hover, .calendar-chip[aria-pressed="true"] { background: var(--color-bg-weak-50); }
  .calendar-chip[aria-pressed="true"] { box-shadow: none; }

  /* two months with a rail of range presets */
  .calendar-double { width: 848px; }
  .calendar-double .calendar-body { padding-bottom: 0; }
  .calendar-months { display: flex; gap: var(--spacing-8); }
  .calendar-double .calendar-month { padding-bottom: var(--spacing-12); }
  .calendar-double .calendar-head { gap: var(--spacing-16); padding: var(--spacing-16); }
  .calendar-double .calendar-title { flex: 1; justify-content: center; }
  .calendar-double .calendar-month:first-child .calendar-title { padding-right: 24px; }
  .calendar-double .calendar-month:last-child .calendar-title { padding-left: 24px; }
  .calendar-double .calendar-section { justify-content: flex-end; align-items: center; padding: var(--spacing-12); }
  .calendar-double .calendar-section > .btn { flex: none; }
  .calendar-range { flex: 1; min-width: 0; display: flex; align-items: center; gap: var(--spacing-8); padding: var(--spacing-8); white-space: nowrap; }
  .calendar-range > svg { width: 20px; height: 20px; color: var(--color-icon-sub-600); stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .calendar-rail { display: flex; flex-direction: column; gap: var(--spacing-8); flex: none; width: 200px; padding: var(--spacing-12); box-shadow: inset -1px 0 var(--color-stroke-soft-200); }
  .calendar-rail-title { padding: var(--spacing-8); color: var(--color-text-sub-600); }
  .calendar-preset { display: block; width: 100%; padding: var(--spacing-8) var(--spacing-12); border-radius: var(--radius-8); text-align: left; transition: background-color 120ms var(--ease-unictive); }
  .calendar-preset:hover, .calendar-preset[aria-pressed="true"] { background: var(--color-bg-weak-50); }
`;

const upload = `
  /* upload: a label around a hidden file input, the whole zone opens the picker and takes drops */
  .upload {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-16);
    padding: var(--spacing-32);
    border: 1px dashed var(--color-stroke-control);
    border-radius: var(--radius-16);
    background: var(--color-bg-white-0);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    color: var(--color-text-strong-950);
    text-align: center;
    cursor: pointer;
    transition: border-color 120ms var(--ease-unictive), background-color 120ms var(--ease-unictive);
  }
  .upload-input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
  .upload:hover, .upload-dragover { border-color: var(--color-brand-core-base); }
  .upload:has(.upload-input:focus-visible) { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }
  .upload:has(.upload-input:disabled) { border-color: var(--color-stroke-control); background: var(--color-bg-weak-50); cursor: not-allowed; }
  .upload-icon { display: flex; padding: var(--spacing-10); border: 1px solid var(--color-stroke-soft-200); border-radius: var(--radius-full); color: var(--color-icon-sub-600); }
  .upload svg { flex: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; fill: none; }
  .upload-icon > svg { width: 20px; height: 20px; }
  .upload-text { display: grid; gap: var(--spacing-2); width: 100%; }
  .upload-title { font-weight: 500; letter-spacing: var(--text-label-sm--letter-spacing); }
  .upload-desc { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); color: var(--color-text-sub-600); }
  .upload-btn { display: inline-flex; align-items: center; padding: var(--spacing-6) var(--spacing-12); border: 1px solid var(--color-stroke-control); border-radius: var(--radius-6); background: var(--color-bg-white-0); font-weight: 500; letter-spacing: var(--text-label-sm--letter-spacing); color: var(--color-text-sub-600); white-space: nowrap; }
  .upload:has(.upload-input:disabled) .upload-btn { border-color: transparent; background: var(--color-bg-weak-50); color: var(--color-text-disabled-300); }

  /* small: one row */
  .upload-sm { flex-direction: row; justify-content: center; gap: var(--spacing-8); font-weight: 500; letter-spacing: var(--text-label-sm--letter-spacing); }
  .upload-sm > svg { width: 16px; height: 16px; stroke-width: 1.4; color: var(--color-icon-strong-950); }
  .upload-sm > span { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: var(--spacing-4); }
  .upload-link { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; color: var(--color-text-sub-600); }
  .field:has(> .upload) { gap: var(--spacing-8); }

  /* file card: one picked file. the base size is Large */
  .file-card {
    --file-icon: 20px;
    --file-pad: var(--spacing-12);
    --file-act: 16px;
    --file-r: var(--radius-12);

    display: flex;
    align-items: center;
    gap: var(--spacing-12);
    padding: var(--spacing-8) var(--spacing-12) var(--spacing-8) var(--spacing-8);
    border: 1px solid var(--color-stroke-control);
    border-radius: var(--radius-16);
    background: var(--color-bg-white-0);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    color: var(--color-text-strong-950);
    text-align: left;
  }
  .file-card-md { --file-icon: 16px; --file-pad: var(--spacing-8); --file-act: 12px; --file-r: var(--radius-8); border-radius: var(--radius-10); }
  .file-card-sm { --file-icon: 16px; --file-pad: var(--spacing-6); --file-act: 12px; --file-r: var(--radius-8); border-radius: var(--radius-10); }
  .file-card svg { stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; fill: none; }
  .file-card-icon { display: flex; flex: none; padding: var(--file-pad); border: 1px solid var(--color-stroke-soft-200); border-radius: var(--file-r); background: var(--color-bg-white-0); color: var(--color-icon-sub-600); }
  .file-card-icon > svg { width: var(--file-icon); height: var(--file-icon); }
  .file-card-body { flex: 1; min-width: 0; display: grid; gap: var(--spacing-2); }
  .file-card-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; letter-spacing: var(--text-label-sm--letter-spacing); }
  .file-card-meta { display: flex; align-items: center; gap: var(--spacing-4); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); color: var(--color-text-sub-600); white-space: nowrap; }
  .file-card-meta > * + *::before { content: ""; display: inline-block; width: 2px; height: 2px; margin-right: var(--spacing-4); border-radius: 50%; background: var(--color-icon-disabled-300); vertical-align: middle; }
  .file-card:is(.file-card-md, .file-card-sm) .file-card-name { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; }
  .file-card-md .file-card-meta { font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); color: var(--color-text-strong-950); }
  .file-card-sm .file-card-meta { display: none; }
  .file-card-action { display: flex; flex: none; padding: 0; border: 0; border-radius: var(--radius-4); background: none; color: var(--color-icon-sub-600); cursor: pointer; }
  .file-card-action > svg { width: var(--file-act); height: var(--file-act); }
  .file-card-action:hover { color: var(--color-icon-strong-950); }
  .file-card-action:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }

  /* state */
  .file-card-ready { border-style: dashed; }
  .file-card-loading .file-card-icon > svg { animation: file-card-spin 1s linear infinite; }
  .file-card-done:is(.file-card-md, .file-card-sm) .file-card-icon { color: var(--color-icon-strong-950); }
  .file-card-view:not(.file-card-md, .file-card-sm) .file-card-meta { color: var(--color-text-strong-950); }
  .file-card-failed { border-color: var(--color-state-error-base); }
  .file-card-failed .file-card-icon { border-color: var(--color-state-error-base); color: var(--color-state-error-base); }
  .file-card-failed .file-card-meta { color: var(--color-state-error-base); }
  .file-card-failed:is(.file-card-md, .file-card-sm) .file-card-action:first-of-type { color: var(--color-icon-strong-950); }
  @media (prefers-reduced-motion: reduce) { .file-card-loading .file-card-icon > svg { animation: none; } }
`;
// navigation separators and the step check, drawn with masks so the markup stays plain
const line = (d: string, box: number, w = 1) => svg(`<path d='${d}' fill='none' stroke='black' stroke-width='${w}' stroke-linecap='round' stroke-linejoin='round'/>`, box);
const chevron = (d: string) => line(d, 16, 1.4);

const breadcrumb = `
  /* breadcrumb: a nav around an ol of links, the last one is the current page */
  .breadcrumb {
    --breadcrumb-sep: ${line('M4.5 9L7.5 6L4.5 3', 12)};
    --breadcrumb-sep-size: 12px;

    max-width: 100%;
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
  }
  .breadcrumb > ol { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-8) var(--spacing-12); margin: 0; padding: 0; list-style: none; }
  .breadcrumb li { display: flex; align-items: center; gap: var(--spacing-12); min-width: 0; }
  .breadcrumb li + li::before { content: ""; flex: none; width: var(--breadcrumb-sep-size); height: var(--breadcrumb-sep-size); background: var(--color-icon-soft-400); mask: var(--breadcrumb-sep) center / contain no-repeat; }
  .breadcrumb-double { --breadcrumb-sep: ${line('M3 8.5L5.5 6L3 3.5M6.5 8.5L9 6L6.5 3.5', 12)}; }
  .breadcrumb-slash { --breadcrumb-sep: ${line('M4.667 14.667L11.333 1.333', 16, 1.2)}; --breadcrumb-sep-size: 16px; }
  .breadcrumb-dot { --breadcrumb-sep: ${svg(`<circle cx='6' cy='6' r='1.5'/>`, 12)}; }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-6);
    height: 20px;
    border-radius: var(--radius-full);
    color: var(--color-text-sub-600);
    text-decoration: none;
    white-space: nowrap;
    transition: color 120ms var(--ease-unictive), box-shadow 120ms var(--ease-unictive);
  }
  .breadcrumb-item > svg { flex: none; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
  .breadcrumb-item:hover { color: var(--color-text-strong-950); }
  .breadcrumb-item[aria-current="page"] { color: var(--color-brand-core-base); font-weight: 500; }
  .breadcrumb-item:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }

  /* rounded: each crumb in a 28 px pill */
  .breadcrumb-rounded .breadcrumb-item { height: 28px; padding: var(--spacing-4) var(--spacing-12); background: var(--color-bg-white-0); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .breadcrumb-rounded .breadcrumb-item[aria-current="page"] { box-shadow: inset 0 0 0 1px var(--color-brand-core-base); }
`;

const tabs = `
  /* tabs: a tablist of buttons. line by default, a 3 px brand underline on the selected tab */
  .tabs {
    display: flex;
    align-items: center;
    gap: var(--spacing-16);
    padding-bottom: var(--spacing-10);
    box-shadow: inset 0 -1px 0 var(--color-stroke-control);
    font: 500 var(--text-label-sm) / var(--text-label-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-label-sm--letter-spacing);
  }
  .tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-6);
    flex: none;
    height: 28px;
    padding: var(--spacing-4);
    border: 0;
    border-radius: var(--radius-10);
    background: none;
    font: inherit;
    color: var(--color-text-sub-600);
    white-space: nowrap;
    cursor: pointer;
    transition: color 120ms var(--ease-unictive), background-color 160ms var(--ease-unictive), box-shadow 160ms var(--ease-unictive);
  }
  .tab > svg { flex: none; width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
  .tab:hover { color: var(--color-text-strong-950); }
  .tab[aria-selected="true"] { color: var(--color-brand-core-base); }
  .tab:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }
  .tab::after { content: ""; position: absolute; left: 0; right: 0; bottom: calc(var(--spacing-10) * -1); height: 3px; border-radius: var(--radius-8) var(--radius-8) 0 0; background: var(--color-brand-core-base); scale: 0 1; transition: scale 160ms var(--ease-unictive); }
  .tab[aria-selected="true"]::after { scale: 1; }
  .tab-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 16px; padding: var(--spacing-2); border-radius: var(--radius-full); background: var(--color-brand-core-base); color: var(--color-bg-white-0); font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); letter-spacing: 0; }

  /* segmented and pill: 36 px tabs, 16 px icons */
  :is(.tabs-segmented, .tabs-pill, .tabs-vertical) { padding: 0; box-shadow: none; }
  :is(.tabs-segmented, .tabs-pill, .tabs-vertical) > .tab::after { content: none; }
  :is(.tabs-segmented, .tabs-pill) > .tab { gap: var(--spacing-8); height: 36px; padding: var(--spacing-8) 20px; border-radius: var(--radius-full); }
  :is(.tabs-segmented, .tabs-pill) > .tab:has(> svg:first-child) { padding-left: var(--spacing-12); }
  :is(.tabs-segmented, .tabs-pill) > .tab:has(> .tab-badge:last-child) { padding-right: var(--spacing-12); }
  :is(.tabs-segmented, .tabs-pill) > .tab > svg { width: 16px; height: 16px; }
  :is(.tabs-segmented, .tabs-pill).tabs-square > .tab { border-radius: var(--radius-12); }

  .tabs-segmented { display: inline-flex; gap: 0; padding: var(--spacing-4); border-radius: var(--radius-full); background: var(--color-bg-weak-50); }
  .tabs-segmented.tabs-square { border-radius: var(--radius-16); }
  .tabs-segmented > .tab[aria-selected="true"] { background: var(--color-bg-white-0); color: var(--color-text-strong-950); box-shadow: 0 16px 32px -12px rgb(14 18 27 / 0.1); }

  /* pill: filled by default, tabs-pill-stroke outlines only the selected one */
  .tabs-pill { flex-wrap: wrap; gap: var(--spacing-8); }
  .tabs-pill > .tab { background: var(--color-bg-white-0); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .tabs-pill > .tab[aria-selected="true"] { background: var(--color-bg-surface-800); color: var(--color-bg-white-0); box-shadow: none; }
  .tabs-pill .tab-badge { background: var(--color-brand-core-lighter); color: var(--color-brand-core-base); }
  .tabs-pill-stroke > .tab { box-shadow: none; }
  .tabs-pill-stroke > .tab[aria-selected="true"] { background: var(--color-bg-white-0); color: var(--color-text-strong-950); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .tabs-pill-stroke .tab-badge { background: var(--color-brand-core-base); color: var(--color-bg-white-0); }

  /* vertical: a 217 px side menu with a title. tabs-side-card frames it */
  .tabs-side { display: flex; flex-direction: column; gap: var(--spacing-8); width: 217px; max-width: 100%; padding: var(--spacing-8) 0; border-radius: var(--radius-8); }
  .tabs-side-card { background: var(--color-bg-white-0); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .tabs-title { margin: 0; padding: var(--spacing-4) var(--spacing-12); font: 500 var(--text-paragraph-xs) / var(--text-paragraph-xs--line-height) var(--font-sans); color: var(--color-text-sub-600); }
  .tabs-side-card > .tabs-title { padding-bottom: var(--spacing-12); box-shadow: 0 1px 0 var(--color-stroke-soft-200); }
  .tabs-vertical { flex-direction: column; align-items: stretch; gap: var(--spacing-4); padding: 0 var(--spacing-8); }
  .tabs-vertical > .tab { justify-content: flex-start; gap: var(--spacing-8); height: 36px; padding: var(--spacing-8); text-align: left; }
  .tabs-vertical > .tab:hover { background: var(--color-bg-weak-50); }
  .tabs-vertical > .tab[aria-selected="true"] { background: var(--color-bg-weak-50); color: var(--color-text-strong-950); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .tabs-vertical .tab-badge { margin-left: auto; }
  @media (prefers-reduced-motion: reduce) { .tab::after { transition: none; } }
`;

const pagination = `
  /* pagination: page info or rows per page on the left, page buttons on the right. Large by default */
  .pagination {
    --pg-h: 40px;
    --pg-r: var(--radius-12);
    --pg-icon: 16px;
    --pg-stroke: 1.4;
    --pg-py: var(--spacing-8);
    --pg-icon-side: var(--spacing-10);
    --pg-text-side: var(--spacing-12);
    --pg-gap: var(--spacing-8);

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-16) var(--spacing-24);
    width: 100%;
    font: 500 18px / 24px var(--font-sans);
    letter-spacing: var(--text-label-md--letter-spacing);
    color: var(--color-text-strong-950);
  }
  .pagination-md { --pg-h: 32px; --pg-r: var(--radius-10); --pg-py: var(--spacing-4); --pg-icon-side: var(--spacing-8); --pg-text-side: var(--spacing-10); font-size: var(--text-label-md); }
  .pagination-sm { --pg-h: 24px; --pg-r: var(--radius-6); --pg-icon: 12px; --pg-stroke: 1.6; --pg-py: var(--spacing-4); --pg-icon-side: var(--spacing-6); --pg-text-side: var(--spacing-8); --pg-gap: var(--spacing-6); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); }

  .pagination-group { display: flex; align-items: center; gap: var(--spacing-16); }
  .pagination-list { display: flex; align-items: center; gap: var(--spacing-4); }
  .pagination-item, .pagination-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--pg-gap);
    flex: none;
    height: var(--pg-h);
    border: 0;
    border-radius: var(--pg-r);
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    transition: background-color 120ms var(--ease-unictive), box-shadow 120ms var(--ease-unictive);
  }
  .pagination-item { min-width: var(--pg-h); padding: 0 var(--spacing-4); font-variant-numeric: tabular-nums; }
  .pagination-sm .pagination-item { border-radius: var(--radius-8); font-size: var(--text-label-sm); line-height: var(--text-label-sm--line-height); }
  span.pagination-item { cursor: default; }
  .pagination-action { padding: var(--pg-py) var(--pg-icon-side) var(--pg-py) var(--pg-text-side); }
  .pagination-action:has(> svg:first-child) { padding: var(--pg-py) var(--pg-text-side) var(--pg-py) var(--pg-icon-side); }
  .pagination-icon, .pagination-icon:has(> svg:first-child) { width: var(--pg-h); padding: 0; }
  .pagination svg { flex: none; width: var(--pg-icon); height: var(--pg-icon); fill: none; stroke: currentColor; stroke-width: var(--pg-stroke); stroke-linecap: round; stroke-linejoin: round; }
  :is(button.pagination-item, .pagination-action):hover:not(:disabled) { background: var(--color-bg-weak-50); }
  .pagination-item[aria-current="page"] { box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .pagination-action:disabled { color: var(--color-text-soft-400); cursor: not-allowed; }
  :is(.pagination-item, .pagination-action, .pagination-select):focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }

  .pagination-info { margin: 0; color: var(--color-text-sub-600); }
  .pagination-rows { display: flex; align-items: center; gap: var(--spacing-12); }
  .pagination-select {
    appearance: none;
    width: 100px;
    height: var(--pg-h);
    margin: 0;
    padding: var(--pg-py) calc(var(--pg-icon-side) + var(--pg-icon) + var(--spacing-8)) var(--pg-py) var(--pg-text-side);
    border: 0;
    border-radius: var(--pg-r);
    background: ${chevron('M4 6L8 10L12 6')} no-repeat right var(--pg-icon-side) center / var(--pg-icon) var(--color-bg-white-0);
    box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200);
    font: inherit;
    font-weight: 400;
    color: inherit;
    cursor: pointer;
  }
  .pagination-sm .pagination-select { width: 78px; }
  .pagination-select:hover, .pagination-select:open { box-shadow: inset 0 0 0 1px var(--color-stroke-control); }
  @media (max-width: 639px) { .pagination-group { flex-wrap: wrap; justify-content: center; row-gap: var(--spacing-8); } }
`;

const stepper = `
  /* stepper: an ol of steps. step-done for finished ones, aria-current="step" on the one in progress */
  .stepper {
    --step-ind: 40px;
    --step-r: var(--radius-full);
    --step-dot: 24px;
    --step-dot-r: var(--radius-full);
    --step-label: var(--text-paragraph-xs);
    --step-label-lh: var(--text-paragraph-xs--line-height);

    display: flex;
    gap: var(--spacing-8);
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    font: 400 var(--text-label-sm) / var(--text-label-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-label-sm--letter-spacing);
    color: var(--color-text-strong-950);
  }
  .stepper-sm { --step-ind: 32px; --step-dot: 20px; --step-label: var(--text-paragraph-2xs); --step-label-lh: var(--text-paragraph-2xs--line-height); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); }
  .stepper-square { --step-r: var(--radius-12); --step-dot-r: var(--radius-6); }
  .stepper-square.stepper-sm { --step-r: var(--radius-8); --step-dot-r: 5px; }

  /* each step sets its color and how far its bar is filled */
  .step { --step-c: var(--color-bg-sub-300); --step-fill: var(--color-state-information-base); --step-progress: 0%; flex: 1 1 0; min-width: 0; display: grid; grid-template-columns: auto 1fr; align-items: center; column-gap: var(--spacing-8); row-gap: var(--spacing-12); }
  .step[aria-current="step"] { --step-c: var(--color-state-information-base); --step-progress: 70%; }
  .step-done { --step-c: var(--color-state-success-base); --step-fill: var(--color-state-success-base); --step-progress: 100%; }

  /* indicator: the step number, a check once done */
  .step-indicator {
    position: relative;
    display: grid;
    place-items: center;
    flex: none;
    width: var(--step-ind);
    height: var(--step-ind);
    border-radius: var(--step-r);
    background: var(--step-c);
    color: var(--color-bg-white-0);
    font: 500 var(--text-label-md) / var(--text-label-md--line-height) var(--font-sans);
    font-variant-numeric: tabular-nums;
    transition: background-color 160ms var(--ease-unictive), box-shadow 160ms var(--ease-unictive), color 160ms var(--ease-unictive);
  }
  .stepper-sm .step-indicator { font-size: var(--text-label-sm); line-height: var(--text-label-sm--line-height); }
  .step-done .step-indicator, :is(.stepper-ring, .stepper-dot) .step-indicator { font-size: 0; }
  .step-indicator::before { position: absolute; inset: 0; margin: auto; }
  .step-done .step-indicator::before { content: ""; width: 24px; height: 24px; background: currentColor; mask: ${line('M20 6L9 17L4 12', 24, 2)} center / contain no-repeat; }
  .stepper-sm .step-done .step-indicator::before { width: 20px; height: 20px; }

  /* stroke: an outline until the step is done. ring and dot draw a dot instead of the number */
  .stepper-stroke .step:not(.step-done) .step-indicator { background: none; box-shadow: inset 0 0 0 1px var(--step-c); color: var(--step-c); }
  .stepper-stroke .step:not(.step-done, [aria-current="step"]) .step-indicator { color: var(--color-text-soft-400); }
  .stepper-ring .step-indicator { background: none; box-shadow: inset 0 0 0 1px var(--step-c); }
  :is(.stepper-ring, .stepper-dot) .step .step-indicator::before { content: ""; width: var(--step-dot); height: var(--step-dot); border-radius: var(--step-dot-r); background: var(--step-c); mask: none; }
  .stepper-dot { --step-dot: 16px; }
  .stepper-dot.stepper-sm { --step-dot: 12px; }
  .stepper-dot.stepper-square { --step-dot-r: var(--radius-4); }
  .stepper-dot.stepper-square.stepper-sm { --step-dot-r: 3px; }
  .stepper-dot .step .step-indicator::before { background: var(--color-bg-white-0); }

  /* label, name and badge */
  .step-text { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }
  .step-label { font-size: var(--step-label); line-height: var(--step-label-lh); letter-spacing: 0; color: var(--color-text-sub-600); }
  .step-name { margin-top: var(--spacing-2); font-weight: 500; }
  .step:not(.step-done, [aria-current="step"]) .step-name { color: var(--color-text-sub-600); }
  .step-badge { display: inline-flex; align-items: center; height: 16px; margin-top: var(--spacing-8); padding: var(--spacing-2) var(--spacing-8); border-radius: var(--radius-full); background: var(--color-brand-core-lighter); color: var(--color-brand-core-base); font: 500 var(--text-paragraph-2xs) / var(--text-paragraph-2xs--line-height) var(--font-sans); letter-spacing: 0; white-space: nowrap; }

  /* bars: drawn after the indicator, bg/soft-200 with the filled part on top */
  .step::after { content: ""; grid-row: 1; grid-column: 2; min-width: 16px; height: 2px; border-radius: var(--radius-full); background: linear-gradient(90deg, var(--step-fill) var(--step-progress), var(--color-bg-soft-200) 0); }
  .step:last-child::after { visibility: hidden; }

  /* inline: the text beside the indicator, a short bar to the next step */
  .stepper-inline { gap: var(--spacing-12); }
  .stepper-inline .step { display: flex; align-items: flex-start; gap: var(--spacing-12); }
  .stepper-inline .step-text { flex: none; }
  .stepper-inline .step::after { flex: 1; margin-top: calc(var(--step-ind) / 2 - 1px); }
  .stepper-inline .step:last-child::after { display: none; }

  /* center: bars on both sides of the indicator, centered text */
  .stepper-center { gap: 0; }
  .stepper-center .step { grid-template-columns: 1fr auto 1fr; }
  .stepper-center .step-indicator { grid-row: 1; grid-column: 2; }
  .stepper-center .step::before { content: ""; grid-row: 1; grid-column: 1; height: 2px; border-radius: var(--radius-full); background: var(--color-bg-soft-200); }
  .stepper-center .step::after { grid-column: 3; }
  .stepper-center :is(.step-done, [aria-current="step"])::before { background: var(--color-state-success-base); }
  .stepper-center .step[aria-current="step"]::after { --step-progress: 0%; }
  .stepper-center .step:first-child::before { visibility: hidden; }
  .stepper-center .step-text { align-items: center; text-align: center; }

  /* bar: a 4 px bar on top of each step, the text beside the indicator */
  .stepper-bar .step { grid-template-columns: auto 1fr; column-gap: var(--spacing-12); row-gap: var(--spacing-16); }
  .stepper-bar .step::after { grid-row: 1; grid-column: 1 / -1; height: 4px; }
  .stepper-bar .step:last-child::after { visibility: visible; }
  .stepper-bar .step[aria-current="step"] { --step-progress: 62%; }
  .stepper-bar .step-indicator { grid-row: 2; }
  .stepper-bar .step-text { grid-row: 2; grid-column: 2; align-self: start; }

  /* vertical: a 2 px line under each indicator */
  .stepper-vertical { flex-direction: column; gap: var(--spacing-8); width: auto; }
  .stepper-vertical .step { flex: none; align-items: start; column-gap: var(--spacing-12); row-gap: var(--spacing-8); }
  .stepper-vertical .step-text { grid-column: 2; grid-row: 1 / span 2; }
  .stepper-vertical .step::after { grid-row: 2; grid-column: 1; justify-self: center; width: 2px; min-width: 0; height: 52px; background: linear-gradient(180deg, var(--step-fill) var(--step-progress), var(--color-bg-soft-200) 0); }
  .stepper-vertical .step[aria-current="step"] { --step-progress: 62%; }
  .stepper-vertical .step:last-child::after { display: none; }

  /* cards: each step a card, the current one on bg/weak-50 */
  .stepper-cards { flex-direction: column; gap: var(--spacing-4); width: auto; }
  .stepper-cards .step { flex: none; display: flex; align-items: flex-start; gap: var(--spacing-12); width: 240px; max-width: 100%; padding: var(--spacing-16); border-radius: var(--radius-16); transition: background-color 160ms var(--ease-unictive); }
  .stepper-cards.stepper-sm .step { padding: var(--spacing-12); border-radius: var(--radius-10); }
  .stepper-cards .step[aria-current="step"] { background: var(--color-bg-weak-50); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .stepper-cards .step::after { content: none; }
`;

// feedback: alert, banner, badge, progress and tooltip. a status class sets two colors, the style picks how they are used
const stateColors = (prefix: string, c: string, cl: string) =>
  (['error', 'warning', 'success', 'information', 'faded'] as const)
    .map((s) => `  .${prefix}-${s === 'information' ? 'info' : s === 'faded' ? 'feature' : s} { ${c}: var(--color-state-${s}-base); ${cl}: var(--color-state-${s}-lighter); }`)
    .join('\n');

const alert = `
  /* alert: Medium and Light by default, information colors until a status class is added */
  .alert {
    --alert-c: var(--color-state-information-base);
    --alert-cl: var(--color-state-information-lighter);
    --alert-bg: var(--alert-cl);
    --alert-fg: var(--alert-c);
    --alert-sub: var(--alert-c);
    --alert-ic: var(--alert-c);
    --alert-icon: 20px;

    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    width: 360px;
    max-width: 100%;
    padding: var(--spacing-8);
    border-radius: var(--radius-8);
    background: var(--alert-bg);
    color: var(--alert-fg);
    box-shadow: var(--alert-bd, none);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
  }
${stateColors('alert', '--alert-c', '--alert-cl')}
  .alert-filled { --alert-bg: var(--alert-c); --alert-fg: var(--color-text-white-0); --alert-sub: var(--color-text-white-0); --alert-ic: var(--color-text-white-0); }
  .alert-stroke { --alert-bg: var(--color-bg-white-0); --alert-fg: var(--color-text-strong-950); --alert-sub: var(--color-text-sub-600); --alert-bd: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .alert-sm { --alert-icon: 16px; font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; }
  .alert-lg { align-items: flex-start; gap: var(--spacing-12); padding: var(--spacing-12); border-radius: var(--radius-12); }

  .alert > svg { flex: none; width: var(--alert-icon); height: var(--alert-icon); fill: var(--alert-ic); }
  .alert-body { flex: 1; min-width: 0; display: flex; align-items: center; gap: var(--spacing-8); }
  .alert-title { flex: 1; min-width: 0; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .alert-lg .alert-body { flex-direction: column; align-items: flex-start; gap: var(--spacing-12); }
  .alert-text { display: flex; flex-direction: column; gap: var(--spacing-4); }
  .alert-lg .alert-title { white-space: normal; font-weight: 500; }
  .alert-desc { margin: 0; color: var(--alert-sub); }
  .alert-actions { display: flex; flex-wrap: wrap; gap: var(--spacing-4) var(--spacing-12); }
  .alert-action { padding: 0; border: 0; background: none; font: inherit; font-weight: 500; letter-spacing: inherit; color: inherit; white-space: nowrap; cursor: pointer; text-underline-offset: 3px; }
  .alert-action:first-child, .alert-action:hover { text-decoration: underline; }
  .alert-close { display: grid; place-items: center; flex: none; padding: 0; border: 0; border-radius: var(--radius-4); background: none; color: inherit; opacity: 0.48; cursor: pointer; transition: opacity 120ms var(--ease-unictive); }
  .alert-close > svg { width: var(--alert-icon); height: var(--alert-icon); fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .alert-sm .alert-close > svg { stroke-width: 2.1; }
  .alert-close:hover, .alert-close:focus-visible { opacity: 1; }
  :is(.alert-action, .alert-close):focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
`;

const banner = `
  /* banner: a full-width strip under the top bar. Light and centered by default */
  .banner {
    --banner-c: var(--color-state-information-base);
    --banner-cl: var(--color-state-information-lighter);
    --banner-bg: var(--banner-cl);
    --banner-fg: var(--banner-c);
    --banner-sub: var(--banner-c);
    --banner-ic: var(--banner-c);
    --banner-dot: var(--banner-c);
    --banner-x: var(--banner-c);

    display: flex;
    align-items: center;
    gap: var(--spacing-16);
    width: 100%;
    min-height: 44px;
    padding: var(--spacing-12) var(--spacing-48);
    background: var(--banner-bg);
    color: var(--banner-fg);
    box-shadow: var(--banner-bd, none);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
  }
${stateColors('banner', '--banner-c', '--banner-cl')}
  .banner-filled { --banner-bg: var(--banner-c); --banner-fg: var(--color-text-white-0); --banner-sub: var(--color-text-white-0); --banner-ic: var(--color-text-white-0); --banner-dot: var(--color-text-white-0); --banner-x: var(--color-text-white-0); }
  .banner-stroke { --banner-bg: var(--color-bg-white-0); --banner-fg: var(--color-text-strong-950); --banner-sub: var(--color-text-sub-600); --banner-dot: var(--color-icon-soft-400); --banner-x: var(--color-icon-sub-600); --banner-bd: inset 0 0 0 1px var(--color-stroke-soft-200); }

  .banner-content { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--spacing-4) var(--spacing-12); }
  .banner-left .banner-content { justify-content: flex-start; }
  .banner-content > svg { flex: none; width: 16px; height: 16px; fill: var(--banner-ic); }
  .banner-text { display: flex; align-items: center; gap: var(--spacing-8); min-width: 0; margin: 0; }
  .banner-title { font-weight: 500; white-space: nowrap; }
  .banner-desc { display: inline-flex; align-items: center; gap: var(--spacing-8); color: var(--banner-sub); }
  .banner-desc::before { content: ""; flex: none; width: 2px; height: 2px; border-radius: var(--radius-full); background: var(--banner-dot); }
  .banner-link { display: inline-flex; align-items: center; gap: var(--spacing-4); font: 500 var(--text-paragraph-xs) / var(--text-paragraph-xs--line-height) var(--font-sans); color: inherit; text-decoration: none; white-space: nowrap; }
  .banner-link:hover { text-decoration: underline; text-underline-offset: 3px; }
  .banner-link > svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
  .banner-close { display: grid; place-items: center; flex: none; padding: 0; border: 0; border-radius: var(--radius-4); background: none; color: var(--banner-x); opacity: 0.48; cursor: pointer; transition: opacity 120ms var(--ease-unictive); }
  .banner-close > svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .banner-close:hover, .banner-close:focus-visible { opacity: 1; }
  :is(.banner-link, .banner-close):focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }

  /* phones: the text stacks under the title, the link below it */
  @media (max-width: 767px) {
    .banner { align-items: flex-start; padding: var(--spacing-12) var(--spacing-16); }
    .banner-content { display: grid; grid-template-columns: 16px minmax(0, 1fr); align-items: start; justify-content: start; }
    .banner-content > svg { margin-top: 2px; }
    .banner-text { flex-direction: column; align-items: flex-start; gap: 0; }
    .banner-title { white-space: normal; }
    .banner-desc::before { display: none; }
    .banner-link { grid-column: 2; justify-self: start; }
  }
`;

const badge = `
  /* badge: Medium, Light and Main by default. Text sits straight in the span */
  .badge {
    --badge-c: var(--color-brand-core-base);
    --badge-cl: var(--color-brand-core-lighter);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    gap: var(--spacing-4);
    height: 20px;
    padding: var(--spacing-2) var(--spacing-8);
    border-radius: var(--radius-6);
    background: var(--badge-cl);
    color: var(--badge-c);
    font: 500 12px / 16px var(--font-sans);
    white-space: nowrap;
  }
  .badge-neutral { --badge-c: var(--color-bg-surface-800); --badge-cl: var(--color-bg-weak-50); }
  .badge-green { --badge-c: var(--color-state-success-base); --badge-cl: var(--color-state-success-lighter); }
  .badge-orange { --badge-c: var(--color-state-warning-base); --badge-cl: var(--color-state-warning-lighter); }
  .badge-blue { --badge-c: var(--color-state-information-base); --badge-cl: var(--color-state-information-lighter); }
  .badge-red { --badge-c: var(--color-state-error-base); --badge-cl: var(--color-state-error-lighter); }

  .badge-filled { background: var(--badge-c); color: var(--color-text-white-0); }
  .badge-stroke { background: transparent; box-shadow: inset 0 0 0 1px var(--badge-c); }
  .badge-white { background: var(--color-bg-white-0); }

  .badge-sm { height: 16px; font-size: 10px; line-height: 12px; }
  .badge-rounded { border-radius: var(--radius-full); }
  .badge-number { min-width: 20px; padding: var(--spacing-2); }
  .badge-sm.badge-number { min-width: 18px; }

  /* dot: a 4 px dot in a 12 px box, 8 px wide at Small */
  .badge-dot { gap: var(--spacing-2); padding-left: var(--spacing-4); }
  .badge-dot.badge-number { padding-right: var(--spacing-6); }
  .badge-dot::before { content: ""; flex: none; width: 4px; height: 4px; margin: 0 var(--spacing-4); border-radius: var(--radius-full); background: currentColor; }
  .badge-sm.badge-dot::before { margin: 0 var(--spacing-2); }

  /* icons: 12 px, 10 px at Small, with 4 px around them */
  .badge > svg { flex: none; width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
  .badge-sm > svg { width: 10px; height: 10px; stroke-width: 3.4; }
  .badge:has(> svg:first-child) { padding-left: var(--spacing-4); }
  .badge:has(> svg:last-child) { padding-right: var(--spacing-4); }
`;

const progress = `
  /* progress: a label row, a native progress bar and a line of info */
  .progress { --progress-fill: var(--color-brand-core-base); --progress-ic: var(--color-icon-soft-400); display: flex; flex-direction: column; gap: var(--spacing-8); width: 400px; max-width: 100%; font-family: var(--font-sans); }
  .progress-success { --progress-fill: var(--color-state-success-base); --progress-ic: var(--color-state-success-base); }
  .progress-error { --progress-fill: var(--color-state-error-base); --progress-ic: var(--color-state-error-base); }
  .progress-label { display: flex; align-items: center; gap: var(--spacing-12); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); }
  .progress-title { flex: 1; min-width: 0; font-weight: 500; color: var(--color-text-strong-950); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .progress-value { display: inline-flex; align-items: center; gap: var(--spacing-4); color: var(--color-text-sub-600); font-variant-numeric: tabular-nums; }
  .progress-value > svg { width: 12px; height: 12px; fill: none; stroke: var(--progress-ic); stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
  .progress:not(.progress-success, .progress-error) .progress-value > svg { animation: progress-spin 1s linear infinite; }
  .progress-info { margin: 0; font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); color: var(--color-text-sub-600); }
  .progress-error .progress-info { color: var(--color-state-error-base); }

  /* the bar on its own: <progress class="progress-bar" value="40" max="100"> */
  .progress-bar { display: block; width: 100%; height: 6px; border: 0; border-radius: var(--radius-full); background: var(--color-bg-soft-200); color: var(--progress-fill, var(--color-brand-core-base)); overflow: hidden; appearance: none; }
  .progress-bar::-webkit-progress-bar { background: var(--color-bg-soft-200); }
  .progress-bar::-webkit-progress-value { background: currentColor; border-radius: var(--radius-full); transition: inline-size 260ms var(--ease-unictive); }
  .progress-bar::-moz-progress-bar { background: currentColor; border-radius: var(--radius-full); }

  /* circular: set --value from 0 to 100. Large 80 px, a ring 10% of the size */
  .progress-ring { --value: 0; --size: 80px; position: relative; display: inline-grid; place-items: center; flex: none; width: var(--size); height: var(--size); font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans); color: var(--color-text-strong-950); font-variant-numeric: tabular-nums; }
  .progress-ring::before { content: ""; position: absolute; inset: 0; border-radius: var(--radius-full); background: conic-gradient(var(--color-state-information-base) calc(var(--value) * 1%), var(--color-bg-weak-50) 0); mask: radial-gradient(farthest-side, transparent calc(100% - var(--size) / 10), #000 calc(100% - var(--size) / 10 + 0.5px)); }
  .progress-ring-md { --size: 64px; font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); }
  .progress-ring-sm { --size: 48px; font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); }
  @media (prefers-reduced-motion: reduce) { .progress-value > svg { animation: none !important; } }
`;

const tooltip = `
  /* tooltip: dark and Small by default. data-arrow puts the tail on an edge, pointing at the trigger */
  .tooltip {
    --tooltip-bg: var(--color-bg-surface-800);
    --tooltip-fg: var(--color-text-white-0);
    --tooltip-sub: var(--color-text-white-0-alpha-088);
    --tooltip-x: var(--color-icon-soft-400);
    --tooltip-tw: 8px;
    --tooltip-th: 4px;
    --tooltip-off: 8px;

    position: relative;
    display: inline-flex;
    align-items: center;
    width: max-content;
    max-width: 240px;
    padding: var(--spacing-4) var(--spacing-8);
    border-radius: var(--radius-6);
    background: var(--tooltip-bg);
    color: var(--tooltip-fg);
    box-shadow: var(--tooltip-shadow, none);
    font: 400 var(--text-paragraph-xs) / var(--text-paragraph-xs--line-height) var(--font-sans);
    text-align: left;
  }
  /* light: for dark surfaces */
  .tooltip-light { --tooltip-bg: var(--color-bg-white-0); --tooltip-fg: var(--color-text-sub-600); --tooltip-sub: var(--color-text-sub-600); --tooltip-x: var(--color-icon-sub-600); --tooltip-shadow: 0 1px 5px -8px rgb(0 0 0 / 0.2); }
  .tooltip-lg { --tooltip-tw: 10px; --tooltip-th: 5px; --tooltip-off: 10px; padding: var(--spacing-6) var(--spacing-10); font-size: var(--text-paragraph-sm); line-height: var(--text-paragraph-sm--line-height); letter-spacing: var(--text-paragraph-sm--letter-spacing); }

  /* rich: an icon, a title and text, and a close button */
  .tooltip-rich { --tooltip-tw: 12px; --tooltip-th: 6px; --tooltip-off: 16px; align-items: flex-start; gap: var(--spacing-8); width: 268px; max-width: 100%; padding: var(--spacing-12); border-radius: var(--radius-10); font-size: var(--text-paragraph-2xs); line-height: var(--text-paragraph-2xs--line-height); letter-spacing: 0; }
  .tooltip-rich.tooltip-lg { gap: var(--spacing-12); width: 284px; border-radius: var(--radius-12); font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); }
  .tooltip-rich.tooltip-light { --tooltip-fg: var(--color-text-strong-950); }
  .tooltip-rich > svg { flex: none; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
  .tooltip-rich.tooltip-lg > svg { width: 20px; height: 20px; stroke-width: 1.7; }
  .tooltip-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-2); }
  .tooltip-title { font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); font-weight: 500; }
  .tooltip-lg .tooltip-title { font-size: var(--text-paragraph-sm); line-height: var(--text-paragraph-sm--line-height); letter-spacing: var(--text-paragraph-sm--letter-spacing); }
  .tooltip-text { color: var(--tooltip-sub); }
  .tooltip-close { display: grid; place-items: center; flex: none; padding: 0; border: 0; border-radius: var(--radius-4); background: none; color: var(--tooltip-x); cursor: pointer; }
  .tooltip-close > svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
  .tooltip-lg .tooltip-close > svg { width: 16px; height: 16px; stroke-width: 2.1; }
  .tooltip-close:hover { color: var(--tooltip-fg); }
  .tooltip-close:focus-visible { outline: 2px solid currentColor; outline-offset: 1px; }

  /* the tail */
  .tooltip[data-arrow]::after { content: ""; position: absolute; width: var(--tooltip-tw); height: var(--tooltip-th); background: var(--tooltip-bg); }
  .tooltip[data-arrow^="top"]::after { bottom: 100%; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .tooltip[data-arrow^="bottom"]::after { top: 100%; clip-path: polygon(0 0, 100% 0, 50% 100%); }
  .tooltip[data-arrow$="-left"]::after { left: var(--tooltip-off); }
  .tooltip[data-arrow$="-center"]::after { left: calc(50% - var(--tooltip-tw) / 2); }
  .tooltip[data-arrow$="-right"]::after { right: var(--tooltip-off); }
  .tooltip:is([data-arrow="left"], [data-arrow="right"])::after { top: calc(50% - var(--tooltip-tw) / 2); width: var(--tooltip-th); height: var(--tooltip-tw); }
  .tooltip[data-arrow="left"]::after { right: 100%; clip-path: polygon(0 50%, 100% 0, 100% 100%); }
  .tooltip[data-arrow="right"]::after { left: 100%; clip-path: polygon(0 0, 100% 50%, 0 100%); }

  /* tooltip-trigger: wrap the trigger and its tooltip, it shows on hover and focus on the side away from the tail */
  .tooltip-trigger { position: relative; display: inline-flex; }
  .tooltip-trigger > .tooltip {
    --tooltip-gap: calc(var(--tooltip-th) + 4px);
    --tooltip-side: calc(50% - var(--tooltip-off) - var(--tooltip-tw) / 2);
    position: absolute;
    z-index: 10;
    bottom: calc(100% + var(--tooltip-gap));
    left: 50%;
    translate: -50% 0;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 120ms var(--ease-unictive), visibility 0s 120ms;
  }
  .tooltip-trigger:is(:hover, :focus-within) > .tooltip { opacity: 1; visibility: visible; pointer-events: auto; transition: opacity 120ms var(--ease-unictive) 300ms; }
  .tooltip-trigger:focus-within > .tooltip { transition-delay: 0s; }
  .tooltip-trigger > .tooltip[data-arrow^="top"] { top: calc(100% + var(--tooltip-gap)); bottom: auto; }
  .tooltip-trigger > .tooltip[data-arrow$="-left"] { left: var(--tooltip-side); translate: none; }
  .tooltip-trigger > .tooltip[data-arrow$="-right"] { left: auto; right: var(--tooltip-side); translate: none; }
  .tooltip-trigger > .tooltip:is([data-arrow="left"], [data-arrow="right"]) { top: 50%; bottom: auto; translate: 0 -50%; }
  .tooltip-trigger > .tooltip[data-arrow="left"] { left: calc(100% + var(--tooltip-gap)); }
  .tooltip-trigger > .tooltip[data-arrow="right"] { left: auto; right: calc(100% + var(--tooltip-gap)); }
`;

// overlays: modal and popover. a modal is a native dialog, a popover uses the popover attribute and anchor positioning
const modal = `
  /* modal: Modal-header, body and Modal-footer in a 480 px card. On a <dialog> it opens on the Overlay */
  .modal {
    display: flex;
    flex-direction: column;
    width: 480px;
    max-width: calc(100% - var(--spacing-32));
    padding: 0;
    border: 0;
    border-radius: var(--radius-16);
    background: var(--color-bg-white-0);
    color: var(--color-text-strong-950);
    box-shadow: 0 12px 32px -12px rgb(14 18 27 / 0.1);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    text-align: left;
  }
  dialog.modal { margin: auto; }
  dialog.modal:not([open]) { display: none; }
  .modal::backdrop { background: var(--color-overlay-overlay-slate); }
  dialog.modal[open] { animation: modal-in 200ms var(--ease-unictive); }
  dialog.modal[open]::backdrop { animation: modal-fade 200ms var(--ease-unictive); }
  @media (prefers-reduced-motion: reduce) { dialog.modal[open], dialog.modal[open]::backdrop { animation: none; } }

  .modal-header { display: flex; align-items: center; gap: var(--spacing-16); padding: var(--spacing-16) var(--spacing-20); border-bottom: 1px solid var(--color-stroke-soft-200); }
  .modal-header-center { flex-direction: column; text-align: center; }
  .modal-icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: var(--radius-12); background: var(--modal-icon-bg, var(--color-bg-white-0)); color: var(--modal-icon-fg, var(--color-icon-sub-600)); box-shadow: var(--modal-icon-bd, inset 0 0 0 1px var(--color-stroke-soft-200)); }
  .modal-icon > svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .modal-icon:is(.modal-icon-error, .modal-icon-warning, .modal-icon-success, .modal-icon-info) { --modal-icon-bd: none; }
  .modal-icon:is(.modal-icon-error, .modal-icon-warning, .modal-icon-success, .modal-icon-info) > svg { fill: currentColor; stroke: none; }
  .modal-icon-error { --modal-icon-bg: var(--color-state-error-lighter); --modal-icon-fg: var(--color-state-error-base); }
  .modal-icon-warning { --modal-icon-bg: var(--color-state-warning-lighter); --modal-icon-fg: var(--color-state-warning-base); }
  .modal-icon-success { --modal-icon-bg: var(--color-state-success-lighter); --modal-icon-fg: var(--color-state-success-base); }
  .modal-icon-info { --modal-icon-bg: var(--color-state-information-lighter); --modal-icon-fg: var(--color-state-information-base); }
  .modal-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-4); }
  .modal-title { margin: 0; font: 500 var(--text-label-sm) / var(--text-label-sm--line-height) var(--font-sans); letter-spacing: var(--text-label-sm--letter-spacing); }
  .modal-desc { margin: 0; font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; color: var(--color-text-sub-600); }
  .modal-close { display: grid; place-items: center; flex: none; align-self: flex-start; padding: 0; border: 0; border-radius: var(--radius-4); background: none; color: var(--color-icon-sub-600); cursor: pointer; }
  .modal-close > svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
  .modal-close:hover { color: var(--color-text-strong-950); }
  .modal-close:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 2px; }

  .modal-body { padding: var(--spacing-16) var(--spacing-20); color: var(--color-text-sub-600); }
  .modal-body > p { margin: 0; }

  .modal-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--spacing-10); padding: var(--spacing-16) var(--spacing-20); }
  .modal-actions { display: flex; gap: var(--spacing-8); margin-left: auto; }
  .modal-footer-fill .modal-actions { flex: 1; margin-left: 0; }
  .modal-footer-fill .btn { flex: 1; }
  .modal-footer-stack .modal-actions { flex: 1; flex-direction: column-reverse; margin-left: 0; }
  .modal-lead { display: inline-flex; align-items: center; gap: var(--spacing-8); padding: 0; border: 0; background: none; font: 500 var(--text-label-md) / var(--text-label-md--line-height) var(--font-sans); letter-spacing: var(--text-label-md--letter-spacing); color: var(--color-text-sub-600); cursor: pointer; }
  .modal-lead > svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .modal-lead:hover { color: var(--color-text-strong-950); }
  .modal-link { padding: 0; border: 0; background: none; font: 500 var(--text-label-sm) / var(--text-label-sm--line-height) var(--font-sans); color: var(--color-brand-core-base); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .modal-dots { display: flex; gap: var(--spacing-8); }
  .modal-dots > i { width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--color-bg-soft-200); }
  .modal-dots > i[aria-current] { background: var(--color-brand-core-base); }
  .modal-footer > .choice { flex: 1; width: auto; font-weight: 500; }
`;

const popover = `
  /* popover: header, body and footer in a 320 px card. data-arrow puts the 17 × 8 tail on an edge, pointing at the trigger */
  .popover {
    --popover-tw: 17px;
    --popover-th: 8px;
    --popover-off: 24px;
    --popover-pad: var(--spacing-16);

    position: relative;
    display: flex;
    flex-direction: column;
    width: 320px;
    max-width: 100%;
    padding: 0;
    border: 0;
    border-radius: var(--radius-16);
    overflow: visible;
    background: var(--color-bg-white-0);
    color: var(--color-text-strong-950);
    box-shadow: 0 12px 32px -12px rgb(14 18 27 / 0.1), 0 2px 8px -8px rgb(0 0 0 / 0.2);
    font: 400 var(--text-paragraph-sm) / var(--text-paragraph-sm--line-height) var(--font-sans);
    letter-spacing: var(--text-paragraph-sm--letter-spacing);
    text-align: left;
  }
  .popover-sm { --popover-pad: var(--spacing-12); width: 312px; font-size: var(--text-paragraph-xs); line-height: var(--text-paragraph-xs--line-height); letter-spacing: 0; }

  .popover-header { display: flex; align-items: center; gap: var(--spacing-12); padding: var(--popover-pad); border-bottom: 1px solid var(--color-stroke-soft-200); }
  .popover-sm .popover-header { gap: var(--spacing-8); }
  .popover-icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: var(--radius-8); color: var(--color-icon-sub-600); box-shadow: inset 0 0 0 1px var(--color-stroke-soft-200); }
  .popover-icon > svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .popover-sm .popover-icon { width: 28px; height: 28px; border-radius: var(--radius-6); }
  .popover-sm .popover-icon > svg { width: 16px; height: 16px; stroke-width: 2.1; }
  .popover-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-2); padding-right: var(--spacing-16); }
  .popover-title { margin: 0; font: 500 var(--text-label-md) / var(--text-label-md--line-height) var(--font-sans); letter-spacing: var(--text-label-md--letter-spacing); }
  .popover-sm .popover-title { font-size: var(--text-label-sm); line-height: var(--text-label-sm--line-height); letter-spacing: var(--text-label-sm--letter-spacing); }
  .popover-desc { margin: 0; color: var(--color-text-sub-600); }
  .popover-close { display: grid; place-items: center; flex: none; align-self: flex-start; width: 20px; height: 20px; padding: 0; border: 0; border-radius: var(--radius-6); background: none; color: var(--color-icon-sub-600); cursor: pointer; }
  .popover-close > svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.1; stroke-linecap: round; stroke-linejoin: round; }
  .popover-close:hover { background: var(--color-bg-weak-50); color: var(--color-text-strong-950); }
  .popover-close:focus-visible { outline: 2px solid var(--color-brand-core-base); outline-offset: 1px; }

  .popover-body { padding: var(--popover-pad); color: var(--color-text-sub-600); }
  .popover-body > p { margin: 0; }
  .popover-flush { padding: 0; }

  .popover-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--spacing-10); padding: var(--popover-pad); border-top: 1px solid var(--color-stroke-soft-200); }
  .popover-footer-fill > .btn { flex: 1; }
  .popover-footer:has(> .popover-step, > .popover-dots) { gap: var(--spacing-4); }
  .popover-step { flex: 1; color: var(--color-text-sub-600); }
  .popover-dots { flex: 1; display: flex; gap: var(--spacing-10); }
  .popover-dots > i { width: 8px; height: 8px; border-radius: var(--radius-full); background: var(--color-bg-soft-200); }
  .popover-sm .popover-dots > i { width: 6px; height: 6px; }
  .popover-dots > i[aria-current] { background: var(--color-brand-core-base); }

  /* the tail, in the card color */
  .popover[data-arrow]::before { content: ""; position: absolute; width: var(--popover-tw); height: var(--popover-th); background: inherit; }
  .popover[data-arrow^="top"]::before { bottom: 100%; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .popover[data-arrow^="bottom"]::before { top: 100%; clip-path: polygon(0 0, 100% 0, 50% 100%); }
  .popover:is([data-arrow="top-left"], [data-arrow="bottom-left"])::before { left: var(--popover-off); }
  .popover:is([data-arrow="top-center"], [data-arrow="bottom-center"])::before { left: calc(50% - var(--popover-tw) / 2); }
  .popover:is([data-arrow="top-right"], [data-arrow="bottom-right"])::before { right: var(--popover-off); }
  .popover:is([data-arrow^="left"], [data-arrow^="right"])::before { width: var(--popover-th); height: var(--popover-tw); }
  .popover[data-arrow^="left"]::before { right: 100%; clip-path: polygon(0 50%, 100% 0, 100% 100%); }
  .popover[data-arrow^="right"]::before { left: 100%; clip-path: polygon(0 0, 100% 50%, 0 100%); }
  .popover:is([data-arrow="left-top"], [data-arrow="right-top"])::before { top: var(--popover-off); }
  .popover:is([data-arrow="left-center"], [data-arrow="right-center"])::before { top: calc(50% - var(--popover-tw) / 2); }
  .popover:is([data-arrow="left-bottom"], [data-arrow="right-bottom"])::before { bottom: var(--popover-off); }

  /* popover-trigger: wrap the button and a [popover]. It opens next to the button, on the side away from the tail */
  .popover-trigger { display: inline-flex; anchor-scope: --popover; }
  .popover-trigger > :first-child { anchor-name: --popover; }
  .popover-trigger > .popover[popover] { --popover-gap: calc(var(--popover-th) + 4px); position-anchor: --popover; position-area: bottom span-right; inset: auto; margin: var(--popover-gap) 0 0; }
  .popover-trigger > .popover[popover]:not(:popover-open) { display: none; }
  .popover-trigger > .popover[data-arrow="top-center"] { position-area: bottom; }
  .popover-trigger > .popover[data-arrow="top-right"] { position-area: bottom span-left; }
  .popover-trigger > .popover[data-arrow^="bottom"] { position-area: top span-right; margin: 0 0 var(--popover-gap); }
  .popover-trigger > .popover[data-arrow="bottom-center"] { position-area: top; }
  .popover-trigger > .popover[data-arrow="bottom-right"] { position-area: top span-left; }
  .popover-trigger > .popover[data-arrow^="left"] { position-area: right span-bottom; margin: 0 0 0 var(--popover-gap); }
  .popover-trigger > .popover[data-arrow="left-center"] { position-area: right; }
  .popover-trigger > .popover[data-arrow="left-bottom"] { position-area: right span-top; }
  .popover-trigger > .popover[data-arrow^="right"] { position-area: left span-bottom; margin: 0 var(--popover-gap) 0 0; }
  .popover-trigger > .popover[data-arrow="right-center"] { position-area: left; }
  .popover-trigger > .popover[data-arrow="right-bottom"] { position-area: left span-top; }
`;

const keyframes = `@keyframes file-card-spin { to { transform: rotate(360deg); } }
@keyframes progress-spin { to { transform: rotate(360deg); } }
@keyframes modal-in { from { opacity: 0; transform: translateY(8px) scale(0.98); } }
@keyframes modal-fade { from { opacity: 0; } }`;

const components = `/* Button: class="btn btn-lg btn-primary btn-main", add btn-rounded for a pill */
@layer components {${button}}

/* Field: class="field" around a label, a control and the caption row. Text input: class="field-control" around class="field-input", class="field-group" for addons. Text area: class="textarea" */
@layer components {${field}}

/* Checkbox, radio and switch: class="checkbox", "radio", "switch" on the native input. With a label: class="choice" */
@layer components {${choice}}

/* Rating: class="rating" around class="rating-item" radios or spans */
@layer components {${rating}}

/* Dropdown: class="dropdown" around a field control and class="dropdown-menu" */
@layer components {${dropdown}}

/* Date picker: class="datepicker" around a field control and class="calendar" */
@layer components {${datepicker}}

/* File upload: class="upload" around the file input, class="file-card" for each file */
@layer components {${upload}}

/* Breadcrumb: class="breadcrumb" on the nav, class="breadcrumb-item" on each link */
@layer components {${breadcrumb}}

/* Tabs: class="tabs" on the tablist, class="tab" on each tab. Vertical: class="tabs-side" around a title and class="tabs tabs-vertical" */
@layer components {${tabs}}

/* Pagination: class="pagination" on the nav, class="pagination-item" for pages, "pagination-action" for previous and next */
@layer components {${pagination}}

/* Stepper: class="stepper" on the ol, class="step" on each li with a step-indicator and step-text */
@layer components {${stepper}}

/* Alert: class="alert alert-lg alert-error" around an svg, class="alert-body" and class="alert-close" */
@layer components {${alert}}

/* Banner: class="banner banner-warning" around class="banner-content" and class="banner-close" */
@layer components {${banner}}

/* Badge: class="badge badge-green", add badge-dot, badge-number or an svg */
@layer components {${badge}}

/* Progress: class="progress" around class="progress-label", <progress class="progress-bar"> and class="progress-info". Circular: class="progress-ring" */
@layer components {${progress}}

/* Tooltip: class="tooltip" with data-arrow, inside class="tooltip-trigger" next to its trigger */
@layer components {${tooltip}}

/* Modal: <dialog class="modal"> around class="modal-header", "modal-body" and "modal-footer". Open it with command="show-modal" */
@layer components {${modal}}

/* Popover: class="popover" with data-arrow, a [popover] inside class="popover-trigger" next to its button */
@layer components {${popover}}

${keyframes}
`;

export const globalCss = `${head}
@theme {${theme}}
${base}
${components}`;

// the same rules for the docs previews: theme values as variables on the preview stage, every rule scoped to it so the doc page keeps its own .field
const themeVars = tailwind().match(/@theme \{([\s\S]*)\}/)![1];

// unictive.css: the same classes without tailwind, theme values on :root and inter loaded from google fonts
export const standaloneCss = `/* Unictive Design System 1.0 · unictive.css, no build step needed · ${host} */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {${themeVars}${theme}}
${base}
${components}`;
export const previewCss = `.ex-stage {${themeVars}${theme}}\n.ex-stage {${button}${field}${choice}${rating}${dropdown}${datepicker}${upload}${breadcrumb}${tabs}${pagination}${stepper}${alert}${banner}${badge}${progress}${tooltip}${modal}${popover}}\n${keyframes}`;
