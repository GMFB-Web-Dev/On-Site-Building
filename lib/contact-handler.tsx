import { createHash } from "node:crypto";
import { render, toPlainText } from "react-email";
import type { CreateEmailOptions } from "resend";
import { ProjectEnquiryEmail } from "../emails/project-enquiry";
import { CONTACT_LIMITS, contactAttachments, validateContact, validEmail } from "./contact-validation";

export const CONTACT_DEFAULTS = {
  from: "On Site Building Construction <forms@weblaunch.co.nz>",
  to: "onsitebuilding1@gmail.com",
  phone: "021 715 196",
} as const;

export function createContactLimiter() {
  const visitors = new Map<string, { expires: number; submissions: Set<string> }>();
  return (visitor: string, submission: string, now: number) => {
    for (const [key, value] of visitors) if (value.expires <= now) visitors.delete(key);
    let window = visitors.get(visitor);
    if (!window) {
      if (visitors.size >= 1000) visitors.delete(visitors.keys().next().value!);
      window = { expires: now + 10 * 60 * 1000, submissions: new Set() };
      visitors.set(visitor, window);
    }
    if (window.submissions.has(submission)) return true;
    if (window.submissions.size >= 5) return false;
    window.submissions.add(submission);
    return true;
  };
}

type Options = {
  apiKey?: string; from?: string; to?: string; services: readonly string[];
  send: (email: CreateEmailOptions, idempotencyKey: string) => Promise<void>;
  limit: ReturnType<typeof createContactLimiter>;
  now?: () => number;
  acknowledgement?: boolean;
};
const json = (body: object, status = 200, extra: HeadersInit = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });

export async function handleContactRequest(request: Request, options: Options) {
  const now = options.now?.() ?? Date.now();
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProtocol === "https" || forwardedProtocol === "http" ? `${forwardedProtocol}:` : requestUrl.protocol;
  const host = request.headers.get("x-forwarded-host")?.split(",")[0].trim() || request.headers.get("host") || requestUrl.host;
  // Next's internal URL can use localhost behind a proxy; compare the public host.
  const publicOrigin = `${protocol}//${host}`;
  if (!origin || ![publicOrigin, "https://onsitebuild.co.nz"].includes(origin)) return json({ error: "Please submit the form from this website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) return json({ error: "Please submit the enquiry form with its files." }, 415);
  if (Number(request.headers.get("content-length")) > CONTACT_LIMITS.bodyBytes) return json({ error: "The files are too large. Please keep all uploads under 3 MB." }, 413);
  if (!options.apiKey?.trim()) return json({ error: "Our enquiry form is temporarily unavailable. Please call 021 715 196 or email onsitebuilding1@gmail.com." }, 503);
  const from = options.from?.trim() || CONTACT_DEFAULTS.from;
  const fromAddress = from.match(/<([^<>]+)>$/)?.[1] ?? from;
  const recipients = (options.to?.trim() || CONTACT_DEFAULTS.to).split(",").map(value => value.trim());
  if (/[\r\n]/.test(from) || !validEmail(fromAddress) || !recipients.length || recipients.length > 5 || recipients.some(email => !validEmail(email))) return json({ error: "Our enquiry form is temporarily unavailable. Please contact our team directly." }, 503);

  let form: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "The enquiry form is empty." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > CONTACT_LIMITS.bodyBytes) { await reader.cancel(); return json({ error: "The files are too large. Please keep all uploads under 3 MB." }, 413); }
      chunks.push(value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    form = await new Response(body, { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
  } catch { return json({ error: "We couldn’t read the form. Please try again." }, 400); }

  const validation = validateContact(form, options.services, now);
  if (validation.honeypot) return json({ ok: true });
  if (!validation.valid) return json({ error: "Please check the highlighted fields and try again.", fields: validation.errors }, 400);
  const { attachments, error: fileError } = await contactAttachments(form);
  if (fileError) return json({ error: fileError, fields: { files: fileError } }, 400);
  const { fields } = validation;
  // The key remains stable across retries, including when the first response is lost.
  const content = createHash("sha256").update(JSON.stringify({ ...fields, startedAt: undefined }));
  for (const attachment of attachments) content.update(attachment.filename).update(attachment.content);
  const fingerprint = content.digest("hex");
  const address = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const visitor = createHash("sha256").update(options.apiKey).update(address).digest("hex");
  if (!options.limit(visitor, fingerprint, now)) return json({ error: "You’ve sent several enquiries recently. Please try again in 10 minutes or call our team." }, 429, { "Retry-After": "600" });

  const props = { enquiry: fields, businessEmail: recipients[0], phone: CONTACT_DEFAULTS.phone, attachments: attachments.map(file => file.filename) };
  try {
    const html = await render(<ProjectEnquiryEmail {...props} />);
    await options.send({ from, to: recipients, replyTo: fields.email, subject: `New website enquiry: ${fields.service}`, html, text: toPlainText(html), attachments,
      tags: [{ name: "source", value: "website-enquiry" }, { name: "kind", value: "notification" }],
    }, `onsite-enquiry-${fingerprint}`);
  } catch {
    return json({ error: "Your enquiry couldn’t be sent just now. Your details are still here—please try again or call 021 715 196." }, 502);
  }
  if (options.acknowledgement !== false) {
    try {
      const html = await render(<ProjectEnquiryEmail {...props} acknowledgement />);
      await options.send({ from, to: fields.email, replyTo: recipients[0], subject: "We’ve received your enquiry | On Site Building Construction", html, text: toPlainText(html),
        tags: [{ name: "source", value: "website-enquiry" }, { name: "kind", value: "acknowledgement" }],
      }, `onsite-receipt-${fingerprint}`);
    } catch {
      // The enquiry reached the business. A failed courtesy receipt must not tell
      // the customer to resubmit an already accepted enquiry or lose the lead.
      console.warn("contact_acknowledgement_failed");
    }
  }
  return json({ ok: true });
}
