import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://pkazala.github.io",
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: ["pub-baa073ca592e4a8eada77d694ff90db6.r2.dev"],
  },
  integrations: [tailwind(), react()],
});
