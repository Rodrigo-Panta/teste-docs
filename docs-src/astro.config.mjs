// @ts-check
import { defineConfig } from 'astro/config';


import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({

  site: "https://Rodrigo-Panta.github.io",
  base: "/teste-docs",


  integrations: [react(), sitemap()],

  output: "static",
});