import { JsonLdScript } from "next-seo";
import { pageStructuredData } from "./seo";
import type { SitePageKey } from "./site-routes";

export function JsonLd({ data, scriptKey }: { data: unknown; scriptKey: string }) {
  return <JsonLdScript scriptKey={scriptKey} data={data} />;
}

export function PageStructuredData({ page }: { page: SitePageKey }) {
  return <JsonLd scriptKey="page-schema" data={pageStructuredData(page)} />;
}
