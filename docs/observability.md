# Observability

The shared layout includes an optional, deferred Cloudflare Web Analytics beacon on every page. This works with GitHub Pages without changing hosting or adding a backend or npm dependency.

## Metrics

- Traffic: visits, page views, popular pages, and referrers.
- Page load timing and Core Web Vitals: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).
- Breakdowns by page, browser, country, and device type where supported by the dashboard.

These are browser measurements, so blockers, disabled JavaScript, and browser API support affect coverage. This integration does not collect JavaScript exceptions, custom interaction events, server logs, or uptime checks. GitHub Actions remains the place to inspect build and deployment failures.

## Enable collection

1. In the [Cloudflare Web Analytics dashboard](https://dash.cloudflare.com/?to=/:account/web-analytics), add `pkazala.github.io` as a site using the setup for sites not proxied through Cloudflare.
2. Open **Manage site** and copy the `token` value from the provided JavaScript snippet. This is a public site identifier embedded in HTML, **not** a Cloudflare API token. Do not add the snippet separately: the shared layout already supplies it.
3. In the GitHub repository, go to **Settings → Secrets and variables → Actions → Variables**, and create a repository variable named `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` with that value.
4. Run the GitHub Pages deployment workflow. The variable is read at build time, so changing it requires a new build and deployment.

For a local production build, copy `.env.example` to `.env` and fill in the same public site token, then run `pnpm run build` and `pnpm run preview`. The development server never includes the beacon. Production previews do include it when a token is configured; leave the token empty for previews you do not want measured.

## Verify

1. Visit the deployed homepage, a blog page, and `/photos/` with browser blockers disabled for the check.
2. In browser developer tools, confirm one `beacon.min.js` script loads on each page and its `data-cf-beacon` attribute contains the configured token. Each page uses normal full-page navigation, so SPA tracking is explicitly disabled.
3. In the Network panel, look for requests to `https://cloudflareinsights.com/cdn-cgi/rum`. Interact with the page and navigate away to allow performance measurements to be sent.
4. Open the site's Cloudflare Web Analytics dashboard. Allow a few minutes for data to appear. Check traffic and the **Core Web Vitals** view; some metrics require interactions or browser support before they appear.

To disable collection, remove or empty the GitHub variable and rebuild/deploy. An unset or whitespace-only token omits the script entirely.

Cloudflare documents that its Web Analytics beacon does not use cookies or local storage for usage metrics. Collection is handled by Cloudflare; the site adds no separate visitor identifiers or event payloads.

References: [setup for externally hosted sites](https://developers.cloudflare.com/web-analytics/get-started/), [Core Web Vitals](https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/), and [data collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).
