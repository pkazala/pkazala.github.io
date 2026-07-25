const photoBaseUrl = "https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev";

export type PhotoCategory = "people" | "landscape" | "creative";

export type PhotoSource = {
  alt: string;
  category: PhotoCategory;
  src: string;
};

const filesByCategory: Record<PhotoCategory, string[]> = {
  people: [
    "P1001198.webp",
    "P1001286.webp",
    "P1001731.webp",
    "P1001867.webp",
    "P1012106.webp",
    "P1012140.webp",
    "P1012584.webp",
  ],
  landscape: [
    "P1000842.webp",
    "P1001122.webp",
    "P1001590.webp",
    "P1001790.webp",
    "P1001799.webp",
    "P1001815.webp",
    "P1001831.webp",
    "P1001868.webp",
    "P1012100.webp",
    "P1012155.webp",
  ],
  creative: [
    "P1000838.webp",
    "P1000842.webp",
    "P1001283.webp",
    "P1001384.webp",
    "P1001399.webp",
    "P1001744.webp",
    "P1001760.webp",
    "P1001857.webp",
    "P1012237.webp",
  ],
};

const labels: Record<PhotoCategory, string> = {
  people: "people photograph",
  landscape: "landscape photograph",
  creative: "creative photograph",
};

export const photoSources: PhotoSource[] = Object.entries(
  filesByCategory,
).flatMap(([category, files]) =>
  files.map((filename) => ({
    alt: `A ${labels[category as PhotoCategory]} by Piotr Kazala.`,
    category: category as PhotoCategory,
    src: `${photoBaseUrl}/${category}/${filename}`,
  })),
);
