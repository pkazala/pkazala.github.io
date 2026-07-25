import { getImage } from "astro:assets";

import type { PhotoSource } from "../data/photos";

const avifWidths = [640, 1280, 2160];
const webpWidths = [640, 1280, 2160];

const toSrcSet = (
  images: Awaited<ReturnType<typeof getImage>>[],
  widths: number[],
) => images.map((image, index) => `${image.src} ${widths[index]}w`).join(", ");

export const optimizePhotoSources = async (sources: PhotoSource[]) =>
  Promise.all(
    sources.map(async (photo) => {
      const [avif, webp] = await Promise.all([
        Promise.all(
          avifWidths.map((width) =>
            getImage({
              src: photo.src,
              width,
              inferSize: true,
              format: "avif",
              quality: 54,
            }),
          ),
        ),
        Promise.all(
          webpWidths.map((width) =>
            getImage({
              src: photo.src,
              width,
              inferSize: true,
              format: "webp",
              quality: 78,
            }),
          ),
        ),
      ]);

      return {
        ...photo,
        src: webp[1].src,
        preloadSrc: avif[2].src,
        avifSrcSet: toSrcSet(avif, avifWidths),
        webpSrcSet: toSrcSet(webp, webpWidths),
        width: webp[1].attributes.width,
        height: webp[1].attributes.height,
      };
    }),
  );
