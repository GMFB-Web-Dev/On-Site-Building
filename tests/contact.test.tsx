import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { render } from "react-email";
import type { CreateEmailOptions } from "resend";
import { CONTACT_DEFAULTS, createContactLimiter, handleContactRequest } from "../lib/contact-handler";
import { CONTACT_LIMITS, contactAttachments, validateContact } from "../lib/contact-validation";
import { ProjectEnquiryEmail } from "../emails/project-enquiry";
import { resendSender } from "../lib/resend-delivery";

const services = ["Renovations & Alterations", "Residential New Builds"];
const now = 1_800_000_000_000;
const fixedId = "c6e502e2-f3cf-4b29-81bb-24650402e222";
function enquiry(changes: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ firstName: "Alex", lastName: "Taylor", email: "alex@example.com", phone: "+64 21 123 4567", service: services[0], size: "50 sqm", message: "We would like to discuss a kitchen renovation.\nPlease contact us about the next steps.", terms: "on", requestId: fixedId, startedAt: String(now - 5000), sourcePath: "/contact-auckland-builders", ...changes })) form.set(key, value);
  return form;
}
function request(form = enquiry(), origin = "https://onsitebuild.co.nz") {
  return new Request("https://onsitebuild.co.nz/api/contact", { method: "POST", headers: { Origin: origin, "x-forwarded-for": "127.0.0.1" }, body: form });
}
const options = () => ({ apiKey: "re_test_mock_only", services, limit: createContactLimiter(), now: () => now, send: async () => {} });

test("form sends branded notification and acknowledgement with safe addressing and attachments", async () => {
  const sent: { email: CreateEmailOptions; key: string }[] = [];
  const form = enquiry();
  form.append("files", new File(["%PDF-1.7\nFixture plans"], "kitchen-plans.pdf", { type: "application/pdf" }));
  const result = await handleContactRequest(request(form), { ...options(), send: async (email, key) => { sent.push({ email, key }); } });
  assert.equal(result.status, 200); assert.equal((await result.json()).ok, true);
  assert.equal(sent.length, 2);
  assert.equal(sent[0].email.from, CONTACT_DEFAULTS.from);
  assert.deepEqual(sent[0].email.to, [CONTACT_DEFAULTS.to]);
  assert.equal(sent[0].email.replyTo, "alex@example.com");
  assert.equal(sent[0].email.attachments?.[0].filename, "kitchen-plans.pdf");
  assert.equal(sent[1].email.to, "alex@example.com");
  assert.equal(sent[1].email.replyTo, CONTACT_DEFAULTS.to);
  assert.equal(sent[1].email.attachments, undefined);
  for (const { email } of sent) {
    assert(email.html?.includes("rgb(94,143,224)")); assert(email.html?.includes("rgb(24,58,114)"));
    assert(email.text?.includes("ON SITE BUILDING")); assert(email.text?.includes("50 sqm"));
    assert(!email.html?.includes("re_test_mock_only"));
    assert(Buffer.byteLength(email.html!) < 100 * 1024);
  }
  assert(!sent[1].email.html?.includes("Please contact us about the next steps"), "Acknowledgements must not relay an arbitrary message to another address");
});

test("validation rejects missing fields, bad addresses, header injection and unknown services", async () => {
  const cases: Record<string, string>[] = [{ email: "not-an-email" }, { email: "alex@example.com\r\nBcc: victim@example.com" }, { firstName: "Alex\r\nBcc: x" }, { phone: "123" }, { service: "unknown" }, { terms: "" }, { message: "short" }, { requestId: "random" }, { sourcePath: "//evil.example" }, { startedAt: String(now) }];
  for (const changes of cases) {
    const response = await handleContactRequest(request(enquiry(changes)), { ...options(), send: async () => assert.fail("Invalid requests must not send") });
    assert.equal(response.status, 400, JSON.stringify(changes));
  }
  assert.equal((await handleContactRequest(request(enquiry(), "https://evil.example"), options())).status, 403);
  assert.equal((await handleContactRequest(request(), { ...options(), apiKey: undefined })).status, 503);
  assert.equal((await handleContactRequest(request(), { ...options(), from: "On Site <not-an-email>" })).status, 503);
  assert.equal((await handleContactRequest(request(), { ...options(), to: "bad-recipient" })).status, 503);
});

test("honeypot submissions do not send email; retries use identical keys and email bodies", async () => {
  let sent = 0;
  assert.equal((await handleContactRequest(request(enquiry({ companyWebsite: "bot" })), { ...options(), send: async () => { sent++; } })).status, 200);
  assert.equal(sent, 0);
  const payloads: { email: CreateEmailOptions; key: string }[] = [];
  const configuration = { ...options(), send: async (email: CreateEmailOptions, key: string) => { payloads.push({ email, key }); } };
  await handleContactRequest(request(), configuration);
  await handleContactRequest(request(), configuration);
  assert.deepEqual(payloads.slice(0, 2), payloads.slice(2));
});

test("notification failure is visible; receipt failure does not lose a captured enquiry", async () => {
  const failure = await handleContactRequest(request(), { ...options(), send: async () => { throw new Error("Fixture outage"); } });
  assert.equal(failure.status, 502);
  assert(!(await failure.text()).includes("Fixture outage"));
  let count = 0;
  const warning = console.warn; console.warn = () => {};
  try {
    const result = await handleContactRequest(request(), { ...options(), send: async () => { if (++count === 2) throw new Error("Receipt outage"); } });
    assert.equal(result.status, 200); assert.equal(count, 2);
  } finally { console.warn = warning; }
});

test("bounded rate limiting counts unique submissions but permits a retry", async () => {
  const limiter = createContactLimiter();
  for (let i = 0; i < 5; i++) assert(limiter("visitor", `enquiry-${i}`, now));
  assert(limiter("visitor", "enquiry-0", now));
  assert.equal(limiter("visitor", "another-enquiry", now), false);
  assert(limiter("visitor", "another-enquiry", now + 10 * 60 * 1000));
  const result = await handleContactRequest(request(enquiry({ requestId: randomUUID() })), { ...options(), limit: () => false, send: async () => assert.fail() });
  assert.equal(result.status, 429); assert.equal(result.headers.get("retry-after"), "600");
});

test("upload limits and content signatures reject fake documents and oversized requests", async () => {
  const fake = enquiry(); fake.append("files", new File(["<script>hello</script>"], "plans.pdf", { type: "application/pdf" }));
  assert((await contactAttachments(fake)).error);
  const large = enquiry(); large.append("files", new File([new Uint8Array(CONTACT_LIMITS.fileBytes + 1)], "plans.pdf", { type: "application/pdf" }));
  assert((await contactAttachments(large)).error);
  const many = enquiry(); for (let i = 0; i < 4; i++) many.append("files", new File(["%PDF-1.7"], `plans-${i}.pdf`, { type: "application/pdf" }));
  assert((await contactAttachments(many)).error);
  const response = await handleContactRequest(new Request("https://onsitebuild.co.nz/api/contact", { method: "POST", headers: { Origin: "https://onsitebuild.co.nz", "Content-Type": "multipart/form-data; boundary=x", "Content-Length": String(CONTACT_LIMITS.bodyBytes + 1) }, body: "x" }), options());
  assert.equal(response.status, 413);
});

test("rendering escapes enquiry text and all email layout styling is inlined", async () => {
  const form = enquiry({ firstName: "<script>bad</script>", message: '<img src=x onerror="alert(1)">\nA valid-length project message.' });
  const { fields } = validateContact(form, services, now);
  const html = await render(<ProjectEnquiryEmail enquiry={fields} businessEmail={CONTACT_DEFAULTS.to} phone={CONTACT_DEFAULTS.phone} attachments={[]} />);
  assert(!html.includes("<script>")); assert(!html.includes("<img src=x"));
  assert(html.includes("&lt;script&gt;")); assert(html.includes("&lt;img"));
  assert(html.includes('lang="en-NZ"'));
  assert(!html.includes("display:flex")); assert(!html.includes("display:grid"));
  assert(!/\b\d+(?:\.\d+)?rem\b/.test(html));
});

test("Resend adapter retries transient failures with the same key, but not permanent errors", async () => {
  const originalFetch = globalThis.fetch;
  const calls: RequestInit[] = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(init!);
    return calls.length === 1 ? Response.json({ name: "internal_server_error", message: "Temporary failure" }, { status: 503 }) : Response.json({ id: "mock-email-id" });
  };
  try {
    await resendSender("re_test_mock_only")({ from: CONTACT_DEFAULTS.from, to: "recipient@example.com", subject: "Fixture", text: "A fixture email" }, "same-test-key");
    assert.equal(calls.length, 2);
    assert.equal(new Headers(calls[0].headers).get("idempotency-key"), "same-test-key");
    assert.equal(new Headers(calls[1].headers).get("idempotency-key"), "same-test-key");
    let permanentCalls = 0;
    globalThis.fetch = async () => { permanentCalls++; return Response.json({ name: "validation_error", message: "Bad fixture request" }, { status: 422 }); };
    await assert.rejects(() => resendSender("re_test_mock_only")({ from: CONTACT_DEFAULTS.from, to: "recipient@example.com", subject: "Fixture", text: "Fixture" }, "permanent-test-key"));
    assert.equal(permanentCalls, 1);
  } finally { globalThis.fetch = originalFetch; }
});
