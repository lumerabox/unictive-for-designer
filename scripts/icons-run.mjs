import { readFileSync, writeFileSync } from 'fs';
const { daemonExec } = await import('/Users/cansa/figma-cli/src/lib/cli-core.js');
const [, , codePath, outPath] = process.argv;
const r = await daemonExec('eval', { code: readFileSync(codePath, 'utf8') }, 300000);
const t = typeof r === 'string' ? r : JSON.stringify(r);
writeFileSync(outPath, t);
console.log('ok', outPath, t.length);
