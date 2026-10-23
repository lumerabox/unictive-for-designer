// values read from the Buttons component set in Unictive Design System 1.0 (216 variants)
export const sizes = ['Large', 'Medium', 'Small'] as const;
export const styles = ['Primary', 'Secondary', 'Tertiary', 'Ghost'] as const;
export const types = ['Main', 'Neutral', 'Error'] as const;
export const states = ['Default', 'Hover', 'Disable'] as const;

export type Size = (typeof sizes)[number];
export type Style = (typeof styles)[number];
export type Type = (typeof types)[number];
export type State = (typeof states)[number];

export interface Variant {
  size: Size;
  style: Style;
  type: Type;
  state: State;
  rounded: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
  label: string;
}

export const metrics = {
  Large: { height: 48, padX: 12, padY: 12, radius: 8, gap: 4, font: 16, line: 24, tracking: -1.1, icon: 24, iconStroke: 2 },
  Medium: { height: 40, padX: 10, padY: 10, radius: 8, gap: 4, font: 14, line: 20, tracking: -0.6, icon: 20, iconStroke: 1.6 },
  Small: { height: 32, padX: 8, padY: 6, radius: 6, gap: 4, font: 14, line: 20, tracking: -0.6, icon: 16, iconStroke: 1.6 },
} as const;

// label padding inside the text frame
export const textPadX = 4;

const palette = {
  Main: { base: '#1868d0', baseHover: '#0d4690', lighter: '#ecf0fe', tint: '#1868d0', tintHover: '#1868d0', line: '#1868d0' },
  Neutral: { base: '#262626', baseHover: '#171717', lighter: '#f7f7f7', tint: '#5c5c5c', tintHover: '#171717', line: '#dedede' },
  Error: { base: '#fb3748', baseHover: '#d02533', lighter: '#ffebec', tint: '#fb3748', tintHover: '#fb3748', line: '#fb3748' },
} as const;

export interface Look {
  fill: string | null;
  stroke: string | null;
  text: string;
}

export function look(style: Style, type: Type, state: State): Look {
  if (state === 'Disable') return { fill: '#f7f7f7', stroke: null, text: '#d1d1d1' };
  const p = palette[type];
  const hover = state === 'Hover';
  switch (style) {
    case 'Primary':
      return { fill: hover ? p.baseHover : p.base, stroke: null, text: '#ffffff' };
    case 'Secondary':
      return hover ? { fill: null, stroke: p.line, text: p.tintHover } : { fill: p.lighter, stroke: null, text: p.tint };
    case 'Tertiary':
      return hover ? { fill: p.lighter, stroke: null, text: p.tintHover } : { fill: null, stroke: p.line, text: p.tint };
    case 'Ghost':
      return hover ? { fill: p.lighter, stroke: null, text: p.tintHover } : { fill: null, stroke: null, text: p.tint };
  }
}

export const variantCount = sizes.length * styles.length * types.length * states.length * 2;

export function variantName(v: Pick<Variant, 'size' | 'style' | 'type' | 'state' | 'rounded'>) {
  return `Size=${v.size}, Style=${v.style}, Type=${v.type}, State=${v.state}, Rounded=${v.rounded}`;
}

export const defaultVariant: Variant = {
  size: 'Large',
  style: 'Primary',
  type: 'Main',
  state: 'Default',
  rounded: false,
  leftIcon: false,
  rightIcon: false,
  label: 'Button',
};
