import { notFound } from "next/navigation";
import { SitePage, type PageKey, slugToPage } from "../site";

export function generateStaticParams() {
  return Object.keys(slugToPage).map((slug) => ({ slug: slug.split("/") }));
}

export default async function RoutedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = slugToPage[slug.join("/")] as PageKey | undefined;
  if (!page) notFound();
  return <SitePage page={page} />;
}
