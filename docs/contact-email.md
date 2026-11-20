# Website enquiry emails

## Required Vercel variable

Add **`RESEND_API_KEY`** to the existing `on-site-building` project's Production environment (and Preview if you want preview forms to send), then redeploy through your usual Vercel workflow. Use a Resend key with sending permission for `weblaunch.co.nz`. The key stays on the server; do not prefix it with `NEXT_PUBLIC_`, commit it, or paste it into chat.

The connected Resend account's `weblaunch.co.nz` domain was confirmed verified with sending enabled. No API key was created, no DNS records or Vercel settings were changed, and no live test emails were sent for this work.

## Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `CONTACT_FROM_EMAIL` | `On Site Building Construction <forms@weblaunch.co.nz>` | Verified sender address and company display name |
| `CONTACT_TO_EMAIL` | `onsitebuilding1@gmail.com` | Business inbox; supports up to five comma-separated addresses |
| `CONTACT_SEND_ACKNOWLEDGEMENT` | `true` | Set to `false` to disable customer acknowledgements |

An existing `CONTACT_FROM_EMAIL` override must use a domain verified in the same Resend account as the API key. Gmail is fine as a recipient or Reply-To, but cannot be used as an authenticated Resend From domain.

## Form behavior

Every existing enquiry form now posts multipart data to `/api/contact`. Names, email addresses and project messages are no longer sent in the page URL. The form validates names, email, phone, service, size, message and the agreement checkbox on the server, shows inline errors, disables duplicate submission while sending, preserves entered details after a failure, and shows a success message only after Resend accepts the business notification.

The former upload text box is a real multi-file upload: up to three PDF/PNG/JPG files, at most 2 MB per file and 3 MB total. The server bounds the entire request, checks extensions, MIME types and file signatures, and sanitizes attachment names. Files are attached to the business notification without being stored in a public bucket or echoed in the customer receipt.

Spam controls include a hidden honeypot, same-origin checks, a short minimum form completion time, and a bounded in-memory limit of five distinct submissions per visitor in ten minutes. The limiter is per running server instance, not a shared fleet-wide quota; no external datastore or additional service is provisioned. Resend idempotency keys remain stable for retries of the same enquiry. Transient sending failures get one bounded retry; permanent validation/authentication errors do not.

The business notification sets Reply-To to the visitor, so the team can reply directly. A separate acknowledgement sets Reply-To to the business inbox. An acknowledgement failure does not mark an already accepted business enquiry as failed or ask the visitor to submit it again. Acceptance by the API is not an inbox-delivery guarantee; delivery events and bounces remain visible in Resend.

## Email design

`emails/project-enquiry.tsx` renders notification and acknowledgement variants with React Email. Both use the website's blue (`#5e8fe0`), navy (`#183a72`) and pale background (`#f5f9ff`), inline pixel-based styling, semantic headings, a table layout, a mobile-friendly single column, and a plain-text version. User text is escaped. There are no remote fonts or images required to understand the email.

Generate local previews without sending anything:

```bash
npm run email:preview
```

Open `tmp/email-previews/team-notification.html` and `tmp/email-previews/customer-acknowledgement.html`. The previews use fictional enquiry details and are excluded from Git.

## Tracking and checks

`onsite_enquiry_sent` is queued in the existing GTM data layer only after the business notification is accepted. It includes only `page_path`, not names, email addresses, phone numbers, messages or attachment names. Add a matching custom event trigger in GTM if you want to count enquiries as conversions.

```bash
npm test
npm run build
npm run lint
npm run test:integration
```

Unit and production HTTP integration tests use fake credentials and a local mock Resend API. They cover addressing, attachments, validation, duplicate-safe retries, rate limiting, errors and acknowledgements without sending to real recipients. After you set the real key and deploy, submit one enquiry you control and check delivery in Resend and the target inbox.

References: [Resend API keys](https://resend.com/api-keys), [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys), [React Email](https://react.email).
