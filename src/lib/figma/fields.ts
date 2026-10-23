// builds a figma clipboard payload for one text input or text area variant from the captured template.
// the template holds all 288 variants as editable auto layout layers (public/figma/inputs.json)
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import font from './inter-regular-glyphs.json';
import { childrenIndex, createLayout, gid } from './layout';

type Node = Record<string, any>;

export interface FieldCopy {
  name: string; // e.g. "Text Input / Outline / Medium / Placeholder / Default"
  label: boolean;
  required: boolean;
  optional: boolean;
  caption: boolean;
  counter?: boolean;
  leadIcon?: boolean;
  trailIcon?: boolean;
  text: string;
}

const VALUE = 'Placeholder text';

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (bytes: Uint8Array) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

interface Template {
  version: number;
  schemaChunk: Uint8Array;
  codec: ReturnType<typeof compileSchema>;
  message: Node;
  byName: Map<string, Node>;
  kids: Map<string, Node[]>;
  canvas: Node;
  doc: Node;
}

let loading: Promise<Template> | null = null;
export function loadTemplate() {
  loading ??= fetch('/figma/inputs.json')
    .then((r) => r.json())
    .then((t: { version: number; schema: string; data: string }) => {
      const schemaChunk = fromB64(t.schema);
      const codec = compileSchema(decodeBinarySchema(inflateRaw(schemaChunk)));
      const message = codec.decodeMessage(inflateRaw(fromB64(t.data))) as Node;
      const nodes: Node[] = message.nodeChanges;
      const doc = nodes.find((n) => n.type === 'DOCUMENT')!;
      const canvas = nodes.find((n) => n.type === 'CANVAS')!;
      const byName = new Map<string, Node>();
      for (const n of nodes) if (n.parentIndex && gid(n.parentIndex.guid) === gid(canvas.guid)) byName.set(n.name, n);
      return { version: t.version, schemaChunk, codec, message, byName, kids: childrenIndex(nodes), canvas, doc };
    });
  return loading;
}

const glyphFor = (ch: string) => (font.glyphs as Record<string, { advance: number; blob: string | null }>)[ch] ?? font.glyphs['?'];
const advance = (ch: string, size: number, track: number) => glyphFor(ch).advance * size + track;

// greedy word wrap, a width of Infinity keeps one line
function wrap(text: string, width: number, size: number, track: number) {
  const chars = [...text];
  const lines: { start: number; end: number; w: number }[] = [];
  let start = 0, w = 0, lastSpace = -1, wAtSpace = 0;
  for (let i = 0; i < chars.length; i++) {
    const a = advance(chars[i], size, track);
    if (chars[i] === ' ') { lastSpace = i; wAtSpace = w; }
    if (w + a - track > width && i > start) {
      const cut = lastSpace > start ? lastSpace + 1 : i;
      lines.push({ start, end: cut, w: lastSpace > start ? wAtSpace - track : w - track });
      w = 0;
      for (let j = cut; j < i; j++) w += advance(chars[j], size, track);
      start = cut;
      lastSpace = -1;
    }
    w += a;
  }
  lines.push({ start, end: chars.length, w: Math.max(0, w - track) });
  return lines;
}

// figma does not re-layout pasted text, so the payload carries glyph positions and outlines
function setText(n: Node, text: string, width: number | null, blobs: Uint8Array[]) {
  const size = n.fontSize as number;
  const lh = n.lineHeight.value as number;
  const track = (n.letterSpacing.value / 100) * size;
  const chars = [...text];
  const lines = wrap(text, width ?? Infinity, size, track);
  const boxW = width ?? Math.ceil(Math.max(...lines.map((l) => l.w)));
  const boxH = lines.length * lh;
  const base = (lh - font.fontLineHeight * size) / 2 + font.ascent * size;
  const blobIndex = new Map<string, number>();
  const glyphs = [];
  const offsets: number[] = [];
  const baselines = [];
  for (const [li, line] of lines.entries()) {
    const y = li * lh + base;
    let x = 0;
    for (let i = line.start; i < line.end; i++) {
      const g = glyphFor(chars[i]);
      offsets[i] = x;
      if (g.blob) {
        if (!blobIndex.has(chars[i])) {
          blobs.push(fromB64(g.blob));
          blobIndex.set(chars[i], blobs.length - 1);
        }
        glyphs.push({ commandsBlob: blobIndex.get(chars[i]), position: { x, y }, fontSize: size, firstCharacter: i, advance: g.advance, rotation: 0 });
      }
      x += advance(chars[i], size, track);
    }
    baselines.push({ position: { x: 0, y }, width: line.w, lineY: li * lh, lineHeight: lh, lineAscent: Math.floor(font.ascent * size), firstCharacter: line.start, endCharacter: line.end });
  }
  const meta = n.derivedTextData.fontMetaData[0];
  n.name = text;
  n.textData = { ...n.textData, characters: text };
  n.size = { x: boxW, y: boxH };
  n.derivedTextData = {
    ...n.derivedTextData,
    layoutSize: { x: boxW, y: boxH },
    baselines,
    glyphs,
    fontMetaData: [{ ...meta, fontDigest: fromB64(font.fontDigest), fontLineHeight: font.fontLineHeight }],
    logicalIndexToCharacterOffsetMap: offsets,
    derivedLines: lines.map(() => ({ directionality: 'LTR' })),
  };
}

export function buildMessage(t: Template, o: FieldCopy) {
  const src = t.byName.get(o.name);
  if (!src) throw new Error(`no template for ${o.name}`);
  // clone the variant subtree
  const ids = new Set<string>();
  const collect = (n: Node) => { ids.add(gid(n.guid)); for (const c of t.kids.get(gid(n.guid)) ?? []) collect(c); };
  collect(src);
  const nodes: Node[] = structuredClone(t.message.nodeChanges.filter((n: Node) => ids.has(gid(n.guid))));
  const kids = childrenIndex(nodes);
  const L = createLayout(kids);
  const root = nodes.find((n) => gid(n.guid) === gid(src.guid))!;
  const child = (p: Node, name: string) => (kids.get(gid(p.guid)) ?? []).find((c) => c.name === name);
  const all = (name: string) => nodes.filter((n) => n.name === name);

  // toggles, the same booleans the component exposes
  const label = child(root, 'Label');
  if (label) {
    label.visible = o.label;
    for (const n of kids.get(gid(label.guid)) ?? []) {
      if (n.name === '*') n.visible = o.required;
      if (n.name === '(Optional)') n.visible = o.optional;
    }
  }
  const cap = child(root, 'Caption');
  if (cap) cap.visible = o.caption;
  const foot = child(root, 'Caption + Caracter Counter');
  if (foot) {
    for (const n of kids.get(gid(foot.guid)) ?? []) n.visible = n.name === 'Input caption' ? o.caption : o.counter ?? true;
    foot.visible = o.caption || (o.counter ?? true);
  }
  if (o.leadIcon === false) for (const n of all('check-line')) n.visible = false;
  if (o.trailIcon === false) for (const n of all('info-circle-line')) n.visible = false;

  // value text: hug texts take their own width, fill texts wrap to the width layout gives them
  const blobs: Uint8Array[] = [...t.message.blobs.map((b: Node) => b.bytes)];
  const values = nodes.filter((n) => n.type === 'TEXT' && n.textData?.characters === VALUE);
  const text = o.text.trim() || VALUE;
  const hug = (n: Node) => n.textAutoResize === 'WIDTH_AND_HEIGHT';
  for (const n of values) if (hug(n)) setText(n, text, null, blobs);
  L.layout(root, L.measure(root));
  if (values.some((n) => !hug(n))) {
    for (const n of values) if (!hug(n)) setText(n, text, n.size.x, blobs);
    L.layout(root, L.measure(root));
  }

  root.transform = { ...root.transform, m02: 0, m12: 0 };

  // ship only the blobs this variant uses
  const used: Uint8Array[] = [];
  const remap = new Map<number, number>();
  const use = (i: number) => {
    if (!remap.has(i)) { remap.set(i, used.length); used.push(blobs[i]); }
    return remap.get(i)!;
  };
  for (const n of nodes) {
    if (n.vectorData?.vectorNetworkBlob !== undefined) n.vectorData.vectorNetworkBlob = use(n.vectorData.vectorNetworkBlob);
    for (const g of n.derivedTextData?.glyphs ?? []) if (g.commandsBlob !== undefined) g.commandsBlob = use(g.commandsBlob);
  }

  return {
    ...t.message,
    nodeChanges: [t.doc, t.canvas, ...nodes],
    blobs: used.map((bytes) => ({ bytes })),
    clipboardSelectionRegions: [{ nodes: [root.guid] }],
  };
}

export function buildFieldHTML(t: Template, o: FieldCopy) {
  const data = deflateRaw(t.codec.encodeMessage(buildMessage(t, o)));
  const schema = t.schemaChunk;
  const prelude = new TextEncoder().encode('fig-kiwi');
  const out = new Uint8Array(prelude.length + 4 + 4 + schema.length + 4 + data.length);
  const view = new DataView(out.buffer);
  out.set(prelude, 0);
  let off = prelude.length;
  view.setUint32(off, t.version, true);
  off += 4;
  for (const chunk of [schema, data]) {
    view.setUint32(off, chunk.length, true);
    out.set(chunk, off + 4);
    off += 4 + chunk.length;
  }
  const meta = { fileKey: '', pasteID: Math.floor(Math.random() * 2 ** 31), dataType: 'scene', editorType: 'design', environment: 'www.figma.com', imageHashes: {} };
  const metaB64 = btoa(JSON.stringify(meta) + '\n');
  return `<meta charset="utf-8"><span data-metadata="<!--(figmeta)${metaB64}(/figmeta)-->"></span><span data-buffer="<!--(figma)${toB64(out)}(/figma)-->"></span>`;
}
