import { createHash } from "node:crypto";
import {
  getAttachments, isEmail, MAX_REQUEST_BYTES, validateAttachmentMetadata, validateContactFields,
} from "./contact-validation";

type ContactEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  VERCEL_ENV?: string;
};

type HandlerOptions = {
  services: readonly string[];
  environment?: () => ContactEnvironment;
  fetcher?: typeof fetch;
  now?: () => number;
  logError?: (message: string, details?: Record<string, string | number>) => void;
};

class RequestTooLarge extends Error {}

const hash = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
const failureMessage = "We couldn't submit your enquiry. Please try again, or contact us by phone or email.";
const response = (body: object, status = 200, headers?: HeadersInit) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
});

async function readBoundedForm(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) throw new RequestTooLarge();
  if (!request.body) throw new Error("Empty request");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new RequestTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Request(request.url, {
    method: "POST", body, headers: { "content-type": request.headers.get("content-type") || "" },
  }).formData();
}

function hasExpectedSignature(file: File, bytes: Buffer) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return bytes.length >= 8 && bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  if (extension === "jpg" || extension === "jpeg") return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (extension === "png") return bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return false;
}

function safeFilename(filename: string, index: number) {
  const name = (filename.split(/[\\/]/).pop() || "attachment").replace(/[^A-Za-z0-9._ -]/g, "_");
  const dot = name.lastIndexOf(".");
  return `${index + 1}-${name.slice(0, dot).slice(0, 100)}${name.slice(dot).toLowerCase()}`;
}

function isSafeSender(value: string) {
  if (/[\r\n\u0000-\u001f\u007f]/.test(value)) return false;
  const match = value.match(/^[^<>]+<([^<>]+)>$/);
  return isEmail(match ? match[1] : value);
}

export function createContactHandler(options: HandlerOptions) {
  const environment = options.environment || (() => process.env);
  const fetcher = options.fetcher || fetch;
  const now = options.now || Date.now;
  const logError = options.logError || console.error;
  // A bounded, per-instance abuse brake. Serverless instances do not share this
  // state; use a platform firewall limit if sustained or distributed abuse occurs.
  const attempts = new Map<string, { count: number; expires: number }>();
  const windowMs = 10 * 60 * 1000;
  const takeAttempt = (key: string, limit: number) => {
    const time = now();
    for (const [savedKey, value] of attempts) if (value.expires <= time) attempts.delete(savedKey);
    const current = attempts.get(key);
    if (current && current.count >= limit) return Math.max(1, Math.ceil((current.expires - time) / 1000));
    if (current) current.count += 1;
    else {
      if (attempts.size >= 2000) return 60;
      attempts.set(key, { count: 1, expires: time + windowMs });
    }
    return 0;
  };

  return async function handleContact(request: Request): Promise<Response> {
    if (request.method !== "POST") return response({ ok: false, message: "Please submit the enquiry form." }, 405, { Allow: "POST" });
    const origin = request.headers.get("origin");
    if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
      return response({ ok: false, message: failureMessage }, 403);
    }
    if (!/^multipart\/form-data\s*;/i.test(request.headers.get("content-type") || "")) {
      return response({ ok: false, message: "Please submit the enquiry form with any attachments." }, 415);
    }
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipWait = takeAttempt(`ip:${hash(ip)}`, 8);
    if (ipWait) return response({ ok: false, message: "Please wait a few minutes before trying again, or contact us by phone or email." }, 429, { "Retry-After": String(ipWait) });

    let form: FormData;
    try {
      form = await readBoundedForm(request);
    } catch (error) {
      return error instanceof RequestTooLarge
        ? response({ ok: false, message: "Please keep your attachments under 3 MB combined.", errors: { files: "Please keep your attachments under 3 MB combined." } }, 413)
        : response({ ok: false, message: "We couldn't read the form. Please try again." }, 400);
    }
    if (form.getAll("website").some(value => typeof value !== "string" || value.trim())) {
      return response({ ok: false, message: failureMessage }, 400);
    }
    const submissionId = form.get("submissionId");
    if (form.getAll("submissionId").length !== 1 || typeof submissionId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submissionId)) {
      return response({ ok: false, message: "Please refresh this page and try again." }, 400);
    }
    const { fields, errors } = validateContactFields(form, options.services);
    const files = getAttachments(form);
    const attachmentError = validateAttachmentMetadata(files);
    if (attachmentError || form.getAll("files").some(value => typeof value === "string" && value !== "")) errors.files = attachmentError || "Please choose files using the upload field.";
    if (Object.keys(errors).length) return response({ ok: false, message: "Please check the highlighted fields.", errors }, 400);
    const emailWait = takeAttempt(`email:${hash(fields.email.toLowerCase())}`, 5);
    if (emailWait) return response({ ok: false, message: "Please wait a few minutes before sending another enquiry, or contact us directly." }, 429, { "Retry-After": String(emailWait) });

    const env = environment();
    const from = env.CONTACT_FROM_EMAIL?.trim() || "";
    const to = env.CONTACT_TO_EMAIL?.trim() || "";
    const production = env.VERCEL_ENV === "production";
    if (!env.RESEND_API_KEY || !isSafeSender(from) || !isEmail(to) || (!production && to.toLowerCase() !== "steven@weblaunch.co.nz")) {
      logError("Contact email configuration is missing or invalid; delivery was not attempted.");
      return response({ ok: false, message: "The enquiry form is temporarily unavailable. Please contact us by phone or email." }, 503);
    }

    const attachments: { filename: string; content: string }[] = [];
    for (const [index, file] of files.entries()) {
      const bytes = Buffer.from(await file.arrayBuffer());
      if (!hasExpectedSignature(file, bytes)) {
        return response({ ok: false, message: "One of your files isn't a valid PDF, JPG or PNG. Please choose another file.", errors: { files: "Please upload valid PDF, JPG or PNG files." } }, 400);
      }
      attachments.push({ filename: safeFilename(file.name, index), content: bytes.toString("base64") });
    }
    const payload = {
      from, to: [to], reply_to: fields.email,
      subject: `${production ? "" : "[Preview] "}Website enquiry: ${fields.service} — ${fields.firstName} ${fields.lastName}`,
      text: [
        production ? "New On Site Building Construction website enquiry" : "PREVIEW TEST — On Site Building Construction website enquiry",
        "", `Name: ${fields.firstName} ${fields.lastName}`, `Email: ${fields.email}`,
        `Phone: ${fields.phone}`, `Service: ${fields.service}`, `Project suburb or town: ${fields.location}`,
        `Project size: ${fields.size || "Not specified"}`, `Estimated budget (NZD): ${fields.budget || "Not specified"}`,
        `Preferred timeframe: ${fields.timeframe || "Not specified"}`,
        "", "Message:", fields.message || "No message supplied.", "",
        `Attachments: ${attachments.length ? attachments.map(file => file.filename).join(", ") : "None"}`,
        "The visitor agreed that their details may be used to respond to this enquiry.",
      ].join("\n"),
      ...(attachments.length ? { attachments } : {}),
    };
    const body = JSON.stringify(payload);
    // Includes content so an edited enquiry gets a new key; unedited retries
    // reuse the same provider key even if the first response was interrupted.
    const idempotencyKey = `onsite-${submissionId}-${hash(body)}`;
    try {
      const sent = await fetcher("https://api.resend.com/emails", {
        method: "POST", headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey,
        }, body, signal: AbortSignal.timeout(15_000),
      });
      const result: unknown = await sent.json().catch(() => null);
      if (!sent.ok || !result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !result.id) {
        logError("Contact email provider did not accept the enquiry.", { status: sent.status });
        return response({ ok: false, message: failureMessage }, 502);
      }
      return response({ ok: true, message: "Thank you. Your enquiry has been submitted and we'll be in touch soon." });
    } catch {
      logError("Contact email request failed or timed out.");
      return response({ ok: false, message: "We couldn't confirm your enquiry was submitted. Please try again, or contact us by phone or email." }, 502);
    }
  };
}
