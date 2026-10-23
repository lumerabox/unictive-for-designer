// values read from the Switch and Switch-label component sets in Unictive Design System 1.0
export { positions, type Position } from './checkbox';

export const sizes = ['Medium', 'Small'] as const;
export type Size = (typeof sizes)[number];

export const metrics = { Medium: { width: 36, height: 20, knob: 16 }, Small: { width: 28, height: 16, knob: 12 } } as const;

// Switch: Size × Select × Disable, Switch-label: Position × Select × Disable
export const variantCount = sizes.length * 2 * 2 + 2 * 2 * 2;
