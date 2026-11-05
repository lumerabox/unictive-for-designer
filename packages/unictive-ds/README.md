# unictive-ds

Unictive Design System for code: tokens and component classes. Docs and examples for every component: https://design.unictive.net

## CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/unictive-ds@1/unictive.css" />

<button type="button" class="btn btn-md btn-primary btn-main">Save changes</button>
```

## npm

```bash
npm install unictive-ds
```

Plain CSS, no Tailwind needed:

```css
@import "unictive-ds";
```

Tailwind CSS v4 (adds utilities like `bg-bg-weak-50`, `text-text-sub-600`, `text-title-h4`, `shadow-regular-md`, `rounded-8`, `p-16`):

```css
@import "unictive-ds/tailwind.css";
```

`tailwind.css` imports `tailwindcss` itself, so it replaces your `@import "tailwindcss"`.

## Files

| File | What |
|---|---|
| `unictive.css` | Tokens, Inter font and every component class. Works without a build step |
| `tailwind.css` | The same classes for Tailwind CSS v4 |
| `unictive-tailwind.css` | Only the `@theme` block: colors, text styles, shadows, radius, spacing |
| `tokens.css` | Only the tokens as CSS variables, with `data-neutral="slate"` mode |
| `tokens.json` | W3C Design Tokens for Style Dictionary and Tokens Studio |

These files are generated from the design system. Do not edit them by hand.

## License

MIT
