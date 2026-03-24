import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';
import { vite as vidstack } from 'vidstack/plugins';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://ryenbeatty.info',
  base: '/',
  prefetch: true,
  integrations: [svelte(), mdx(), sitemap(), robotsTxt(), tailwind()],
  vite: {
    plugins: ([] as any[]).concat(vidstack({
      include: /player\//
    })),
    resolve: {
      preserveSymlinks: true
    }
  }
});