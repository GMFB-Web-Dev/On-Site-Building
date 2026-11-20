export const SITE_ORIGIN = "https://onsitebuild.co.nz";
export const BLOG_INDEX_PATH = "/building-advice-auckland";
export const TENANT_ID = 7;
export const TENANT_SLUG = "onsite-build";

export function validBlogSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function blogPath(slug: string) {
  if (!validBlogSlug(slug)) throw new Error("Invalid blog slug");
  return `/blogs/${slug}`;
}
