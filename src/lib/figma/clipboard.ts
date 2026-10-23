// builds a figma clipboard payload (fig-kiwi) for one button variant as editable auto-layout layers
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import template from './button-template.json';
import font from './inter-medium-glyphs.json';
import { look, metrics, textPadX, type Variant } from '../../data/button';

type Node = Record<string, any>;

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toB64 = (bytes: Uint8Array) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const revive = (_: string, v: any) => (v && typeof v === 'object' ? ('$b' in v ? fromB64(v.$b) : '$n' in v ? BigInt(v.$n) : v) : v);

let compiled: ReturnType<typeof compileSchema> | null = null;
let schemaChunk: Uint8Array | null = null;
function codec() {
  if (!compiled) {
    schemaChunk = fromB64(template.schema);
    compiled = compileSchema(decodeBinarySchema(inflateRaw(schemaChunk)));
  }
  return compiled;
}

const rgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a: 1,
});
const solid = (hex: string) => [{ type: 'SOLID', color: rgb(hex), opacity: 1, visible: true, blendMode: 'NORMAL' }];

const glyphFor = (ch: string) => (font.glyphs as Record<string, { advance: number; blob: string | null }>)[ch] ?? font.glyphs['?'];

// width of a single-line label as figma lays it out: advances plus tracking between characters
export function measureLabel(label: string, fontSize: number, trackingPct: number) {
  const chars = [...label];
  const adv = chars.reduce((w, ch) => w + glyphFor(ch).advance * fontSize, 0);
  return adv + (trackingPct / 100) * fontSize * Math.max(chars.length - 1, 0);
}

// figma does not re-layout pasted text, so the payload carries the glyph outlines
function derivedText(label: string, fontSize: number, lineHeight: number, trackingPct: number, boxW: number, blobs: { bytes: Uint8Array }[]) {
  const width = measureLabel(label, fontSize, trackingPct);
  const baselineY = (lineHeight - font.fontLineHeight * fontSize) / 2 + font.ascent * fontSize;
  const startX = (boxW - width) / 2;
  const blobIndex = new Map<string, number>();
  const glyphs = [];
  const offsets = [];
  let x = 0;
  const chars = [...label];
  for (let i = 0; i < chars.length; i++) {
    const g = glyphFor(chars[i]);
    offsets.push(x);
    if (g.blob) {
      if (!blobIndex.has(chars[i])) {
        blobs.push({ bytes: fromB64(g.blob) });
        blobIndex.set(chars[i], blobs.length - 1);
      }
      glyphs.push({ commandsBlob: blobIndex.get(chars[i]), position: { x: startX + x, y: baselineY }, fontSize, firstCharacter: i, advance: g.advance, rotation: 0 });
    }
    x += g.advance * fontSize + (trackingPct / 100) * fontSize;
  }
  return {
    layoutSize: { x: boxW, y: lineHeight },
    baselines: [{ position: { x: startX, y: baselineY }, width, lineY: 0, lineHeight, lineAscent: Math.floor(font.ascent * fontSize), firstCharacter: 0, endCharacter: chars.length }],
    glyphs,
    fontMetaData: [{ key: { family: 'Inter', style: 'Medium', postscript: '' }, fontLineHeight: font.fontLineHeight, fontDigest: fromB64(font.fontDigest), fontStyle: 'NORMAL', fontWeight: 500 }],
    truncationStartIndex: -1,
    truncatedHeight: -1,
    logicalIndexToCharacterOffsetMap: offsets,
    derivedLines: [{ directionality: 'LTR' }],
  };
}

export function buildMessage(v: Variant) {
  const message = JSON.parse(JSON.stringify(template.message), revive);
  const nodes: Node[] = message.nodeChanges;
  const byName = (type: string, name: string) => nodes.find((n) => n.type === type && n.name === name)!;
  const rootId = template.root;
  const root = nodes.find((n) => `${n.guid.sessionID}:${n.guid.localID}` === rootId)!;
  const textFrame = byName('FRAME', 'Text');
  const text = byName('TEXT', 'Button');
  const iconL = byName('FRAME', 'chevron-left-line');
  const iconR = byName('FRAME', 'chevron-right-line');
  const vectors = nodes.filter((n) => n.type === 'VECTOR');

  const m = metrics[v.size];
  const c = look(v.style, v.type, v.state);
  const label = v.label.trim() || 'Button';
  const textW = Math.ceil(measureLabel(label, m.font, m.tracking));

  root.name = `Button / ${v.size} / ${v.style} / ${v.type}${v.state === 'Default' ? '' : ' / ' + v.state}`;
  root.fillPaints = c.fill ? solid(c.fill) : [];
  root.strokePaints = c.stroke ? solid(c.stroke) : [];
  root.strokeWeight = 1;
  root.strokeAlign = 'INSIDE';
  const r = v.rounded ? 999 : m.radius;
  root.cornerRadius = r;
  for (const k of ['rectangleTopLeftCornerRadius', 'rectangleTopRightCornerRadius', 'rectangleBottomLeftCornerRadius', 'rectangleBottomRightCornerRadius']) root[k] = r;
  root.stackSpacing = m.gap;
  root.stackHorizontalPadding = m.padX;
  root.stackPaddingRight = m.padX;
  root.stackVerticalPadding = m.padY;
  root.stackPaddingBottom = m.padY;

  text.name = label;
  text.textData = { ...text.textData, characters: label };
  text.fontSize = m.font;
  text.lineHeight = { value: m.line, units: 'PIXELS' };
  text.letterSpacing = { value: m.tracking, units: 'PERCENT' };
  text.textTracking = m.tracking / 100;
  text.fillPaints = solid(c.text);
  text.size = { x: textW, y: m.line };
  text.derivedTextData = derivedText(label, m.font, m.line, m.tracking, textW, message.blobs);
  text.transform = { ...text.transform, m02: textPadX, m12: 0 };
  textFrame.size = { x: textW + textPadX * 2, y: m.line };

  const scale = m.icon / 24;
  for (const vec of vectors) {
    vec.size = { x: 6 * scale, y: 12 * scale };
    vec.transform = { ...vec.transform, m02: 9 * scale, m12: 6 * scale };
    vec.strokeWeight = m.iconStroke;
    vec.strokePaints = solid(c.text);
  }
  iconL.visible = v.leftIcon;
  iconR.visible = v.rightIcon;
  for (const ic of [iconL, iconR]) ic.size = { x: m.icon, y: m.icon };

  // lay out the visible children the way auto layout would
  let x = m.padX;
  for (const child of [iconL, textFrame, iconR]) {
    if (child.visible === false) continue;
    child.transform = { ...child.transform, m02: x, m12: (m.height - child.size.y) / 2 };
    x += child.size.x + m.gap;
  }
  root.size = { x: x - m.gap + m.padX, y: m.height };
  return message;
}

export function buildClipboardHTML(v: Variant) {
  const data = deflateRaw(codec().encodeMessage(buildMessage(v)));
  const schema = schemaChunk!;
  const prelude = new TextEncoder().encode('fig-kiwi');
  const out = new Uint8Array(prelude.length + 4 + 4 + schema.length + 4 + data.length);
  const view = new DataView(out.buffer);
  out.set(prelude, 0);
  let o = prelude.length;
  view.setUint32(o, template.version, true);
  o += 4;
  for (const chunk of [schema, data]) {
    view.setUint32(o, chunk.length, true);
    out.set(chunk, o + 4);
    o += 4 + chunk.length;
  }
  const meta = { fileKey: '', pasteID: Math.floor(Math.random() * 2 ** 31), dataType: 'scene', editorType: 'design', environment: 'www.figma.com', imageHashes: {} };
  const metaB64 = btoa(JSON.stringify(meta) + '\n');
  return `<meta charset="utf-8"><span data-metadata="<!--(figmeta)${metaB64}(/figmeta)-->"></span><span data-buffer="<!--(figma)${toB64(out)}(/figma)-->"></span>`;
}
