# Personal P mark

The black rounded tile and two white rounded bars (long left, short right)
form an abstract P and replace the dithered sphere. Source
geometry lives in `scripts/generate-brand-assets.mjs`; run `pnpm generate:brand`
to regenerate the SVGs, 16/32/48 px PNGs, multi-size ICO, 256 px PNG, and 180 px
Apple touch icon. The small favicons use a separate outline with pixel-aligned
bars and a full-pixel gap to retain clarity at native browser-tab sizes.

The page mark uses `logo-bars.svg`: two grey bars on a transparent background,
52 pixels tall, without the favicon's black tile. `PersonalLogo.tsx` passes this
image to Paper's Liquid Metal shader so its contour follows the rounded bars.
An additional SVG alpha mask clips the shader's background and the gap between
the bars. The canvas compensates for Paper's 0.6 object scale to align the image
and outer mask.

Settings match the supplied Paper screenshot: white background, `#a8a8a8` tint,
repetition 2, softness 0.1, red/blue shifts 0.3, distortion 0.07, contour 0.4,
angle 70, speed 1, scale 0.6, rotation/offsets 0, and contain fit. The image
replaces the demo's predefined diamond shape.

Motion pauses outside the viewport or in a hidden tab, and falls back to static
grey bars with reduced motion, without JavaScript, or without WebGL2. The
favicon retains its black tile and stays static. No new runtime dependency is
needed: the existing Paper Shaders package includes Liquid Metal.

On the landing page the logo sits alone in the top bar; the name is a separate
hero heading below it. Other pages retain the shared logo-and-name header.

Reference: https://shaders.paper.design/liquid-metal
