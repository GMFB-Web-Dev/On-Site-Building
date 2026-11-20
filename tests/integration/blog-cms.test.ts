import test from "node:test";
import assert from "node:assert/strict";
import https from "node:https";
import net from "node:net";
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import type { BlogPost } from "../../lib/payload-client";

async function freePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = (server.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => server.close(() => resolve()));
  return port;
}

test("production HTTP routes stay fresh across publication, edits, slug changes, deletion and CMS errors", { timeout: 90_000 }, async () => {
  const temporary = mkdtempSync(join(tmpdir(), "onsite-cms-test-"));
  writeFileSync(join(temporary, "openssl.cnf"), "[req]\ndistinguished_name=dn\nx509_extensions=ext\nprompt=no\n[dn]\nCN=localhost\n[ext]\nsubjectAltName=DNS:localhost,IP:127.0.0.1\nbasicConstraints=critical,CA:TRUE\nkeyUsage=critical,digitalSignature,keyCertSign,keyEncipherment\n");
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-config", join(temporary, "openssl.cnf"), "-keyout", join(temporary, "key.pem"), "-out", join(temporary, "cert.pem")], { stdio: "ignore" });
  const posts: BlogPost[] = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1, tenant: 7, _status: "published", slug: `fixture-article-${i + 1}`, path: `/blogs/fixture-article-${i + 1}`,
    title: `Complete fixture article ${i + 1}`, excerpt: "CMS excerpt", template: "article",
    body: { root: { type: "root", children: [{ type: "heading", tag: "h2", children: [{ type: "text", text: "First CMS section" }] }, { type: "paragraph", children: [{ type: "text", text: "Complete content supplied by the mock CMS." }] }] } },
    seo: { title: `CMS title ${i + 1}`, description: "CMS SEO description" },
  }));
  let unavailable = false;
  let unsafeQuery = false;
  const cms = https.createServer({ key: readFileSync(join(temporary, "key.pem")), cert: readFileSync(join(temporary, "cert.pem")) }, (request, response) => {
    const url = new URL(request.url!, "https://localhost");
    if (url.pathname !== "/api/blog-posts") { response.writeHead(404).end(); return; }
    if (url.searchParams.get("where[tenant][equals]") !== "7" || url.searchParams.get("where[_status][equals]") !== "published" || request.headers.authorization) unsafeQuery = true;
    if (unavailable) { response.writeHead(503).end("Fixture outage"); return; }
    const slug = url.searchParams.get("where[slug][equals]");
    const excluded = url.searchParams.get("where[slug][not_equals]");
    const published = posts.filter(post => post._status === "published" && String(post.tenant) === "7" && (!slug || slug === post.slug) && post.slug !== excluded);
    const page = Number(url.searchParams.get("page"));
    const limit = Number(url.searchParams.get("limit"));
    const totalPages = Math.max(1, Math.ceil(published.length / limit));
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ docs: published.slice((page - 1) * limit, page * limit), page, totalPages, totalDocs: published.length, hasNextPage: page < totalPages }));
  });
  cms.listen(0, "127.0.0.1");
  await once(cms, "listening");
  const cmsPort = (cms.address() as net.AddressInfo).port;
  const port = await freePort();
  const secret = "fixture-secret-not-for-production";
  const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: { ...process.env, NODE_ENV: "production", NODE_EXTRA_CA_CERTS: join(temporary, "cert.pem"), PAYLOAD_CMS_URL: `https://127.0.0.1:${cmsPort}`, PAYLOAD_TENANT_ID: "7", PAYLOAD_TENANT_SLUG: "onsite-build", REVALIDATION_SECRET: secret },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  app.stdout.on("data", chunk => { logs = (logs + chunk).slice(-5000); });
  app.stderr.on("data", chunk => { logs = (logs + chunk).slice(-5000); });
  const base = `http://127.0.0.1:${port}`;
  const get = async (path: string) => {
    const response = await fetch(base + path, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "manual" });
    return { status: response.status, html: await response.text(), headers: response.headers };
  };
  const webhook = (token?: string, changes = {}) => fetch(`${base}/api/revalidate/payload`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { "x-revalidation-secret": token } : {}) }, body: JSON.stringify({ tenantSlug: "onsite-build", collection: "blog-posts", operation: "update", pageSlug: posts[0]?.slug, publicationStatus: "published", ...changes }) });
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { ready = (await fetch(base)).ok; } catch { /* wait for server startup */ }
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert(ready, logs);
    const index = await get("/building-advice-auckland");
    assert.equal(index.status, 200, logs);
    assert(index.html.includes("fixture-article-24"));
    assert(!index.html.includes("fixture-article-27"));
    assert(index.html.includes("?page=2"));
    const secondPage = await get("/building-advice-auckland?page=2");
    assert.equal(secondPage.status, 200);
    assert(secondPage.html.includes("fixture-article-27"));
    assert.equal((await get("/building-advice-auckland?page=3")).status, 404);
    const article = await get(posts[0].path);
    assert.equal(article.status, 200);
    assert(article.html.includes("CMS title 1"));
    assert(article.html.includes("Complete content supplied by the mock CMS."));
    assert(article.html.includes('href="/blogs/fixture-article-2"'));
    assert(!article.html.includes('class="blog-card" href="/blogs/fixture-article-1"'));
    assert(article.html.includes("1 min read"));
    assert(!article.html.includes("20 November"));
    assert.equal((await get("/blogs/unknown-fixture")).status, 404);
    assert.equal((await get("/blogs")).headers.get("location"), "/building-advice-auckland");
    assert.equal((await get("/blogs/renovate-or-rebuild")).headers.get("location"), "/blogs/renovate-or-rebuild-auckland");
    assert.equal((await get("/sitemap.xml")).html.includes("fixture-article-27"), true);
    assert.equal((await webhook()).status, 401);
    assert.equal((await webhook("wrong")).status, 401);
    assert.equal((await webhook(secret, { tenantSlug: "other" })).status, 403);
    assert.equal((await webhook(secret)).status, 200);
    assert.equal((await webhook(secret, { collection: "media", pageSlug: null, operation: "delete" })).status, 200);
    posts[0].title = "An edit visible without a webhook";
    assert((await get(posts[0].path)).html.includes(posts[0].title));
    posts[0]._status = "draft" as BlogPost["_status"];
    assert.equal((await get(posts[0].path)).status, 404);
    assert(!(await get("/building-advice-auckland")).html.includes(posts[0].title));
    posts[0]._status = "published";
    const oldPath = posts[0].path;
    posts[0].slug = "a-new-slug-after-publication"; posts[0].path = `/blogs/${posts[0].slug}`;
    assert.equal((await get(oldPath)).status, 404);
    assert.equal((await get(posts[0].path)).status, 200);
    const deleted = posts.shift()!;
    assert.equal((await get(deleted.path)).status, 404);
    assert(!(await get("/sitemap.xml")).html.includes(deleted.slug));
    unavailable = true;
    const failure = await get(posts[0].path);
    assert.equal(failure.status, 500);
    assert(!failure.html.includes("Complete content supplied by the mock CMS."));
    assert.equal((await get("/building-advice-auckland")).status, 500);
    assert.equal((await get("/services-auckland")).status, 200);
    assert.equal(unsafeQuery, false, "Every CMS request must filter tenant and status without credentials");
  } finally {
    app.kill("SIGTERM");
    await once(app, "exit");
    await new Promise<void>(resolve => cms.close(() => resolve()));
    rmSync(temporary, { recursive: true, force: true });
  }
});
