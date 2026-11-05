// builds figma clipboard payloads for the input controls (dropdown, date picker, file upload, checkbox,
// radio, switch, rating) from the captured "Copy to Figma · Controls" frame, one template per page
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import regular from './inter-regular-glyphs.json';
import medium from './inter-medium-glyphs.json';
import { childrenIndex, createLayout, gid } from './layout';

type Node = Record<string, any>;
type Atlas = typeof regular;

// one DS variant, patched by layer name
export interface Part {
  variant: string; // e.g. "Checkbox Label / Right / Select / false"
  texts?: Record<string, string>; // text layer name → new text
  hide?: string[]; // layer names to hide, or paths like "Frame > Layer" under the variant
  show?: string[]; // layer names to show
  // replace a layer with another variant: path names the layer, or with index the container and its nth child
  swap?: { path: string; index?: number; part: Part }[];
  // replace every child of a container ("" is the variant itself) with these parts
  fill?: { path: string; parts: Part[] }[];
}

// several parts in an auto layout frame, e.g. a rating row or a menu
export interface Wrap {
  name: string;
  dir: 'HORIZONTAL' | 'VERTICAL';
  gap: number;
  pad?: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  align?: 'MIN' | 'CENTER' | 'MAX'; // cross axis
}

export interface CopySpec {
  parts: Part[];
  wrap?: Wrap;
}

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (bytes: Uint8Array) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

export interface Template {
  version: number;
  images: string[];
  schemaChunk: Uint8Array;
  codec: ReturnType<typeof compileSchema>;
  message: Node;
  byName: Map<string, Node>;
  kids: Map<string, Node[]>;
  canvas: Node;
  doc: Node;
}

const loading = new Map<string, Promise<Template>>();
export function loadTemplate(page: string) {
  if (!loading.has(page))
    loading.set(page, fetch(`/figma/controls-${page}.json`)
      .then((r) => r.json())
      .then((t: { version: number; images: string[]; schema: string; data: string }) => {
        const schemaChunk = fromB64(t.schema);
        const codec = compileSchema(decodeBinarySchema(inflateRaw(schemaChunk)));
        const message = codec.decodeMessage(inflateRaw(fromB64(t.data))) as Node;
        const nodes: Node[] = message.nodeChanges;
        const doc = nodes.find((n) => n.type === 'DOCUMENT')!;
        const canvas = nodes.find((n) => n.type === 'CANVAS')!;
        const byName = new Map<string, Node>();
        for (const n of nodes) if (n.parentIndex && gid(n.parentIndex.guid) === gid(canvas.guid)) byName.set(n.name, n);
        return { version: t.version, images: t.images, schemaChunk, codec, message, byName, kids: childrenIndex(nodes), canvas, doc };
      }));
  return loading.get(page)!;
}

// a variant by name, or a layer inside one: "Breadcrumbs / Arrow / 2 / false > chevron-right-line"
function findVariant(t: Template, name: string) {
  if (t.byName.has(name)) return t.byName.get(name);
  const [top, ...rest] = name.split(' > ');
  const src = t.byName.get(top);
  return src && rest.length ? walkPath(t.kids, src, rest.join(' > ')) : undefined;
}

// path segments are layer names, "Name#1" picks the second sibling with that name
function walkPath(kids: Map<string, Node[]>, from: Node, path: string): Node | undefined {
  let at: Node | undefined = from;
  for (const seg of path.split(' > ')) {
    const [name, nth = '0'] = seg.split('#');
    at = (kids.get(gid(at!.guid)) ?? []).filter((k) => k.name === name)[Number(nth)];
    if (!at) return undefined;
  }
  return at;
}

// "" is the root, one plain name matches the first layer with it anywhere, otherwise a path from the root
function resolve(nodes: Node[], root: Node, path: string): Node {
  if (!path) return root;
  const kids = childrenIndex(nodes);
  const hit = !path.includes(' > ') && !path.includes('#') ? nodes.find((n) => n !== root && n.name === path) : walkPath(kids, root, path);
  if (!hit) throw new Error(`no layer ${path}`);
  return hit;
}

const atlasFor = (n: Node): Atlas => (n.fontName?.style === 'Medium' ? (medium as Atlas) : regular);
const glyphFor = (a: Atlas, ch: string) => (a.glyphs as Record<string, { advance: number; blob: string | null }>)[ch] ?? a.glyphs['?' as keyof typeof a.glyphs];

const plain: Record<string, string> = { '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', '…': '...' };

// greedy word wrap, a width of Infinity keeps one line
function wrapLines(a: Atlas, chars: string[], width: number, size: number, track: number) {
  const adv = (ch: string) => glyphFor(a, ch).advance * size + track;
  const lines: { start: number; end: number; w: number }[] = [];
  let start = 0, w = 0, lastSpace = -1, wAtSpace = 0;
  for (let i = 0; i < chars.length; i++) {
    const g = adv(chars[i]);
    if (chars[i] === ' ') { lastSpace = i; wAtSpace = w; }
    if (w + g - track > width && i > start) {
      const cut = lastSpace > start ? lastSpace + 1 : i;
      lines.push({ start, end: cut, w: lastSpace > start ? wAtSpace - track : w - track });
      w = 0;
      for (let j = cut; j < i; j++) w += adv(chars[j]);
      start = cut;
      lastSpace = -1;
    }
    w += g;
  }
  lines.push({ start, end: chars.length, w: Math.max(0, w - track) });
  return lines;
}

// figma does not re-layout pasted text, so the payload carries glyph positions and outlines
function setText(n: Node, text: string, width: number | null, blobs: Uint8Array[], cache: Map<string, number>) {
  const a = atlasFor(n);
  const size = n.fontSize as number;
  const lh = n.lineHeight?.units === 'PIXELS' ? (n.lineHeight.value as number) : Math.round(a.fontLineHeight * size);
  const track = ((n.letterSpacing?.value ?? 0) / 100) * size;
  // typographic marks the atlas has no outline for fall back to their plain forms
  const chars = [...text].map((ch) => (ch in a.glyphs ? ch : plain[ch] ?? ch));
  text = chars.join('');
  const lines = wrapLines(a, chars, width ?? Infinity, size, track);
  const boxW = width ?? Math.ceil(Math.max(...lines.map((l) => l.w)));
  const boxH = lines.length * lh;
  const base = (lh - a.fontLineHeight * size) / 2 + a.ascent * size;
  const align = n.textAlignHorizontal;
  const glyphs = [];
  const offsets: number[] = [];
  const baselines = [];
  for (const [li, line] of lines.entries()) {
    const y = li * lh + base;
    const x0 = align === 'CENTER' ? (boxW - line.w) / 2 : align === 'RIGHT' ? boxW - line.w : 0;
    let x = x0;
    for (let i = line.start; i < line.end; i++) {
      const g = glyphFor(a, chars[i]);
      offsets[i] = x;
      if (g.blob) {
        const key = `${n.fontName?.style}:${chars[i]}`;
        if (!cache.has(key)) { blobs.push(fromB64(g.blob)); cache.set(key, blobs.length - 1); }
        glyphs.push({ commandsBlob: cache.get(key), position: { x, y }, fontSize: size, firstCharacter: i, advance: g.advance, rotation: 0 });
      }
      x += g.advance * size + track;
    }
    baselines.push({ position: { x: x0, y }, width: line.w, lineY: li * lh, lineHeight: lh, lineAscent: Math.floor(a.ascent * size), firstCharacter: line.start, endCharacter: line.end });
  }
  const meta = n.derivedTextData.fontMetaData[0];
  n.textData = { ...n.textData, characters: text };
  n.size = { x: boxW, y: boxH };
  n.derivedTextData = {
    ...n.derivedTextData,
    layoutSize: { x: boxW, y: boxH },
    baselines,
    glyphs,
    fontMetaData: [{ ...meta, fontDigest: fromB64(a.fontDigest), fontLineHeight: a.fontLineHeight }],
    logicalIndexToCharacterOffsetMap: offsets,
    derivedLines: lines.map(() => ({ directionality: 'LTR' })),
  };
}

const rgb = (hex: string) => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255, a: 1 });
const solid = (hex: string) => [{ type: 'SOLID', color: rgb(hex), opacity: 1, visible: true, blendMode: 'NORMAL' }];

export function buildMessage(t: Template, spec: CopySpec) {
  let nextId = 1;
  const session = 7777;
  const fresh = () => ({ sessionID: session, localID: nextId++ });
  const blobs: Uint8Array[] = t.message.blobs.map((b: Node) => b.bytes);
  const glyphCache = new Map<string, number>();
  const out: Node[] = [];
  const roots: Node[] = [];

  // one part as a fresh subtree: hide and show applied, texts recorded, swaps and fills grafted in
  function instantiate(p: Part): { nodes: Node[]; root: Node; texts: Map<Node, string> } {
    const src = findVariant(t, p.variant);
    if (!src) throw new Error(`no template for ${p.variant}`);
    // clone the subtree with fresh ids so a variant can repeat
    const map = new Map<string, any>();
    let nodes: Node[] = [];
    const collect = (n: Node) => {
      const c = structuredClone(n);
      map.set(gid(n.guid), (c.guid = fresh()));
      nodes.push(c);
      for (const k of t.kids.get(gid(n.guid)) ?? []) collect(k);
    };
    collect(src);
    for (const n of nodes) if (n.parentIndex && map.has(gid(n.parentIndex.guid))) n.parentIndex = { ...n.parentIndex, guid: map.get(gid(n.parentIndex.guid)) };
    const root = nodes[0];

    // a key matches a layer name, or with " > " the exact path under the variant, e.g. "Text-input (Outline) > Label"
    const byGid = new Map(nodes.map((n) => [gid(n.guid), n]));
    const pathOf = (n: Node): string => {
      const up = n === root ? undefined : byGid.get(gid(n.parentIndex.guid));
      return !up || up === root ? n.name : `${pathOf(up)} > ${n.name}`;
    };
    const paths = new Map(nodes.map((n) => [n, pathOf(n)]));
    const hits = (keys: string[] | undefined, n: Node) => !!keys?.some((k) => (k.includes('#') ? picked.get(k) === n : k.includes(' > ') ? k === paths.get(n) : k === n.name));
    // "Bar#1" style keys point at one sibling among several with the same name
    const picked = new Map<string, Node | undefined>();
    const kidsNow = childrenIndex(nodes);
    for (const k of [...(p.hide ?? []), ...(p.show ?? [])]) if (k.includes('#')) picked.set(k, walkPath(kidsNow, root, k));
    for (const n of nodes) {
      if (hits(p.hide, n)) n.visible = false;
      if (hits(p.show, n)) n.visible = true;
    }
    const texts = new Map<Node, string>();
    if (p.texts) for (const n of nodes) if (n.type === 'TEXT' && (n.name in p.texts || paths.get(n)! in p.texts)) texts.set(n, p.texts[paths.get(n)!] ?? p.texts[n.name]);
    // "Link-buttons#1 > Link Button" style keys pick one text among siblings with the same path
    for (const [k, v] of Object.entries(p.texts ?? {})) {
      const n = k.includes('#') ? walkPath(kidsNow, root, k) : undefined;
      if (n?.type === 'TEXT') texts.set(n, v);
    }

    const subtree = (n: Node) => {
      const kids = childrenIndex(nodes);
      const out = new Set<Node>();
      const walk = (x: Node) => { out.add(x); for (const k of kids.get(gid(x.guid)) ?? []) walk(k); };
      walk(n);
      return out;
    };
    // the grafted root takes the place, position and auto layout child settings of what it replaces
    const graft = (old: Node, p2: Part, parent: Node, position: string) => {
      const g = instantiate(p2);
      g.root.parentIndex = { guid: parent.guid, position };
      g.root.transform = { ...g.root.transform, m02: old.transform.m02, m12: old.transform.m12 };
      for (const k of ['stackChildPrimaryGrow', 'stackChildAlignSelf', 'stackPositioning']) {
        if (old[k] === undefined) delete g.root[k];
        else g.root[k] = old[k];
      }
      nodes.push(...g.nodes);
      for (const [n, v] of g.texts) texts.set(n, v);
    };
    const drop = (n: Node) => {
      const gone = subtree(n);
      nodes = nodes.filter((x) => !gone.has(x));
      for (const x of gone) texts.delete(x);
    };
    for (const s of p.swap ?? []) {
      const at = s.index === undefined ? resolve(nodes, root, s.path) : childrenIndex(nodes).get(gid(resolve(nodes, root, s.path).guid))?.[s.index];
      if (!at) throw new Error(`no layer ${s.path}${s.index === undefined ? '' : `[${s.index}]`} in ${p.variant}`);
      const parent = nodes.find((x) => gid(x.guid) === gid(at.parentIndex.guid))!;
      drop(at);
      graft(at, s.part, parent, at.parentIndex.position);
    }
    for (const f of p.fill ?? []) {
      const box = resolve(nodes, root, f.path);
      const old = childrenIndex(nodes).get(gid(box.guid)) ?? [];
      if (!old.length) throw new Error(`no children in ${f.path} of ${p.variant}`);
      old.forEach(drop);
      f.parts.forEach((fp, i) => graft(old[Math.min(i, old.length - 1)], fp, box, String.fromCharCode(33 + i)));
    }
    return { nodes, root, texts };
  }

  for (const p of spec.parts) {
    const { nodes, root, texts } = instantiate(p);
    const L = createLayout(childrenIndex(nodes));
    // hug texts take their own width, fill texts wrap to the width layout gives them
    const edits = [...texts.keys()];
    const hug = (n: Node) => n.textAutoResize === 'WIDTH_AND_HEIGHT';
    for (const n of edits) if (hug(n)) setText(n, texts.get(n) || ' ', null, blobs, glyphCache);
    L.layout(root, L.measure(root));
    if (edits.some((n) => !hug(n))) {
      for (const n of edits) if (!hug(n)) setText(n, texts.get(n) || ' ', n.size.x, blobs, glyphCache);
      L.layout(root, L.measure(root));
    }
    for (const n of edits) n.name = n.textData.characters;
    out.push(...nodes);
    roots.push(root);
  }

  let top: Node;
  if (spec.wrap && roots.length) {
    const w = spec.wrap;
    const pad = w.pad ?? 0;
    top = {
      guid: fresh(),
      phase: 'CREATED',
      parentIndex: { guid: t.canvas.guid, position: '!' },
      type: 'FRAME',
      name: w.name,
      visible: true,
      opacity: 1,
      blendMode: 'PASS_THROUGH',
      size: { x: 1, y: 1 },
      transform: { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 },
      fillPaints: w.fill ? solid(w.fill) : [],
      strokePaints: w.stroke ? solid(w.stroke) : [],
      strokeWeight: 1,
      strokeAlign: 'INSIDE',
      cornerRadius: w.radius ?? 0,
      ...Object.fromEntries(['rectangleTopLeftCornerRadius', 'rectangleTopRightCornerRadius', 'rectangleBottomLeftCornerRadius', 'rectangleBottomRightCornerRadius'].map((k) => [k, w.radius ?? 0])),
      frameMaskDisabled: true,
      stackMode: w.dir,
      stackSpacing: w.gap,
      stackHorizontalPadding: pad,
      stackPaddingRight: pad,
      stackVerticalPadding: pad,
      stackPaddingBottom: pad,
      stackPrimarySizing: 'RESIZE_TO_FIT_WITH_IMPLICIT_SIZE',
      stackCounterSizing: 'RESIZE_TO_FIT_WITH_IMPLICIT_SIZE',
      stackCounterAlignItems: w.align ?? 'MIN',
      stackPrimaryAlignItems: 'MIN',
    };
    roots.forEach((r, i) => (r.parentIndex = { guid: top.guid, position: String.fromCharCode(33 + i) }));
    out.unshift(top);
    const L = createLayout(childrenIndex(out));
    L.layout(top, L.measure(top));
  } else top = roots[0];
  top.transform = { ...top.transform, m02: 0, m12: 0 };

  // ship only the blobs these nodes use
  const used: Uint8Array[] = [];
  const remap = new Map<number, number>();
  const use = (i: number) => {
    if (!remap.has(i)) { remap.set(i, used.length); used.push(blobs[i]); }
    return remap.get(i)!;
  };
  for (const n of out) {
    if (n.vectorData?.vectorNetworkBlob !== undefined) n.vectorData.vectorNetworkBlob = use(n.vectorData.vectorNetworkBlob);
    for (const g of n.derivedTextData?.glyphs ?? []) if (g.commandsBlob !== undefined) g.commandsBlob = use(g.commandsBlob);
  }

  return {
    ...t.message,
    nodeChanges: [t.doc, t.canvas, ...out],
    blobs: used.map((bytes) => ({ bytes })),
    clipboardSelectionRegions: [{ nodes: [top.guid] }],
  };
}

export function buildHTML(t: Template, spec: CopySpec) {
  const data = deflateRaw(t.codec.encodeMessage(buildMessage(t, spec)));
  const schema = t.schemaChunk;
  const prelude = new TextEncoder().encode('fig-kiwi');
  const buf = new Uint8Array(prelude.length + 4 + 4 + schema.length + 4 + data.length);
  const view = new DataView(buf.buffer);
  buf.set(prelude, 0);
  let off = prelude.length;
  view.setUint32(off, t.version, true);
  off += 4;
  for (const chunk of [schema, data]) {
    view.setUint32(off, chunk.length, true);
    buf.set(chunk, off + 4);
    off += 4 + chunk.length;
  }
  // figma fetches image fills from these urls on paste
  const imageHashes = Object.fromEntries(t.images.map((h) => [h, new URL(`/figma/img/${h}.png`, location.origin).href]));
  const meta = { fileKey: '', pasteID: Math.floor(Math.random() * 2 ** 31), dataType: 'scene', editorType: 'design', environment: 'www.figma.com', imageHashes };
  const metaB64 = btoa(JSON.stringify(meta) + '\n');
  return `<meta charset="utf-8"><span data-metadata="<!--(figmeta)${metaB64}(/figmeta)-->"></span><span data-buffer="<!--(figma)${toB64(buf)}(/figma)-->"></span>`;
}
