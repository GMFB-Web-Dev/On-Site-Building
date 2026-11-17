import type { MetadataRoute } from "next";
import { paths, type SitePageKey } from "./site-routes";
import { absoluteUrl, pageImage, SEO_UPDATED } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(paths) as SitePageKey[]).map(page => ({
    url: absoluteUrl(paths[page]),
    lastModified: SEO_UPDATED,
    ...(!["privacy", "terms"].includes(page) ? { images: [absoluteUrl(pageImage(page).src)] } : {}),
  }));
}
