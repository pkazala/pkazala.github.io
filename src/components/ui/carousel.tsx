"use client";

import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";

import { cn } from "../../lib/utils";

type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollPrevious: () => void;
  scrollNext: () => void;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a Carousel");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { opts?: CarouselOptions }
>(({ className, opts, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(opts);
  const [canScrollPrevious, setCanScrollPrevious] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    if (!api) return;

    setCanScrollPrevious(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  const scrollPrevious = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    updateScrollState();
    api.on("reInit", updateScrollState);
    api.on("select", updateScrollState);

    return () => {
      api.off("reInit", updateScrollState);
      api.off("select", updateScrollState);
    };
  }, [api, updateScrollState]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        scrollPrevious,
        scrollNext,
        canScrollPrevious,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("-ml-3 flex", className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("min-w-0 shrink-0 grow-0 basis-full pl-3", className)}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrevious, canScrollPrevious } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute -left-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/80 text-sm text-ink backdrop-blur transition-colors hover:bg-white/80 disabled:pointer-events-none disabled:opacity-0",
        className,
      )}
      disabled={!canScrollPrevious}
      type="button"
      onClick={scrollPrevious}
      aria-label="Previous slide"
      {...props}
    >
      <span aria-hidden="true">←</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute -right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/80 text-sm text-ink backdrop-blur transition-colors hover:bg-white/80 disabled:pointer-events-none disabled:opacity-0",
        className,
      )}
      disabled={!canScrollNext}
      type="button"
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <span aria-hidden="true">→</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
