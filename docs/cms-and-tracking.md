# Payload blog and Google Tag Manager

## Production environment

Set these in the existing Vercel project for Production, and Preview if testing a preview deployment:

| Variable | Value |
| --- | --- |
| `PAYLOAD_CMS_URL` | `https://payload.gmfb.co.nz` |
| `PAYLOAD_TENANT_ID` | `7` |
| `PAYLOAD_TENANT_SLUG` | `onsite-build` |
| `REVALIDATION_SECRET` | The private value matching Payload's `ONSITE_BUILD_REVALIDATION_SECRET` |
| `NEXT_PUBLIC_GTM_ID` | Optional override; defaults to `GTM-NQCNX9N7` |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console HTML verification content value |

Enter plain values without the backslashes or trailing `\` from formatted handoffs. Preserve all other existing project variables. No Payload editor password, JWT, or API key is necessary. CMS variables and the revalidation secret are server-only. Search Console and GTM IDs are public by design.

The four CMS variables can be entered in Vercel as planned. A private `frontend.env` file was not supplied with this handoff and was not required or committed. `.env.example` contains no secret. GTM and Search Console configuration is evaluated during build, so deploy again after changing those values.

## Data and routing

- Public reads use `/api/blog-posts`, tenant `7`, `_status=published`, `depth=1`, and `cache: 'no-store'` on every request. Returned tenant, slug, path and publication status are checked again. Missing/incorrect configuration or CMS errors fail rather than falling back to old article copy.
- `/building-advice-auckland?page=N` paginates 24 articles at a time. The sitemap traverses all CMS result pages. Related cards query the same tenant and exclude the current slug.
- `/blogs/<slug>` is a separate dynamic route, ahead of the non-blog catch-all. It has no build-time slug list. Unknown, draft, unpublished and deleted articles return HTTP 404. Publishing, editing, renaming, deleting and media changes are visible on a fresh request without a build or webhook.
- The existing article layout, table of contents, cards and CSS classes are retained. Lexical content renders as escaped React elements with safe URL schemes. Reading time is calculated from article text. Import timestamps are not displayed as original publication dates. Guide tools/steps and case-study fields render when populated.
- Only `https://media.gmfb.co.nz/media/**` is allowed for CMS image optimization. Populated hero/card sizes and alt text are used; a media revision query versions optimized images after file replacements. Missing images retain the page/card without a broken image.
- The SEO branch's canonical route mappings, redirects, search metadata, structured data and robots configuration were selectively adapted onto `main`. Its unrelated design, images, contact backend and extra content pages were not merged. Open Graph images point to assets already on `main`.
- As in the SEO branch, Cache Components/Partial Prefetching are disabled to preserve non-streamed HTTP status handling. Existing non-blog pages are still statically generated; the index, articles and sitemap render per request. React `cache` only deduplicates the same article's metadata/page fetch within one request.

## Payload notification endpoint

Configure Payload to POST to `https://onsitebuild.co.nz/api/revalidate/payload` with:

```http
Content-Type: application/json
x-revalidation-secret: <the private shared secret>
```

```json
{
  "tenantSlug": "onsite-build",
  "collection": "blog-posts",
  "operation": "update",
  "pageSlug": "renovate-or-rebuild-auckland",
  "pagePath": "/blogs/renovate-or-rebuild-auckland",
  "publicationStatus": "published"
}
```

The supported collections are `blog-posts` and `media`; operations are `create`, `update` and `delete`. Draft transitions are accepted. Slug/path/status may be omitted or null for media notifications. Secrets are checked with a constant-time digest comparison. The tenant and notification fields are validated before invalidation. Arbitrary site paths are rejected.

Accepted notifications return `200` with `revalidated: true`; missing/wrong signatures return `401`, another tenant `403`, invalid fields/JSON `400`, the wrong content type `415`, oversized bodies `413`, and an unconfigured secret `503`. Other HTTP methods return `405`.

Every accepted notification invalidates the index, sitemap, and article route pattern, including shared related cards and old slugs after a rename. Freshness also works without notifications because reads are not cached between requests. The endpoint uses the supplied shared-secret header contract, not an HMAC signature protocol.

## GTM and Google verification

The root layout loads container `GTM-NQCNX9N7` once via Next's script loader and includes the standard no-JavaScript iframe. The container's public script returned HTTP 200 during setup.

The app queues these data-layer events:

| Event | Fields | Trigger |
| --- | --- | --- |
| `onsite_page_view` | `page_path` | Initial load and client-side URL changes |
| `onsite_contact_click` | `contact_method` (`phone` or `email`), `page_path` | Business phone/email link click |

No query parameters, form values, contact names, or enquiry messages are included in these custom events. Existing form submission behavior is unchanged; submitting the current GET form is not reported as a successful lead.

Use Tag Assistant to confirm the container is detected on the deployed domain. In GTM, configure the intended analytics tags/custom event triggers and publish the container. If using the custom page-view event for GA4, avoid also counting automatic/history page views for the same navigation. Installing GTM does not create a GA4 property, grant account ownership, or confirm Search Console verification.

Search Console can use its GTM ownership verification method if the signed-in Google account has the required container permissions. Alternatively, set `GOOGLE_SITE_VERIFICATION` to the HTML verification content value and redeploy. No Search Console verification code was supplied, so ownership verification remains an account-side step. The sitemap URL is `https://onsitebuild.co.nz/sitemap.xml`.

## Deployment and verification

Work stays on `main`. The production Vercel project is `on-site-building`, whose Production Branch is `main`. The custom domain `onsitebuild.co.nz` and its `www` redirect were moved from `on-site-building-review` to this project after validating the CMS-enabled deployment. The review project's launch branch and unrelated environment variables were left intact. Future pushes to `main` deploy through the existing Git integration.

Local checks:

```bash
npm run lint
npm test
npm run build
npm run test:integration
```

The integration test uses an isolated local HTTPS mock CMS and the built production server. It verifies arbitrary slugs, pagination, metadata, related posts, sitemap updates, drafts, edits without webhooks, slug changes, deletion, outages, and signed/unsigned notifications. It never changes real CMS content.

After deployment, check the index, all six canonical article URLs, images, canonical metadata, sitemap and old redirects on the hosted domain. Confirm an unknown article returns 404. Verify the webhook from Payload using the real private secret. No private secret should appear in generated HTML, client JavaScript, logs or Git.

The Vercel login was renewed and the four CMS variables were confirmed on the production project. Hosted checks on `https://onsitebuild.co.nz` passed for the CMS index, canonical articles, media, sitemap, unknown-slug HTTP 404, old URL redirects, the `www` redirect, GTM loading, and missing/incorrect webhook secrets returning HTTP 401. No CMS posts were created or edited. Accepted signed notifications, drafts, deletion and renaming were tested with isolated fixtures; the production shared secret is stored as a sensitive Vercel variable and was not disclosed or extracted for a live signed test. Search Console ownership verification remains an account-side step.

References: [installed Next.js docs](../node_modules/next/dist/docs/), [Payload rich-text rendering](https://payloadcms.com/docs/rich-text/converters).
