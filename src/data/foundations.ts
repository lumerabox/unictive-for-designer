// foundation tokens of Unictive Design System 1.0 (light mode), read from the DS file's variables and styles

type Step = [step: string, hex: string];
const scale = (steps: string[], hexes: string): Step[] => hexes.split(' ').map((h, i) => [steps[i], '#' + h.toUpperCase()]);
const s11 = ['950', '900', '800', '700', '600', '500', '400', '300', '200', '100', '50'];
const s12 = [...s11, '0'];

// 07-Foundations primitives
export const neutrals = {
  gray: scale(s12, '171717 1c1c1c 262626 3d3d3d 858585 a3a3a3 c2c2c2 dedede ebebeb f5f5f5 f7f7f7 ffffff'),
  slate: scale(s12, '0e121b 181b25 222530 2b303b 525866 717784 99a0ae cacfd8 eaecf0 f2f5f8 f5f7fa ffffff'),
};

export const stateScales = {
  blue: scale(s11, '000b3b 001557 00278d 0039c2 004af2 335cff 6379ff 8a97ff aeb6ff d5d9ff eef0ff'),
  orange: scale(s11, '71330a 96440d b75310 ce5e12 e16614 fa7319 ffa468 ffc197 ffd9c0 ffe6d5 fff3eb'),
  red: scale(s11, '681219 8b1822 ad1f2b d02533 e93544 fb3748 ff6875 ff97a0 ffc0c5 ffd5d8 ffebec'),
  green: scale(s11, '0b4627 16643b 1a7544 178c4e 1daf61 1fc16b 3ee089 84ebb4 c2f5da d6f5e8 e3f7ec'),
  yellow: scale(s11, '624c18 86661d a78025 c99a2c e6a819 f6b51e ffd268 ffe097 ffecc0 ffefcc fffaeb'),
};

export interface Brand {
  key: string;
  name: string;
  base: string;
  scale: Step[];
}
// base is the step the semantic brand/<key>/base points to (the ⭐ step in the DS)
export const brands: Brand[] = [
  { key: 'core', name: 'Unictive', base: '500', scale: scale(s11, '01102b 021b40 073168 0d4690 1359b5 1868d0 2880fa 6f9bfb a0b8fc cfdafe ecf0fe') },
  { key: 'kelolain', name: 'Kelolain', base: '400', scale: scale(s11, '00150f 00221b 003d31 005847 01725d 018971 019b80 01b797 02d5b1 03f8ce b8ffea') },
  { key: 'servios', name: 'Servios', base: '400', scale: scale(s11, '250801 391003 622109 8a3211 b14319 d55221 f05d26 fa8369 fbab9e fcd4ce feedeb') },
  { key: 'unisign', name: 'Unisign', base: '500', scale: scale(s11, '18033a 270657 45108f 621ac6 7b2cf1 874ef4 9971f7 ad92f9 c4b3fb e0d7fd f2effe') },
  { key: 'unisign-roomboking', name: 'Roomboking', base: '500', scale: scale(s11, '000e33 00194c 002f7d 0044ae 0057da 0066fc 5680ff 839cff aab9ff d4daff edf0ff') },
  { key: 'quiktiv', name: 'Quiktiv', base: '500', scale: scale(s11, '2b0108 440211 750624 a60d36 d21447 f41954 fb5874 fc8595 fcacb5 fed4d8 feedee') },
];

const hexOf = (b: Brand, step: string) => b.scale.find(([s]) => s === step)![1];
// semantic brand tokens: darker 800, dark 700, base, light 100, lighter 50, and three alphas of the base
export const brandTokens = (b: Brand): [token: string, alias: string, hex: string][] => [
  [`brand/${b.key}/darker`, `${b.key}/800`, hexOf(b, '800')],
  [`brand/${b.key}/dark`, `${b.key}/700`, hexOf(b, '700')],
  [`brand/${b.key}/base`, `${b.key}/${b.base}`, hexOf(b, b.base)],
  [`brand/${b.key}/light`, `${b.key}/100`, hexOf(b, '100')],
  [`brand/${b.key}/lighter`, `${b.key}/50`, hexOf(b, '50')],
  ...(['24', '16', '10'] as const).map((a): [string, string, string] => [`brand/${b.key}/alpha-${a}`, `alpha/${b.key}/alpha-${a}`, hexOf(b, b.base) + Math.round((+a / 100) * 255).toString(16).toUpperCase().padStart(2, '0')]),
];

// 01-Tokens, semantic, resolved to light mode values
export type Token = [token: string, alias: string, hex: string];
export const semantic: { group: string; note: string; tokens: Token[] }[] = [
  {
    group: 'Background',
    note: 'Page and surface fills, from the strongest to white',
    tokens: [
      ['bg/strong-950', 'neutral 950', '#171717'],
      ['bg/surface-800', 'neutral 800', '#262626'],
      ['bg/sub-300', 'neutral 300', '#D1D1D1'],
      ['bg/soft-200', 'neutral 200', '#EBEBEB'],
      ['bg/weak-50', 'neutral 50', '#F7F7F7'],
      ['bg/white-0', 'neutral 0', '#FFFFFF'],
    ],
  },
  {
    group: 'Text',
    note: 'Text colors. The ratio is the contrast on bg/white-0',
    tokens: [
      ['text/strong-950', 'neutral 950', '#171717'],
      ['text/sub-600', 'neutral 600', '#5C5C5C'],
      ['text/soft-400', 'neutral 400', '#A3A3A3'],
      ['text/disabled-300', 'neutral 300', '#D1D1D1'],
      ['text/white-0', 'neutral 0', '#FFFFFF'],
    ],
  },
  {
    group: 'Stroke',
    note: 'Borders and dividers',
    tokens: [
      ['stroke/strong-950', 'neutral 950', '#171717'],
      ['stroke/sub-300', 'neutral 300', '#DEDEDE'],
      ['stroke/soft-200', 'neutral 200', '#EBEBEB'],
      ['stroke/white-0', 'neutral 0', '#FFFFFF'],
    ],
  },
  {
    group: 'Icon',
    note: 'Icon fills and strokes, paired with the text colors',
    tokens: [
      ['icon/strong-950', 'neutral 950', '#171717'],
      ['icon/sub-600', 'neutral 600', '#5C5C5C'],
      ['icon/soft-400', 'neutral 400', '#A3A3A3'],
      ['icon/disabled-300', 'neutral 300', '#D1D1D1'],
      ['icon/white-0', 'neutral 0', '#FFFFFF'],
    ],
  },
  {
    group: 'Static',
    note: 'Black and white that stay the same in every theme',
    tokens: [
      ['static/static-black', 'neutral 950', '#171717'],
      ['static/static-white', 'neutral 0', '#FFFFFF'],
    ],
  },
];

export const states: { key: string; name: string; use: string; tokens: [level: string, alias: string, hex: string][] }[] = [
  { key: 'information', name: 'Information', use: 'Neutral news, tips, links in alerts', tokens: [['dark', 'blue/950', '#000B3B'], ['base', 'blue/500', '#335CFF'], ['light', 'blue/100', '#D5D9FF'], ['lighter', 'blue/50', '#EEF0FF']] },
  { key: 'success', name: 'Success', use: 'Done, paid, saved, online', tokens: [['dark', 'green/950', '#0B4627'], ['base', 'green/500', '#1FC16B'], ['light', 'green/200', '#C2F5DA'], ['lighter', 'green/50', '#E3F7EC']] },
  { key: 'warning', name: 'Warning', use: 'Needs attention soon, pending', tokens: [['dark', 'orange/950', '#71330A'], ['base', 'orange/500', '#FA7319'], ['light', 'orange/200', '#FFD9C0'], ['lighter', 'orange/50', '#FFF3EB']] },
  { key: 'error', name: 'Error', use: 'Failed, overdue, destructive', tokens: [['dark', 'red/700', '#D02533'], ['base', 'red/500', '#FB3748'], ['light', 'red/200', '#FFC0C5'], ['lighter', 'red/50', '#FFEBEC']] },
  { key: 'away', name: 'Away', use: 'Idle or paused presence', tokens: [['dark', 'yellow/950', '#624C18'], ['base', 'yellow/500', '#F6B51E'], ['light', 'yellow/200', '#FFECC0'], ['lighter', 'yellow/50', '#FFFAEB']] },
  { key: 'faded', name: 'Faded', use: 'Inactive, archived, features', tokens: [['dark', 'neutral 800', '#262626'], ['base', 'neutral 500', '#7B7B7B'], ['light', 'neutral 200', '#EBEBEB'], ['lighter', 'neutral 100', '#F5F5F5']] },
];

// alpha tokens, the hex carries the alpha channel
export const alphas: Token[] = [
  ['text/white-0-alpha-088', 'alpha/white/alpha-88', '#FFFFFFE0'],
  ['text/white-0-alpha-064', 'alpha/white/alpha-64', '#FFFFFFA3'],
  ['text/white-0-alpha-024', 'alpha/white/alpha-24', '#FFFFFF3D'],
  ['bg/white-0-alpha-016', 'alpha/white/alpha-16', '#FFFFFF29'],
  ['overlay/overlay-gray', '—', '#3333333D'],
  ['overlay/overlay-slate', '—', '#2B303B3D'],
  ['shadow/gray/shadow-8', 'alpha/shadow/gray/alpha-8', '#17171714'],
  ['shadow/gray/shadow-4', 'alpha/shadow/gray/alpha-4', '#1717170A'],
];

export const opacity = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96];

// wcag contrast of a hex on white
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (hex: string, on = '#FFFFFF') => {
  const [a, b] = [lum(hex), lum(on)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};
// text color that reads on a swatch
export const ink = (hex: string) => (contrast(hex.slice(0, 7)) >= 3 ? '#FFFFFF' : '#171717');

// text styles, Inter. [name, weight, size, line height, tracking %]
export type TypeStyle = [name: string, weight: number, size: number, line: number, tracking: number];
const W: Record<string, number> = { Bold: 700, 'Semi Bold': 600, Semibold: 600, Medium: 500, Regular: 400, Italic: 400 };
const titles: [string, number, number, number][] = [['H1', 56, 64, -1], ['H2', 48, 56, -1], ['H3', 40, 48, -1], ['H4', 32, 40, -0.5], ['H5', 24, 32, 0], ['H6', 20, 28, 0]];
const body: [string, number, number, number][] = [['Extra Large', 24, 32, -1.5], ['Large', 18, 24, -1.5], ['Medium', 16, 24, -1.1], ['Small', 14, 20, -0.6], ['Extra Small', 12, 16, 0], ['Super Small', 10, 12, 0], ['Very Small', 8, 10, 0]];
const sub: [string, number, number, number][] = [['Medium', 16, 24, 6], ['Small', 14, 20, 6], ['Extra Small', 12, 16, 4], ['2x Small', 11, 12, 2]];
const upper: [string, number, number, number, number][] = [['Extra Large', 500, 24, 32, 10], ['Large', 500, 18, 24, 9.5], ['Medium', 400, 16, 24, 7.5], ['Small', 400, 14, 20, 7], ['Extra Small', 400, 12, 16, 6], ['Super Small', 400, 10, 12, 0], ['Very Small', 400, 8, 10, 0]];

export interface TypeGroup {
  key: string;
  name: string;
  use: string;
  weights: string[];
  rows: (weight: string) => TypeStyle[];
  italic?: boolean;
  upper?: boolean;
}
export const typeGroups: TypeGroup[] = [
  { key: 'title', name: 'Title', use: 'Page and section headings', weights: ['Semi Bold', 'Bold', 'Medium'], rows: (w) => titles.map(([n, s, l, t]) => [`Title/${w}/${n} Title`, W[w], s, l, t]) },
  { key: 'label', name: 'Label', use: 'Buttons, fields, menus and other UI text on one line', weights: ['Medium', 'Semibold'], rows: (w) => body.map(([n, s, l, t]) => [`Label/${w}/${n}`, W[w], s, l, t]) },
  { key: 'paragraph', name: 'Paragraph', use: 'Running text that wraps', weights: ['Regular'], rows: () => body.map(([n, s, l, t]) => [`Paragraphs/${n}`, 400, s, l, t]) },
  { key: 'subheading', name: 'Subheading', use: 'Small headings above groups, widely tracked', weights: ['Medium', 'Semibold', 'Regular'], rows: (w) => sub.map(([n, s, l, t]) => [`Subheading/${w}/${n}`, W[w], s, l, t]) },
  { key: 'uppercase', name: 'Uppercase', use: 'Overlines and tags, set in capitals', weights: ['Mixed'], upper: true, rows: () => upper.map(([n, w, s, l, t]) => [`Uppercase/${n}`, w, s, l, t]) },
  { key: 'italic', name: 'Italic', use: 'Quotes and emphasis inside a paragraph', weights: ['Italic'], italic: true, rows: () => body.map(([n, s, l, t]) => [`Italic/${n}`, 400, s, l, t]) },
];
export const typeCount = 64;

export const radii = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 999];
export const spacing = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64];

// where components use them, from the component pages
export const radiusUse: [token: string, where: string][] = [
  ['radius-4', 'Checkbox, tags inside fields, Rating star'],
  ['radius-6', 'Badge, Small Button'],
  ['radius-8', 'Button, Text Input, Icon Button, Small Alert'],
  ['radius-10', 'Medium Pagination item, Tooltip'],
  ['radius-12', 'Large Alert, Dropdown menu, modal icon'],
  ['radius-16', 'Modal, Popover, Large Dropdown menu'],
  ['radius-full', 'Switch, Banner, Progress Bar, rounded Badge'],
];

// effect styles. css is the browser equivalent of the figma effects (inner shadows included)
export interface Shadow {
  name: string;
  group: string;
  css: string;
  layers: number;
  use: string;
}
const g = (a: number) => `rgb(51 51 51 / ${a})`;
const customSmall = `inset 0 -0.5px 0.5px ${g(0.08)}, 0 1px 3px -1.5px ${g(0.16)}, 0 5px 5px -2.5px ${g(0.08)}, 0 12px 6px -6px ${g(0.02)}, 0 16px 8px -8px ${g(0.01)}, 0 0 0 1px ${g(0.04)}`;
const ladder = `0 48px 48px -24px ${g(0.04)}, 0 24px 24px -12px ${g(0.04)}, 0 12px 12px -6px ${g(0.04)}, 0 6px 6px -3px ${g(0.04)}, 0 3px 3px -1.5px ${g(0.02)}, 0 1px 1px 0.5px ${g(0.04)}`;
export const shadows: Shadow[] = [
  { name: 'Reguler-shadows/Small', group: 'Regular', css: '0 1px 2px 0 rgb(10 13 20 / 0.03)', layers: 1, use: 'Fields, buttons and cards that sit on the page' },
  { name: 'Reguler-shadows/Medium', group: 'Regular', css: '0 16px 32px -12px rgb(14 18 27 / 0.1)', layers: 1, use: 'Dropdown menus, popovers, date picker' },
  { name: 'Card-shadows/Large', group: 'Card', css: '0 12px 32px -12px rgb(14 18 27 / 0.1)', layers: 1, use: 'Cards that lift on hover' },
  { name: 'Custom-shadows/X-Small', group: 'Custom', css: customSmall, layers: 6, use: 'Same layers as Small, for chips and toggles' },
  { name: 'Custom-shadows/Small', group: 'Custom', css: customSmall, layers: 6, use: 'Raised controls, segmented thumbs' },
  { name: 'Custom-shadows/Medium', group: 'Custom', css: `0 0 0 1px #FFFFFF, ${ladder}, inset 0 -1px 1px -0.5px ${g(0.06)}`, layers: 8, use: 'Floating panels and toasts' },
  { name: 'Custom-shadows/Large', group: 'Custom', css: `inset 0 -1px 1px -0.5px ${g(0.06)}, 0 96px 96px -32px ${g(0.06)}, ${ladder}, 0 0 0 1px ${g(0.04)}`, layers: 9, use: 'Modals and full-screen sheets' },
];
