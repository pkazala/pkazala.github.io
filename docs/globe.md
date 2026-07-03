# Globe Notes

The homepage globe is a bespoke Three.js vignette focused on Europe, Poland, the UK, and a small toy-plane route.

## Files

- `src/components/EuropeGlobe.astro` contains the canvas wrapper and imports the script.
- `src/scripts/europe-globe.ts` owns rendering, animation, country loading, and geometry conversion.
- `public/data/custom.geo.json` is the runtime country-data source.

## Rendering Model

- The renderer uses `alpha: true`; keep the canvas and wrapper transparent.
- The globe shell is translucent and uses a hidden depth mask so country polygons sit on the curved surface.
- Country polygons are built from GeoJSON `Polygon` and `MultiPolygon` geometry.
- Rings are densified before projecting to the sphere so borders follow the globe curvature.
- Country borders are subtle white `Line` objects, not text labels.

## Data Rules

- The script filters country rings to a Europe-focused lon/lat bounding box.
- It skips obvious far-north artifacts that can appear in Natural Earth-style country data.
- Poland is highlighted when the country code/name resolves to `POL` or `Poland`.
- The UK is highlighted when the country code/name resolves to `GBR` or `United Kingdom`.
- If replacing the GeoJSON, preserve common properties such as `iso_a3`, `adm0_a3`, `admin`, or `name`, or update `getCountryCode` / `getCountryName`.

## Interaction And Motion

- The globe is deliberately not draggable.
- The toy plane travels Poland to Edinburgh and back using a ping-pong sample over one quadratic route.
- `prefers-reduced-motion` freezes the plane at a representative point.
- The propeller spins only when reduced motion is not requested.

## Change Guidance

- For view/framing changes, start with camera position/lookAt and `root.position` / `root.rotation`.
- For country accuracy, prefer updating `public/data/custom.geo.json` over hand-drawing shapes in TypeScript.
- After meaningful globe changes, verify desktop and mobile screenshots and confirm the canvas remains nonblank, transparent, and without horizontal overflow.
