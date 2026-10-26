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
    date: '2026-10-26',
    title: 'Foundations, tokens and assets',
    summary: 'The site now covers the whole DS: the foundations behind every component, all variables with exports for code, and the asset libraries',
    changes: [
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
