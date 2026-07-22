"use client";

import React, { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type Photo = {
  alt: string;
  avifSrcSet: string;
  preloadSrc: string;
  src: string;
  webpSrcSet: string;
};

type PhotoLightboxProps = {
  photos: Photo[];
};

export default function PhotoLightbox({ photos }: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const preloadedImages = useRef(new Set<string>());
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    let cancelled = false;

    const preloadAll = async () => {
      for (const photo of photos) {
        if (cancelled) {
          return;
        }

        await preloadPhoto(photo, preloadedImages.current);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => void preloadAll(), {
        timeout: 2500,
      });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(() => void preloadAll(), 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [photos]);

  const openPhoto = (index: number) => {
    void preloadPhoto(photos[index], preloadedImages.current);
    setCurrentIndex(index);
    setOpen(true);
  };

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + photos.length) % photos.length);
  };

  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % photos.length);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Carousel
        className="w-full px-9 sm:px-10"
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem
              className="basis-[82%] sm:basis-1/2 lg:basis-1/3"
              key={photo.src}
            >
              <button
                className="group block w-full rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                type="button"
                onClick={() => openPhoto(index)}
                onFocus={() =>
                  void preloadPhoto(photo, preloadedImages.current)
                }
                onPointerEnter={() =>
                  void preloadPhoto(photo, preloadedImages.current)
                }
                aria-label="Open photo"
              >
                <PictureImage
                  photo={photo}
                  className="aspect-[4/3] w-full rounded-sm object-cover transition-transform duration-200 ease-out group-hover:scale-[1.01] group-active:scale-[0.99]"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 78vw"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      <DialogContent
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrevious();
          }

          if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
          }
        }}
      >
        <DialogTitle className="sr-only">Selected photograph</DialogTitle>
        {currentPhoto && (
          <PictureImage
            photo={currentPhoto}
            className="max-h-[90vh] max-w-[92vw] rounded-sm object-contain"
            sizes="92vw"
            priority
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type PictureImageProps = {
  className: string;
  photo: Photo;
  priority?: boolean;
  sizes: string;
};

function PictureImage({
  className,
  photo,
  priority = false,
  sizes,
}: PictureImageProps) {
  return (
    <picture>
      <source srcSet={photo.avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={photo.webpSrcSet} sizes={sizes} type="image/webp" />
      <img
        className={className}
        src={photo.src}
        srcSet={photo.webpSrcSet}
        sizes={sizes}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}

function preloadPhoto(photo: Photo, preloadedImages: Set<string>) {
  if (preloadedImages.has(photo.preloadSrc)) {
    return Promise.resolve();
  }

  preloadedImages.add(photo.preloadSrc);

  return new Promise<void>((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = photo.preloadSrc;
  });
}
