// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://design.wofyu.space',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  redirects: {
    '/tokens/how-tokens-work/': '/foundations/how-tokens-work/',
    '/tokens/all-tokens/': '/foundations/all-tokens/',
    '/tokens/export/': '/foundations/export/',
    '/whats-new/': '/changelog/',
    '/foundations/motion/': '/motion/easing/',
    '/animations/reveal/': '/motion/reveal/',
    '/animations/text-reveal/': '/motion/text-reveal/',
  },
});
