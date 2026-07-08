# Photos

## Overview

The homepage photo section is a small interactive React island inside the otherwise static Astro site.

Current images are optimized local WebP files in `public/photos`.

The checked-in source JPEGs currently go up to 1086px on the long edge, so the largest generated WebP variant is 1086px rather than an upscaled 1440px.

## Files

- `src/pages/index.astro` defines the `photos` array and passes it to the lightbox.
- `src/components/PhotoLightbox.tsx` renders the scroll-snap strip and popup behavior.
- `src/components/ui/dialog.tsx` wraps Radix Dialog in the local shadcn style.
- `src/lib/utils.ts` provides the shared `cn` helper.
- `public/photos` contains the source JPEGs and generated WebP variants.

## Interaction

- The strip uses native horizontal scrolling with scroll snap.
- Clicking a photo opens a transparent Dialog popup.
- There are intentionally no visible close or navigation buttons.
- Users close the popup by clicking outside the image or pressing Escape.
- Users navigate while open with the left and right arrow keys.

Keep this behavior simple unless the design direction changes.

## Performance

The current generated WebP variants are:

- 480px long edge at WebP quality 78.
- 960px long edge at WebP quality 80.
- 1086px long edge at WebP quality 82.

For future higher-resolution originals, use 480, 960, and 1440px long-edge WebP variants. Avoid upscaling small originals.

Cloudflare Image Resizing or an R2-backed custom image pipeline could be useful later, but static local variants are the simplest current setup.

## Checks

After changing the photo section:

```sh
pnpm run build
```

For visual checks, verify that clicking outside the popup closes it and that left/right key navigation still works.
