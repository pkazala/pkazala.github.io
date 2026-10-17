import { LiquidMetal } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

export default function PersonalLogo() {
  const root = useRef<HTMLSpanElement>(null);
  const [canRender, setCanRender] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    if (!context) return;
    context.getExtension("WEBGL_lose_context")?.loseContext();

    let visible = false;
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
      className="relative block size-[1cap] shrink-0"
      aria-hidden="true"
    >
      <img
        className="block size-full"
        src="/logo-p.svg"
        width="64"
        height="64"
        alt=""
      />
      {canRender && (
        <LiquidMetal
          width="100%"
          height="100%"
          className="pointer-events-none absolute inset-0"
          style={{
            // Clip the material to the exact same outline as the static logo.
            // The black tile and the gap between the bars stay untouched.
            maskImage: "url(/logo-p-mask.svg)",
            WebkitMaskImage: "url(/logo-p-mask.svg)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            opacity: 0.65,
          }}
          shape="none"
          colorBack="#ffffff"
          colorTint="#ffffff"
          repetition={1.5}
          softness={0.45}
          shiftRed={0}
          shiftBlue={0}
          distortion={0.12}
          contour={0.15}
          angle={70}
          speed={shouldAnimate ? 0.18 : 0}
          scale={1}
          minPixelRatio={2}
          maxPixelCount={65536}
        />
      )}
    </span>
  );
}
