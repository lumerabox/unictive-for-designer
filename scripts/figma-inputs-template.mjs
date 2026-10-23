// turns the captured "Copy to Figma · Inputs" frame into the template the text input and text area pages patch,
// plus the Inter Regular glyph atlas captured next to it.
// usage: node scripts/figma-inputs-template.mjs figma/captures/inputs-template.html
import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import { decompress } from 'fzstd';

const [input] = process.argv.slice(2);
const html = fs.readFileSync(input, 'utf8');
const buf = Buffer.from(html.slice(html.indexOf('<!--(figma)') + 11, html.indexOf('(/figma)-->')), 'base64');
const version = buf.readUInt32LE(8);
const chunks = [];
for (let off = 12; off < buf.length; ) {
  const n = buf.readUInt32LE(off);
  chunks.push(new Uint8Array(buf.subarray(off + 4, off + 4 + n)));
  off += 4 + n;
}
const unpack = (c) => (c[0] === 0x28 && c[1] === 0xb5 ? decompress(c) : inflateRaw(c));
const schemaBytes = unpack(chunks[0]);
const codec = compileSchema(decodeBinarySchema(schemaBytes));
const message = codec.decodeMessage(unpack(chunks[1]));
const id = (g) => `${g.sessionID}:${g.localID}`;
const b64 = (u) => Buffer.from(u).toString('base64');

// glyph atlas: one text node with every printable character in Inter Regular
const atlas = message.nodeChanges.find((n) => n.type === 'TEXT' && n.name === 'glyph-atlas-inter-regular');
{
  const chars = [...atlas.textData.characters];
  const d = atlas.derivedTextData;
  const glyphs = {};
  for (const g of d.glyphs) glyphs[chars[g.firstCharacter]] = { advance: g.advance, blob: b64(message.blobs[g.commandsBlob].bytes) };
  const offs = d.logicalIndexToCharacterOffsetMap;
  for (let i = 0; i < chars.length; i++) {
    if (glyphs[chars[i]]) continue;
    const next = offs[i + 1] ?? d.baselines[0].width;
    glyphs[chars[i]] = { advance: (next - offs[i]) / atlas.fontSize, blob: null };
  }
  const meta = d.fontMetaData[0];
  fs.writeFileSync('src/lib/figma/inter-regular-glyphs.json', JSON.stringify({ fontLineHeight: meta.fontLineHeight, fontDigest: b64(meta.fontDigest), ascent: 0.96875, glyphs }));
  console.log(`atlas: ${Object.keys(glyphs).length} glyphs`);
}

// keep the variant frames and the page canvas, drop library variables, styles, the internal canvas and the atlas
const root = message.clipboardSelectionRegions[0].nodes[0];
const rootNode = message.nodeChanges.find((n) => id(n.guid) === id(root));
const keep = new Set([id(root)]);
for (let grew = true; grew; ) {
  grew = false;
  for (const n of message.nodeChanges) {
    if (!keep.has(id(n.guid)) && n.parentIndex && keep.has(id(n.parentIndex.guid)) && n !== atlas) {
      keep.add(id(n.guid));
      grew = true;
    }
  }
}
const canvas = message.nodeChanges.find((n) => id(n.guid) === id(rootNode.parentIndex.guid));
const doc = message.nodeChanges.find((n) => n.type === 'DOCUMENT');
keep.add(id(canvas.guid)).add(id(doc.guid));
keep.delete(id(root));

const strip = ['description', 'symbolDescription', 'detachedSymbolId', 'isPublishable', 'key', 'publishID', 'sourceLibraryKey', 'sortPosition', 'version', 'userFacingVersion', 'layoutGrids', 'styleIdForGrid', 'styleIdForText', 'styleType', 'pluginData', 'parameterConsumptionMap', 'fillGeometry', 'strokeGeometry'];
message.nodeChanges = message.nodeChanges.filter((n) => keep.has(id(n.guid)));
for (const n of message.nodeChanges) {
  for (const k of strip) delete n[k];
  for (const k of ['fillPaints', 'strokePaints']) if (n[k]) for (const p of n[k]) { delete p.colorVar; delete p.authoredColor; }
  // variant frames hang off the canvas directly
  if (n.parentIndex && id(n.parentIndex.guid) === id(root)) n.parentIndex = { ...n.parentIndex, guid: canvas.guid };
}

// only keep blobs still referenced: vector networks and glyph outlines
const blobs = [];
const remap = new Map();
const use = (i) => {
  if (!remap.has(i)) { remap.set(i, blobs.length); blobs.push(message.blobs[i]); }
  return remap.get(i);
};
for (const n of message.nodeChanges) {
  if (n.vectorData?.vectorNetworkBlob !== undefined) n.vectorData.vectorNetworkBlob = use(n.vectorData.vectorNetworkBlob);
  for (const g of n.derivedTextData?.glyphs ?? []) if (g.commandsBlob !== undefined) g.commandsBlob = use(g.commandsBlob);
}
message.blobs = blobs;
message.pasteFileKey = '';
message.publishedAssetGuids = [];
message.annotationCategories = [];
delete message.clipboardSelectionRegions;

const variants = message.nodeChanges.filter((n) => n.parentIndex && id(n.parentIndex.guid) === id(canvas.guid)).map((n) => n.name);
fs.mkdirSync('public/figma', { recursive: true });
fs.writeFileSync('public/figma/inputs.json', JSON.stringify({
  version,
  schema: b64(deflateRaw(schemaBytes)),
  data: b64(deflateRaw(codec.encodeMessage(message))),
}));
console.log(`template: ${variants.length} variants, ${message.nodeChanges.length} nodes, ${blobs.length} blobs, schema v${version}, ${fs.statSync('public/figma/inputs.json').size} bytes`);
