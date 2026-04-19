import { defineConfig } from 'astro/config';
import blogConfig from './blog.config.mjs';
import rehypeLinkPolicy from './src/plugins/rehypeLinkPolicy.mjs';

export default defineConfig({
  site: blogConfig.siteUrl,
  output: 'static',
  build: {
    format: 'file',
  },
  markdown: {
    rehypePlugins: [[rehypeLinkPolicy, { blockedDomains: blogConfig.interlink.blockedDomains }]],
  },
  vite: {
    server: {
      fs: {
        allow: ['.'],
      },
    },
  },
});
