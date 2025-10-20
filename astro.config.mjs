// @ts-check
import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [partytown(), preact()],
  vite: {
    plugins: [tailwindcss()]
  }
});