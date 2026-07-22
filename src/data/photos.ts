const photoBaseUrl = "https://pub-baa073ca592e4a8eada77d694ff90db6.r2.dev";

export type PhotoCategory = "people" | "landscape" | "creative";

export type PhotoSource = {
  alt: string;
  category: PhotoCategory;
  src: string;
};

export const photoSources: PhotoSource[] = [
  {
    alt: "A man standing beside a pale green caravan in woodland.",
    category: "people",
    src: `${photoBaseUrl}/P1012584.jpeg`,
  },
  {
    alt: "A stone gallery building and lawn under a clear blue sky.",
    category: "landscape",
    src: `${photoBaseUrl}/P1012596.jpeg`,
  },
  {
    alt: "A visitor examining an art installation in an orange-walled gallery.",
    category: "creative",
    src: `${photoBaseUrl}/P1012604.jpeg`,
  },
  {
    alt: "A stone fortress above a garden in Dubrovnik.",
    category: "landscape",
    src: `${photoBaseUrl}/P1012155.jpeg`,
  },
];
