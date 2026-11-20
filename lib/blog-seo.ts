import type { Metadata } from "next";
import type { BlogPost } from "./payload-client";
import { mediaImage } from "./payload-client";
import { BLOG_INDEX_PATH, SITE_ORIGIN } from "./blog-routes";

export function blogMetadata(post: BlogPost): Metadata {
  const image = mediaImage(post, "hero");
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt;
  const url = `${SITE_ORIGIN}${post.path}`;
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    openGraph: { type: "article", locale: "en_NZ", siteName: "On Site Building Construction", title, description, url,
      authors: post.author ? [post.author] : undefined,
      modifiedTime: post.updatedAt,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : [],
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [{ url: image.url, alt: image.alt }] : [] },
  };
}

export function blogStructuredData(post: BlogPost) {
  const image = mediaImage(post, "hero");
  const url = `${SITE_ORIGIN}${post.path}`;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "BlogPosting", "@id": `${url}#article`, url, headline: post.title, description: post.seo?.description || post.excerpt,
      ...(image ? { image: [image.url] } : {}), ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
      author: { "@type": "Organization", name: post.author || "On Site Building Construction" },
      publisher: { "@id": `${SITE_ORIGIN}/#business` }, mainEntityOfPage: url, inLanguage: "en-NZ", articleSection: post.category || "Building advice" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Building advice", item: `${SITE_ORIGIN}${BLOG_INDEX_PATH}` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ] },
  ] };
}
