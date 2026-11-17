// Offline checks: every email provider request is mocked. No email is sent.
import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "onsite-contact-check-"));
const compiled = spawnSync(process.execPath, [
  join(root, "node_modules/typescript/bin/tsc"),
  "--outDir", output, "--module", "commonjs", "--moduleResolution", "node",
  "--target", "ES2022", "--lib", "ES2022,DOM,DOM.Iterable", "--types", "node",
  "--skipLibCheck", "--esModuleInterop", "--strict", "--noEmit", "false",
  "app/lib/contact-handler.ts", "app/lib/contact-validation.ts",
], { cwd: root, encoding: "utf8" });
if (compiled.status !== 0) {
  rmSync(output, { recursive: true, force: true });
  throw new Error(compiled.stdout + compiled.stderr);
}
after(() => rmSync(output, { recursive: true, force: true }));
const require = createRequire(import.meta.url);
const { createContactHandler } = require(join(output, "contact-handler.js"));
const { MAX_REQUEST_BYTES, MAX_ATTACHMENT_BYTES } = require(join(output, "contact-validation.js"));

const env = {
  RESEND_API_KEY: "test-placeholder-no-real-key",
  CONTACT_FROM_EMAIL: "Website Enquiries <forms@weblaunch.co.nz>",
  CONTACT_TO_EMAIL: "steven@weblaunch.co.nz",
  VERCEL_ENV: "preview",
};
const service = "RESIDENTIAL NEW BUILDS";
const validId = "7a29cf31-7f23-4bb4-aef8-dd0e3c2a554a";
const pdf = new File(["%PDF-1.7\n%%EOF\n"], "plans.pdf", { type: "application/pdf" });
const jpg = new File([new Uint8Array([255, 216, 255, 224, 255, 217])], "exterior.JPG", { type: "image/jpeg" });
const png = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, ...Array(16).fill(0)])], "photo.png", { type: "image/png" });

function fixture(extra = {}) {
  const calls = [];
  const logs = [];
  const handler = createContactHandler({
    services: [service], environment: () => env,
    fetcher: async (url, options) => { calls.push({ url, ...options }); return Response.json({ id: "mock-accepted-email-id" }); },
    logError: (...args) => logs.push(args), ...extra,
  });
  return { handler, calls, logs };
}

function request(values = {}, files = [], headers = {}) {
  const form = new FormData();
  const fields = {
    firstName: "Ana", lastName: "Smith", email: "ana@example.com", phone: "+64 21 123 4567",
    service, location: "Manurewa", size: "Not sure yet", budget: "$50,000–$100,000",
    timeframe: "Within 3 months", message: "We would like to discuss a new home.",
    consent: "on", website: "", submissionId: validId, ...values,
  };
  for (const [key, value] of Object.entries(fields)) if (value !== null) form.set(key, value);
  for (const file of files) form.append("files", file);
  return new Request("https://onsite-preview.vercel.app/api/contact", {
    method: "POST", body: form, headers: { origin: "https://onsite-preview.vercel.app", "x-forwarded-for": "192.0.2.5", ...headers },
  });
}

test("a valid enquiry is sent only to the configured internal preview address", async () => {
  const { handler, calls } = fixture();
  const result = await handler(request({ message: "Plans include <script>text</script> and & symbols." }, [pdf, jpg, png]));
  assert.equal(result.status, 200);
  assert.equal((await result.json()).ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const body = JSON.parse(calls[0].body);
  assert.deepEqual(body.to, ["steven@weblaunch.co.nz"]);
  assert.equal(body.reply_to, "ana@example.com");
  assert.equal(body.from, env.CONTACT_FROM_EMAIL);
  assert.match(body.subject, /^\[Preview\]/);
  assert.equal(body.html, undefined);
  assert.equal(body.cc, undefined);
  assert.equal(body.bcc, undefined);
  const lines = body.text.split("\n");
  assert.ok(lines.includes("Project suburb or town: Manurewa"));
  assert.ok(lines.includes("Project size: Not sure yet"));
  assert.ok(lines.includes("Estimated budget (NZD): $50,000–$100,000"));
  assert.ok(lines.includes("Preferred timeframe: Within 3 months"));
  assert.ok(lines.includes("Plans include <script>text</script> and & symbols."));
  assert.equal(body.attachments.length, 3);
  assert.equal(body.attachments[0].filename, "1-plans.pdf");
  assert.equal(Buffer.from(body.attachments[0].content, "base64").toString(), "%PDF-1.7\n%%EOF\n");
});

test("provider rejection, malformed success and timeouts never show success", async () => {
  for (const fetcher of [
    async () => Response.json({ message: "provider error" }, { status: 500 }),
    async () => Response.json({ error: "missing id" }),
    async () => { throw new Error("simulated timeout"); },
  ]) {
    const { handler, logs } = fixture({ fetcher });
    const result = await handler(request());
    assert.equal(result.status, 502);
    assert.equal((await result.json()).ok, false);
    assert.equal(logs.length, 1);
    assert.doesNotMatch(JSON.stringify(logs), /ana@example|test-placeholder|new home|Manurewa|Within 3 months/);
  }
});

test("missing config and client recipients on nonproduction fail closed", async () => {
  for (const environment of [
    () => ({ ...env, RESEND_API_KEY: undefined }),
    () => ({ ...env, CONTACT_TO_EMAIL: "onsitebuilding1@gmail.com" }),
    () => ({ ...env, VERCEL_ENV: undefined, CONTACT_TO_EMAIL: "onsitebuilding1@gmail.com" }),
    () => ({ ...env, CONTACT_FROM_EMAIL: "Sender\r\nBcc: extra@example.com" }),
  ]) {
    const { handler, calls } = fixture({ environment });
    assert.equal((await handler(request())).status, 503);
    assert.equal(calls.length, 0);
  }
});

test("production uses the explicit production recipient (mocked, no send)", async () => {
  const { handler, calls } = fixture({ environment: () => ({ ...env, VERCEL_ENV: "production", CONTACT_TO_EMAIL: "onsitebuilding1@gmail.com" }) });
  assert.equal((await handler(request())).status, 200);
  const body = JSON.parse(calls[0].body);
  assert.deepEqual(body.to, ["onsitebuilding1@gmail.com"]);
  assert.doesNotMatch(body.subject, /Preview/);
});

test("invalid fields, consent, honeypot and submission identifiers do not call the provider", async () => {
  for (const values of [
    { email: "ana@example.com\r\nBcc:other@example.com" },
    { firstName: "Ana\r\nBcc:Other" }, { phone: "abc" }, { service: "Unknown" },
    { consent: null }, { website: "spam.example" }, { submissionId: "invalid" },
    { message: "x".repeat(5001) },
  ]) {
    const { handler, calls } = fixture();
    const result = await handler(request(values));
    assert.equal(result.status, 400, JSON.stringify(values));
    assert.equal(calls.length, 0);
  }
});

test("project location is required and bounded, and optional lead fields reject unknown choices", async () => {
  const invalidFields = [
    ["location", null], ["location", ""], ["location", "   "], ["location", "x".repeat(121)],
    ["location", "Manurewa\r\nBcc:other@example.com"], ["location", "Manu\u0000rewa"],
    ["location", "Manurewa\tAuckland"], ["location", "Manurewa\n"], ["location", "Manurewa\u2028Auckland"],
    ["budget", "Any amount"], ["budget", "Under $25,000\r\nBcc:other@example.com"],
    ["timeframe", "Tomorrow"], ["timeframe", "Within 3 months\u0000"],
  ];
  for (const [field, value] of invalidFields) {
    const { handler, calls, logs } = fixture();
    const result = await handler(request({ [field]: value }));
    assert.equal(result.status, 400, JSON.stringify({ field, value }));
    const body = await result.json();
    assert.ok(body.errors[field]);
    assert.equal(calls.length, 0);
    assert.equal(logs.length, 0);
  }
});

test("budget, timeframe and message stay optional, including unknown budgets and smaller projects", async () => {
  for (const values of [
    { budget: null, timeframe: null, message: null },
    { budget: "", timeframe: "", message: "" },
    { budget: "Not sure yet", timeframe: "Flexible / Not sure yet" },
    { budget: "Under $25,000", timeframe: "Planning ahead" },
  ]) {
    const { handler, calls } = fixture();
    const result = await handler(request({ location: "  Whangārei  ", ...values }));
    assert.equal(result.status, 200);
    const lines = JSON.parse(calls[0].body).text.split("\n");
    assert.ok(lines.includes("Project suburb or town: Whangārei"));
    assert.ok(lines.includes(`Estimated budget (NZD): ${values.budget || "Not specified"}`));
    assert.ok(lines.includes(`Preferred timeframe: ${values.timeframe || "Not specified"}`));
    if (!values.message && "message" in values) assert.ok(lines.includes("No message supplied."));
  }
});

test("file type, actual signature, number, empty files and total bytes are enforced", async () => {
  const invalidFiles = [
    [new File(["not a PDF"], "plan.pdf", { type: "application/pdf" })],
    [new File(["<svg/>"], "picture.svg", { type: "image/svg+xml" })],
    [new File([], "empty.pdf", { type: "application/pdf" })],
    [pdf, pdf, pdf, pdf],
    [new File([new Uint8Array(MAX_ATTACHMENT_BYTES + 1)], "large.pdf", { type: "application/pdf" })],
  ];
  for (const files of invalidFiles) {
    const { handler, calls } = fixture();
    const result = await handler(request({}, files));
    assert.equal(result.status, 400);
    assert.equal((await result.json()).ok, false);
    assert.equal(calls.length, 0);
  }
});

test("oversized request streams are stopped even without Content-Length", async () => {
  const { handler, calls } = fixture();
  const result = await handler(new Request("https://onsite-preview.vercel.app/api/contact", {
    method: "POST", body: new Uint8Array(MAX_REQUEST_BYTES + 1),
    headers: { "content-type": "multipart/form-data; boundary=test" },
  }));
  assert.equal(result.status, 413);
  assert.equal(calls.length, 0);
});

test("cross-origin submissions and unsupported methods are rejected", async () => {
  const { handler, calls } = fixture();
  assert.equal((await handler(request({}, [], { origin: "https://other.example" }))).status, 403);
  assert.equal((await handler(request({}, [], { "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await handler(new Request("https://onsite-preview.vercel.app/api/contact"))).status, 405);
  assert.equal(calls.length, 0);
});

test("retry idempotency is stable but edited content uses a new key", async () => {
  const { handler, calls } = fixture();
  assert.equal((await handler(request({}, [pdf]))).status, 200);
  assert.equal((await handler(request({}, [pdf]))).status, 200);
  assert.equal((await handler(request({ message: "An amended enquiry." }, [pdf]))).status, 200);
  assert.equal(calls[0].headers["Idempotency-Key"], calls[1].headers["Idempotency-Key"]);
  assert.notEqual(calls[1].headers["Idempotency-Key"], calls[2].headers["Idempotency-Key"]);
});

test("per-instance abuse limit rejects excess requests and expires", async () => {
  let now = 0;
  const { handler, calls } = fixture({ now: () => now });
  for (let index = 0; index < 8; index++) {
    assert.equal((await handler(request({ email: `visitor${index}@example.com` }))).status, 200);
  }
  const blocked = await handler(request({ email: "another@example.com" }));
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  assert.equal(calls.length, 8);
  now = 600_001;
  assert.equal((await handler(request())).status, 200);
});
