# On Site Building: SEO launch package — 17 November 2026

## Purpose and current state

This branch is a review candidate. The original website was approved for launch, but subsequent visible SEO rewrites were rejected. The correction restores the approved headings, introductions and article copy while retaining technical SEO, real project photographs, the five-service scope and enquiry functionality.

Canonical production origin: `https://onsitebuild.co.nz`.

The GitHub launch branch has a working automatic Vercel preview in the original on-site-building project. GitHub access and Vercel team consent are complete. The custom domain still uses Dynadot parking. Its apex and www domains are assigned to the retained review project, which still needs the updated source deployment and live form check. Review the corrected preview before continuing the production cutover. Local validation does not establish public-domain availability or live email delivery.

## Content and location decisions

- Manurewa / South Auckland is the home base. Renovations and extensions are the commercial priority.
- Auckland, Waikato and Whangārei are the approved service regions. The seven coverage groups contain 67 representative suburbs and towns, not fabricated branch offices or completed-project claims.
- No fixed minimum job size, travel radius or small-job travel rule was verified. The visible copy asks for location, scope and timing so the business can confirm availability.
- Five detailed service pages remain: renovations and alterations, additions and extensions, residential new builds, design and build, and light commercial construction.
- Design and build describes collaboration with an architect partner. Light commercial examples remain shops, dairies, laundromats and suitable alterations.
- Four supported project pages remain: Whitford Heights, Manukau Heights, Botany and New Lynn. Unverified projects and placeholder testimonials remain excluded.
- All 21 original pages render their approved hero headings and introductory paragraphs from the unchanged master copy. The six article bodies retain their original wording and original calls to action. Added SEO introductions, guide sections and extra calls to action have been removed.
- Service regions appear as compact footer links to the dedicated directory. The directory retains seven groups and 67 representative suburbs/towns, using the site’s shared width and mobile gutters.
- The Tailwind build rule is limited to app/globals.css so native CSS Module class mappings are preserved for the directory, form and legal pages.
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

The homepage metadata targets South Auckland builders. The renovation metadata targets house renovations in South Auckland, and the extension metadata describes South Auckland and wider Auckland coverage. These keyword decisions remain in accurate search metadata and descriptive URLs; they no longer override the approved visible headlines or add promotional copy. Any future visible editorial changes should be reviewed as exact before/after proposals.

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

The HTTP checker validates page status, unique metadata, exact approved hero headings and introductions, absence of unresolved CSS Module classes, canonical/social tags, structured-data references, breadcrumbs, internal/fragment links, image URLs, robots, sitemap, 404 behavior and all legacy redirects. The production-host option is a local simulation; run the checker against the actual HTTPS domain after DNS and deployment are complete.

The corrected local checks passed: 24 pages, 20 one-hop redirects, 24 sitemap entries, 20 image URLs, 1,128 internal-link occurrences and 239 fragment links. Both preview and production-host simulations passed 5,529 assertions each with zero failures. These are local HTTP results, not a live-domain or inbox-delivery claim.

## Launch sequence still required

1. Review the corrected branch preview, including desktop/mobile copy, service-area layout and footer. Main remains unchanged.
2. After review, connect/deploy the approved source to the retained On Site Building hosting project.
3. Confirm the deployed form configuration, send the one authorized internal test and verify delivery.
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
