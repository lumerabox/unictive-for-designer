// pairs line and solid exports by category order into public/icons/icons.json
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
const [, , keysPath, dir, outPath] = process.argv;
const keys = JSON.parse(readFileSync(keysPath, 'utf8'));
const read = (kind) => {
  const m = new Map();
  for (const f of readdirSync(dir).filter((f) => f.startsWith(`out-${kind}-`)).sort())
    for (const l of readFileSync(`${dir}/${f}`, 'utf8').split('\n')) { const i = l.indexOf('\t'); if (i > 0) m.set(l.slice(0, i), l.slice(i + 1)); }
  return m;
};
const clean = (s) => s.replace(/(stroke|fill)="black"/g, '$1="currentColor"').replace(/ stroke-width="2"/g, '');
const line = read('line'), solid = read('solid');
const cats = [], icons = [];
let miss = 0;
const norm = (n) => n.replace(/-(line|outline|lline|solid)$/, '').replace(/-alt$/, '').replace(/-line$/, '');
const solidBy = new Map(keys.solid.map(([c, n]) => [c + '|' + norm(n), n]));
const unmatched = [];
keys.line.forEach(([cat, name], i) => {
  const sname = solidBy.get(cat + '|' + norm(name)) ?? { 'plane-01': 'plane-solid' }[name] ?? (unmatched.push(name), null);
  if (!cats.includes(cat)) cats.push(cat);
  const base = name.replace(/-(line|outline|lline)$/, '');
  const l = line.get(name), s = sname ? solid.get(sname) : '';
  if (!l || s === undefined || l.startsWith('ERROR') || s.startsWith('ERROR')) { miss++; return; }
  icons.push([base, cats.indexOf(cat), clean(l), s ? clean(s) : '']);
});
writeFileSync(outPath, JSON.stringify({ categories: cats, icons }));
console.log(unmatched.join(' '), { icons: icons.length, cats: cats.length, miss, bytes: JSON.stringify({ cats, icons }).length });
