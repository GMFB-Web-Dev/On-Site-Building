import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SitePage, type PageKey, slugToPage } from "../site";

export function generateStaticParams() {
  return Object.keys(slugToPage).map((slug) => ({ slug: slug.split("/") }));
}

type RoutedPageProps = { params: Promise<{ slug: string[] }> };

async function RouteContent({ params }: RoutedPageProps) {
  const { slug } = await params;
  const page = slugToPage[slug.join("/")] as PageKey | undefined;
  if (!page) notFound();
  return <SitePage page={page} />;
}

export default function RoutedPage({ params }: RoutedPageProps) {
  return <Suspense fallback={<main className="route-loading" aria-busy="true"><p role="status">Loading page…</p></main>}>
    <RouteContent params={params} />
  </Suspense>;
}
