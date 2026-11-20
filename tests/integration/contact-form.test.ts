import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { masterContent } from "../../app/master-content";

async function freePort() {
  const socket = net.createServer(); socket.listen(0, "127.0.0.1"); await once(socket, "listening");
  const port = (socket.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => socket.close(() => resolve())); return port;
}

test("production form route sends through the mocked Resend API without emailing real recipients", { timeout: 60_000 }, async () => {
  const emails: { body: Record<string, unknown>; key: string | undefined }[] = [];
  let fail = false;
  const provider = http.createServer(async (request, response) => {
    assert.equal(request.url, "/emails");
    assert.equal(request.headers.authorization, "Bearer re_contact_fixture_only");
    const chunks: Buffer[] = []; for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const body = JSON.parse(Buffer.concat(chunks).toString());
    if (fail) { response.writeHead(422, { "Content-Type": "application/json" }).end(JSON.stringify({ name: "validation_error", statusCode: 422, message: "Fixture failure" })); return; }
    emails.push({ body, key: request.headers["idempotency-key"] as string });
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ id: `mock-email-${emails.length}` }));
  });
  provider.listen(0, "127.0.0.1"); await once(provider, "listening");
  const providerPort = (provider.address() as net.AddressInfo).port;
  const port = await freePort(); const base = `http://127.0.0.1:${port}`;
  const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, NODE_ENV: "production", RESEND_API_KEY: "re_contact_fixture_only", RESEND_BASE_URL: `http://127.0.0.1:${providerPort}`, CONTACT_TO_EMAIL: "team@example.com", CONTACT_FROM_EMAIL: "On Site <forms@weblaunch.co.nz>", CONTACT_SEND_ACKNOWLEDGEMENT: "true" }, stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = ""; app.stdout.on("data", chunk => { logs = (logs + chunk).slice(-3000); }); app.stderr.on("data", chunk => { logs = (logs + chunk).slice(-3000); });
  const form = (changes: Record<string, string> = {}) => {
    const data = new FormData();
    for (const [key, value] of Object.entries({ firstName: "Alex", lastName: "Taylor", email: "customer@example.com", phone: "021 123 4567", service: masterContent.services.labels.renovations, size: "50 sqm", message: "We would like help renovating our home.", terms: "on", startedAt: String(Date.now() - 5000), requestId: randomUUID(), sourcePath: "/contact-auckland-builders", ...changes })) data.set(key, value);
    return data;
  };
  const send = (data: FormData, origin = base) => fetch(`${base}/api/contact`, { method: "POST", headers: { Origin: origin }, body: data });
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) { try { ready = (await fetch(base)).ok; } catch {} if (ready) break; await new Promise(resolve => setTimeout(resolve, 100)); }
    assert(ready, logs);
    const html = await (await fetch(`${base}/contact-auckland-builders`)).text();
    assert(html.includes('action="/api/contact"')); assert(html.includes('type="file"')); assert(!html.includes("re_contact_fixture_only"));
    assert.equal((await fetch(`${base}/api/contact`)).status, 405);
    assert.equal((await send(form(), "https://evil.example")).status, 403);
    assert.equal((await send(form({ email: "invalid" }))).status, 400);
    assert.equal(emails.length, 0);
    const valid = form(); valid.append("files", new File(["%PDF-1.7\nFixture only"], "project-plans.pdf", { type: "application/pdf" }));
    const result = await send(valid); assert.equal(result.status, 200, await result.text());
    assert.equal(emails.length, 2);
    assert.deepEqual(emails[0].body.to, ["team@example.com"]);
    assert.equal(emails[0].body.reply_to, "customer@example.com");
    assert.equal(emails[1].body.reply_to, "team@example.com");
    assert.equal(emails[1].body.to, "customer@example.com");
    const attachments = emails[0].body.attachments as { filename: string; content: string }[];
    assert.equal(attachments[0].filename, "project-plans.pdf");
    assert.equal(Buffer.from(attachments[0].content, "base64").subarray(0, 5).toString(), "%PDF-");
    assert.equal(typeof emails[0].body.html, "string"); assert.equal(typeof emails[0].body.text, "string");
    assert(emails[0].key?.startsWith("onsite-enquiry-")); assert(emails[1].key?.startsWith("onsite-receipt-"));
    const badFile = form(); badFile.append("files", new File(["not a PDF"], "fake.pdf", { type: "application/pdf" }));
    assert.equal((await send(badFile)).status, 400);
    assert.equal((await send(form({ companyWebsite: "spam" }))).status, 200); assert.equal(emails.length, 2);
    fail = true;
    assert.equal((await send(form())).status, 502); assert.equal(emails.length, 2);
  } finally {
    app.kill("SIGTERM"); await once(app, "exit"); await new Promise<void>(resolve => provider.close(() => resolve()));
  }
});
