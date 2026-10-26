import { readFileSync, writeFileSync } from 'fs';
const [, , keysPath, kind, start, end, out] = process.argv;
const rows = JSON.parse(readFileSync(keysPath, 'utf8'))[kind].slice(+start, +end);
const code = `const rows = ${JSON.stringify(rows.map(r => [r[1], r[2]]))};
const res = await Promise.all(rows.map(async ([name, key]) => {
  try {
    const c = await figma.importComponentByKeyAsync(key);
    const s = await c.exportAsync({ format: 'SVG_STRING' });
    return name + '\\t' + s.replace(/^<svg[^>]*>\\s*/, '').replace(/\\s*<\\/svg>\\s*$/, '').replace(/\\n/g, '');
  } catch (e) { return name + '\\tERROR ' + e.message; }
}));
return res.join('\\n');`;
writeFileSync(out, code);
