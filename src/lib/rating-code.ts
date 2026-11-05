// code for developers: rating classes and html examples. the css lives in global-css.ts
import type { ClassRow, Example } from './code-types';
import { count, type Size, type Type } from '../data/rating';

const sizeClass = { Small: ' rating-sm', Medium: '', Large: ' rating-lg' } as const;
const cls = (type: Type, size: Size) => `rating${sizeClass[size]}${type === 'Heart' ? ' rating-heart' : ''}`;
const noun = (type: Type, n: number) => `${n} ${type === 'Heart' ? 'heart' : 'star'}${n === 1 ? '' : 's'}`;

// a read only score: spans, full, half or empty
export function ratingHtml({ type = 'Star', size = 'Medium', value = 0, disabled = false }: { type?: Type; size?: Size; value?: number; disabled?: boolean }) {
  const items = Array.from({ length: count }, (_, i) => {
    const s = value >= i + 1 ? ' rating-item-full' : value >= i + 0.5 ? ' rating-item-half' : '';
    return `  <span class="rating-item${s}"></span>`;
  });
  return [`<div class="${cls(type, size)}" role="img" aria-label="${value} out of ${count}"${disabled ? ' aria-disabled="true"' : ''}>`, ...items, '</div>'].join('\n');
}

// an input: one radio per point, the checked one and everything before it fill
function ratingInput({ type = 'Star', size = 'Medium', value = 0, name, label, disabled = false }: { type?: Type; size?: Size; value?: number; name: string; label: string; disabled?: boolean }) {
  const items = Array.from({ length: count }, (_, i) =>
    `  <input type="radio" class="rating-item" name="${name}" value="${i + 1}" aria-label="${noun(type, i + 1)}"${i + 1 === value ? ' checked' : ''}${disabled ? ' disabled' : ''} />`);
  return [`<div class="${cls(type, size)}" role="radiogroup" aria-label="${label}">`, ...items, '</div>'].join('\n');
}

export const classes: ClassRow[] = [
  ['rating', 'Component', 'Row of five items, Medium 20 px with 4 px gaps. Star in amber'],
  ['rating-sm', 'Size', 'Small, 12 px items 2 px apart, for review counts in lists'],
  ['rating-lg', 'Size', 'Large, 28 px items, when the rating is the main task'],
  ['rating-heart', 'Type', 'Hearts in red, for favourites and likes'],
  ['rating-item', 'Part', 'One point. A span shows a score, a radio takes one. Empty by default'],
  ['rating-item-half', 'State', 'Half filled, for a score like 3.5'],
  ['rating-item-full', 'State', 'Filled'],
  ['checked', 'Attribute', 'On a radio item: fills it and every item before it'],
  ['aria-disabled="true"', 'Attribute', 'On the rating, or disabled on each radio: every item filled grey'],
];

export const examples: Example[] = [
  {
    id: 'ex-score',
    title: 'Show a score',
    desc: 'Spans with full and half items. Give the row role="img" and an aria-label with the score',
    html: ratingHtml({ value: 3.5 }),
  },
  {
    id: 'ex-input',
    title: 'Take a rating',
    desc: 'Radios that share a name. Hover previews the score, a click picks it, arrow keys step through it',
    html: ratingInput({ value: 4, name: 'stay', label: 'Rate your stay' }),
  },
  {
    id: 'ex-sizes',
    title: 'Sizes',
    desc: 'Small for review counts in lists, Medium next to body text, Large when the rating is the main task',
    html: [ratingHtml({ size: 'Small', value: 4 }), ratingHtml({ value: 4 }), ratingHtml({ size: 'Large', value: 4 })].join('\n'),
  },
  {
    id: 'ex-heart',
    title: 'Heart',
    desc: 'rating-heart swaps the shape and the color, for favourites and likes',
    html: [ratingHtml({ type: 'Heart', value: 2.5 }), ratingInput({ type: 'Heart', value: 3, name: 'love', label: 'How much did you like it' })].join('\n'),
  },
  {
    id: 'ex-disabled',
    title: 'Disabled',
    desc: 'Every item turns grey whatever the value. Use aria-disabled on a score, disabled on each radio',
    html: [ratingHtml({ value: 3, disabled: true }), ratingInput({ value: 3, name: 'closed', label: 'Rating closed', disabled: true })].join('\n'),
  },
  {
    id: 'ex-summary',
    title: 'With a score and count',
    desc: 'Put the number and the review count next to a small rating. The text carries the score for screen readers',
    html: [
      '<div style="display: flex; align-items: center; gap: var(--spacing-8); font-size: 14px; line-height: 20px">',
      '  <strong>4.5</strong>',
      ratingHtml({ size: 'Small', value: 4.5 }).replace(' role="img" aria-label="4.5 out of 5"', ' aria-hidden="true"').split('\n').map((l) => '  ' + l).join('\n'),
      '  <span style="color: var(--color-text-sub-600)">128 reviews</span>',
      '</div>',
    ].join('\n'),
  },
];
