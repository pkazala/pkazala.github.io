# Photos

The homepage reads optimized WebP images from this folder.

Photos are configured in `src/pages/index.astro`. The lightbox lives in `src/components/PhotoLightbox.tsx`.

Current generated variants:

- `photo-01-480.webp`, `photo-01-960.webp`, `photo-01-1086.webp`
- `photo-02-480.webp`, `photo-02-960.webp`, `photo-02-1086.webp`
- `photo-03-480.webp`, `photo-03-960.webp`, `photo-03-1086.webp`
- `photo-04-480.webp`, `photo-04-960.webp`, `photo-04-1086.webp`

The current WebP set tops out at 1086px on the long edge. Do not generate 1440px variants unless future source images are large enough.
