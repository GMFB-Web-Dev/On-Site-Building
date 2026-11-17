import Link from "next/link";
import { breadcrumbsFor, pageStructuredData } from "./seo";
import type { SitePageKey } from "./site-routes";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function PageStructuredData({ page }: { page: SitePageKey }) {
  return <JsonLd data={pageStructuredData(page)} />;
}

export function Breadcrumbs({ page }: { page: SitePageKey }) {
  const items = breadcrumbsFor(page);
  if (items.length < 2) return null;
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol className="content-shell">
    {items.map((item, index) => <li key={item.path}>{index === items.length - 1
      ? <span aria-current="page">{item.name}</span>
      : <Link href={item.path}>{item.name}</Link>}</li>)}
  </ol></nav>;
}
