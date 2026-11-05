// copies the built css from dist into packages/unictive-ds. run after astro build: npm run pkg
import { copyFileSync } from 'node:fs';

const files = {
  'code/unictive.css': 'unictive.css',
  'code/global.css': 'tailwind.css',
  'tokens/unictive-tailwind.css': 'unictive-tailwind.css',
  'tokens/unictive-tokens.css': 'tokens.css',
  'tokens/unictive-tokens.json': 'tokens.json',
  'code/motion.css': 'motion.css',
  'code/motion.js': 'motion.js',
};
for (const [from, to] of Object.entries(files)) copyFileSync(`dist/${from}`, `packages/unictive-ds/${to}`);
console.log('packages/unictive-ds ready. publish: cd packages/unictive-ds && npm publish');
