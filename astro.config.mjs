// @ts-check
import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site:'https://stevekramp.com',
  integrations: [partytown(), preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});