# Photos

## Overview

The homepage photo section is a small interactive React island inside the otherwise static Astro site.

Current images use full-size JPEG originals stored in Cloudflare R2.

Astro generates optimized responsive AVIF and WebP variants at build time.

## Files

- `src/data/photos.ts` lists the public R2 photo URLs and alt text.
- `src/pages/index.astro` imports that manifest, calls `getImage` from `astro:assets`, and passes optimized image metadata to the lightbox.
- `src/components/PhotoLightbox.tsx` renders the carousel and popup behavior.
- `src/components/ui/carousel.tsx` wraps Embla in the local shadcn style.
- `src/components/ui/dialog.tsx` wraps Radix Dialog in the local shadcn style.
- `src/lib/utils.ts` provides the shared `cn` helper.

## Interaction

- The strip uses the local shadcn-style carousel primitive backed by Embla.
- Clicking a photo opens a transparent Dialog popup.
- There are intentionally no visible close or navigation buttons.
- Users close the popup by clicking outside the image or pressing Escape.
- Users navigate while open with the left and right arrow keys.
- Larger lightbox images are preloaded after browser idle, and individual images are warmed on hover/focus.

Keep this behavior simple unless the design direction changes.

## Performance

The current generated AVIF widths are:

- 480px
- 960px
- 1440px
- 2160px
- 2880px

The WebP fallback skips the largest width and stops at 2160px to keep the deployed build smaller.

The current formats are AVIF and WebP. The `<img>` fallback also uses WebP, which is supported by modern browsers and avoids generating a large extra JPEG fallback set. Keep originals in R2 large enough for the largest generated width; avoid using iCloud preview exports such as `*_1_105_c.jpeg`.

The public `r2.dev` URLs are used for Astro's build-time optimization. The R2 S3 API endpoint requires authorization for listing and object reads, so automatic bucket discovery would need build-time credentials or a generated manifest.

## Checks

After changing the photo section:

```sh
pnpm run build
```

For visual checks, verify that clicking outside the popup closes it and that left/right key navigation still works.
