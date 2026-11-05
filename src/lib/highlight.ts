// small highlighter for the dark code blocks, output is escaped html
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rules = {
  html: /(<!--[\s\S]*?-->)|(<\/?[\w-]+|\/?>)|([\w:-]+)(?==")|("[^"]*")/g,
  css: /(\/\*[\s\S]*?\*\/)|(@[\w-]+)|(--[\w-]+|\.[\w-]+|(?<=[\s{;])[a-z-]+(?=:\s))|("[^"]*")/g,
};
const kinds = ['c', 't', 'a', 's'];
export function highlight(code: string, lang: keyof typeof rules) {
  let out = '';
  let at = 0;
  for (const m of code.matchAll(rules[lang])) {
    out += esc(code.slice(at, m.index));
    const k = kinds[m.slice(1).findIndex((g) => g !== undefined)];
    out += `<span class="hl-${k}">${esc(m[0])}</span>`;
    at = m.index! + m[0].length;
  }
  return out + esc(code.slice(at));
}
