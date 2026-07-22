"use client";

import React, { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  Carousel,
  type CarouselApi,
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
  variant?: "full" | "strip";
};

export default function PhotoLightbox({
  photos,
  variant = "strip",
}: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
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
        className={
          variant === "full"
            ? "relative left-1/2 w-screen -translate-x-1/2"
            : "w-full px-9 sm:px-10"
        }
        opts={{
          align: "start",
          containScroll: variant === "full" ? false : "trimSnaps",
          loop: variant === "full",
        }}
        setApi={variant === "full" ? setCarouselApi : undefined}
        wheelNavigation={variant === "full"}
      >
        <CarouselContent
          className={
            variant === "full"
              ? "cursor-grab px-4 active:cursor-grabbing sm:px-6"
              : undefined
          }
        >
          {photos.map((photo, index) => (
            <CarouselItem
              className={
                variant === "full"
                  ? "h-[420px] basis-auto"
                  : "basis-[82%] sm:basis-1/2 lg:basis-1/3"
              }
              key={`${photo.src}-${index}`}
            >
              <button
                className={`group block h-full cursor-pointer rounded-sm text-left outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ink/25 active:scale-[0.99] ${variant === "full" ? "w-auto" : "w-full"}`}
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
                  className={
                    variant === "full"
                      ? "block h-full w-auto max-w-none rounded-sm object-contain"
                      : "aspect-[4/3] w-full rounded-sm object-cover transition-transform duration-200 ease-out group-hover:scale-[1.01]"
                  }
                  sizes={
                    variant === "full"
                      ? "(min-width: 640px) 840px, 600px"
                      : "(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 78vw"
                  }
                  onLoad={
                    variant === "full" ? () => carouselApi?.reInit() : undefined
                  }
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={
            variant === "full"
              ? "left-4 border-ink/5 bg-paper/45 hover:bg-paper/70 sm:left-6"
              : "left-0"
          }
        />
        <CarouselNext
          className={
            variant === "full"
              ? "right-4 border-ink/5 bg-paper/45 hover:bg-paper/70 sm:right-6"
              : "right-0"
          }
        />
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
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  photo: Photo;
  priority?: boolean;
  sizes: string;
};

function PictureImage({
  className,
  onLoad,
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
        onLoad={onLoad}
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
