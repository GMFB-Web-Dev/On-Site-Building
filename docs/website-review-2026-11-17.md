# On Site Building website review — 17 November 2026

## Changes

- Applied the supplied labelled page and service photos, with optimised WebP assets.
- Added real heroes, overview photos and galleries for Whitford Heights, Manukau Heights, Botany and New Lynn.
- Restricted project navigation, cards and related projects to those four supported projects.
- Preserved existing hero images where no replacement HERO was supplied.
- Removed dummy testimonial sections and unsupported, repeated service galleries.
- Increased the LBP logo, simplified the header phone hover, and centred the map more closely on Auckland.
- Added adapted privacy-policy and website-terms pages with On Site Building's business details.
- Replaced the placeholder form with validated server-side delivery and real attachments.

## Form configuration

For internal form checks, set these as server-only Vercel environment variables in the deployment being tested:

```text
RESEND_API_KEY=<sending-only key for the verified domain>
CONTACT_FROM_EMAIL=Website Enquiries <forms@weblaunch.co.nz>
CONTACT_TO_EMAIL=steven@weblaunch.co.nz
```

The nonproduction handler refuses to send to any other recipient. Production must have its own explicit `CONTACT_TO_EMAIL=onsitebuilding1@gmail.com` configuration after approval. Never expose the key in source or a `NEXT_PUBLIC_` variable.

The form accepts up to three PDF/JPG/PNG files, with a combined size of 3 MB. A submission is successful only after the email provider accepts it. Invalid configuration or provider errors produce an honest visible failure and retain the entered values.

## Verification

`npm run lint`, `npm run build`, `git diff --check` and `node scripts/check-contact.mjs` passed. The twelve contact checks use mocked delivery and do not send emails. Live inbox delivery requires a real submission from the configured preview.

## Review items

- Check photo selection and cropping on desktop and phone, especially all four project heroes and the About portrait.
- One supplied Manukau driveway photo appears inconsistent with the remaining project photos. It and its duplicate residential-gallery asset are excluded from visible galleries pending owner confirmation.
- The client approved launch on 17 November 2026. Public contact details use the business phone, email and Manurewa locality; the private residential street address must not be published.
- SEO implementation and the remaining deployment checks are described in `seo-launch-2026-11-17.md`.

## Source material

- Client-supplied, labelled project photographs and approved website copy.
- Discovery, onboarding and design-review discussions supplied through the project records. Private source links are not published with the website.
- Policy references: https://vosltd.co.nz/privacy-policy/ and https://vosltd.co.nz/terms/

The legal pages use fresh wording adapted for this website. Unrelated account, comment, advertising and payment clauses from the reference site were not imported.
