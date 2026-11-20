import { notFound } from "next/navigation";
import { SitePage, type PageKey, slugToPage } from "../site";
import { metadataFor } from "../seo";
import { PageStructuredData } from "../seo-components";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(slugToPage).map((slug) => ({ slug: slug.split("/") }));
}

type RoutedPageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: RoutedPageProps) {
  const { slug } = await params;
  const page = slugToPage[slug.join("/")];
  if (!page) notFound();
  return metadataFor(page);
}

export default async function RoutedPage({ params }: RoutedPageProps) {
  const { slug } = await params;
  const page = slugToPage[slug.join("/")] as PageKey | undefined;
  if (!page) notFound();
  return <><PageStructuredData page={page} /><SitePage page={page} /></>;
}
