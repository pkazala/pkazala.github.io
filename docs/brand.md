# Personal P mark

The black rounded tile and two white rounded bars (long left, short right)
form an abstract P and replace the dithered sphere. Source
geometry lives in `scripts/generate-brand-assets.mjs`; run `pnpm generate:brand`
to regenerate the SVGs, 16/32/48 px PNGs, multi-size ICO, 256 px PNG, and 180 px
Apple touch icon. The small favicons use a separate outline with pixel-aligned
bars and a full-pixel gap to retain clarity at native browser-tab sizes.

`PersonalLogo.tsx` renders the static SVG first and overlays Paper's Liquid Metal
shader through an exact SVG alpha mask. Only the P receives the shader; its
gap between the bars and black tile stay fixed. A 65% opacity limit over the white P keeps
the darkest metal reflections readable. Red/blue dispersion is disabled.

Motion runs slowly at speed 0.18, pauses outside the viewport or in a hidden
tab, and falls back to the static logo with reduced motion, without JavaScript,
or without WebGL2. The favicon is always static. No new runtime dependency is
needed: the existing Paper Shaders package includes Liquid Metal.

On the landing page the logo sits alone in the top bar; the name is a separate
hero heading below it. Other pages retain the shared logo-and-name header.

Reference: https://shaders.paper.design/liquid-metal
