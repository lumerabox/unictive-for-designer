// values read from the Radio-group and Radio-group-label component sets in Unictive Design System 1.0
export { positions, type Position } from './checkbox';

export const sizes = ['Medium', 'Small'] as const;
export type Size = (typeof sizes)[number];

export const metrics = { Medium: { size: 20, dot: 16 }, Small: { size: 16, dot: 13 } } as const;

// Radio-group: Size × Select × Disable, Radio-group-label: Position × Select × Disable
export const variantCount = sizes.length * 2 * 2 + 2 * 2 * 2;
