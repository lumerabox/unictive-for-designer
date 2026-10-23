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

const atlasFor = (n: Node): Atlas => (n.fontName?.style === 'Medium' ? (medium as Atlas) : regular);
const glyphFor = (a: Atlas, ch: string) => (a.glyphs as Record<string, { advance: number; blob: string | null }>)[ch] ?? a.glyphs['?' as keyof typeof a.glyphs];

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
  const chars = [...text];
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

  for (const p of spec.parts) {
    const src = t.byName.get(p.variant);
    if (!src) throw new Error(`no template for ${p.variant}`);
    // clone the subtree with fresh ids so a variant can repeat
    const map = new Map<string, any>();
    const nodes: Node[] = [];
    const collect = (n: Node) => {
      const c = structuredClone(n);
      map.set(gid(n.guid), (c.guid = fresh()));
      nodes.push(c);
      for (const k of t.kids.get(gid(n.guid)) ?? []) collect(k);
    };
    collect(src);
    for (const n of nodes) if (n.parentIndex && map.has(gid(n.parentIndex.guid))) n.parentIndex = { ...n.parentIndex, guid: map.get(gid(n.parentIndex.guid)) };
    const root = nodes[0];
    const kids = childrenIndex(nodes);
    const L = createLayout(kids);

    // a key matches a layer name, or with " > " the exact path under the variant, e.g. "Text-input (Outline) > Label"
    const byGid = new Map(nodes.map((n) => [gid(n.guid), n]));
    const pathOf = (n: Node): string => {
      const up = n === root ? undefined : byGid.get(gid(n.parentIndex.guid));
      return !up || up === root ? n.name : `${pathOf(up)} > ${n.name}`;
    };
    const paths = new Map(nodes.map((n) => [n, pathOf(n)]));
    const hits = (keys: string[] | undefined, n: Node) => !!keys?.some((k) => (k.includes(' > ') ? k === paths.get(n) : k === n.name));
    const textOf = (n: Node) => p.texts![paths.get(n)!] ?? p.texts![n.name];
    for (const n of nodes) {
      if (hits(p.hide, n)) n.visible = false;
      if (hits(p.show, n)) n.visible = true;
    }
    // hug texts take their own width, fill texts wrap to the width layout gives them
    const edits = nodes.filter((n) => n.type === 'TEXT' && p.texts && (n.name in p.texts || paths.get(n)! in p.texts));
    const hug = (n: Node) => n.textAutoResize === 'WIDTH_AND_HEIGHT';
    for (const n of edits) if (hug(n)) setText(n, textOf(n) || ' ', null, blobs, glyphCache);
    L.layout(root, L.measure(root));
    if (edits.some((n) => !hug(n))) {
      for (const n of edits) if (!hug(n)) setText(n, textOf(n) || ' ', n.size.x, blobs, glyphCache);
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
