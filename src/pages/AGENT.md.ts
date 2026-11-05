// AGENT.md: instructions for AI coding agents, built from the same class lists and examples as the component pages
import type { ClassRow, Example } from '../lib/code-types';
import * as button from '../lib/button-code';
import * as textInput from '../lib/text-input-code';
import * as textArea from '../lib/text-area-code';
import * as dropdown from '../lib/dropdown-code';
import * as datePicker from '../lib/date-picker-code';
import * as fileUpload from '../lib/file-upload-code';
import * as rating from '../lib/rating-code';
import { checkbox, radio, switchCode } from '../lib/choice-code';
import { breadcrumbCode, tabsCode, paginationCode, stepperCode } from '../lib/nav-code';
import { alertCode, bannerCode, badgeCode, progressCode, tooltipCode } from '../lib/feedback-code';
import { modalCode, popoverCode } from '../lib/overlay-code';

const site = 'https://design.wofyu.space';

const components: [name: string, slug: string, code: { classes: ClassRow[]; examples: Example[] }][] = [
  ['Button', 'button', button],
  ['Text Input', 'text-input', textInput],
  ['Text Area', 'text-area', textArea],
  ['Dropdown', 'dropdown', dropdown],
  ['Date Picker', 'date-picker', datePicker],
  ['File Upload', 'file-upload', fileUpload],
  ['Checkbox', 'checkbox', checkbox],
  ['Radio Group', 'radio-group', radio],
  ['Switch', 'switch', switchCode],
  ['Rating', 'rating', rating],
  ['Breadcrumbs', 'breadcrumbs', breadcrumbCode],
  ['Tab Menu', 'tab-menu', tabsCode],
  ['Pagination', 'pagination', paginationCode],
  ['Stepper', 'stepper', stepperCode],
  ['Alert', 'alert', alertCode],
  ['Banner', 'banner', bannerCode],
  ['Badge', 'badge', badgeCode],
  ['Progress Bar', 'progress-bar', progressCode],
  ['Tooltip', 'tooltip', tooltipCode],
  ['Modal', 'modal', modalCode],
  ['Popover', 'popover', popoverCode],
];

// svg paths are long and add nothing for an agent, so examples keep the tag and drop the path data
const trim = (html: string) => html.replace(/ d="[^"]{40,}"/g, ' d="…"');

const section = ([name, slug, { classes, examples }]: (typeof components)[number]) => {
  const ex = examples[0];
  return `### ${name}

Docs: ${site}/components/${slug}/

| Class | Type | What |
|---|---|---|
${classes.map(([c, t, d]) => `| \`${c}\` | ${t} | ${d} |`).join('\n')}
${ex ? `
${ex.title}: ${ex.desc}

\`\`\`html
${trim(ex.html)}
\`\`\`
` : ''}`;
};

const body = `# Unictive Design System

Instructions for AI coding agents (Claude Code, Cursor, Codex) working in a project that uses the Unictive Design System. Save this file as CLAUDE.md (or AGENTS.md) in the project root.

Docs: ${site}

## Setup

The DS ships as one npm package, \`unictive-ds\`: design tokens as CSS variables plus plain CSS component classes. There is no JavaScript framework and no React package. Components are HTML with classes, so they work in any stack. In JSX write \`className\` instead of \`class\`.

Check how the project loads it before adding anything:

- npm: \`npm install unictive-ds\`, then \`@import "unictive-ds";\` once at the top of the main CSS file
- Tailwind CSS v4: \`@import "unictive-ds/tailwind.css";\` replaces \`@import "tailwindcss"\`
- CDN: \`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/unictive-ds@1/unictive.css" />\`
- Tokens only: \`@import "unictive-ds/tokens.css";\`

## Rules

1. Use a DS component class when one exists. Never rebuild a button, field, modal or badge with custom CSS.
2. Never hardcode colors, radius, spacing or shadows. Use the tokens below as CSS variables (or as Tailwind utilities when the project uses \`tailwind.css\`).
3. Never edit files inside \`node_modules/unictive-ds\`. They are generated from the design system.
4. Font is Inter, loaded by \`unictive.css\`. Do not add another font.
5. Icons are inline \`<svg>\` with \`stroke="currentColor"\` (or \`fill="currentColor"\`), so they take the text color. Do not use emoji as icons.
6. Keep native elements: \`<button>\`, \`<input type="checkbox">\`, \`<dialog>\`, \`<a>\`. The classes style them, the browser keeps them accessible.
7. One Primary button per area. Use \`btn-neutral\` for supporting actions and \`btn-error\` for destructive ones.

## Tokens

Semantic tokens, light mode. Names follow \`--<group>-<role>-<step>\`, where the step matches the neutral scale (0 white to 950 black).

| Group | Variables |
|---|---|
| Background | \`--bg-white-0\`, \`--bg-weak-50\`, \`--bg-soft-200\`, \`--bg-sub-300\`, \`--bg-surface-800\`, \`--bg-strong-950\` |
| Text | \`--text-strong-950\`, \`--text-sub-600\`, \`--text-soft-400\`, \`--text-disabled-300\`, \`--text-white-0\` |
| Stroke | \`--stroke-soft-200\`, \`--stroke-sub-300\`, \`--stroke-strong-950\`, \`--stroke-white-0\` |
| Icon | \`--icon-strong-950\`, \`--icon-sub-600\`, \`--icon-soft-400\`, \`--icon-disabled-300\`, \`--icon-white-0\` |
| Primary (brand) | \`--primary-base\`, \`--primary-dark\`, \`--primary-darkest\`, \`--primary-light\`, \`--primary-lighter\`, \`--primary-alpha-10\`, \`--primary-alpha-16\`, \`--primary-alpha-24\` |
| State | \`--state-{error,warning,success,information,away,faded}-{base,dark,light,lighter}\` |
| Radius | \`--radius-{0,2,4,6,8,10,12,16,20,24,28,32,36,40,44,full}\` |
| Spacing | \`--spacing-{0,2,4,6,8,10,12,14,16,20,24,32,40,48,56,64}\` |

\`\`\`css
.card {
  background: var(--bg-white-0);
  border: 1px solid var(--stroke-soft-200);
  border-radius: var(--radius-16);
  padding: var(--spacing-24);
  color: var(--text-strong-950);
}
\`\`\`

With Tailwind every token is a utility: \`bg-bg-weak-50\`, \`text-text-sub-600\`, \`border-stroke-soft-200\`, \`rounded-8\`, \`p-16\`, \`gap-12\`, \`shadow-regular-md\`, and text styles such as \`text-title-h4\`, \`text-label-sm\` and \`text-paragraph-md\`.

All tokens: ${site}/foundations/all-tokens/

## Components

Every class the package ships, grouped by component, with one example each. Each docs page has more examples and the states.

${components.map(section).join('\n')}`;

export function GET() {
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
