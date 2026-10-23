// extracts glyph outlines for Inter Medium from a captured text node so pasted labels render without relayout.
// usage: node scripts/figma-glyphs.mjs figma/captures/glyph-atlas-inter-medium.html src/lib/figma/inter-medium-glyphs.json
import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw } from 'pako';
import { decompress } from 'fzstd';

const [input, output] = process.argv.slice(2);
const html = fs.readFileSync(input, 'utf8');
const buf = Buffer.from(html.slice(html.indexOf('<!--(figma)') + 11, html.indexOf('(/figma)-->')), 'base64');
const chunks = [];
for (let off = 12; off < buf.length; ) {
  const n = buf.readUInt32LE(off);
  chunks.push(new Uint8Array(buf.subarray(off + 4, off + 4 + n)));
  off += 4 + n;
}
const unpack = (c) => (c[0] === 0x28 && c[1] === 0xb5 ? decompress(c) : inflateRaw(c));
const message = compileSchema(decodeBinarySchema(unpack(chunks[0]))).decodeMessage(unpack(chunks[1]));
const text = message.nodeChanges.find((n) => n.type === 'TEXT');
const chars = text.textData.characters;
const d = text.derivedTextData;
const b64 = (u) => Buffer.from(u).toString('base64');
const glyphs = {};
for (const g of d.glyphs) {
  glyphs[chars[g.firstCharacter]] = { advance: g.advance, blob: b64(message.blobs[g.commandsBlob].bytes) };
}
// characters without an outline (space) still need an advance
for (let i = 0; i < d.logicalIndexToCharacterOffsetMap.length; i++) {
  const ch = chars[i];
  if (!glyphs[ch]) {
    const next = d.logicalIndexToCharacterOffsetMap[i + 1] ?? d.baselines[0].width;
    glyphs[ch] = { advance: (next - d.logicalIndexToCharacterOffsetMap[i]) / text.fontSize, blob: null };
  }
}
const meta = d.fontMetaData[0];
fs.writeFileSync(output, JSON.stringify({
  fontLineHeight: meta.fontLineHeight,
  fontDigest: b64(meta.fontDigest),
  ascent: 0.96875,
  glyphs,
}));
console.log(`${Object.keys(glyphs).length} glyphs, ${Object.values(glyphs).filter((g) => !g.blob).length} without outline`);
