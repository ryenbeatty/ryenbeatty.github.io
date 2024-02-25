import { defineConfig } from 'astro/config'

import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'

import { vite as vidstack } from 'vidstack/plugins'

export default defineConfig({
  site: 'https://ryenbeatty.github.io',
  base: '/',
  prefetch: true,
  integrations: [svelte(), mdx()],
  vite: {
    plugins: [vidstack({ include: /player\// })],
  },
})
