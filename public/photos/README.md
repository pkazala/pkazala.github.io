# Local photo folder

The homepage does not currently read images from this folder.

Photos are configured in `src/pages/index.astro` and served from Piotr's public Cloudflare R2 development URL. The lightbox lives in `src/components/PhotoLightbox.tsx`.

Keep this folder for a future local fallback or for files that should be committed with the site.

If local photos are added later, prefer optimized WebP/AVIF variants at a few display widths rather than full-resolution camera JPEGs.
