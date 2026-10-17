import { LiquidMetal } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

export default function PersonalLogo() {
  const root = useRef<HTMLSpanElement>(null);
  const [canRender, setCanRender] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    if (!context) return;
    context.getExtension("WEBGL_lose_context")?.loseContext();

    let visible = true;
    const update = () => {
      setCanRender(!reducedMotion.matches);
      setShouldAnimate(visible && !document.hidden && !reducedMotion.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (root.current) observer.observe(root.current);
    update();
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <span
      ref={root}
      className="relative block h-[52px] w-[28px] shrink-0"
      aria-hidden="true"
    >
      <img
        className="block size-full"
        src="/logo-bars.svg"
        width="24"
        height="45"
        alt=""
      />
      {canRender && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            // Clip the background as well as the material: no tile, no fill
            // between the two bars, including while Paper loads its image.
            maskImage: "url(/logo-bars.svg)",
            WebkitMaskImage: "url(/logo-bars.svg)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
          }}
        >
          <LiquidMetal
            // Compensate the canvas size for Paper's 0.6 object scale so the
            // custom image and the outer alpha mask share the same outline.
            width="166.666667%"
            height="166.666667%"
            style={{
              position: "absolute",
              left: "-33.333333%",
              top: "-33.333333%",
            }}
            image="/logo-bars.svg"
            shape="none"
            colorBack="#ffffff"
            colorTint="#a8a8a8"
            repetition={2}
            softness={0.1}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0.07}
            contour={0.4}
            angle={70}
            speed={shouldAnimate ? 1 : 0}
            scale={0.6}
            rotation={0}
            offsetX={0}
            offsetY={0}
            fit="contain"
            minPixelRatio={2}
            maxPixelCount={65536}
          />
        </span>
      )}
    </span>
  );
}
