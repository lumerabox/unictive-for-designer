// exports the DS asset components (figma/assets/keys.txt) through figma-cli into public/assets
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
const { daemonExec } = await import('/Users/cansa/figma-cli/src/lib/cli-core.js');
const raster = { emoji: 3, avatars: 2 };
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\+/g, '-plus').replace(/#/g, '-sharp').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const groups = [];
let cur;
for (const line of readFileSync('figma/assets/keys.txt', 'utf8').split('\n')) {
  if (!line.trim()) continue;
  if (line.startsWith('#')) { const [kind, name] = line.slice(1).split('|'); groups.push(cur = { kind, name, items: [] }); continue; }
  const [name, key] = line.split('|');
  cur.items.push({ name, key });
}
const jobs = [];
for (const g of groups) {
  const used = new Set();
  for (const it of g.items) {
    let s = slug(it.name); while (used.has(s)) s += '-2'; used.add(s);
    if (g.kind === 'logos') s = slug(g.name) + '--' + s;
    it.file = `/assets/${g.kind}/${s}.${raster[g.kind] ? 'png' : 'svg'}`;
    if (!existsSync('public' + it.file) || process.argv.includes('--force')) jobs.push({ ...it, kind: g.kind });
  }
}
console.log('to export', jobs.length);
for (let i = 0; i < jobs.length; i += 20) {
  const batch = jobs.slice(i, i + 20).map((j) => [j.key, raster[j.kind] ?? 0]);
  const code = `const rows = ${JSON.stringify(batch)};
const late = (p) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 20000))]);
const out = await Promise.all(rows.map(async ([key, scale]) => {
  try {
    const c = await late(figma.importComponentByKeyAsync(key));
    if (!scale) return key + '\\t' + (await c.exportAsync({ format: 'SVG_STRING' })).replace(/\\n/g, ' ');
    const b = await c.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: scale } });
    return key + '\\t' + figma.base64Encode(b);
  } catch (e) { return key + '\\tERROR ' + e.message; }
}));
return out.join('\\n');`;
  let r;
  try { r = await daemonExec('eval', { code }, 90000); } catch (e) { console.log('batch timeout', i); continue; }
  const text = typeof r === 'string' ? r : (r.result ?? JSON.stringify(r));
  const byKey = new Map(text.split('\n').map((l) => [l.slice(0, l.indexOf('\t')), l.slice(l.indexOf('\t') + 1)]));
  for (const j of jobs.slice(i, i + 20)) {
    const d = byKey.get(j.key);
    if (!d || d.startsWith('ERROR')) { console.log('fail', j.name, d?.slice(0, 80)); continue; }
    mkdirSync(`public/assets/${j.kind}`, { recursive: true });
    writeFileSync('public' + j.file, raster[j.kind] ? Buffer.from(d, 'base64') : d);
  }
  console.log('done', Math.min(i + 20, jobs.length));
}
const manifest = groups.map((g) => ({ kind: g.kind, name: g.name, items: g.items.filter((it) => existsSync('public' + it.file)).map(({ name, file }) => [name, file]) }));
writeFileSync('src/data/assets.json', JSON.stringify(manifest));
console.log('manifest', manifest.reduce((n, g) => n + g.items.length, 0));
