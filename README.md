# On Site Building Construction

Pixel-matched Next.js 16 App Router implementation of the supplied On Site Builders Figma design.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For the CMS blog, copy [.env.example](.env.example) to `.env.local` and set the four server-side CMS variables. No CMS password or token is used. Never commit `frontend.env`, `.env.local`, or a revalidation secret.

For a production check:

```bash
npm run build
npm start
```

## Routes and CMS

Canonical SEO paths and legacy redirects are defined in `app/site-routes.ts`. Existing non-blog page copy, photographs, galleries, and form behavior remain from `main`; the route and metadata definitions were selectively adapted from `launch/onsite-seo-2026-11-17`. That branch was not merged or modified. Its additional legal/service-area pages and contact backend were not imported.

The blog index is `/building-advice-auckland`; `/blogs` redirects there. `/blogs/<slug>` reads arbitrary published articles from Payload, independently of the static non-blog route map. The six old short blog URLs redirect to their Auckland SEO counterparts.

See [CMS and tracking setup](docs/cms-and-tracking.md) for Vercel variables, webhook verification, GTM events, and deployment checks.

## Checks

```bash
npm run lint
npm test
npm run build
npm run test:integration
```

The integration check starts a local HTTPS fixture CMS and the production app. It never creates or edits real CMS posts. With the app running, `node scripts/check-master-copy.mjs <base-url>` checks non-blog copy and `node scripts/check-gallery-images.mjs <base-url>` checks the supplied galleries.

The desktop design is verified at the native Figma frame width of 1440 px. Narrow viewports proportionally scale the verified desktop composition without horizontal overflow.
