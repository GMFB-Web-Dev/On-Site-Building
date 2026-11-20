import Image from "next/image";
import Link from "next/link";
import type { BlogPage, BlogPost } from "../lib/payload-client";
import { mediaImage } from "../lib/payload-client";
import { blogDocument, safeHref } from "../lib/blog-content";
import { BLOG_INDEX_PATH } from "../lib/blog-routes";
import { LexicalContent } from "./blog-lexical";
import { HeroOverlay } from "./site";
import { paths } from "./site-routes";
import { copyParagraphs, getCopySection } from "./master-content";

export function BlogCards({ posts, related = false }: { posts: BlogPost[]; related?: boolean }) {
  const sizes = related
    ? "(max-width: 800px) calc(100vw - 32px), (max-width: 1040px) calc(50vw - 40px), min(25vw - 36px, 304px)"
    : "(max-width: 800px) calc(100vw - 32px), min(50vw - 40px, 640px)";
  return <div className="blog-card-grid">{posts.map(post => {
    const image = mediaImage(post, "card");
    return <Link className="blog-card" href={post.path} key={post.id}>
      {image && <div><Image src={image.url} alt={image.alt} fill sizes={sizes} quality={82} /></div>}
      <span><strong>{post.title}</strong><b>LEARN MORE&nbsp; →</b></span>
    </Link>;
  })}</div>;
}

export function BlogsSection({ result }: { result: BlogPage }) {
  const content = getCopySection("blogs", "ALL BLOGS");
  const pageUrl = (page: number) => page === 1 ? BLOG_INDEX_PATH : `${BLOG_INDEX_PATH}?page=${page}`;
  return <section className="blogs-grid-section"><div className="content-shell">
    <header className="section-heading"><h2>{content.title}</h2><p>{copyParagraphs(content)[0]}</p></header>
    {result.docs.length ? <BlogCards posts={result.docs} /> : <p>No building advice articles are published yet.</p>}
    {result.totalPages > 1 && <nav className="blog-pagination" aria-label="Blog pagination">
      {result.page > 1 && <Link className="cta-button" href={pageUrl(result.page - 1)} rel="prev">Previous</Link>}
      <span>Page {result.page} of {result.totalPages}</span>
      {result.hasNextPage && <Link className="cta-button" href={pageUrl(result.page + 1)} rel="next">Next</Link>}
    </nav>}
  </div></section>;
}

export function BlogHero({ post }: { post: BlogPost }) {
  const image = mediaImage(post, "hero");
  return <section className="responsive-hero cms-blog-hero">
    {image && <Image src={image.url} alt={image.alt} fill preload sizes="100vw" quality={82} />}
    <HeroOverlay /><div className="hero-content"><h1>{post.title}</h1>{post.excerpt && <p>{post.excerpt}</p>}
      <div><Link className="cta-button cta-button-on-image" href={paths.contact}>CONTACT</Link><Link className="cta-button cta-button-on-image" href={paths.services}>SERVICES</Link></div>
    </div>
  </section>;
}

export function BlogArticleSection({ post }: { post: BlogPost }) {
  const document = blogDocument(post);
  const ctaHref = safeHref(post.cta?.href);
  return <article className="article-section"><div className="content-shell article-layout">
    <aside aria-label="Table of contents"><strong>TABLE OF CONTENTS</strong><ol>{document.headings.map(heading => <li key={heading.id} className={heading.level === 3 ? "article-toc-subheading" : undefined}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol></aside>
    <div className="article-body"><div className="article-meta"><span>{`${document.readingMinutes} min read`}</span>{post.author && <span> · {post.author}</span>}</div>
      {document.sections.map(section => <section id={section.id} key={section.id}><LexicalContent nodes={section.nodes} /></section>)}
      {ctaHref && <div className="article-callout">{post.cta?.heading && <h2>{post.cta.heading}</h2>}<Link className="cta-button outline-button" href={ctaHref}>{post.cta?.label || "CONTACT"}</Link></div>}
    </div>
  </div></article>;
}

export function RelatedBlogsSection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return <section className="related-blogs-section"><div className="content-shell"><header className="section-heading"><h2>OUR BLOGS</h2><p>More advice to help you plan your project.</p></header><BlogCards posts={posts} related /></div></section>;
}
