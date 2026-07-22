import { getImage } from "astro:assets";

import type { PhotoSource } from "../data/photos";

const avifWidths = [480, 960, 1440, 2160, 2880];
const webpWidths = [480, 960, 1440, 2160];

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
        src: webp[2].src,
        preloadSrc: avif[3].src,
        avifSrcSet: toSrcSet(avif, avifWidths),
        webpSrcSet: toSrcSet(webp, webpWidths),
        width: webp[2].attributes.width,
        height: webp[2].attributes.height,
      };
    }),
  );
