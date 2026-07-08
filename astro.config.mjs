import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://pkazala.github.io",
  devToolbar: {
    enabled: false,
  },
  integrations: [tailwind(), react()],
});
