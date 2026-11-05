// releases of the site, newest first. pages are names from livePages in nav.ts
export type Kind = 'new' | 'improved' | 'removed';

export interface Change {
  kind: Kind;
  text: string;
  pages?: string[];
}

export interface Release {
  date: string;
  title: string;
  summary: string;
  changes: Change[];
}

export const kinds: [Kind, string][] = [
  ['new', 'New'],
  ['improved', 'Improved'],
  ['removed', 'Removed'],
];

export const releases: Release[] = [
  {
    date: '2026-10-28',
    title: 'File icons',
    summary: '32 file type icons in Default, Light and Solid, ready to copy into Figma or download',
    changes: [
      { kind: 'new', text: 'File Icons: PDF, Office, image, video, audio, archive and code files in three styles, colored by file family', pages: ['File Icons'] },
    ],
  },
  {
    date: '2026-10-28',
    title: 'Motion and reveal animations',
    summary: 'Motion tokens and a first set of scroll reveal animations, in plain CSS and a 2 kB script',
    changes: [
      { kind: 'new', text: 'Motion section next to Components: easing, duration and choreography tokens in motion.css', pages: ['Easing', 'Duration', 'Choreography'] },
      { kind: 'new', text: 'Reveal: fade, scale and blur entrances, staggered children, clip, zoom and curtain image reveals, scroll-linked progress', pages: ['Reveal'] },
      { kind: 'new', text: 'Text Reveal: lines, words and characters from a mask, or coming into focus', pages: ['Text Reveal'] },
      { kind: 'new', text: 'Interaction: hover, press and pointer effects, from lift and underline to magnetic and tilt', pages: ['Interaction'] },
      { kind: 'new', text: 'Scroll: text that fills as you read, sections that expand to full width, parallax, stacking cards, a pinned horizontal gallery, marquee and reading progress', pages: ['Scroll'] },
      { kind: 'improved', text: 'Durations start at 300 ms, the new default. Staggers are a little longer so each step reads', pages: ['Duration', 'Choreography'] },
      { kind: 'removed', text: 'm-sheen hover', pages: ['Interaction'] },
    ],
  },
  {
    date: '2026-10-28',
    title: 'unictive-ds package',
    summary: 'The design system ships as one package, unictive-ds, from npm or a CDN, with or without Tailwind',
    changes: [
      { kind: 'new', text: 'unictive.css: tokens, the Inter font and every component class in plain CSS, no Tailwind or build step needed', pages: ['Quick Start'] },
      { kind: 'improved', text: 'Quick Start shows the CDN link and npm install instead of downloading two files', pages: ['Quick Start'] },
    ],
  },
  {
    date: '2026-10-28',
    title: 'Foundations inside Components',
    summary: 'One section for everything you build with: foundations and tokens sit at the top of Components',
    changes: [
      { kind: 'improved', text: 'Foundations and Tokens moved into Components, above the component groups. Links stay the same', pages: ['Color', 'Typography', 'Radius & spacing', 'Shadows', 'Icons', 'How tokens work', 'All tokens', 'Export'] },
      { kind: 'removed', text: 'Foundations in the top bar. Components now opens on Color' },
      { kind: 'new', text: 'Code for developers on Text Input: classes, examples for every type with a live preview, Copy HTML in the playground, and the field group, addon, select and tag rules in global.css', pages: ['Text Input'] },
    ],
  },
  {
    date: '2026-10-27',
    title: 'Getting Started',
    summary: 'A new first section for anyone opening the site the first time, and a shorter top bar',
    changes: [
      { kind: 'new', text: 'Getting Started section: what the site covers, setting up code, setting up Figma, and how a component page works', pages: ['Introduction', 'Quick Start', 'Figma Library', 'Usage'] },
      { kind: 'improved', text: 'Tokens moved into Foundations, next to the values they describe. Old links redirect', pages: ['How tokens work', 'All tokens', 'Export'] },
      { kind: 'improved', text: 'What’s new is now Changelog in the top bar', pages: ['Changelog'] },
      { kind: 'new', text: 'Code for developers on the overlay pages: classes, examples with a live preview, and the rules in global.css. Modals open with command, popovers with popovertarget, no script needed', pages: ['Modal', 'Popover'] },
      { kind: 'new', text: 'Copy to Figma and Copy HTML in the overlay playgrounds. Figma gets the DS modal and popover with the same header, footer, arrow and tour step as the preview', pages: ['Modal', 'Popover'] },
      { kind: 'new', text: 'Code for developers on the navigation pages: classes, examples with a live preview, and the rules in global.css', pages: ['Breadcrumbs', 'Tab Menu', 'Pagination', 'Stepper'] },
      { kind: 'new', text: 'Copy to Figma and Copy HTML in the navigation playgrounds. Figma gets the DS layers with the same items, active tab, page and step as the preview', pages: ['Breadcrumbs', 'Tab Menu', 'Pagination', 'Stepper'] },
      { kind: 'new', text: 'Code for developers on the feedback pages: classes, examples with a live preview, and the rules in global.css', pages: ['Alert', 'Banner', 'Badge', 'Progress Bar', 'Tooltip'] },
      { kind: 'new', text: 'Copy to Figma and Copy HTML in the feedback playgrounds. Figma gets the DS layers with the same status, style, texts and value as the preview', pages: ['Alert', 'Banner', 'Badge', 'Progress Bar', 'Tooltip'] },
      { kind: 'improved', text: 'A smaller search button in the top bar. Search opens in a dialog, so it doesn’t need a wide field' },
    ],
  },
  {
    date: '2026-10-26',
    title: 'Foundations, tokens and assets',
    summary: 'The site now covers the whole DS: the foundations behind every component, all variables with exports for code, and the asset libraries',
    changes: [
      { kind: 'new', text: 'Code for developers: a class reference, ready-to-paste examples with a live preview, Copy HTML in the playground, and one global.css to download', pages: ['Button', 'Text Area', 'Dropdown', 'Date Picker', 'File Upload', 'Checkbox', 'Radio Group', 'Switch', 'Rating'] },
      { kind: 'new', text: 'Foundation pages with every value read from the DS variables, text styles and effect styles', pages: ['Color', 'Typography', 'Radius & spacing', 'Shadows', 'Icons'] },
      { kind: 'new', text: 'Tokens section: how the three layers fit together, a filterable table of every variable, and CSS, Tailwind v4 and W3C JSON exports', pages: ['How tokens work', 'All tokens', 'Export'] },
      { kind: 'new', text: 'Asset libraries, ready to copy into Figma or download', pages: ['Avatars', 'Brand Logos', 'Country Flags', 'Emoji'] },
      { kind: 'new', text: 'The rest of the Actions group', pages: ['Icon Button', 'Link Button', 'Compact Button', 'Social Button'] },
      { kind: 'new', text: 'This changelog, linked from What’s new in the top bar' },
      { kind: 'improved', text: 'The sidebar lists only the groups of the section you are in' },
      { kind: 'improved', text: 'Moving between doc pages swaps only the content, so the sidebar keeps its place' },
      { kind: 'improved', text: 'The side nav has a right stroke and a square active item' },
      { kind: 'improved', text: 'Content keeps a 14 px inset from the guides, corners follow one radius scale and state tiles show plain labels' },
      { kind: 'removed', text: 'The text field in component playgrounds. Labels come from the DS defaults' },
    ],
  },
  {
    date: '2026-10-23',
    title: 'First components',
    summary: 'The first version of Unictive for Designer: the Button and 24 more components, each with a playground, usage guidance and specs',
    changes: [
      { kind: 'new', text: 'Button with all 216 variants and Copy to Figma', pages: ['Button'] },
      { kind: 'new', text: 'Input components. Copy to Figma pastes the exact DS variant as layers, no plugin needed', pages: ['Text Input', 'Text Area', 'Dropdown', 'Date Picker', 'File Upload', 'Checkbox', 'Radio Group', 'Switch', 'Rating'] },
      { kind: 'new', text: 'Navigation components with live previews', pages: ['Breadcrumbs', 'Tab Menu', 'Pagination', 'Stepper'] },
      { kind: 'new', text: 'Feedback and overlay components with live demos', pages: ['Alert', 'Banner', 'Badge', 'Progress Bar', 'Tooltip', 'Modal', 'Popover'] },
      { kind: 'removed', text: 'The eyebrow label above section headlines' },
    ],
  },
];

export const idOf = (r: Release) => `r-${r.date}`;
export const dateOf = (r: Release) =>
  new Date(`${r.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const countOf = (k: Kind) => releases.reduce((n, r) => n + r.changes.filter((c) => c.kind === k).length, 0);
