// turns the captured "Copy to Figma · Controls" frame into one template per page (public/figma/controls-<page>.json),
// plus the images its variants use (public/figma/img/<hash>.png).
// usage: node scripts/figma-controls-template.mjs figma/captures/controls-template.html (or nav-template.html, feedback-template.html, overlay-template.html)
import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw, deflateRaw } from 'pako';
import { decompress } from 'fzstd';

// first segment of a variant name → page that loads it
const pages = {
  Dropdown: 'dropdown',
  'Date Picker': 'date-picker',
  Calendar: 'date-picker',
  'File Upload Area': 'file-upload',
  'File Card': 'file-upload',
  Checkbox: 'checkbox',
  'Checkbox Label': 'checkbox',
  Radio: 'radio-group',
  'Radio Label': 'radio-group',
  Switch: 'switch',
  'Switch Label': 'switch',
  Rating: 'rating',
  Breadcrumbs: 'breadcrumbs',
  Crumb: 'breadcrumbs',
  'Line-tabs': 'tab-menu',
  'Segmented-tabs': 'tab-menu',
  'Pill-tabs': 'tab-menu',
  'Tab-menu-vertical': 'tab-menu',
  'Line-tab': 'tab-menu',
  'Segmented-tab': 'tab-menu',
  'Pill-tab': 'tab-menu',
  'Vertical-tab': 'tab-menu',
  'Page Number': 'pagination',
  Number: 'pagination',
  Action: 'pagination',
  'Rows-page': 'pagination',
  'Step-variant': 'stepper',
  'Stepper-horizontal': 'stepper',
  'Stepper-vertical': 'stepper',
  Alert: 'alert',
  Banner: 'banner',
  Badge: 'badge',
  'Progress-bar': 'progress-bar',
  Bar: 'progress-bar',
  Tooltip: 'tooltip',
  Modal: 'modal',
  'Modal-header': 'modal',
  'Modal-footer': 'modal',
  Popover: 'popover',
  'Popover-header': 'popover',
  'Popover-footer': 'popover',
  'Popover-dot': 'popover',
};

const [input] = process.argv.slice(2);
const html = fs.readFileSync(input, 'utf8');
const meta = JSON.parse(Buffer.from(html.match(/\(figmeta\)(.*?)\(\/figmeta\)/)[1], 'base64').toString());
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
const hex = (u) => Buffer.from(u).toString('hex');

const root = message.clipboardSelectionRegions[0].nodes[0];
const rootNode = message.nodeChanges.find((n) => id(n.guid) === id(root));
const canvas = message.nodeChanges.find((n) => id(n.guid) === id(rootNode.parentIndex.guid));
const doc = message.nodeChanges.find((n) => n.type === 'DOCUMENT');
const kids = new Map();
for (const n of message.nodeChanges) {
  if (!n.parentIndex) continue;
  const k = id(n.parentIndex.guid);
  if (!kids.has(k)) kids.set(k, []);
  kids.get(k).push(n);
}

const strip = ['description', 'symbolDescription', 'detachedSymbolId', 'isPublishable', 'key', 'publishID', 'sourceLibraryKey', 'sortPosition', 'version', 'userFacingVersion', 'layoutGrids', 'styleIdForGrid', 'styleIdForText', 'styleType', 'pluginData', 'parameterConsumptionMap', 'fillGeometry', 'strokeGeometry', 'componentPropAssignments', 'componentPropRefs'];
const clean = (n) => {
  for (const k of strip) delete n[k];
  for (const k of ['fillPaints', 'strokePaints']) if (n[k]) for (const p of n[k]) { delete p.colorVar; delete p.authoredColor; }
  return n;
};

// group the variant frames by page
const groups = new Map();
for (const v of kids.get(id(root)) ?? []) {
  const page = pages[v.name.split(' / ')[0]];
  if (!page) throw new Error(`no page for ${v.name}`);
  if (!groups.has(page)) groups.set(page, []);
  groups.get(page).push(v);
}

fs.mkdirSync('public/figma/img', { recursive: true });
const images = new Set();
for (const [page, variants] of groups) {
  const nodes = [];
  const walk = (n) => { nodes.push(n); for (const c of kids.get(id(n.guid)) ?? []) walk(c); };
  variants.forEach(walk);
  const out = structuredClone(nodes).map(clean);
  for (const n of out) if (id(n.parentIndex.guid) === id(root)) n.parentIndex = { ...n.parentIndex, guid: canvas.guid };

  const blobs = [];
  const remap = new Map();
  const use = (i) => {
    if (!remap.has(i)) { remap.set(i, blobs.length); blobs.push(message.blobs[i]); }
    return remap.get(i);
  };
  const hashes = new Set();
  for (const n of out) {
    if (n.vectorData?.vectorNetworkBlob !== undefined) n.vectorData.vectorNetworkBlob = use(n.vectorData.vectorNetworkBlob);
    for (const g of n.derivedTextData?.glyphs ?? []) if (g.commandsBlob !== undefined) g.commandsBlob = use(g.commandsBlob);
    for (const p of n.fillPaints ?? []) if (p.type === 'IMAGE' && p.image?.hash) hashes.add(hex(p.image.hash));
  }
  for (const h of hashes) images.add(h);

  const msg = { ...message, nodeChanges: [structuredClone(doc), structuredClone(canvas), ...out], blobs, pasteFileKey: '', publishedAssetGuids: [], annotationCategories: [] };
  delete msg.clipboardSelectionRegions;
  const file = `public/figma/controls-${page}.json`;
  fs.writeFileSync(file, JSON.stringify({ version, images: [...hashes], schema: b64(deflateRaw(schemaBytes)), data: b64(deflateRaw(codec.encodeMessage(msg))) }));
  console.log(`${page}: ${variants.length} variants, ${out.length} nodes, ${blobs.length} blobs, ${hashes.size} images, ${fs.statSync(file).size} bytes`);
}

// images are served next to the templates so a paste in another file can fetch them
for (const h of images) {
  const url = meta.imageHashes?.[h];
  if (!url) { console.warn(`image ${h} has no url in the capture`); continue; }
  const res = await fetch(url);
  fs.writeFileSync(`public/figma/img/${h}.png`, Buffer.from(await res.arrayBuffer()));
  console.log(`image ${h}: ${res.status}`);
}
