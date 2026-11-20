import { blogPath, TENANT_ID, TENANT_SLUG, validBlogSlug } from "./blog-routes";

export type LexicalNode = {
  type: string;
  text?: string;
  tag?: string;
  format?: number | string;
  listType?: string;
  start?: number;
  checked?: boolean;
  children?: LexicalNode[];
  fields?: { url?: string; newTab?: boolean; linkType?: string; doc?: { value?: { path?: string; slug?: string } } };
  url?: string;
  value?: unknown;
  relationTo?: string;
  [key: string]: unknown;
};
export type RichText = { root: LexicalNode };
export type MediaSize = { url?: string; width?: number; height?: number };
export type Media = MediaSize & {
  id?: number | string;
  tenant?: number | string | { id: number | string; slug?: string };
  alt?: string;
  updatedAt?: string;
  sizes?: { thumbnail?: MediaSize; card?: MediaSize; hero?: MediaSize };
};
export type SupplementalContent = string | RichText | null;
export type BlogPost = {
  id: number | string;
  tenant: number | string | { id: number | string; slug?: string };
  title: string;
  slug: string;
  path: string;
  template?: "article" | "guide" | "case-study" | string;
  excerpt?: string;
  featuredImage?: Media | number | string | null;
  featuredImageAlt?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
  body?: RichText | null;
  tools?: SupplementalContent;
  steps?: { id?: string; title?: string; heading?: string; description?: SupplementalContent; body?: SupplementalContent; content?: SupplementalContent }[];
  caseStudy?: Record<string, SupplementalContent>;
  cta?: { heading?: string; label?: string; href?: string };
  seo?: { title?: string; description?: string };
  _status: "published";
};
export type BlogPage = { docs: BlogPost[]; page: number; totalPages: number; totalDocs: number; hasNextPage: boolean };
type PayloadPage = { docs: unknown[]; page: number; totalPages: number; totalDocs: number; hasNextPage: boolean; nextPage?: number | null };
type PayloadEnv = { PAYLOAD_CMS_URL?: string; PAYLOAD_TENANT_ID?: string; PAYLOAD_TENANT_SLUG?: string; NODE_ENV?: string };

export class CmsError extends Error {
  constructor(message: string) { super(message); this.name = "CmsError"; }
}

function tenantMatches(value: unknown) {
  if (typeof value === "number" || typeof value === "string") return String(value) === String(TENANT_ID);
  if (!value || typeof value !== "object") return false;
  const tenant = value as { id?: unknown; slug?: unknown };
  return String(tenant.id) === String(TENANT_ID) && (tenant.slug === undefined || tenant.slug === TENANT_SLUG);
}

export function publishedTenantPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") return false;
  const post = value as BlogPost;
  return tenantMatches(post.tenant) && post._status === "published" && validBlogSlug(post.slug)
    && post.path === blogPath(post.slug) && typeof post.title === "string" && !!post.title.trim()
    && (typeof post.id === "number" || typeof post.id === "string");
}

export function payloadConfig(env: PayloadEnv = process.env) {
  if (env.PAYLOAD_TENANT_ID !== String(TENANT_ID)) throw new CmsError("PAYLOAD_TENANT_ID must be 7");
  if (env.PAYLOAD_TENANT_SLUG && env.PAYLOAD_TENANT_SLUG !== TENANT_SLUG) throw new CmsError("PAYLOAD_TENANT_SLUG must be onsite-build");
  let base: URL;
  try { base = new URL(env.PAYLOAD_CMS_URL ?? ""); } catch { throw new CmsError("PAYLOAD_CMS_URL is required"); }
  const local = env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
  if ((base.protocol !== "https:" && !(local && base.protocol === "http:")) || base.username || base.password || base.pathname !== "/" || base.search || base.hash) {
    throw new CmsError("PAYLOAD_CMS_URL must be an HTTPS origin");
  }
  return base;
}

export function createPayloadClient(env: PayloadEnv = process.env, fetcher: typeof fetch = fetch) {
  const base = payloadConfig(env);
  async function query(options: { page?: number; limit?: number; slug?: string; exclude?: string } = {}): Promise<BlogPage> {
    const url = new URL("/api/blog-posts", base);
    const page = options.page ?? 1;
    url.searchParams.set("where[tenant][equals]", String(TENANT_ID));
    url.searchParams.set("where[_status][equals]", "published");
    url.searchParams.set("depth", "1");
    url.searchParams.set("sort", "-publishedAt");
    url.searchParams.set("limit", String(options.limit ?? 24));
    url.searchParams.set("page", String(page));
    if (options.slug) url.searchParams.set("where[slug][equals]", options.slug);
    if (options.exclude) url.searchParams.set("where[slug][not_equals]", options.exclude);
    let response: Response;
    try {
      response = await fetcher(url, { cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) });
    } catch { throw new CmsError("Payload CMS is temporarily unavailable"); }
    if (!response.ok) throw new CmsError(`Payload CMS returned HTTP ${response.status}`);
    let data: PayloadPage;
    try { data = await response.json(); } catch { throw new CmsError("Payload CMS returned invalid JSON"); }
    if (!data || !Array.isArray(data.docs) || !Number.isSafeInteger(data.totalDocs) || data.totalDocs < 0
      || !Number.isSafeInteger(data.totalPages) || data.totalPages < 0 || data.page !== page || typeof data.hasNextPage !== "boolean") {
      throw new CmsError("Payload CMS returned an invalid page");
    }
    // Fail closed even if an upstream access-control or query regression exposes another tenant.
    const docs = data.docs.filter(publishedTenantPost).filter(post => (!options.slug || post.slug === options.slug) && post.slug !== options.exclude);
    return { docs, page, totalPages: data.totalPages, totalDocs: data.totalDocs, hasNextPage: data.hasNextPage };
  }
  return {
    list: query,
    async post(slug: string) {
      if (!validBlogSlug(slug)) return null;
      return (await query({ slug, limit: 1 })).docs[0] ?? null;
    },
    async all() {
      const posts: BlogPost[] = [];
      const seen = new Set<string>();
      let page = 1;
      while (true) {
        const result = await query({ page, limit: 100 });
        for (const post of result.docs) if (!seen.has(post.slug)) { posts.push(post); seen.add(post.slug); }
        if (!result.hasNextPage) return posts;
        if (page >= result.totalPages) throw new CmsError("Payload CMS returned inconsistent pagination");
        page++;
      }
    },
  };
}

export function mediaImage(post: BlogPost, size: "thumbnail" | "card" | "hero") {
  const media = post.featuredImage;
  if (!media || typeof media !== "object" || (media.tenant !== undefined && !tenantMatches(media.tenant))) return null;
  const preferred = media.sizes?.[size];
  for (const candidate of [preferred, media]) {
    if (!candidate?.url) continue;
    try {
      const url = new URL(candidate.url);
      if (url.protocol !== "https:" || url.hostname !== "media.gmfb.co.nz" || url.port || !url.pathname.startsWith("/media/") || url.username || url.password || url.search) continue;
      // File replacements can retain their URL. Version the optimizer cache by the
      // media revision so a published media edit also refreshes the visible image.
      if (media.updatedAt) url.searchParams.set("v", media.updatedAt);
      return { url: url.href, alt: post.featuredImageAlt || media.alt || post.title, width: candidate.width ?? media.width, height: candidate.height ?? media.height };
    } catch { continue; }
  }
  return null;
}
