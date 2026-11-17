# On Site Building: SEO launch package — 17 November 2026

## Purpose and current state

The client has approved the website for launch. This package preserves the approved design, real project photographs and five-service scope while adding local SEO and enquiry qualification.

Canonical production origin: `https://onsitebuild.co.nz`.

At the time of this checkpoint, the updated build has not been uploaded to the hosting project. The domain is registered with Dynadot and still uses parking. Its apex and www domains have been assigned in Vercel; the www redirect targets the apex with HTTP 308. DNS cutover is pending the updated deployment and live form check. Vercel deployment authorization and the GitHub app's organization/repository write grant are outstanding. Local validation does not establish public-domain availability or live email delivery.

## Content and location decisions

- Manurewa / South Auckland is the home base. Renovations and extensions are the commercial priority.
- Auckland, Waikato and Whangārei are the approved service regions. The seven coverage groups contain 67 representative suburbs and towns, not fabricated branch offices or completed-project claims.
- No fixed minimum job size, travel radius or small-job travel rule was verified. The visible copy asks for location, scope and timing so the business can confirm availability.
- Five detailed service pages remain: renovations and alterations, additions and extensions, residential new builds, design and build, and light commercial construction.
- Design and build describes collaboration with an architect partner. Light commercial examples remain shops, dairies, laundromats and suitable alterations.
- Four supported project pages remain: Whitford Heights, Manukau Heights, Botany and New Lynn. Unverified projects and placeholder testimonials remain excluded.
- Six existing building-advice articles have contextual Auckland introductions, related-service links and visible organization bylines. The update date reflects actual editorial changes; no original publication date is invented.
- The private residential street address must not appear in public content, structured data or maps.

## SEO implementation

- Unique descriptive titles (45–58 characters) and descriptions (150–160 characters) on all 24 pages, with relevant service, location and brand wording.
- One main heading per page; visible breadcrumbs and semantic page structure.
- Canonical URLs and Open Graph/Twitter images on the production origin.
- 24-entry XML sitemap and crawlable robots.txt; API routes excluded from crawling.
- 20 permanent 308 redirects from changed URLs, preserving query parameters in one hop.
- Consistent internal links to canonical destinations; no generated suburb doorway pages.
- Structured data: Organization, WebSite, appropriate WebPage/collection types, 5 Service entities, 6 BlogPosting entities and 23 BreadcrumbList entities.
- No fabricated ratings, review schema, private-address LocalBusiness markup or unsupported FAQ rich-result claims.
- Preview/local hosts return noindex headers while the canonical production host remains indexable.
- A branded 404 responds with the correct HTTP status.
- Responsive image sizing, compressed client photos and nine optimized legacy photographic assets (21.34 MB of PNGs replaced by 1.86 MB of same-dimension WebPs, a 91.31% reduction).

Titles and descriptions use concise editorial length targets. Google does not impose a fixed character limit, and can rewrite or truncate search-result text according to the query and device width. Structured data describes the visible content; it does not guarantee a rich result or ranking.

## Keyword research refinement

Keyword Planner research on 17 November 2026 used New Zealand, English and Google, with the historical period November 2025–October 2026. Thirty seed phrases produced 204 distinct ideas. The displayed search ranges and page recommendations are retained in the separate keyword workbook; account identifiers and research exports are not included in this repository.

The homepage retains South Auckland builders as its main target. The renovation page now leads with house renovations in South Auckland, supported by wider Auckland service coverage and natural home-renovation wording. The homepage introduction links that service explicitly. The extension description now makes South Auckland and wider Auckland coverage clear. These editorial refinements retain the existing descriptive URLs and five-service structure.

Search ranges are estimates, close variants can overlap, and Google Ads competition measures advertisers rather than organic ranking difficulty. Regional demand does not establish a local office, an unconditional travel commitment or a reason to add an unconfirmed service.

## Enquiry form

The form includes required suburb/town, optional NZD budget range and optional timeframe, alongside the approved contact, service, project-size and message fields. All details are included in the server-side enquiry email.

Attachments: at most 3 PDF/JPG/PNG files, 3 MB combined. Server validation checks field values, file signatures and request size. Consent, same-origin checks, a honeypot, per-instance rate limiting and idempotent provider requests are retained. Success is shown only after the email provider accepts the enquiry.

Server-only environment variables:

```text
RESEND_API_KEY=<restricted sending-only credential>
CONTACT_FROM_EMAIL=Website Enquiries <forms@weblaunch.co.nz>
CONTACT_TO_EMAIL=<explicit recipient for this environment>
```

Use `steven@weblaunch.co.nz` for the authorized internal test. Set the final production recipient to `onsitebuilding1@gmail.com` after that test. The nonproduction handler refuses other recipients. Never commit or expose the API key in client code.

## Validation

- `npm run lint`
- `npm run build`
- `node scripts/check-contact.mjs`: 12 offline checks with mocked delivery, no emails sent.
- `node scripts/check-seo.mjs http://127.0.0.1:3000`
- `node scripts/check-seo.mjs http://127.0.0.1:3000 --production-host`
- `git diff --check`

The HTTP checker validates page status, unique metadata, main headings, canonical/social tags, structured-data references, breadcrumbs, internal/fragment links, image URLs, robots, sitemap, 404 behavior and all legacy redirects. The production-host option is a local simulation; run the checker against the actual HTTPS domain after DNS and deployment are complete.

The final local checks passed: 24 pages, 20 one-hop redirects, 24 sitemap entries, 20 image URLs, 1,010 internal-link occurrences and 71 fragment links. Both preview and production-host simulations passed 4,941 assertions each with zero failures. These are local HTTP results, not a live-domain or inbox-delivery claim.

## Launch sequence still required

1. Restore the correct GitHub organization/repository app grant and Vercel project deployment authorization.
2. Upload the committed launch branch to the existing repository and deploy the updated source to the retained On Site Building hosting project.
3. Check desktop and mobile rendering on the actual deployment. Send the one authorized internal form test and verify delivery.
4. Set the customer production recipient and redeploy so the environment change takes effect.
5. Add the apex domain and `www`; keep the apex as canonical and redirect `www` permanently to it.
6. Apply the exact DNS values supplied by Vercel in Dynadot, preserving any unrelated records. Verify HTTPS, domain redirects and the complete page check.
7. Verify ownership in Google Search Console and submit `/sitemap.xml` when the production domain is reachable. Inspect priority service URLs and monitor indexing.

No Search Console ownership verification, analytics property or Google Business Profile update is claimed in this package. No test email has been sent to the client.

## Canonical URL inventory

| Page key | Production path |
|---|---|
| `home` | `/` |
| `services` | `/building-services-auckland` |
| `service` | `/services/new-home-builders-auckland` |
| `serviceRenovations` | `/services/home-renovations-south-auckland` |
| `serviceDesignBuild` | `/services/design-and-build-auckland` |
| `serviceExtensions` | `/services/home-extensions-auckland` |
| `serviceCommercial` | `/services/light-commercial-builders-auckland` |
| `projects` | `/building-projects-auckland` |
| `whitford` | `/projects/whitford-heights-design-build-auckland` |
| `manukau` | `/projects/manukau-heights-new-home-auckland` |
| `botany` | `/projects/botany-new-home-east-auckland` |
| `newLynn` | `/projects/new-lynn-new-home-west-auckland` |
| `about` | `/about-onsite-building-auckland` |
| `blogs` | `/building-advice-auckland` |
| `blog` | `/blogs/renovate-or-rebuild-auckland` |
| `blogExtension` | `/blogs/planning-home-extension-auckland` |
| `blogBlending` | `/blogs/blending-old-new-home-renovation-auckland` |
| `blogCommercial` | `/blogs/light-commercial-construction-auckland` |
| `blogDesignBuild` | `/blogs/design-build-process-auckland` |
| `blogNewHome` | `/blogs/building-new-home-auckland` |
| `contact` | `/contact-auckland-builders` |
| `serviceAreas` | `/building-service-areas-auckland-waikato-whangarei` |
| `privacy` | `/privacy-policy` |
| `terms` | `/terms` |

## Public technical references

- Google title guidance: https://developers.google.com/search/docs/appearance/title-link
- Google description/snippet guidance: https://developers.google.com/search/docs/appearance/snippet
- Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Search feature updates: https://developers.google.com/search/updates
- Keyword Planner historical metrics: https://support.google.com/google-ads/answer/3022575?hl=en
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

Private client source links are kept outside the repository and deployment package.
