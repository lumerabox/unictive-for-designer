// values read from the Text-area (Outline) and Text-area (Contained) component sets in Unictive Design System 1.0
export { styles, states, showsValue, slug } from './text-input';
export type { Style, State } from './text-input';

export const sizes = ['Large', 'Small'] as const;
export type Size = (typeof sizes)[number];

export const metrics = {
  Large: { height: 120 },
  Small: { height: 80 },
} as const;

export const maxLength = 200;
export const variantCount = sizes.length * 6 * 2;
