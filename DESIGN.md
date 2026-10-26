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
- Content sits on white or `bg-weak-50` blocks. Corners use `--radius` 12 for boxes (tiles, canvas, pager, palette), `--radius-sm` 8 for controls (selects, toggles, fields, chips, table rows) and `--radius-xs` 4 for small marks. DS components keep their own radius.
- Content keeps `--inset` 14 from the guide lines: topbar padding, sidebar labels/items and the right edge of the center column (0 below 1024, where guides are hidden).
- State tiles carry only the uppercase state label top-left, no A/B/C letters.
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
- `TextInput` and `TextArea` ([src/components/](src/components/) and [src/styles/u-field.css](src/styles/u-field.css)) are the DS fields: Style × Size × State (× Type for Text Input). That makes 264 and 24 variants, with values in [src/data/text-input.ts](src/data/text-input.ts) and [src/data/text-area.ts](src/data/text-area.ts). Pass `live` for a working field; [src/scripts/field-page.ts](src/scripts/field-page.ts) drives both playgrounds and their Copy to Figma.
- Copy to Figma for the fields: the "Copy to Figma · Inputs" frame on the Captures page of the website file holds all 288 variants as detached layers plus an Inter Regular glyph row. After a DS change, rebuild that frame, copy it, save the clipboard HTML to `figma/captures/inputs-template.html` and run `node scripts/figma-inputs-template.mjs figma/captures/inputs-template.html`. That writes `public/figma/inputs.json` and `src/lib/figma/inter-regular-glyphs.json`. [src/lib/figma/fields.ts](src/lib/figma/fields.ts) patches a variant (toggles, text), and [src/lib/figma/layout.ts](src/lib/figma/layout.ts) lays it out again because Figma keeps pasted geometry as is. `node scripts/figma-check-layout.ts` checks that layout pass against the capture.
- Copy to Figma for the input controls: the "Copy to Figma · Controls" frame (13:29591) on the Captures page holds the 143 variants of Dropdown, Date Picker, Calendar, File Upload, Checkbox, Radio, Switch and Rating as detached layers. After a DS change, rebuild it, copy it, save the clipboard HTML to `figma/captures/controls-template.html` and run `node scripts/figma-controls-template.mjs figma/captures/controls-template.html`. That writes one `public/figma/controls-<page>.json` per page and the image fills to `public/figma/img/`. [src/lib/figma/controls.ts](src/lib/figma/controls.ts) builds a payload from a spec (variant parts patched by layer name, optionally wrapped in an auto layout frame) and [src/scripts/controls-copy.ts](src/scripts/controls-copy.ts) wires the buttons, tiles and ⌘C. Check the layout pass with `node scripts/figma-check-layout.ts figma/captures/controls-template.html`.
- Copy to Figma: [src/lib/figma/clipboard.ts](src/lib/figma/clipboard.ts) writes a native Figma clipboard payload, so no plugin is needed. A new component needs its own captured template, made with `scripts/figma-template.mjs`.
- File Upload: copy is wired via [src/lib/figma/controls.ts](src/lib/figma/controls.ts) (`file-upload` template) from [src/scripts/file-upload-page.ts](src/scripts/file-upload-page.ts). The playground copies the area and the card in a 24 px vertical wrap, or the area alone once the card is closed; a dropped file's name and size go into the card.
- Checkbox, Radio Group, Switch: copy is wired via [src/lib/figma/controls.ts](src/lib/figma/controls.ts) (`checkbox`, `radio-group`, `switch` templates) from [src/scripts/choice-page.ts](src/scripts/choice-page.ts), specs built in [src/lib/figma/choice-copy.ts](src/lib/figma/choice-copy.ts). The label variants take the label, description, badge and link text from the preview and hide the parts toggled off; the radio playground copies its three rows in a 16 px vertical wrap.
- Rating: copy is wired the same way (`rating` template). The DS has no row component, so a row is five items in a horizontal wrap (2 px gap at Small, 4 px otherwise), each item Select, Precision or Default from the value, Default/true for every item when disabled.
- Dropdown: copy is wired via [src/lib/figma/controls.ts](src/lib/figma/controls.ts) (`dropdown` template), specs from `rowCopy` / `menuCopy` in [src/data/dropdown.ts](src/data/dropdown.ts). One row copies as its DS variant; the open menu copies its rows as picked in a vertical wrap (gap 4, pad 8, radius 12 / 16, stroke/soft-200). Icon and Description toggles hide those layers.
- Date Picker: copy is wired the same way (`date-picker` template). The DS variant is copied as is, without picked dates in the calendar; Label and Required hide the field's layers and an applied date goes into the field. Layer keys with " > " are paths under the variant, since the time field and range rail reuse the field's layer names.

- Breadcrumbs, Tab Menu, Pagination, Stepper (Navigation group): each data file ([src/data/breadcrumbs.ts](src/data/breadcrumbs.ts), [tab-menu.ts](src/data/tab-menu.ts), [pagination.ts](src/data/pagination.ts), [stepper.ts](src/data/stepper.ts)) holds the DS values and a `render(opts)` that returns the component's HTML, so the page (via `set:html`) and the browser draw the same markup. Styles are in `u-breadcrumbs.css`, `u-tabs.css`, `u-pagination.css` and `u-stepper.css`. A live preview carries its options in `data-opts`; [src/scripts/nav-page.ts](src/scripts/nav-page.ts) re-renders it on every click, key or playground change (trail trims back, tabs switch with arrows, pages and rows per page, Back/Next and finished steps). No Copy to Figma yet: tiles use `.tile-static`, and these pages need a captured template like the input controls.
- Alert, Banner, Badge, Progress Bar, Tooltip (Feedback) and Modal, Popover (Overlays): same pattern, a data file per component ([alert.ts](src/data/alert.ts), [banner.ts](src/data/banner.ts), [badge.ts](src/data/badge.ts), [progress-bar.ts](src/data/progress-bar.ts), [tooltip.ts](src/data/tooltip.ts), [modal.ts](src/data/modal.ts), [popover.ts](src/data/popover.ts)) with the DS values and a `render(opts)`. [src/data/markup.ts](src/data/markup.ts) holds the DS icon paths (`icon()`), the five statuses and their icons, and string versions of the Button and Icon Buttons. Shared CSS is in `u-feedback.css`: the state colors (`data-status` sets `--st` / `--st-lighter`), Link-buttons, dismiss buttons, Icon Buttons, and the tail and placement rules for floating surfaces (`.u-float` with `data-arrow`, placed around a trigger inside `.u-anchor`). [src/scripts/feedback-page.ts](src/scripts/feedback-page.ts) reads a whole playground form into options and redraws it, and runs the live demos: dismiss and Show again, a fake upload, tooltips on hover (300 ms) and focus, the modal as a native `<dialog>`, and the popover tour. No Copy to Figma yet; tiles use `.tile-static`.
- DS quirks seen there: Tooltip light shadows (0 1 5 −8 and 0 2 8 −8) are almost invisible, so light tooltips are shown on bg/weak-50 tiles; the circular progress track is bg/weak-50, so it sits on a `.surface`; the centered Modal-header has no close.
- Doc patterns added for them in `doc.css`: `.stage` (a canvas area that moves the trigger to the side a tooltip or popover opens away from), `.rows`, `.ring-grid`, `.tile-wrap`, `.range`, and `minmax(0, 1fr)` tracks on `.tile-body`, `.canvas` and mobile `.grid2`/`.grid3` so wide previews shrink instead of spilling out. Also `.surface` (white panel for components whose own fills are bg/weak-50, like the segmented track or hover states), `.tile-auto`, `.tile-wide` and `.tile-stack` for tall or wide previews, `.canvas-fill`, `.canvas-tall` and `.canvas-tools` for full-width live previews with their own buttons.

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
