import { notFound } from "next/navigation";
import { getBlogPost, getRelatedPosts } from "../../../lib/payload";
import { blogMetadata, blogStructuredData } from "../../../lib/blog-seo";
import { SiteHeader, SiteFooter, ContactCTA } from "../../site";
import { BlogHero, BlogArticleSection, RelatedBlogsSection } from "../../blog-components";
import { JsonLd } from "../../seo-components";

type Props = { params: Promise<{ slug: string }> };

async function requirePost(slug: string) {
  const post = await getBlogPost(slug);
  if (!post) notFound();
  return post;
}

// No generateStaticParams: every valid newly published CMS slug works on its next request.
export async function generateMetadata({ params }: Props) {
  return blogMetadata(await requirePost((await params).slug));
}

export default async function BlogArticle({ params }: Props) {
  const post = await requirePost((await params).slug);
  const related = await getRelatedPosts(post.slug);
  return <><JsonLd data={blogStructuredData(post)} /><main className="site-canvas" data-page="blog">
    <SiteHeader file="navbar-blog.png" /><BlogHero post={post} /><BlogArticleSection post={post} />
    <RelatedBlogsSection posts={related} /><ContactCTA blue /><SiteFooter file="footer-blog.png" />
  </main></>;
}
