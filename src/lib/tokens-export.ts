// token files for code: css variables, a tailwind v4 theme and w3c design tokens json
import { tokens, collections, cssName, refOf, resolve, display, get, type DsToken } from '../data/tokens';
import { typeGroups, shadows } from '../data/foundations';

const banner = (what: string) => `Unictive Design System 1.0 · ${what} · generated from ${new URL(import.meta.env.SITE).host}/tokens`;
const order = ['foundations', 'radius', 'spacing', 'opacity', 'neutral', 'brand', 'tokens'] as const;
const numCss = (x: DsToken) => (x.collection === 'opacity' ? String(+x.value! / 100) : `${x.value}px`);
const cssValue = (x: DsToken) => (x.kind === 'number' ? numCss(x) : x.ref ? `var(${cssName(get(x.ref))})` : x.value!.toLowerCase());

export function css() {
  const lines = [`/* ${banner('CSS variables')} */`, '', ':root {'];
  for (const k of order) {
    const c = collections.find((c) => c.key === k)!;
    lines.push(`  /* ${c.name} */`);
    for (const x of tokens.filter((x) => x.collection === k)) lines.push(`  ${cssName(x)}: ${cssValue(x)};`);
    lines.push('');
  }
  lines[lines.length - 1] = '}';
  // custom properties inherit their computed value, so every token built on 02-Neutral is declared again here
  lines.push('', '/* 02-Neutral, Slate mode: set data-neutral="slate" on any element */', '[data-neutral="slate"] {');
  for (const x of tokens.filter((x) => x.slate)) lines.push(`  ${cssName(x)}: var(${cssName(get(x.slate!))});`);
  for (const x of tokens.filter((x) => !x.slate && display(x, 'gray') !== display(x, 'slate'))) lines.push(`  ${cssName(x)}: ${cssValue(x)};`);
  lines.push('}', '');
  return lines.join('\n');
}

// tailwind names for the foundations pages. italic shares the paragraph sizes, so it is paragraph + italic
const sizeKey: Record<string, string> = { 'Extra Large': 'xl', Large: 'lg', Medium: 'md', Small: 'sm', 'Extra Small': 'xs', 'Super Small': '2xs', '2x Small': '2xs', 'Very Small': '3xs' };
export const twType = typeGroups.filter((g) => !g.italic).flatMap((g) =>
  g.rows(g.weights[0]).map(([name, weight, size, line, tracking]) => {
    const last = name.split('/').at(-1)!.replace(' Title', '');
    return { group: g.key, name, cls: `text-${g.key}-${/^H\d$/.test(last) ? last.toLowerCase() : sizeKey[last]}`, weight, size, line, tracking };
  }),
);
const shadowKey: Record<string, string> = { 'X-Small': 'xs', Small: 'sm', Medium: 'md', Large: 'lg' };
export const twShadows = shadows.map((x) => {
  const [group, size] = x.name.split('/');
  return { ...x, cls: `shadow-${group.split('-')[0].toLowerCase().replace('reguler', 'regular')}-${shadowKey[size]}` };
});

// tailwind v4 reads theme variables from @theme; values are resolved so the file works on its own
export function tailwind() {
  const lines = [`/* ${banner('Tailwind CSS v4 theme, Gray mode')} */`, '/* import it after tailwindcss: @import "tailwindcss"; @import "./unictive-tailwind.css"; */', '', '@theme {'];
  lines.push('  /* colors: bg-bg-weak-50, text-text-sub-600, border-stroke-soft-200 … */');
  for (const x of tokens.filter((x) => x.collection === 'tokens')) lines.push(`  --color-${x.name.replace(/\//g, '-')}: ${resolve(x).toLowerCase()};`);
  lines.push('', '  /* primary roles of the active brand: bg-primary-base, text-primary-dark */');
  for (const x of tokens.filter((x) => x.collection === 'brand')) lines.push(`  --color-${x.name.split('/').at(-1)}: ${resolve(x).toLowerCase()};`);
  lines.push('', '  /* primitives, for charts and illustrations only: bg-blue-500, fill-core-500 */');
  for (const x of tokens.filter((x) => x.collection === 'foundations' && !x.name.startsWith('alpha/'))) lines.push(`  --color-${x.name.replace(/^neutral\//, '').replace(/\//g, '-')}: ${x.value!.toLowerCase()};`);
  lines.push('', '  /* text styles: text-title-h1, text-label-sm, text-paragraph-md. add font-bold for another weight, uppercase or italic for those groups */');
  for (const t of twType) {
    lines.push(`  --text-${t.cls.slice(5)}: ${t.size}px;`, `  --text-${t.cls.slice(5)}--line-height: ${t.line}px;`);
    if (t.tracking) lines.push(`  --text-${t.cls.slice(5)}--letter-spacing: ${+(t.tracking / 100).toFixed(4)}em;`);
    lines.push(`  --text-${t.cls.slice(5)}--font-weight: ${t.weight};`);
  }
  lines.push('', '  /* shadows: shadow-regular-md, shadow-custom-lg */');
  for (const x of twShadows) lines.push(`  --${x.cls}: ${x.css};`);
  lines.push('', '  /* radius: rounded-8, rounded-full */');
  for (const x of tokens.filter((x) => x.collection === 'radius')) lines.push(`  --radius-${x.name.slice(7)}: ${numCss(x)};`);
  lines.push('', '  /* spacing: p-16, gap-24 */');
  for (const x of tokens.filter((x) => x.collection === 'spacing')) lines.push(`  --spacing-${x.name.slice(8)}: ${numCss(x)};`);
  lines.push('}', '');
  return lines.join('\n');
}

// w3c design tokens format: groups by collection, aliases as {collection.path}
const path = (x: DsToken) => [x.collection, ...x.name.split('/')];
const alias = (name: string) => `{${path(get(name)).join('.')}}`;
export function json() {
  const root: Record<string, any> = { $description: banner('Design Tokens (W3C format)') };
  for (const k of order) root[k] = { $description: collections.find((c) => c.key === k)!.name };
  for (const x of tokens) {
    let node = root;
    for (const p of path(x).slice(0, -1)) node = node[p] ??= {};
    const leaf: Record<string, unknown> = x.kind === 'number'
      ? { $type: x.collection === 'opacity' ? 'number' : 'dimension', $value: x.collection === 'opacity' ? +x.value! / 100 : `${x.value}px` }
      : { $type: 'color', $value: x.ref ? alias(refOf(x)!) : x.value!.toLowerCase() };
    if (x.slate) leaf.$extensions = { 'com.figma.modes': { Gray: alias(x.ref!), Slate: alias(x.slate) } };
    node[path(x).at(-1)!] = leaf;
  }
  return JSON.stringify(root, null, 2) + '\n';
}

export const formats = [
  { key: 'css', name: 'CSS', file: 'unictive-tokens.css', type: 'text/css', build: css, hint: 'Plain CSS variables. Aliases stay as var() so a Slate container or a new brand updates every token under it' },
  { key: 'tailwind', name: 'Tailwind v4', file: 'unictive-tailwind.css', type: 'text/css', build: tailwind, hint: 'An @theme block with the colors, text styles, shadows, radius and spacing, so classes like bg-bg-weak-50, text-title-h4, shadow-regular-md and rounded-8 work' },
  { key: 'json', name: 'JSON', file: 'unictive-tokens.json', type: 'application/json', build: json, hint: 'W3C Design Tokens format for Style Dictionary, Tokens Studio and other tools. Aliases are kept as references' },
] as const;
