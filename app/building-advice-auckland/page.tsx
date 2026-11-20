import { notFound } from "next/navigation";
import { getBlogPage } from "../../lib/payload";
import { SiteHeader, SiteFooter, ResponsiveHero, ContactCTA } from "../site";
import { ServicesPromoSection } from "../content-sections";
import { BlogsSection } from "../blog-components";
import { metadataFor } from "../seo";
import { PageStructuredData } from "../seo-components";

export const metadata = metadataFor("blogs");

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const { page: input } = await searchParams;
  const page = input === undefined ? 1 : typeof input === "string" && /^[1-9]\d*$/.test(input) ? Number(input) : NaN;
  if (!Number.isSafeInteger(page) || page < 1) notFound();
  const result = await getBlogPage(page);
  if (page > 1 && page > result.totalPages) notFound();
  return <><PageStructuredData page="blogs" /><main className="site-canvas" data-page="blogs">
    <SiteHeader file="navbar-blogs.png" /><ResponsiveHero file="hero-blogs.png" />
    <BlogsSection result={result} /><ServicesPromoSection /><ContactCTA blue /><SiteFooter file="footer-blogs.png" />
  </main></>;
}
