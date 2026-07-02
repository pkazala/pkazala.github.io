# pkazala.github.io

Personal website for Piotr Kazala, built with Astro and Tailwind.

## Development

Install Node.js, then install dependencies and run the site locally:

```sh
npm install
npm run dev
```

The site is deployed as a static Astro build to GitHub Pages.

## Blog posts

Add posts as markdown files in `src/content/blog`.

Each post uses frontmatter like:

```md
---
title: "Post title"
description: "Short summary for listings and metadata."
date: 2026-07-02
tags:
  - notes
draft: false
---
```

Draft posts are hidden from production builds when `draft: true`.

## Photos

Homepage photo placeholders can be replaced later with files in `public/photos`.
