// values read from the Tooltip component set in Unictive Design System 1.0
import { icon, esc, slug } from './markup';

export const types = ['Default', 'Description'] as const;
export const arrows = ['No', 'Top Left', 'Top Center', 'Top Right', 'Bottom Left', 'Bottom Center', 'Bottom Right', 'Left', 'Right'] as const;
export const sizes = ['Small', 'Large'] as const;
export type Type = (typeof types)[number];
export type Arrow = (typeof arrows)[number];
export type Size = (typeof sizes)[number];

// Type × Arrow × Size × Dark
export const variantCount = types.length * arrows.length * sizes.length * 2;

// Left and Right point sideways from the vertical center
export const arrowKey = (a: Arrow) => (a === 'Left' ? 'left-center' : a === 'Right' ? 'right-center' : slug(a));

export const sample = {
  title: 'Shareable link',
  text: 'Copy link',
  desc: 'Anyone with this link can view the file. Turn it off in Share settings.',
};

export interface Opts {
  type?: Type;
  arrow?: Arrow;
  size?: Size;
  dark?: boolean;
  icon?: boolean;
  close?: boolean;
  text?: string;
  desc?: string;
  id?: string;
  live?: boolean;
}

export function render(o: Opts) {
  const { type = 'Default', arrow = 'Bottom Center', size = 'Small', dark = true, close = true } = o;
  const small = size === 'Small';
  let inner: string;
  if (type === 'Default') inner = `<span class="u-tip-text">${esc(o.text ?? sample.text)}</span>`;
  else {
    const lead = o.icon === false ? '' : `<span class="u-tip-icon">${icon('alert-circle-line', small ? 16 : 20)}</span>`;
    const x = close ? `<button type="button" class="u-tip-close" aria-label="Close" data-tip-close>${icon('x-close-line', small ? 12 : 16)}</button>` : '';
    inner = `${lead}<span class="u-tip-body"><span class="u-tip-title">${esc(o.text ?? sample.title)}</span><span class="u-tip-desc">${esc(o.desc ?? sample.desc)}</span></span>${x}`;
  }
  const tail = arrow === 'No' ? '' : '<i class="u-tail" aria-hidden="true"></i>';
  return `<span class="u-tip u-float" role="tooltip"${o.id ? ` id="${o.id}"` : ''} data-type="${slug(type)}" data-arrow="${arrowKey(arrow)}" data-size="${slug(size)}" data-dark="${dark}"${o.live ? ' data-live' : ''}>${tail}${inner}</span>`;
}

export const chip = (o: { type: Type; arrow: Arrow; size: Size; dark: boolean }) => `Tooltip · Type=${o.type} · Arrow=${o.arrow} · Size=${o.size} · Dark=${o.dark}`;
