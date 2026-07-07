"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

type Photo = {
  alt: string;
  src: string;
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
      <div
        className="-mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Photo carousel"
      >
        {photos.map((photo, index) => (
          <DialogTrigger asChild key={photo.src}>
            <button
              className="group min-w-[78%] snap-start overflow-hidden rounded-sm border border-ink/10 bg-zinc-100 text-left outline-none transition hover:border-ink/25 focus-visible:ring-2 focus-visible:ring-ink/30 sm:min-w-[calc((100%_-_1.5rem)/3)]"
              type="button"
              onClick={() => openPhoto(index)}
              aria-label="Open photo"
            >
              <img
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
              />
            </button>
          </DialogTrigger>
        ))}
      </div>

      <DialogContent
        aria-describedby={undefined}
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
            alt={currentPhoto.alt}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
