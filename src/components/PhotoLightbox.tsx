"use client";

import React, { useState } from "react";

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
  src: string;
  srcSet?: string;
};

type PhotoLightboxProps = {
  photos: Photo[];
};

export default function PhotoLightbox({ photos }: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPhoto = photos[currentIndex];

  const openPhoto = (index: number) => {
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
                aria-label="Open photo"
              >
                <img
                  className="aspect-[4/3] w-full rounded-sm object-cover transition-transform duration-200 ease-out group-hover:scale-[1.01] group-active:scale-[0.99]"
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 78vw"
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
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
          <img
            className="max-h-[90vh] max-w-[92vw] rounded-sm object-contain"
            src={currentPhoto.src}
            srcSet={currentPhoto.srcSet}
            sizes="92vw"
            alt={currentPhoto.alt}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
