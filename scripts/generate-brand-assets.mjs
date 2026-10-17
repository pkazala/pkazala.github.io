import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// One outline for the logo, shader mask, and large app icons. Small favicons
// use pixel-aligned bars and a full-pixel gap rather than shrinking a render.
const letter =
  "M20 15.5a5.5 5.5 0 0 1 11 0v34a5.5 5.5 0 0 1-11 0ZM33 15.5a5.5 5.5 0 0 1 11 0V30a5.5 5.5 0 0 1-11 0Z";
const smallLetter =
  "M5 4.5a1.5 1.5 0 0 1 3 0v7a1.5 1.5 0 0 1-3 0ZM9 4.5a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-3 0Z";
const glyph = (path) => `<path fill="white" fill-rule="evenodd" d="${path}"/>`;
const svg = (body, size = 64) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>\n`;
const tile = '<rect width="64" height="64" rx="12" fill="#080808"/>';
const rim =
  '<rect x=".5" y=".5" width="63" height="63" rx="11.5" fill="none" stroke="#ffffff" stroke-opacity=".12"/>';
const logo = svg(tile + rim + glyph(letter));
const small = svg(
  '<rect width="16" height="16" rx="3" fill="#080808"/>' + glyph(smallLetter),
  16,
);
const output = new URL("../public/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL("logo-p.svg", output), logo);
await writeFile(new URL("logo-p-mask.svg", output), svg(glyph(letter)));
await writeFile(new URL("favicon.svg", output), small);

const icons = [];
for (const size of [16, 32, 48]) {
  const png = await sharp(Buffer.from(small), { density: (size * 72) / 16 })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(new URL(`favicon-${size}.png`, output), png);
  icons.push({ size, png });
}
for (const [file, size] of [
  ["favicon.png", 256],
  ["apple-touch-icon.png", 180],
]) {
  await sharp(Buffer.from(logo), { density: (size * 72) / 64 })
    .resize(size, size)
    .png()
    .toFile(new URL(file, output).pathname);
}

// ICO directory with PNG payloads at native Windows/browser favicon sizes.
const header = Buffer.alloc(6 + 16 * icons.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icons.length, 4);
let offset = header.length;
icons.forEach(({ size, png }, index) => {
  const position = 6 + index * 16;
  header[position] = size;
  header[position + 1] = size;
  header.writeUInt16LE(1, position + 4);
  header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(png.length, position + 8);
  header.writeUInt32LE(offset, position + 12);
  offset += png.length;
});
await writeFile(
  new URL("favicon.ico", output),
  Buffer.concat([header, ...icons.map(({ png }) => png)]),
);
console.log(
  "Generated P logo, shader mask, SVG/ICO/PNG favicons, and touch icon.",
);
