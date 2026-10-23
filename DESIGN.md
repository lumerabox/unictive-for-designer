# Unictive for Designer — design system and layout rules

Source of truth for how design.wofyu.space looks. Figma reference: "Unictive for Designer - Website" (fileKey `Ggu8FBap6zK7jFTLLGfXlI`). The Guidelines page holds the grid frame (9:3862), and the Component page holds Button v4 (9:2912).

## Revise once, apply everywhere

Every value lives in one file, [src/styles/tokens.css](src/styles/tokens.css). Pages never hardcode spacing, size or color.

| To change | Edit | Affects |
|---|---|---|
| Page side margin | `--margin` (plus the overrides in the media queries below it) | topbar, shell and guides on every page |
| Content width | `--container` | every page |
| Sidebar, TOC or main column width | `--sidebar`, `--toc`, `--main`, `--center`, `--shell-gap` | every doc page |
| Space between sections | `--space-section` | every section on every page |
| Heading sizes | `--fs-display`, `--fs-h2`, `--fs-title`, … | every page |
| Colors | `--brand`, `--text-*`, `--bg-*`, `--stroke-*` | everything |
| Tile and canvas heights | `--tile-sm/md/lg`, `--canvas-h`, `--dd-h` | every tile grid |

The structure is shared too. Pages are thin: they only pass content to shared parts.

- [src/layouts/Base.astro](src/layouts/Base.astro) holds the html head, topbar, search palette and toast.
- [src/layouts/DocPage.astro](src/layouts/DocPage.astro) is the doc template. It builds the sidebar, header (crumbs, h1, intro, meta), main column, pager and on-this-page list. The sidebar, crumbs group and prev/next are derived from [src/data/nav.ts](src/data/nav.ts).
- [src/components/doc/](src/components/doc/) holds the shared blocks:
  - `Section`: label, h2, description and the bottom line
  - `Usage`: Use when / Avoid when
  - `DoDont`: do and don't figures, with slots
  - `SpecsTable`: tokens and specs, click a token to copy it
  - `Related`: related components grid
  - `Link`: a link when the page is live, a coming-soon button otherwise
- [src/styles/doc.css](src/styles/doc.css) styles every doc pattern (shell, sections, playground controls, tiles, table, pager, TOC, responsive). Restyle a pattern here once and it changes on every page.

Media queries can't read CSS variables. The breakpoints below are written as numbers in `tokens.css`, `doc.css` and `Base.astro`. To change a breakpoint, search for the number.

## Visual direction (v4)

The look is editorial and brutalist, the opposite of a generic card UI. The first card-based, rounded, tinted design was rejected as "too AI".

- One strict 12-column grid, which is visible: 0.5 px brand-alpha-16 guide lines at the container edges only.
- Horizontal lines (0.5 px, stroke-soft-200) only at the bottom of a section. Lines never cut through content.
- Content sits on white or `bg-weak-50` blocks. Corners are square (radius 0); only DS components such as Button keep their own radius.
- No light green or red tinted backgrounds. Status is shown with a 4 px top border (brand for do, error for don't) and colored labels.
- Labels are uppercase, 10/12, 500 weight, 8% tracking, in brand blue (or `muted` grey). Numbered labels such as "01 — Playground" are allowed.
- Headings are large and tight: the display h1 is 64–120 px with −5% tracking, and h2 is 32/40 with −3% tracking.
- The active state is solid black (`bg-strong-950`) with white text. The current nav item gets a brand inset bar.
- Asymmetric spans are welcome (4+8, 7+1+4, 2+8+2). Do not stretch every block edge to edge.
- Body text spans 4–6 columns (max about 588 px), and section padding is 64–96 px.
- Motion is short and functional: 120/160/260 ms on `cubic-bezier(.2,0,0,1)`, with no bounce.
- Use real Unictive DS tokens and component instances. Never use invented colors.

## Grid

| | 1440 canvas |
|---|---|
| Margin | 120 |
| Columns | 12 × 78 |
| Gutter | 24 |
| Container | 1200 |
| Span n | 78n + 24(n − 1) |

Doc page shell inside the container:

```
| sidebar 180 | gap 60 | main 792 | 24 | toc 144 |
               |------- center 960 ---------------|
```

## Breakpoints

| Width | Change |
|---|---|
| ≤ 1439 | `--margin` 64 |
| ≤ 1279 | TOC hidden, `--shell-gap` 40, main fills the center, topnav gap 24, search 160 |
| ≤ 1023 | `--margin` 32, `--topbar` 64, sidebar becomes a drawer (with top nav links), guides hidden |
| ≤ 767 | mobile: section 48, h2 28/36, lead 18/28, 2-column tiles, stacked intro, table rows stacked |
| ≤ 639 | `--margin` 20 |
| ≤ 399 | tile padding 14, tighter tile grid |

## Tokens

The color values mirror Unictive DS 1.0 semantic tokens (light mode only).

| Token | Value | DS name |
|---|---|---|
| `--bg-white-0` | #FFFFFF | bg/white-0 |
| `--bg-weak-50` | #F7F7F7 | bg/weak-50 |
| `--bg-soft-200` | #EBEBEB | bg/soft-200 |
| `--bg-strong-950` | #171717 | bg/strong-950 |
| `--text-strong-950` | #171717 | text/strong-950 |
| `--text-sub-600` | #5C5C5C | text/sub-600 |
| `--text-soft-400` | #A3A3A3 | text/soft-400 |
| `--stroke-soft-200` | #EBEBEB | stroke/soft-200 |
| `--stroke-sub-300` | #DEDEDE | stroke/sub-300 |
| `--brand` | #1868D0 | brand/core/base |
| `--brand-dark` | #0D4690 | brand hover |
| `--brand-lighter` | #ECF0FE | brand tint |
| `--brand-alpha-16` | #1868D029 | brand/core/alpha-16 |
| `--error` | #FB3748 | error |

Type is Inter 400/500/600: body 16/24, small 14/20, lead 20/30, label 10/12.

## Components on the site

- `Btn` ([src/components/Btn.astro](src/components/Btn.astro) and [src/styles/u-button.css](src/styles/u-button.css)) is the DS Button: Size × Style × Type × State (+ Rounded, icons). That makes 216 variants, with values in [src/data/button.ts](src/data/button.ts).
- Copy to Figma: [src/lib/figma/clipboard.ts](src/lib/figma/clipboard.ts) writes a native Figma clipboard payload, so no plugin is needed. A new component needs its own captured template, made with `scripts/figma-template.mjs`.

## Adding a page

1. Add the item to `livePages` in `src/data/nav.ts`. The sidebar, search, pager and related links pick it up.
2. Create `src/pages/components/<name>.astro`:

```astro
---
import DocPage from '../../layouts/DocPage.astro';
import Section from '../../components/doc/Section.astro';
import Usage from '../../components/doc/Usage.astro';
import SpecsTable from '../../components/doc/SpecsTable.astro';
---
<DocPage title="Text Input" description="…" intro="…" toc={[['usage', 'When to use'], ['specs', 'Tokens and specs']]}>
  <Section id="usage" label="Usage" title="When to use">
    <Usage use={['…']} avoid={['…']} />
  </Section>
  <Section id="specs" label="Specs" title="Tokens and specs">
    <SpecsTable label="Text Input specs" rows={[['Height', 'spacing-40', '40 px']]} />
  </Section>
</DocPage>
```

3. Don't add a `<style>` block for layout. When a page needs a new pattern, add it to `doc.css` with token values so the next page can use it.

## Run and deploy

```bash
npm run dev
```

```bash
npm run deploy
```

`npm run deploy` builds the site and rsyncs `dist/` to the AWS Lightsail VPS (`/srv/design`). Caddy serves it at design.wofyu.space.
