# Photos

## Overview

The homepage photo section is a small interactive React island inside the otherwise static Astro site.

Current images are served from Piotr's public Cloudflare R2 development URL:

- `https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev/P1012584.jpeg`
- `https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev/P1012596.jpeg`
- `https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev/P1012604.jpeg`

## Files

- `src/pages/index.astro` defines the `photos` array and passes it to the lightbox.
- `src/components/PhotoLightbox.tsx` renders the scroll-snap strip and popup behavior.
- `src/components/ui/dialog.tsx` wraps Radix Dialog in the local shadcn style.
- `src/lib/utils.ts` provides the shared `cn` helper.
- `public/photos` is currently not used by the homepage.

## Interaction

- The strip uses native horizontal scrolling with scroll snap.
- Clicking a photo opens a transparent Dialog popup.
- There are intentionally no visible close or navigation buttons.
- Users close the popup by clicking outside the image or pressing Escape.
- Users navigate while open with the left and right arrow keys.

Keep this behavior simple unless the design direction changes.

## Performance

The current R2 files are full JPEGs and are larger than ideal for a homepage. Before adding many more photos, prefer uploading optimized variants to R2:

- WebP or AVIF for modern browsers.
- A few widths such as 480, 960, and 1440 pixels.
- Responsive `srcset` and `sizes` entries in the `photos` array.

Cloudflare Image Resizing or an R2-backed custom image pipeline would be better long term, but static variants are the simplest next step.

## Checks

After changing the photo section:

```sh
pnpm run build
```

For visual checks, verify that clicking outside the popup closes it and that left/right key navigation still works.
