// every variable of Unictive DS 1.0 by collection, with the token each one points to.
// read from the DS library; gray/900 and gray/700 are not used by any semantic token and come from the older primitive scale
import { brands, stateScales, states, radii, spacing, opacity } from './foundations';

export type Mode = 'gray' | 'slate';
export type CollectionKey = 'tokens' | 'neutral' | 'brand' | 'radius' | 'spacing' | 'opacity' | 'foundations';

export interface Collection {
  key: CollectionKey;
  name: string;
  layer: 'Semantic' | 'Theme' | 'Primitive';
  holds: string;
  modes: string[];
}
export const collections: Collection[] = [
  { key: 'tokens', name: '01-Tokens', layer: 'Semantic', holds: 'Backgrounds, text, strokes, icons, states, brand roles, overlays and shadows', modes: ['Default'] },
  { key: 'neutral', name: '02-Neutral', layer: 'Theme', holds: 'The neutral steps every gray token points to', modes: ['Gray', 'Slate'] },
  { key: 'brand', name: '03-Brand', layer: 'Theme', holds: 'Primary roles that point to the active brand', modes: ['Default'] },
  { key: 'radius', name: '04-Radius', layer: 'Primitive', holds: 'Corner radius, 0 to full', modes: ['Default'] },
  { key: 'spacing', name: '05-Spacing', layer: 'Primitive', holds: 'Padding and gaps, 0 to 64', modes: ['Default'] },
  { key: 'opacity', name: '06-Opacity', layer: 'Primitive', holds: 'Layer opacity in steps of 8 %', modes: ['Default'] },
  { key: 'foundations', name: 'Foundations', layer: 'Primitive', holds: 'Raw ramps: neutrals, six brands, five state hues and alpha colors', modes: ['Default'] },
];

export interface DsToken {
  name: string;
  collection: CollectionKey;
  kind: 'color' | 'number';
  // the token this one points to, by name; slate is set only where the Slate mode points elsewhere
  ref?: string;
  slate?: string;
  value?: string;
}

const s12 = ['950', '900', '800', '700', '600', '500', '400', '300', '200', '100', '50', '0'];
const hex = (h: string) => '#' + h.toUpperCase();
const a8 = (a: number) => Math.round((a / 100) * 255).toString(16).toUpperCase().padStart(2, '0');

// primitives
const gray = '171717 1c1c1c 262626 3d3d3d 5c5c5c 7b7b7b a3a3a3 d1d1d1 ebebeb f5f5f5 f7f7f7 ffffff'.split(' ');
const slate = '0e121b 181b25 222530 2b303b 525866 717784 99a0ae cacfd8 eaecf0 f2f5f8 f5f7fa ffffff'.split(' ');
// [group, base hex, alpha steps]
const alphaSets: [string, string, number[]][] = [
  ['slate', '99a0ae', [24, 16, 10]],
  ['gray', 'a3a3a3', [24, 16, 10, 0]],
  ...brands.map((b): [string, string, number[]] => [b.key, b.scale.find(([s]) => s === b.base)![1].slice(1), [24, 16, 10]]),
  ['orange', 'fa7319', [24, 16, 10]],
  ['red', 'fb3748', [24, 16, 10]],
  ['green', '1fc16b', [24, 16, 10]],
  ['yellow', 'fbc64b', [24, 16, 10]],
  ['white', 'ffffff', [88, 80, 72, 64, 48, 24, 16, 10, 0]],
  ['black', '171717', [24, 16, 10]],
  ...['gray', ...brands.map((b) => b.key), 'orange', 'green'].map((k): [string, string, number[]] => {
    const dark = k === 'gray' ? '171717' : k === 'orange' ? '71330a' : k === 'green' ? '0b4627' : brands.find((b) => b.key === k)!.scale[0][1].slice(1);
    return [`shadow/${k}`, dark, [8, 6, 4, 2, 0]];
  }),
];

const foundations: DsToken[] = [
  ...gray.map((h, i): DsToken => ({ name: `neutral/gray/${s12[i]}`, collection: 'foundations', kind: 'color', value: hex(h) })),
  ...slate.map((h, i): DsToken => ({ name: `neutral/slate/${s12[i]}`, collection: 'foundations', kind: 'color', value: hex(h) })),
  ...brands.flatMap((b) => b.scale.map(([s, h]): DsToken => ({ name: `${b.key}/${s}`, collection: 'foundations', kind: 'color', value: h }))),
  ...Object.entries(stateScales).flatMap(([k, steps]) => steps.map(([s, h]): DsToken => ({ name: `${k}/${s}`, collection: 'foundations', kind: 'color', value: h }))),
  ...alphaSets.flatMap(([g, h, steps]) => steps.map((a): DsToken => ({ name: `alpha/${g}/alpha-${a}`, collection: 'foundations', kind: 'color', value: hex(h) + a8(a) }))),
];

// 02-Neutral, one step per mode
const neutral: DsToken[] = s12.map((s) => ({ name: s, collection: 'neutral', kind: 'color', ref: `neutral/gray/${s}`, slate: `neutral/slate/${s}` }));

// 03-Brand, primary roles of the Unictive brand
const brand: DsToken[] = [
  ['primary-darkest', 'brand/core/darker'], ['primary-dark', 'brand/core/dark'], ['primary-base', 'brand/core/base'], ['primary-light', 'brand/core/light'], ['primary-lighter', 'brand/core/lighter'],
  ['alpha/primary-alpha-24', 'brand/core/alpha-24'], ['alpha/primary-alpha-16', 'brand/core/alpha-16'], ['alpha/primary-alpha-10', 'brand/core/alpha-10'],
  ...[8, 6, 4, 2, 0].map((a) => [`shadow/primary-shadow-${a}`, `alpha/shadow/core/alpha-${a}`]),
].map(([name, ref]) => ({ name, collection: 'brand', kind: 'color', ref }));

// 01-Tokens
const t = (name: string, ref: string): DsToken => ({ name, collection: 'tokens', kind: 'color', ref });
const raw = (name: string, h: string): DsToken => ({ name, collection: 'tokens', kind: 'color', value: hex(h) });
const step = (r: string) => r.match(/\d+$/)![0];
const semantic: DsToken[] = [
  t('static/static-black', '950'), t('static/static-white', '0'),
  ...['strong-950', 'surface-800', 'sub-300', 'soft-200', 'weak-50', 'white-0'].map((r) => t(`bg/${r}`, step(r))),
  t('bg/white-0-alpha-016', 'alpha/white/alpha-16'), t('bg/white-0-alpha-010', 'alpha/white/alpha-10'),
  ...['strong-950', 'sub-600', 'soft-400', 'disabled-300', 'white-0'].map((r) => t(`text/${r}`, step(r))),
  ...[88, 80, 72, 64, 48, 24].map((a) => t(`text/white-0-alpha-0${a}`, `alpha/white/alpha-${a}`)),
  ...['strong-950', 'sub-300', 'soft-200', 'white-0'].map((r) => t(`stroke/${r}`, step(r))),
  ...['strong-950', 'sub-600', 'soft-400', 'disabled-300', 'white-0'].map((r) => t(`icon/${r}`, step(r))),
  ...states.flatMap((s) => s.tokens.map(([level, alias]) => t(`state/${s.key}/${level}`, alias.startsWith('neutral ') ? alias.slice(8) : alias))),
  ...brands.flatMap((b) => [
    t(`brand/${b.key}/darker`, `${b.key}/800`), t(`brand/${b.key}/dark`, `${b.key}/700`), t(`brand/${b.key}/base`, `${b.key}/${b.base}`),
    t(`brand/${b.key}/light`, `${b.key}/100`), t(`brand/${b.key}/lighter`, `${b.key}/50`),
    ...[24, 16, 10].map((a) => t(`brand/${b.key}/alpha-${a}`, `alpha/${b.key}/alpha-${a}`)),
  ]),
  raw('overlay/overlay-gray', '3333333d'), raw('overlay/overlay-slate', '2b303b3d'), raw('overlay/overlay-white', 'ffffff'), raw('overlay/overlay-white-0', 'ffffff00'),
  ...['strong-400', 'sub-300', 'soft-200', 'weak-100', 'white-0'].map((r) => t(`illustration/${r}`, step(r))),
  ...['gray', 'orange'].flatMap((k) => [8, 6, 4, 2, 0].map((a) => t(`shadow/${k}/shadow-${a}`, `alpha/shadow/${k}/alpha-${a}`))),
  raw('social/apple', '000000'), raw('social/twitter', '010101'), raw('social/github', '24292f'), raw('social/notion', '1e2226'),
  raw('social/tidal', '000000'), raw('social/amazon', '353e47'), raw('social/zendesk', '16140d'),
];

const num = (collection: CollectionKey, name: string, v: number): DsToken => ({ name, collection, kind: 'number', value: String(v) });

export const tokens: DsToken[] = [
  ...semantic,
  ...neutral,
  ...brand,
  ...radii.map((r) => num('radius', r === 999 ? 'radius-full' : `radius-${r}`, r)),
  ...spacing.map((s) => num('spacing', `spacing-${s}`, s)),
  ...opacity.map((o) => num('opacity', `opacity-${o}`, o)),
  ...foundations,
];

const byName = new Map(tokens.map((x) => [x.name, x]));
export const collectionOf = (k: CollectionKey) => collections.find((c) => c.key === k)!;
export const countOf = (k: CollectionKey) => tokens.filter((x) => x.collection === k).length;

// the token a reference points to in a mode
export const refOf = (x: DsToken, mode: Mode = 'gray') => (mode === 'slate' && x.slate ? x.slate : x.ref);

// every step from a token down to its raw value
export function chain(x: DsToken, mode: Mode = 'gray'): DsToken[] {
  const out = [x];
  let cur = x;
  while (refOf(cur, mode)) {
    cur = byName.get(refOf(cur, mode)!)!;
    out.push(cur);
  }
  return out;
}
export const resolve = (x: DsToken, mode: Mode = 'gray') => chain(x, mode).at(-1)!.value!;
export const get = (name: string) => byName.get(name)!;

export const unit = (x: DsToken) => (x.collection === 'opacity' ? '%' : 'px');
export const display = (x: DsToken, mode: Mode = 'gray') => (x.kind === 'number' ? `${x.value === '999' ? '999' : x.value} ${unit(x)}` : resolve(x, mode));

// css custom property name. 03-Brand drops its group so alpha/primary-alpha-24 reads --primary-alpha-24
export const cssName = (x: DsToken) => {
  const n = x.collection === 'brand' ? x.name.split('/').at(-1)! : x.name;
  return '--' + (x.collection === 'neutral' ? `neutral-${n}` : n.replace(/\//g, '-'));
};
