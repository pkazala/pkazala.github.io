# Photos

## Overview

The homepage shows a static, lightweight preview linking to each category. The `/photos/` page presents the same manifest as interactive categorized carousels.

Current images use full-size WebP originals stored in Cloudflare R2.

Astro generates optimized responsive AVIF and WebP variants at build time.

## Files

- `src/data/photos.ts` lists the public R2 photo URLs, alt text, and category for each image.
- `src/lib/photo-images.ts` generates the shared responsive AVIF and WebP image metadata.
- `src/pages/index.astro` renders one linked preview for each photo category.
- `src/pages/photos/index.astro` groups the optimized images into viewport-wide People, Landscape, and Creative carousels.
- `src/components/PhotoLightbox.tsx` renders the carousel and popup behavior.
- `src/components/ui/carousel.tsx` wraps Embla in the local shadcn style.
- `src/components/ui/dialog.tsx` wraps Radix Dialog in the local shadcn style.
- `src/lib/utils.ts` provides the shared `cn` helper.

## Interaction

- Homepage previews link directly to the corresponding section on `/photos/`.
- Category galleries use the local shadcn-style carousel primitive backed by Embla.
- Clicking a photo opens a transparent Dialog popup.
- There are intentionally no visible close or navigation buttons.
- Users close the popup by clicking outside the image or pressing Escape.
- Users navigate while open with the left and right arrow keys.
- Viewport-wide category carousels support dragging, horizontal trackpad gestures, and Shift+wheel navigation in addition to their arrow controls.
- Larger lightbox images are preloaded after browser idle, and individual images are warmed on hover/focus.

Keep this behavior simple unless the design direction changes.

## Performance

The generated AVIF and WebP widths are:

- 640px
- 1280px
- 2160px

The generated formats are AVIF and WebP. The `<img>` fallback also uses WebP, which is supported by modern browsers and avoids generating a large extra JPEG fallback set. Keep originals in R2 large enough for the largest generated width; avoid using iCloud preview exports such as `*_1_105_c.jpeg`.

The public `r2.dev` URLs are used for Astro's build-time optimization. The R2 S3 API endpoint requires authorization for listing and object reads, so automatic bucket discovery would need build-time credentials or a generated manifest.

## Checks

After changing the photo section:

```sh
pnpm run build
```

For visual checks, verify that clicking outside the popup closes it and that left/right key navigation still works.
