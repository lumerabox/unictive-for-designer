// values read from the Icon Buttons, Link-buttons, Compact-buttons and Social-buttons component sets in Unictive Design System 1.0
import { icon, esc, slug, type IconName } from './markup';

/* Icon Buttons: same axes and colors as Buttons, square, 216 variants */
export const iconSizes = ['Large', 'Medium', 'Small'] as const;
export const iconStyles = ['Primary', 'Secondary', 'Tertiary', 'Ghost'] as const;
export const iconTypes = ['Main', 'Neutral', 'Error'] as const;
export const iconStates = ['Default', 'Hover', 'Disable'] as const;
export const iconMetrics = {
  Large: { size: 48, pad: 12, radius: 8, icon: 24 },
  Medium: { size: 40, pad: 10, radius: 8, icon: 20 },
  Small: { size: 28, pad: 6, radius: 6, icon: 16 },
} as const;
export const glyphs: [IconName, string][] = [
  ['check-line', 'Check'],
  ['plus-line', 'Add'],
  ['edit-02-line', 'Edit'],
  ['trash-01-line', 'Delete'],
  ['heart-line', 'Like'],
  ['share-07-line', 'Share'],
  ['dots-horizontal-line', 'More'],
  ['settings-01-line', 'Settings'],
];

export interface IconOpts {
  size?: (typeof iconSizes)[number];
  style?: (typeof iconStyles)[number];
  type?: (typeof iconTypes)[number];
  state?: (typeof iconStates)[number];
  rounded?: boolean;
  glyph?: IconName;
  label?: string;
  live?: boolean;
}

export function iconButton(o: IconOpts) {
  const { size = 'Medium', style = 'Primary', type = 'Main', state = 'Default', rounded = false, glyph = 'check-line', live = false } = o;
  const label = o.label ?? glyphs.find(([g]) => g === glyph)?.[1] ?? 'Action';
  const disabled = state === 'Disable' ? ' disabled' : '';
  return `<button type="button" class="u-btn" data-icon-only data-size="${slug(size)}" data-style="${slug(style)}" data-type="${slug(type)}" data-state="${slug(state)}" data-rounded="${rounded}"${live ? '' : ' data-static tabindex="-1"'} aria-label="${esc(label)}"${disabled}>${icon(glyph, iconMetrics[size].icon)}</button>`;
}
export const iconChip = (o: Required<Pick<IconOpts, 'size' | 'style' | 'type' | 'state' | 'rounded'>>) =>
  `Icon Buttons · Size=${o.size} · Style=${o.style} · Type=${o.type} · State=${o.state} · Rounded=${o.rounded}`;

/* Link-buttons: text with optional chevrons, 48 variants */
export const linkSizes = ['Medium', 'Small'] as const;
export const linkStyles = ['Gray', 'Neutral', 'Primary', 'Error'] as const;
export const linkStates = ['Default', 'Hover', 'Disable'] as const;
export const linkColors: Record<(typeof linkStyles)[number], [string, string]> = {
  Gray: ['text/sub-600', '#5C5C5C'],
  Neutral: ['text/strong-950', '#171717'],
  Primary: ['brand/core/base', '#1868D0'],
  Error: ['state/error/base', '#FB3748'],
};

export interface LinkOpts {
  size?: (typeof linkSizes)[number];
  style?: (typeof linkStyles)[number];
  state?: (typeof linkStates)[number];
  underline?: boolean;
  left?: boolean;
  right?: boolean;
  text?: string;
  live?: boolean;
}

export function linkButton(o: LinkOpts) {
  const { size = 'Medium', style = 'Primary', state = 'Default', underline = false, left = false, right = false, text = 'Link Button', live = false } = o;
  const is = size === 'Small' ? 16 : 20;
  const disabled = state === 'Disable' ? ' disabled' : '';
  return `<button type="button" class="u-lbtn" data-size="${slug(size)}" data-style="${slug(style)}" data-state="${slug(state)}" data-underline="${underline}"${live ? '' : ' data-static tabindex="-1"'}${disabled}>${left ? icon('chevron-left-line', is) : ''}<span>${esc(text)}</span>${right ? icon('chevron-right-line', is) : ''}</button>`;
}
export const linkChip = (o: Required<Pick<LinkOpts, 'size' | 'style' | 'state' | 'underline'>>) =>
  `Link-buttons · Size=${o.size} · Style=${o.style} · State=${o.state} · Underline=${o.underline}`;

/* Compact-buttons: 24 and 20 px icon buttons for tight spots, 48 variants */
export const compactSizes = ['Large (24)', 'Small (20)'] as const;
export const compactStyles = ['Stroke', 'Ghost', 'White'] as const;
export const compactStates = ['Default', 'Hover', 'Active', 'Disable'] as const;

export interface CompactOpts {
  size?: (typeof compactSizes)[number];
  style?: (typeof compactStyles)[number];
  state?: (typeof compactStates)[number];
  rounded?: boolean;
  glyph?: IconName;
  label?: string;
  live?: boolean;
}

export function compactButton(o: CompactOpts) {
  const { size = 'Large (24)', style = 'Stroke', state = 'Default', rounded = false, glyph = 'x-close-line', label = 'Close', live = false } = o;
  const large = size.startsWith('Large');
  const disabled = state === 'Disable' ? ' disabled' : '';
  return `<button type="button" class="u-cbtn" data-size="${large ? 'large' : 'small'}" data-style="${slug(style)}" data-state="${slug(state)}" data-rounded="${rounded}"${live ? '' : ' data-static tabindex="-1"'} aria-label="${esc(label)}"${state === 'Active' ? ' aria-pressed="true"' : ''}${disabled}>${icon(glyph, large ? 20 : 16)}</button>`;
}
export const compactChip = (o: Required<Pick<CompactOpts, 'size' | 'style' | 'state' | 'rounded'>>) =>
  `Compact-buttons · Size=${o.size} · Style=${o.style} · State=${o.state} · Rounded=${o.rounded}`;

/* Social-buttons: sign in with a provider, 24 variants. The logo is the Major Brand Logos instance */
export const socialStyles = ['Neutral', 'Stroke', 'White'] as const;
export const socialStates = ['Default', 'Hover'] as const;
export const brands = ['Google', 'Apple', 'Facebook', 'X', 'GitHub', 'LinkedIn', 'Microsoft'] as const;
const brandFile: Record<(typeof brands)[number], string> = {
  Google: 'google', Apple: 'apple', Facebook: 'facebook', X: 'x-twitter', GitHub: 'github', LinkedIn: 'linkedin', Microsoft: 'microsoft',
};
// Neutral sits on a dark fill, so it takes the white logo, Stroke and White take the original
export const logoSrc = (brand: (typeof brands)[number], style: (typeof socialStyles)[number]) =>
  `/assets/logos/major-brands--${brandFile[brand]}${style === 'Neutral' ? '-white' : ''}.svg`;

export interface SocialOpts {
  style?: (typeof socialStyles)[number];
  state?: (typeof socialStates)[number];
  iconOnly?: boolean;
  rounded?: boolean;
  brand?: (typeof brands)[number];
  live?: boolean;
}

export function socialButton(o: SocialOpts) {
  const { style = 'Neutral', state = 'Default', iconOnly = false, rounded = false, brand = 'Google', live = false } = o;
  const label = `Login with ${brand}`;
  return `<button type="button" class="u-sbtn" data-style="${slug(style)}" data-state="${slug(state)}" data-icon-only="${iconOnly}" data-rounded="${rounded}"${live ? '' : ' data-static tabindex="-1"'}${iconOnly ? ` aria-label="${esc(label)}"` : ''}><img src="${logoSrc(brand, style)}" width="20" height="20" alt="" />${iconOnly ? '' : `<span>${esc(label)}</span>`}</button>`;
}
export const socialChip = (o: Required<Pick<SocialOpts, 'style' | 'state' | 'iconOnly' | 'rounded'>>) =>
  `Social-buttons · Style=${o.style} · State=${o.state} · Icon Only=${o.iconOnly} · Rounded=${o.rounded}`;
