const photoBaseUrl = "https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev";

export const photoSources = [
  "P1012584.jpeg",
  "P1012596.jpeg",
  "P1012604.jpeg",
].map((filename) => ({
  alt: "A photograph by Piotr Kazala.",
  src: `${photoBaseUrl}/${filename}`,
}));
