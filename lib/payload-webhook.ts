import { createHash, timingSafeEqual } from "node:crypto";
import { BLOG_INDEX_PATH, TENANT_SLUG, validBlogSlug } from "./blog-routes";

type Invalidator = (path: string, type?: "page" | "layout") => void;
const response = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handlePayloadWebhook(request: Request, secret: string | undefined, invalidate: Invalidator) {
  if (!secret?.trim()) return response({ error: "Revalidation is not configured" }, 503);
  const provided = request.headers.get("x-revalidation-secret") ?? "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!provided || !timingSafeEqual(digest(secret), digest(provided))) return response({ error: "Unauthorized" }, 401);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return response({ error: "Expected application/json" }, 415);
  if (Number(request.headers.get("content-length")) > 16_384) return response({ error: "Payload too large" }, 413);
  let payload: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "Missing JSON body" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) { await reader.cancel(); return response({ error: "Payload too large" }, 413); }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return response({ error: "Invalid notification" }, 400);
    payload = parsed as Record<string, unknown>;
  } catch { return response({ error: "Invalid JSON" }, 400); }

  if (payload.tenantSlug !== TENANT_SLUG) return response({ error: "Unsupported tenant" }, 403);
  if (!["blog-posts", "media"].includes(String(payload.collection))) return response({ error: "Unsupported collection" }, 400);
  if (!["create", "update", "delete"].includes(String(payload.operation))) return response({ error: "Unsupported operation" }, 400);
  if (payload.publicationStatus != null && !["draft", "published"].includes(String(payload.publicationStatus))) return response({ error: "Invalid publication status" }, 400);
  if (payload.pageSlug != null && !validBlogSlug(payload.pageSlug)) return response({ error: "Invalid blog slug" }, 400);
  if (payload.pagePath != null && (typeof payload.pagePath !== "string" || !/^\/blogs\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.pagePath) || payload.pagePath.length > 207)) {
    return response({ error: "Invalid blog path" }, 400);
  }

  // All article pages share related cards/media. Broad blog invalidation also covers
  // an old slug after a rename, which the notification need not include.
  const paths = [BLOG_INDEX_PATH, "/blogs", "/sitemap.xml"];
  for (const path of paths) invalidate(path);
  invalidate("/blogs/[slug]", "page");
  if (typeof payload.pagePath === "string") invalidate(payload.pagePath);
  if (typeof payload.pageSlug === "string") invalidate(`/blogs/${payload.pageSlug}`);
  return response({ revalidated: true, paths: [...new Set([...paths, "/blogs/[slug]", payload.pagePath, payload.pageSlug ? `/blogs/${payload.pageSlug}` : null].filter((path): path is string => typeof path === "string"))] });
}
