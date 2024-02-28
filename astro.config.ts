import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { vite as vidstack } from 'vidstack/plugins';
import robotsTxt from 'astro-robots-txt';


// https://astro.build/config
export default defineConfig({
  site: 'https://ryenbeatty.info',
  base: '/',
  prefetch: true,
  integrations: [svelte(), mdx(), sitemap(), robotsTxt()],
  vite: {
    plugins: [vidstack({
      include: /player\//
    })]
  }
});