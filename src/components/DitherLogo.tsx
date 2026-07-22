"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export default function DitherLogo() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setShouldAnimate(!reducedMotion.matches);

    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    return () => reducedMotion.removeEventListener("change", updateMotion);
  }, []);

  return (
    <div
      className="size-[1cap] shrink-0 overflow-hidden mix-blend-multiply"
      aria-hidden="true"
    >
      <Dithering
        width="1cap"
        height="1cap"
        colorBack="#ffffff"
        colorFront="#000000"
        shape="sphere"
        type="4x4"
        size={2}
        speed={shouldAnimate ? 1 : 0}
        scale={1}
        rotation={0}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
