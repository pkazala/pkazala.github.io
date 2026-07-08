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

Homepage photos use full-size originals stored in Cloudflare R2 and are optimized at build time with Astro's image pipeline.

The photo strip uses a shadcn-style Embla carousel. Clicking a photo opens it in a transparent Dialog popup; users close it by clicking outside the image or pressing Escape, and move between images with the left/right arrow keys.

`src/data/photos.ts` lists the public R2 photo URLs. `src/pages/index.astro` generates AVIF `srcset` values at 480, 960, 1440, 2160, and 2880 pixels. WebP fallback images stop at 2160 pixels to keep the built site smaller.
