import { defineConfig } from 'astro/config';
//import node from '@astrojs/node';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://pkazala.github.io',
  integrations: [tailwind()]
});