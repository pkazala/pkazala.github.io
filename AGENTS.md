# AGENTS.md

## Project Shape

This is Piotr Kazala's personal website, built as a static Astro site with Tailwind.
The active app is intentionally small and minimal:

- `src/pages/index.astro` is the homepage.
- `src/layouts/Layout.astro` owns global metadata, nav, footer, and the centered page shell.
- `src/pages/blog/index.astro` and `src/pages/blog/[slug].astro` render the markdown blog.
- `src/content/blog/*.md` contains blog posts.
- `src/content/config.ts` defines the blog frontmatter schema.
- `src/components/EuropeGlobe.astro` mounts the globe canvas.
- `src/scripts/europe-globe.ts` owns all Three.js globe logic.
- `src/styles/global.css` should stay very small; prefer Tailwind utilities in Astro files.

There are old business-site components/assets still in `src/components` and `src/assets`.
Treat them as legacy unless a route imports them. Do not assume they are active UI.

## Architecture Notes

- The site is static and deployed to GitHub Pages at `https://pkazala.github.io`.
- Astro content collections power the blog. Draft posts are hidden in production when `draft: true`.
- The visual direction is clean, quiet, personal, and engineering-focused, with small playful details.
- Avoid broad CSS rewrites. Most layout/styling belongs in Tailwind classes near the markup.
- Keep the homepage lean: intro, globe, current facts, writing preview, photo placeholder, links.

## Globe

The globe is custom Three.js, not globe.gl.

- `src/components/EuropeGlobe.astro` is only the wrapper and canvas.
- `src/scripts/europe-globe.ts` creates the scene, transparent globe shell, Europe country layer, route, and toy plane animation.
- Country shapes are loaded at runtime from `public/data/custom.geo.json`.
- Poland and the UK are highlighted by country properties/code in the GeoJSON.
- The globe is intentionally not draggable.

See `docs/globe.md` before making substantial globe changes.

## Development

Prefer the project package manager, `pnpm`, because `package.json` and GitHub Actions specify `pnpm@11.9.0`.

Useful commands:

```sh
pnpm install
pnpm run dev
pnpm run build
```

In this Codex environment, Node package-manager shims may not always be on `PATH`.
When needed, previous sessions used the bundled Node runtime plus the local Astro binary:

```sh
ASTRO_TELEMETRY_DISABLED=1 PATH=/Users/piotrkazala/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/astro build
```

Astro's dev toolbar is disabled in `astro.config.mjs` so visual checks do not show extra UI.

## Deployment

`.github/workflows/deploy.yml` builds and deploys with `withastro/action@v6` and `pnpm@11.9.0`.
Do not introduce server-only code unless the deployment model changes.

## Content Notes

Blog posts use frontmatter:

```md
---
title: "Post title"
description: "Short summary."
date: 2026-07-02
tags:
  - notes
draft: false
---
```

Photo files are expected under `public/photos`, but the homepage currently uses text placeholders.
