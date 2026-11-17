import Link from "next/link";
import { breadcrumbsFor, pageDetails, pageStructuredData, serviceGuides, SITE_NAME, SEO_UPDATED } from "./seo";
import { paths, serviceKeys, type SitePageKey, type ServicePageKey, type BlogPageKey } from "./site-routes";

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

export function HomeLocalIntroduction() {
  return <section className="local-introduction"><div className="content-shell">
    <p className="section-kicker">MANUREWA · SOUTH AUCKLAND</p>
    <h2>House renovations and extensions in South Auckland</h2>
    <p>Planning to improve the home you already love? Our South Auckland builders help homeowners with <Link href={paths.serviceRenovations}>house renovations and alterations</Link>, <Link href={paths.serviceExtensions}>home extensions</Link> and <Link href={paths.service}>new homes</Link>. We bring over 30 years of building experience and a trusted network of specialist trades to each project.</p>
    <p>We work throughout Auckland, including Manurewa, Manukau, Papakura, Takanini, Botany, Whitford and New Lynn. For projects in Waikato or Whangārei, tell us about your location, plans and timing so we can discuss what is practical.</p>
    <Link className="text-link" href={paths.serviceAreas}>Explore our building service areas <span aria-hidden="true">→</span></Link>
  </div></section>;
}

export function ServiceReading({ page }: { page: ServicePageKey }) {
  return <section className="service-reading"><div className="content-shell">
    <h2>Planning your project</h2><p>Practical reading to help you prepare for a conversation with your builder.</p>
    <div className="reading-links">{serviceGuides[page].map(key => <Link key={key} href={paths[key]}><span>{pageDetails[key].label}</span><span aria-hidden="true">→</span></Link>)}</div>
  </div></section>;
}

const articleIntroductions: Record<BlogPageKey, string> = {
  blog: "For Auckland homeowners, the choice between renovating and rebuilding starts with the home, the site and the way you want to live. This guide outlines the questions to discuss before choosing a direction.",
  blogExtension: "Extending an Auckland home means considering the existing building, the section and the extra space your family needs. Use this guide to prepare your brief before speaking with a designer and builder.",
  blogBlending: "A successful Auckland renovation should feel connected to the original home. The following considerations can help you discuss layout, materials and the transition between old and new spaces.",
  blogCommercial: "For Auckland shops, dairies and laundromats, light commercial construction is about making an existing or new space work for the business. This guide explains the scope and the planning conversations that help get started.",
  blogDesignBuild: "For an Auckland homeowner starting with an idea, design and build brings architectural input and construction planning into the same conversation. On Site Building works alongside an experienced architect to help connect those stages.",
  blogNewHome: "Before building a new home in Auckland, it helps to understand the site, your priorities and the practical steps ahead. This guide is a starting point for discussions with your builder, designer and other relevant professionals.",
};

export function ArticleIntroduction({ page }: { page: BlogPageKey }) {
  return <div className="article-introduction"><p className="article-byline">By <Link href={paths.about}>{SITE_NAME}</Link> · Updated <time dateTime={SEO_UPDATED}>17 November 2026</time></p><p>{articleIntroductions[page]}</p></div>;
}

export function ArticleServiceLinks({ page }: { page: BlogPageKey }) {
  const services = serviceKeys.filter(key => serviceGuides[key].includes(page));
  return <nav className="article-service-links" aria-label="Related building services"><h2>Discuss your Auckland building project</h2>
    <p>Our Manurewa-based team works across Auckland, with wider enquiries from Waikato and Whangārei considered around the location and scope.</p>
    <ul>{services.map(key => <li key={key}><Link href={paths[key]}>{pageDetails[key].heading}</Link></li>)}</ul>
    <Link href={paths.contact} className="text-link">Tell us about your project <span aria-hidden="true">→</span></Link>
  </nav>;
}
