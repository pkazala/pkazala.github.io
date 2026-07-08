# pkazala.github.io

Personal website for Piotr Kazala, built with Astro and Tailwind.

## Development

This project uses `pnpm` because the GitHub Pages workflow pins `pnpm@11.9.0`.

```sh
pnpm install
pnpm run dev
pnpm run build
```

The site is deployed as a static Astro build to GitHub Pages.

## Interactive pieces

- `src/scripts/europe-globe.ts` renders the custom Three.js Europe globe and plane animation.
- `src/components/PhotoLightbox.tsx` renders the photography strip as a small React island.
- `src/components/ui/carousel.tsx` provides the shadcn-style Embla carousel used by the photo strip.
- `src/components/ui/dialog.tsx` provides the shadcn/Radix-style Dialog used by the photo popup.

## Blog posts

Add posts as markdown files in `src/content/blog`.

Each post uses frontmatter like:

```md
---
title: "Post title"
description: "Short summary for listings and metadata."
date: 2026-07-02
tags:
  - notes
draft: false
---
```

Draft posts are hidden from production builds when `draft: true`.

## Photos

Homepage photos are currently loaded from optimized local WebP files in `public/photos` and configured in the `photos` array in `src/pages/index.astro`.

The photo strip uses a shadcn-style Embla carousel. Clicking a photo opens it in a transparent Dialog popup; users close it by clicking outside the image or pressing Escape, and move between images with the left/right arrow keys.

Each photo should have responsive WebP variants and `srcset`/`sizes` values. The current originals only go up to 1086px on the long edge, so the largest generated variant is 1086 rather than an upscaled 1440.
