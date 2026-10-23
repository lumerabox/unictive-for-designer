// checks the auto layout pass in src/lib/figma/layout.ts against the captured frame: every visible layer must land where figma put it.
// usage: node scripts/figma-check-layout.ts [figma/captures/inputs-template.html]

import fs from 'node:fs';
import { decodeBinarySchema, compileSchema } from 'kiwi-schema';
import { inflateRaw } from 'pako';
import { decompress } from 'fzstd';
import { childrenIndex, createLayout, gid } from '../src/lib/figma/layout.ts';

const html = fs.readFileSync(process.argv[2] ?? 'figma/captures/inputs-template.html', 'utf8');
const buf = Buffer.from(html.slice(html.indexOf('<!--(figma)') + 11, html.indexOf('(/figma)-->')), 'base64');
const chunks: Uint8Array[] = [];
for (let off = 12; off < buf.length; ) { const n = buf.readUInt32LE(off); chunks.push(new Uint8Array(buf.subarray(off + 4, off + 4 + n))); off += 4 + n; }
const unpack = (c: Uint8Array) => (c[0] === 0x28 && c[1] === 0xb5 ? decompress(c) : inflateRaw(c));
const msg: any = compileSchema(decodeBinarySchema(unpack(chunks[0]))).decodeMessage(unpack(chunks[1]));
const orig = new Map(msg.nodeChanges.map((n: any) => [gid(n.guid), JSON.parse(JSON.stringify({ s: n.size, t: n.transform }))]));
const kids = childrenIndex(msg.nodeChanges);
const L = createLayout(kids);
const root = msg.clipboardSelectionRegions[0].nodes[0];
let bad = 0, checked = 0;
const descend = (n: any, f: (n: any) => void) => { f(n); for (const c of kids.get(gid(n.guid)) ?? []) descend(c, f); };
for (const v of kids.get(gid(root))!.filter((n: any) => n.type === 'FRAME')) {
  const t = { ...v.transform };
  L.layout(v, L.measure(v));
  v.transform = t;
  descend(v, (n) => {
    if (n.visible === false) return;
    const o: any = orig.get(gid(n.guid));
    checked++;
    const d = Math.max(Math.abs(o.s.x - n.size.x), Math.abs(o.s.y - n.size.y), Math.abs(o.t.m02 - n.transform.m02), Math.abs(o.t.m12 - n.transform.m12));
    if (d > 0.05) { if (bad++ < 12) console.log(v.name, '>', n.name, 'orig', o.s, o.t.m02, o.t.m12, 'got', n.size, n.transform.m02, n.transform.m12); }
  });
}
console.log({ checked, bad });
