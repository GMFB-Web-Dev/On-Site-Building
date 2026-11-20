import type { MetadataRoute } from "next";
import { paths, slugToPage, type SitePageKey } from "./site-routes";
import { absoluteUrl, pageImage } from "./seo";
import { getAllBlogPosts } from "../lib/payload";
import { mediaImage } from "../lib/payload-client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();
  const pages = ["home", ...Object.values(slugToPage), "blogs"] as SitePageKey[];
  return [
    ...pages.map(page => ({ url: absoluteUrl(paths[page]), images: [absoluteUrl(pageImage(page).src)] })),
    ...posts.map(post => {
      const image = mediaImage(post, "hero");
      return { url: absoluteUrl(post.path), ...(post.updatedAt ? { lastModified: post.updatedAt } : {}), ...(image ? { images: [image.url] } : {}) };
    }),
  ];
}
