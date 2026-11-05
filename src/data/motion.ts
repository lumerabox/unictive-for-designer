// motion tokens and reveal presets, the same values as public/code/motion.css

export const easings: { name: string; value: string; bezier?: [number, number, number, number]; use: string }[] = [
  { name: 'ease-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', bezier: [0.2, 0, 0, 1], use: 'Hover, color and state changes in product UI' },
  { name: 'ease-enter', value: 'cubic-bezier(0.22, 1, 0.36, 1)', bezier: [0.22, 1, 0.36, 1], use: 'Something appears: dropdown, toast, popover' },
  { name: 'ease-exit', value: 'cubic-bezier(0.64, 0, 0.78, 0)', bezier: [0.64, 0, 0.78, 0], use: 'Something leaves. Pair with a shorter duration' },
  { name: 'ease-move', value: 'cubic-bezier(0.65, 0, 0.35, 1)', bezier: [0.65, 0, 0.35, 1], use: 'On-screen moves: slider, tab indicator, reorder' },
  { name: 'ease-expo', value: 'cubic-bezier(0.16, 1, 0.3, 1)', bezier: [0.16, 1, 0.3, 1], use: 'Landing reveals and text. Fast start, long settle' },
  { name: 'ease-curtain', value: 'cubic-bezier(0.87, 0, 0.13, 1)', bezier: [0.87, 0, 0.13, 1], use: 'Wipes, curtains and page transitions' },
  { name: 'ease-pop', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', bezier: [0.34, 1.56, 0.64, 1], use: 'Small things that pop: badge, check, like' },
  { name: 'ease-spring', value: 'linear(0, 0.048, 0.159, 0.302, 0.452, 0.594, 0.719, 0.823, 0.903, 0.963, 1.004, 1.03, 1.043, 1.048, 1.047, 1.043, 1.036, 1.029, 1.022, 1.015, 1.01, 1.006, 1.003, 1, 0.999, 0.998, 1)', use: 'Toggles, sheets and drag release. A spring without JS' },
];

export const durations: { name: string; ms: number; use: string }[] = [
  { name: 'duration-base', ms: 300, use: 'The default and the floor: hover, press, color, tooltip' },
  { name: 'duration-medium', ms: 400, use: 'Menu, popover, toast, toggle' },
  { name: 'duration-slow', ms: 500, use: 'Drawer, sheet, modal' },
  { name: 'duration-slower', ms: 700, use: 'Large moves, card stagger, small reveals' },
  { name: 'duration-reveal', ms: 900, use: 'Landing text and image reveal' },
  { name: 'duration-cinematic', ms: 1400, use: 'Hero intro, curtain, page transition' },
];

export const staggers: [name: string, value: string, use: string][] = [
  ['stagger-list', '60ms', 'Rows in a menu or list'],
  ['stagger-item', '100ms', 'Cards and children on a landing page'],
  ['stagger-word', '80ms', 'Word reveal'],
  ['stagger-char', '30ms', 'Character reveal'],
];

export const distances: [name: string, value: string, use: string][] = [
  ['distance-sm', '8px', 'UI: menus and toasts'],
  ['distance-md', '24px', 'Default reveal'],
  ['distance-lg', '64px', 'Hero and scroll-linked'],
];

export const blockPresets: [value: string, text: string, desc: string][] = [
  ['fade-up', 'Fade up', 'Rises from below. The default reveal'],
  ['fade-down', 'Fade down', 'Drops in from above'],
  ['fade-left', 'Fade left', 'Comes in from the right'],
  ['fade-right', 'Fade right', 'Comes in from the left'],
  ['scale-in', 'Scale in', 'Grows from 92 %'],
  ['blur-in', 'Blur in', 'Comes into focus while it rises'],
];

export const imagePresets: [value: string, text: string, desc: string, from?: string][] = [
  ['reveal-clip', 'Clip from bottom', 'The frame wipes open upward, the image settles from 1.2x', 'bottom'],
  ['reveal-clip', 'Clip from left', 'Same wipe, sideways', 'left'],
  ['reveal-clip', 'Clip from center', 'Opens outward from the middle', 'center'],
  ['reveal-zoom', 'Zoom out', 'Fades in while the image settles from 1.25x'],
  ['reveal-curtain', 'Curtain', 'A brand block slides across and uncovers the image'],
];

export const textPresets: [value: string, text: string, desc: string][] = [
  ['lines-up', 'Lines up', 'Each line rises from its own mask. Calm, editorial'],
  ['words-up', 'Words up', 'Word by word from a mask'],
  ['chars-up', 'Characters up', 'Letter by letter, the GSAP SplitText look. Keep it for short headings'],
  ['words-blur', 'Words blur', 'Words come into focus, no mask'],
  ['chars-fade', 'Characters fade', 'Letters fade in with a small lift'],
];

export const attributes: [name: string, type: string, desc: string][] = [
  ['data-motion', 'preset', 'Turns the reveal on. Plays once when the element scrolls into view'],
  ['data-motion-children', 'flag', 'Moves the children one after another instead of the element'],
  ['data-motion-from', 'bottom · top · left · right · center', 'Wipe direction for reveal-clip'],
  ['data-motion-repeat', 'flag', 'Plays again each time it re-enters from below'],
  ['data-motion-scroll', 'preset', 'Ties progress to the scroll position instead of time. See Scroll'],
  ['--motion-duration', 'time', 'Overrides the duration'],
  ['--motion-ease', 'easing', 'Overrides the curve'],
  ['--motion-delay', 'time', 'Waits before it starts'],
  ['--motion-stagger', 'time', 'Gap between children, words or letters'],
  ['--motion-distance', 'length', 'How far fades travel'],
  ['--motion-curtain', 'color', 'Curtain color, primary base by default'],
  ['--motion-range', 'range', 'Scroll range for data-motion-scroll, entry 0% cover 40% by default'],
];

export const api: [name: string, type: string, desc: string][] = [
  ['UnictiveMotion.init(root?)', 'function', 'Finds new [data-motion] elements. Runs on load; call it again after adding content'],
  ['UnictiveMotion.replay(el)', 'function', 'Snaps back and plays again'],
  ['UnictiveMotion.show(el)', 'function', 'Plays without waiting for the scroll'],
  ['UnictiveMotion.hide(el, instant?)', 'function', 'Back to the hidden state'],
  ['UnictiveMotion.destroy(el?)', 'function', 'Restores the original markup and stops watching'],
];

export const motionSetup = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/unictive-ds/motion.css">
<script src="https://cdn.jsdelivr.net/npm/unictive-ds/motion.js" defer></script>`;

// one snippet for the playgrounds and the copy buttons
export function motionHtml(o: { preset: string; kind: 'block' | 'image' | 'text'; children?: boolean; from?: string; text?: string; vars?: Record<string, string> }) {
  const style = Object.entries(o.vars ?? {}).map(([k, v]) => `${k}: ${v}`).join('; ');
  const attrs = `data-motion="${o.preset}"${o.from && o.preset === 'reveal-clip' ? ` data-motion-from="${o.from}"` : ''}${o.children ? ' data-motion-children' : ''}${style ? ` style="${style}"` : ''}`;
  if (o.kind === 'text') return `<h2 ${attrs}>${o.text ?? 'Design that moves with purpose'}</h2>`;
  if (o.kind === 'image') return `<figure ${attrs}>\n  <img src="photo.jpg" alt="">\n</figure>`;
  if (o.children) return `<ul ${attrs}>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>`;
  return `<div class="card" ${attrs}>…</div>`;
}

// the full catalog on the Easing page: tokens above, then the standard families, css keywords and physics curves
export type Curve = { name: string; value: string; bezier?: [number, number, number, number] };
const cb = (b: [number, number, number, number]) => `cubic-bezier(${b.join(', ')})`;
const fam = (name: string, i: Curve['bezier'], o: Curve['bezier'], io: Curve['bezier']) =>
  [['in', i], ['out', o], ['in-out', io]].map(([k, b]): Curve => ({ name: `${name}-${k}`, value: cb(b as [number, number, number, number]), bezier: b as [number, number, number, number] }));

export const families: { name: string; desc: string; curves: Curve[] }[] = [
  { name: 'Sine', desc: 'The softest. Barely different from linear', curves: fam('sine', [0.12, 0, 0.39, 0], [0.61, 1, 0.88, 1], [0.37, 0, 0.63, 1]) },
  { name: 'Quad', desc: 'Gentle, a safe default for small UI', curves: fam('quad', [0.11, 0, 0.5, 0], [0.5, 1, 0.89, 1], [0.45, 0, 0.55, 1]) },
  { name: 'Cubic', desc: 'Noticeable but calm', curves: fam('cubic', [0.32, 0, 0.67, 0], [0.33, 1, 0.68, 1], [0.65, 0, 0.35, 1]) },
  { name: 'Quart', desc: 'Confident. Good for drawers and modals', curves: fam('quart', [0.5, 0, 0.75, 0], [0.25, 1, 0.5, 1], [0.76, 0, 0.24, 1]) },
  { name: 'Quint', desc: 'Strong start, long settle', curves: fam('quint', [0.64, 0, 0.78, 0], [0.22, 1, 0.36, 1], [0.83, 0, 0.17, 1]) },
  { name: 'Expo', desc: 'The most dramatic. The landing page favourite', curves: fam('expo', [0.7, 0, 0.84, 0], [0.16, 1, 0.3, 1], [0.87, 0, 0.13, 1]) },
  { name: 'Circ', desc: 'Sharp corner at one end', curves: fam('circ', [0.55, 0, 1, 0.45], [0, 0.55, 0.45, 1], [0.85, 0, 0.15, 1]) },
  { name: 'Back', desc: 'Pulls back or overshoots before it lands', curves: fam('back', [0.36, 0, 0.66, -0.56], [0.34, 1.56, 0.64, 1], [0.68, -0.6, 0.32, 1.6]) },
];

export const keywords: Curve[] = [
  { name: 'linear', value: 'linear', bezier: [0, 0, 1, 1] },
  { name: 'ease', value: 'ease', bezier: [0.25, 0.1, 0.25, 1] },
  { name: 'ease-in', value: 'ease-in', bezier: [0.42, 0, 1, 1] },
  { name: 'ease-out', value: 'ease-out', bezier: [0, 0, 0.58, 1] },
  { name: 'ease-in-out', value: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] },
];

export const physics: (Curve & { desc: string })[] = [
  { name: 'spring', value: easings.find((e) => e.name === 'ease-spring')!.value, desc: 'The ease-spring token. One small overshoot' },
  { name: 'spring-gentle', value: 'linear(0, 0.033, 0.107, 0.202, 0.302, 0.4, 0.491, 0.572, 0.644, 0.705, 0.758, 0.802, 0.838, 0.869, 0.894, 0.914, 0.931, 0.945, 0.956, 0.964, 0.972, 0.977, 0.982, 0.986, 0.989, 0.991, 0.993, 0.994, 0.995, 0.996, 0.997, 0.998, 0.998, 0.999, 1)', desc: 'Critically damped, no overshoot' },
  { name: 'spring-snappy', value: 'linear(0, 0.103, 0.313, 0.538, 0.731, 0.874, 0.966, 1.018, 1.04, 1.044, 1.038, 1.028, 1.018, 1.01, 1.005, 1.001, 0.999, 0.998, 0.998, 1)', desc: 'Stiff and quick, for toggles' },
  { name: 'elastic-out', value: 'linear(0, 0.205, 0.493, 0.796, 1.06, 1.25, 1.352, 1.371, 1.323, 1.232, 1.125, 1.023, 0.941, 0.89, 0.869, 0.875, 0.901, 0.937, 0.975, 1.008, 1.031, 1.044, 1.046, 1.04, 1.029, 1.016, 1.003, 0.993, 0.986, 0.984, 0.984, 0.988, 0.992, 0.997, 1.001, 1.004, 1.006, 1.006, 1.005, 1.004, 1.002, 1)', desc: 'Wobbles into place. Playful moments only' },
  { name: 'bounce-out', value: 'linear(0, 0.003, 0.012, 0.027, 0.048, 0.076, 0.109, 0.148, 0.194, 0.245, 0.303, 0.366, 0.436, 0.511, 0.593, 0.681, 0.774, 0.874, 0.98, 0.957, 0.91, 0.869, 0.834, 0.805, 0.782, 0.766, 0.755, 0.75, 0.752, 0.759, 0.772, 0.792, 0.818, 0.849, 0.887, 0.931, 0.98, 0.984, 0.963, 0.949, 0.94, 0.938, 0.941, 0.951, 0.966, 0.988, 0.993, 0.986, 0.985, 0.989, 1)', desc: 'Drops and bounces like a ball' },
  { name: 'steps-5', value: 'steps(5, end)', desc: 'Jumps in five steps. Counters, sprites, typewriters' },
];

// interaction presets on the Interaction page: class or attribute, demo kind, what it does
export const interactions: { group: string; items: { name: string; hook: string; demo: string; desc: string }[] }[] = [
  {
    group: 'Hover',
    items: [
      { name: 'Lift', hook: 'm-lift', demo: 'card', desc: 'Rises 4 px and casts a shadow. For clickable cards' },
      { name: 'Underline', hook: 'm-underline', demo: 'link', desc: 'Draws in from the left, leaves to the right' },
      { name: 'Nudge', hook: 'm-nudge', demo: 'arrow', desc: 'The trailing icon steps forward' },
      { name: 'Zoom', hook: 'm-zoom', demo: 'image', desc: 'The image grows inside its frame' },
      { name: 'Fill', hook: 'm-fill', demo: 'outline', desc: 'Color fills in from the left' },
      { name: 'Rotate', hook: 'm-rotate', demo: 'plus', desc: 'The icon turns with a spring' },
    ],
  },
  {
    group: 'Press and feedback',
    items: [
      { name: 'Press', hook: 'm-press', demo: 'button', desc: 'Shrinks to 97 % while held. Every button can have it' },
      { name: 'Ripple', hook: 'data-motion-ripple', demo: 'button', desc: 'A wave spreads from where you tap' },
      { name: 'Pop', hook: 'm-pop', demo: 'like', desc: 'The icon pops when it turns on' },
    ],
  },
  {
    group: 'Pointer',
    items: [
      { name: 'Magnetic', hook: 'data-motion-magnetic', demo: 'button', desc: 'Leans toward the pointer, springs back on leave' },
      { name: 'Tilt', hook: 'data-motion-tilt', demo: 'card', desc: 'Tilts in 3D under the pointer' },
      { name: 'Spotlight', hook: 'data-motion-spotlight', demo: 'panel', desc: 'A soft glow follows the pointer' },
    ],
  },
];

// scroll-driven presets on the Scroll page: data-motion-scroll value, what it does, the markup to copy
export const scrollGroups: { id: string; group: string; desc: string; items: { value: string; name: string; desc: string; snippet: string; wide?: boolean }[] }[] = [
  {
    id: 'text',
    group: 'Text',
    desc: 'The paragraph lights up word by word or letter by letter as it crosses the screen. Scroll back and it dims again',
    items: [
      { value: 'chars-fill', name: 'Characters fill', wide: true, desc: 'Letters go from dim to an accent color to full, a soft wave across the text. For statements and manifestos', snippet: `<p data-motion-scroll="chars-fill" style="--motion-accent: #f2643d">\n  A product should say something before it moves.\n</p>` },
      { value: 'words-fill', name: 'Words fill', desc: 'Word by word from 20 % to full. Calm, reads well at any length', snippet: `<p data-motion-scroll="words-fill">We design the parts you never notice.</p>` },
      { value: 'words-blur', name: 'Words focus', desc: 'Words come out of a blur as you read on', snippet: `<p data-motion-scroll="words-blur">The structure recedes while it keeps its shape.</p>` },
    ],
  },
  {
    id: 'sections',
    group: 'Sections',
    desc: 'Whole sections that change shape with the scroll',
    items: [
      { value: 'expand', name: 'Expand to full width', wide: true, desc: 'Starts at 80 % with rounded corners and opens to the full width as it reaches the middle. For a hero image or video', snippet: `<section data-motion-scroll="expand">\n  <img src="hero.jpg" alt="">\n</section>` },
      { value: 'marquee', name: 'Scroll marquee', wide: true, desc: 'Big lines of type slide sideways with the scroll, each line the other way. Repeat the words so the line is at least twice the screen width', snippet: `<p data-motion-scroll="marquee">Design · Motion · Systems · Design · Motion · Systems ·</p>\n<p data-motion-scroll="marquee" style="--motion-shift-from: -50%; --motion-shift: 0%">Build · Ship · Measure · Build · Ship · Measure ·</p>` },
    ],
  },
  {
    id: 'images',
    group: 'Images',
    desc: 'The frame stays in place, the image inside moves',
    items: [
      { value: 'parallax', name: 'Parallax', desc: 'The image drifts slower than the page inside its frame', snippet: `<figure data-motion-scroll="parallax">\n  <img src="photo.jpg" alt="">\n</figure>` },
      { value: 'zoom-out', name: 'Zoom out', desc: 'Settles from 1.35x to its size as it enters', snippet: `<figure data-motion-scroll="zoom-out">\n  <img src="photo.jpg" alt="">\n</figure>` },
      { value: 'reveal-circle', name: 'Circle mask', desc: 'A circle in the middle grows until the image is uncovered', snippet: `<figure data-motion-scroll="reveal-circle">\n  <img src="photo.jpg" alt="">\n</figure>` },
    ],
  },
  {
    id: 'pinned',
    group: 'Pinned',
    desc: 'Content that stays on screen while the scroll drives it',
    items: [
      { value: 'stack', name: 'Stacking cards', wide: true, desc: 'Cards stick to the top one over another, the ones below step back. For steps and case studies', snippet: `<ul data-motion-scroll="stack">\n  <li class="card">01 Discover</li>\n  <li class="card">02 Design</li>\n  <li class="card">03 Build</li>\n</ul>` },
      { value: 'pin-x', name: 'Horizontal gallery', wide: true, desc: 'A tall section pins its row and turns the vertical scroll into a sideways move', snippet: `<section data-motion-scroll="pin-x" style="--motion-pin-length: 300vh">\n  <div class="m-pin">\n    <div>…cards…</div>\n  </div>\n</section>` },
    ],
  },
  {
    id: 'basics',
    group: 'Progress and basics',
    desc: 'A reading bar, and the reveal presets tied to the scroll instead of time',
    items: [
      { value: 'progress', name: 'Reading progress', desc: 'A bar that fills with the nearest scroller. Put it in a sticky header', snippet: `<div class="progress" data-motion-scroll="progress"></div>` },
      { value: 'fade-up', name: 'Fade, scale, blur, clip', desc: 'fade-up, scale-in, blur-in and reveal-clip, following the scroll both ways', snippet: `<div data-motion-scroll="fade-up">…</div>\n<div data-motion-scroll="scale-in">…</div>\n<div data-motion-scroll="blur-in">…</div>\n<figure data-motion-scroll="reveal-clip"><img src="photo.jpg" alt=""></figure>` },
    ],
  },
];

export const scrollVars: [name: string, type: string, desc: string][] = [
  ['data-motion-scroll', 'preset', 'Ties the animation to the scroll position. Text presets need motion.js to split'],
  ['--motion-range', 'range', 'When it runs, for example entry 0% cover 40%. Each preset has its own default'],
  ['--motion-inset', 'percent', 'expand: how far in from each side it starts, 10% by default'],
  ['--motion-radius', 'length', 'expand: the starting corner radius, 24px by default'],
  ['--motion-accent', 'color', 'chars-fill: the color at the leading edge, primary base by default'],
  ['--motion-text-dim', 'number', 'Text presets: opacity before a piece lights up, 0.2 by default'],
  ['--motion-text-start', 'percent', 'Text presets: where on screen the first piece starts, 15% by default'],
  ['--motion-text-span', 'percent', 'Text presets: how much scroll the whole text takes, 35% by default'],
  ['--motion-shift-from, --motion-shift', 'percent', 'marquee: start and end of the sideways move, 0% to -50% by default'],
  ['--motion-stack-top, --motion-stack-peek', 'length', 'stack: where cards stick and how much of each one peeks out'],
  ['--motion-pin-length', 'length', 'pin-x: how much scroll the gallery takes, 300vh by default'],
  ['--motion-pin-view', 'length', 'pin-x: the pinned height, 100vh by default'],
  ['--motion-pin-top, --motion-pin-range', 'length, range', 'pin-x: where a shorter pinned row sticks, and the scroll range that matches it'],
  ['--motion-timeline', 'timeline', 'progress: what the bar follows, the nearest scroller by default'],
];
