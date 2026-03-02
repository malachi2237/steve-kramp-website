// @ts-check
import { defineConfig, envField } from 'astro/config';

import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site:'https://stevekramp.com',
  integrations: [partytown(), sitemap(), preact()],
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '*.stevekramp.com'
    },
    {
      protocol: 'https',
      hostname: '**.malachirobbins.workers.dev'
    }]
  },
  trailingSlash: "never",
  env: {
    schema: {
      FORM_KEY: envField.string({ context: "server", access: "secret" }),
      TURNSTILE_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
      TURNSTILE_PUBLIC_KEY: envField.string({ context: "client", access: "public" }),
      SONICJS_API_URL: envField.string({context: "server", access: "secret"}),
      CDN_URL: envField.string({context: "server", access: "public"})

    }
  }
});