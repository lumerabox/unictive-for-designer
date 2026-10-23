// turns a captured figma clipboard payload into a sanitized template the site can patch.
// usage: node scripts/figma-template.mjs figma/captures/button-template.html src/lib/figma/button-template.json
import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import { decompress } from 'fzstd';

const [input, output] = process.argv.slice(2);
const html = fs.readFileSync(input, 'utf8');
const b64 = html.slice(html.indexOf('<!--(figma)') + 11, html.indexOf('(/figma)-->'));
const buf = Buffer.from(b64, 'base64');
const version = buf.readUInt32LE(8);
const chunks = [];
for (let off = 12; off < buf.length; ) {
  const n = buf.readUInt32LE(off);
  chunks.push(new Uint8Array(buf.subarray(off + 4, off + 4 + n)));
  off += 4 + n;
}
const unpack = (c) => (c[0] === 0x28 && c[1] === 0xb5 ? decompress(c) : inflateRaw(c));
const schemaBytes = unpack(chunks[0]);
const message = compileSchema(decodeBinarySchema(schemaBytes)).decodeMessage(unpack(chunks[1]));

const id = (g) => `${g.sessionID}:${g.localID}`;
const root = message.clipboardSelectionRegions[0].nodes[0];
const keep = new Set([id(root)]);
// keep the selected subtree only, drop library variables, styles and the internal canvas
let grew = true;
while (grew) {
  grew = false;
  for (const n of message.nodeChanges) {
    if (!keep.has(id(n.guid)) && n.parentIndex && keep.has(id(n.parentIndex.guid))) {
      keep.add(id(n.guid));
      grew = true;
    }
  }
}
const strip = ['styleIdForText', 'styleIdForGrid', 'layoutGrids', 'detachedSymbolId', 'pluginData', 'derivedTextData', 'parameterConsumptionMap', 'description', 'symbolDescription'];
keep.add('0:0').add('0:1');
message.nodeChanges = message.nodeChanges.filter((n) => keep.has(id(n.guid)));
for (const n of message.nodeChanges) {
  for (const k of strip) delete n[k];
  for (const k of ['fillPaints', 'strokePaints']) {
    if (n[k]) for (const p of n[k]) { delete p.colorVar; delete p.authoredColor; }
  }
}
message.pasteFileKey = '';
message.publishedAssetGuids = [];
message.annotationCategories = [];

// cached geometry goes stale once icons are resized, figma rebuilds it from the vector network
const blobs = [];
for (const n of message.nodeChanges) {
  delete n.fillGeometry;
  delete n.strokeGeometry;
  if (n.vectorData?.vectorNetworkBlob !== undefined) {
    blobs.push(message.blobs[n.vectorData.vectorNetworkBlob]);
    n.vectorData.vectorNetworkBlob = blobs.length - 1;
  }
}
message.blobs = blobs;

const replacer = (k, v) => (v instanceof Uint8Array ? { $b: Buffer.from(v).toString('base64') } : typeof v === 'bigint' ? { $n: v.toString() } : v);
fs.writeFileSync(output, JSON.stringify({
  version,
  schema: Buffer.from(deflateRaw(schemaBytes)).toString('base64'),
  root: id(root),
  message,
}, replacer));
console.log(`template: ${message.nodeChanges.length} nodes, ${message.blobs.length} blobs, schema v${version}`);

