// values read from the Badge component set in Unictive Design System 1.0
import { icon, esc, slug } from './markup';

export const sizes = ['Medium', 'Small'] as const;
export const types = ['Basic', 'Dot', 'Icon'] as const;
export const colors = ['Main', 'Neutral', 'Green', 'Orange', 'Blue', 'Red'] as const;
export const styles = ['Filled', 'Light', 'Stroke', 'White'] as const;
export type Size = (typeof sizes)[number];
export type Type = (typeof types)[number];
export type Color = (typeof colors)[number];
export type Style = (typeof styles)[number];

export const variantCount = 384;

// the token behind each Color, base and lighter
export const colorTokens: Record<Color, [string, string, string, string]> = {
  Main: ['brand/core/base', '#1868D0', 'brand/core/lighter', '#ECF0FE'],
  Neutral: ['bg/surface-800', '#262626', 'bg/weak-50', '#F7F7F7'],
  Green: ['state/success/base', '#1FC16B', 'state/success/lighter', '#E3F7EC'],
  Orange: ['state/warning/base', '#FA7319', 'state/warning/lighter', '#FFF3EB'],
  Blue: ['state/information/base', '#335CFF', 'state/information/lighter', '#EEF0FF'],
  Red: ['state/error/base', '#FB3748', 'state/error/lighter', '#FFEBEC'],
};

export interface Opts {
  size?: Size;
  type?: Type;
  color?: Color;
  style?: Style;
  number?: boolean;
  rounded?: boolean;
  left?: boolean;
  right?: boolean;
  text?: string;
  num?: string;
}

export function render(o: Opts) {
  const { size = 'Medium', type = 'Basic', color = 'Main', style = 'Light', rounded = false, left = true, right = true } = o;
  // the DS only has numbers on Basic and Dot
  const number = !!o.number && type !== 'Icon';
  const is = size === 'Small' ? 10 : 12;
  const text = `<span class="u-badge-text">${esc(number ? (o.num ?? '99') : (o.text ?? 'Badge'))}</span>`;
  let inner = text;
  if (type === 'Dot') inner = `<span class="u-badge-dot" aria-hidden="true"><i></i></span>${text}`;
  if (type === 'Icon') inner = `${left ? icon('alert-circle-line', is) : ''}${text}${right ? icon('x-close-line', is) : ''}`;
  return `<span class="u-badge" data-size="${slug(size)}" data-type="${slug(type)}" data-color="${slug(color)}" data-style="${slug(style)}" data-rounded="${rounded}" data-number="${number}">${inner}</span>`;
}

export const chip = (o: Required<Pick<Opts, 'size' | 'type' | 'color' | 'style' | 'number' | 'rounded'>>) =>
  `Badge · Size=${o.size} · Type=${o.type} · Color=${o.color} · Style=${o.style} · Number=${o.number && o.type !== 'Icon'} · Rounded=${o.rounded}`;
