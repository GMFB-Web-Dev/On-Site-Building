import { pageStructuredData } from "./seo";
import type { SitePageKey } from "./site-routes";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function PageStructuredData({ page }: { page: SitePageKey }) {
  return <JsonLd data={pageStructuredData(page)} />;
}
