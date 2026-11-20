import test from "node:test";
import assert from "node:assert/strict";
import { createPayloadClient, mediaImage, type BlogPost } from "../lib/payload-client";
import { handlePayloadWebhook } from "../lib/payload-webhook";
import { blogDocument, safeHref } from "../lib/blog-content";
import { blogMetadata } from "../lib/blog-seo";

const env = { PAYLOAD_CMS_URL: "https://payload.gmfb.co.nz", PAYLOAD_TENANT_ID: "7", PAYLOAD_TENANT_SLUG: "onsite-build" };
const post: BlogPost = { id: 1, title: "A newly published article", slug: "a-new-article", path: "/blogs/a-new-article", tenant: { id: 7, slug: "onsite-build" }, _status: "published", body: { root: { type: "root", children: [{ type: "heading", tag: "h2", children: [{ type: "text", text: "Plan ahead" }] }, { type: "paragraph", children: [{ type: "text", text: "Your complete article." }] }] } } };
const page = (docs: unknown[], options = {}) => Response.json({ docs, page: 1, totalDocs: docs.length, totalPages: 1, hasNextPage: false, ...options });

test("public reads always encode tenant 7, published status and no-store; arbitrary slugs resolve", async () => {
  const client = createPayloadClient(env, async (input, options) => {
    const url = new URL(String(input));
    assert.equal(url.origin, env.PAYLOAD_CMS_URL);
    assert.equal(url.searchParams.get("where[tenant][equals]"), "7");
    assert.equal(url.searchParams.get("where[_status][equals]"), "published");
    assert.equal(url.searchParams.get("where[slug][equals]"), post.slug);
    assert.equal(options?.cache, "no-store");
    assert.equal(new Headers(options?.headers).has("authorization"), false);
    return page([post]);
  });
  assert.deepEqual(await client.post(post.slug), post);
});

test("drafts, foreign tenants, tenant slug mismatches, foreign slugs and paths fail closed", async () => {
  const invalid = [{ ...post, tenant: 8 }, { ...post, tenant: { id: 7, slug: "someone-else" } }, { ...post, _status: "draft" }, { ...post, path: "https://evil.example" }];
  const client = createPayloadClient(env, async () => page(invalid));
  assert.equal(await client.post(post.slug), null);
  assert.deepEqual((await client.list()).docs, []);
  const otherSlug = createPayloadClient(env, async () => page([{ ...post, slug: "different-post", path: "/blogs/different-post" }]));
  assert.equal(await otherSlug.post(post.slug), null);
});

test("unsafe slug input never triggers a CMS query", async () => {
  const client = createPayloadClient(env, async () => { throw new Error("Unexpected query"); });
  for (const input of ["../secret", "hello&where[tenant][equals]=8", "hello/world", "", "slug?x=1", "a".repeat(201)]) assert.equal(await client.post(input), null);
});

test("pagination traverses every page, deduplicates, and excludes the current related post", async () => {
  const urls: URL[] = [];
  const second = { ...post, id: 2, slug: "another-article", path: "/blogs/another-article" };
  const client = createPayloadClient(env, async input => {
    const url = new URL(String(input)); urls.push(url);
    const current = Number(url.searchParams.get("page"));
    return page(current === 1 ? [post] : [post, second], { page: current, totalDocs: 2, totalPages: 2, hasNextPage: current === 1 });
  });
  assert.deepEqual((await client.all()).map(post => post.slug), [post.slug, second.slug]);
  const related = await client.list({ exclude: post.slug, page: 2, limit: 4 });
  assert.deepEqual(related.docs, [second]);
  assert.equal(urls.at(-1)?.searchParams.get("where[slug][not_equals]"), post.slug);
});

test("HTTP, network, JSON and pagination failures never return old article data", async () => {
  for (const response of [new Response("down", { status: 503 }), new Response("not JSON"), Response.json({ docs: [] }), page([post], { hasNextPage: true })]) {
    const client = createPayloadClient(env, async () => response);
    await assert.rejects(() => client.all(), /Payload CMS/);
  }
  await assert.rejects(() => createPayloadClient(env, async () => { throw new Error("offline"); }).post(post.slug), /temporarily unavailable/);
  assert.throws(() => createPayloadClient({ ...env, PAYLOAD_TENANT_ID: "8" }), /must be 7/);
  assert.throws(() => createPayloadClient({ ...env, PAYLOAD_TENANT_SLUG: "other" }), /onsite-build/);
  assert.throws(() => createPayloadClient({ ...env, PAYLOAD_CMS_URL: "https://user:password@payload.gmfb.co.nz" }), /HTTPS origin/);
});

test("media uses populated size, alt text and exact allowed host/path", () => {
  const image = { tenant: 7, url: "https://media.gmfb.co.nz/media/full.webp", alt: "Media description", sizes: { card: { url: "https://media.gmfb.co.nz/media/card.webp", width: 768, height: 512 } } };
  assert.deepEqual(mediaImage({ ...post, featuredImage: image }, "card"), { url: image.sizes.card.url, alt: image.alt, width: 768, height: 512 });
  assert.equal(mediaImage({ ...post, featuredImage: { ...image, tenant: 8 } }, "card"), null);
  assert.equal(mediaImage({ ...post, featuredImage: { url: "https://evil.example/media/x" } }, "hero"), null);
  assert.equal(mediaImage({ ...post, featuredImage: { url: "https://media.gmfb.co.nz/private/x" } }, "hero"), null);
  assert.equal(mediaImage({ ...post, featuredImage: 3 }, "hero"), null);
  assert.equal(new URL(mediaImage({ ...post, featuredImage: { ...image, updatedAt: "2026-11-20T00:00:00Z" } }, "card")!.url).searchParams.get("v"), "2026-11-20T00:00:00Z");
});

test("guide/case-study fields, repeated headings, reading time and safe links", () => {
  const document = blogDocument({ ...post, template: "guide", tools: "A drill", steps: [{ title: "Plan ahead", body: { root: { type: "root", children: [{ type: "paragraph", children: [{ type: "text", text: "word ".repeat(401) }] }] } } }] });
  assert.equal(document.headings.length, 3);
  assert.equal(new Set(document.headings.map(h => h.id)).size, 3);
  assert.equal(document.readingMinutes, 3);
  const study = blogDocument({ ...post, template: "case-study", caseStudy: { challenge: "A difficult site", solution: "Careful planning", results: "A completed home" } });
  assert.deepEqual(study.headings.slice(-3).map(h => h.title), ["Challenge", "Solution", "Results"]);
  for (const href of ["javascript:alert(1)", "data:text/html,hi", "//evil.example", "/\\evil.example", "java\nscript:alert(1)"]) assert.equal(safeHref(href), undefined);
  assert.equal(safeHref("/contact"), "/contact-auckland-builders");
  assert.equal(safeHref("https://example.com/path"), "https://example.com/path");
  assert.equal(blogMetadata({ ...post, seo: { title: "CMS SEO title", description: "CMS description" } }).alternates?.canonical, "https://onsitebuild.co.nz/blogs/a-new-article");
});

const secret = "test-only-revalidation-secret";
const notification = { tenantSlug: "onsite-build", collection: "blog-posts", operation: "update", pageSlug: post.slug, pagePath: post.path, publicationStatus: "published" };
function request(body: unknown = notification, token: string | null = secret) {
  return new Request("https://onsitebuild.co.nz/api/revalidate/payload", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { "x-revalidation-secret": token } : {}) }, body: typeof body === "string" ? body : JSON.stringify(body) });
}

test("unsigned/wrong signatures never invalidate; missing configuration fails closed", async () => {
  for (const token of [null, "wrong-secret", "x"]) {
    const invalidated: unknown[] = [];
    assert.equal((await handlePayloadWebhook(request(notification, token), secret, (...args) => invalidated.push(args))).status, 401);
    assert.equal(invalidated.length, 0);
  }
  assert.equal((await handlePayloadWebhook(request(), undefined, () => assert.fail())).status, 503);
});

test("signed create/update/delete, draft transitions and media edits invalidate only blog paths", async () => {
  for (const operation of ["create", "update", "delete"]) for (const publicationStatus of ["published", "draft", null]) {
    const invalidated: [string, ("page" | "layout")?][] = [];
    const result = await handlePayloadWebhook(request({ ...notification, operation, publicationStatus }), secret, (...args) => invalidated.push(args));
    assert.equal(result.status, 200);
    assert(invalidated.some(([path, type]) => path === "/blogs/[slug]" && type === "page"));
    assert(invalidated.some(([path]) => path === "/building-advice-auckland"));
    assert(invalidated.some(([path]) => path === "/sitemap.xml"));
    assert(!invalidated.some(([path]) => path === "/"));
  }
  assert.equal((await handlePayloadWebhook(request({ tenantSlug: "onsite-build", collection: "media", operation: "delete", pageSlug: null, pagePath: null }), secret, () => {})).status, 200);
});

test("signed but malformed/foreign/unrelated notifications cannot invalidate arbitrary paths", async () => {
  for (const [body, expected] of [
    [{ ...notification, tenantSlug: "other" }, 403], [{ ...notification, collection: "users" }, 400],
    [{ ...notification, operation: "execute" }, 400], [{ ...notification, pagePath: "/" }, 400],
    [{ ...notification, pageSlug: "../../" }, 400], [{ ...notification, publicationStatus: "secret" }, 400],
    ["not json", 400], [[], 400], [" ".repeat(17000), 413],
  ] as const) {
    assert.equal((await handlePayloadWebhook(request(body), secret, () => assert.fail("Must not invalidate"))).status, expected);
  }
});
