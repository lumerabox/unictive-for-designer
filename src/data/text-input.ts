// values read from the Text-input (Outline) and Text-input (Countained) component sets in Unictive Design System 1.0
export const styles = ['Outline', 'Contained'] as const;
export const sizes = ['Large', 'Medium', 'Small'] as const;
export const states = ['Placeholder', 'Focus', 'Typing', 'Filled', 'Disable', 'Error'] as const;
export const types = ['Default', 'Password', 'Leading Text', 'Trailing Button', 'File Upload', 'Leading Dropdown', 'Trailing Dropdown', 'Tag Input'] as const;

export type Style = (typeof styles)[number];
export type Size = (typeof sizes)[number];
export type State = (typeof states)[number];
export type Type = (typeof types)[number];

// password only ships Filled and Error
export const statesFor = (t: Type): readonly State[] => (t === 'Password' ? ['Filled', 'Error'] : states);

export const metrics = {
  Large: { height: 48, padY: 14, icon: 20 },
  Medium: { height: 40, padY: 10, icon: 20 },
  Small: { height: 32, padY: 6, icon: 16 },
} as const;

// types with a leading check icon, every type but Trailing Dropdown has the trailing info icon
export const hasLeadIcon = (t: Type) => t === 'Default' || t === 'Password' || t === 'Trailing Dropdown';
export const hasTrailIcon = (t: Type) => t !== 'Trailing Dropdown';

// states that show the text as a value rather than a placeholder
export const showsValue = (s: State) => s === 'Typing' || s === 'Filled' || s === 'Error';

export const variantsPerStyle = sizes.length * types.reduce((n, t) => n + statesFor(t).length, 0);
export const variantCount = variantsPerStyle * styles.length;

export const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
