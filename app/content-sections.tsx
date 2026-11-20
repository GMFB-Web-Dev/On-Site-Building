import Image from "next/image";
import Link from "next/link";
import { ServiceAreaMap } from "./service-area-map";
import { paths } from "./site-routes";
import { copyParagraphs, copySubsections, getCopySection, masterContent, pageCopy, type CopyNode, type CopyPageKey, type CopySection } from "./master-content";

import { clientImages, projects, getProject, serviceMedia, type ProjectKey } from "./client-media";
import { PhotoGallery } from "./interactive-sections";
export type BlogKey = "blog" | "blogExtension" | "blogBlending" | "blogNewHome" | "blogCommercial" | "blogDesignBuild";
type ServiceKey = "service" | "renovations" | "designBuild" | "extensions" | "commercial";

const servicePages: Record<ServiceKey, CopyPageKey> = { service: "service", renovations: "serviceRenovations", extensions: "serviceExtensions", designBuild: "serviceDesignBuild", commercial: "serviceCommercial" };
const blogs: { page: BlogKey; image: string; href: string }[] = [
  { page: "blog", image: "figma-blog-renovate-rebuild.webp", href: "/blogs/renovate-or-rebuild-auckland" },
  { page: "blogExtension", image: "figma-blog-extension.webp", href: "/blogs/planning-home-extension-auckland" },
  { page: "blogBlending", image: "figma-blog-blending.webp", href: "/blogs/blending-old-new-home-renovation-auckland" },
  { page: "blogCommercial", image: "figma-blog-commercial.webp", href: "/blogs/light-commercial-construction-auckland" },
  { page: "blogDesignBuild", image: "figma-blog-design-build.webp", href: "/blogs/design-build-process-auckland" },
  { page: "blogNewHome", image: "figma-blog-new-home.webp", href: "/blogs/building-new-home-auckland" },
];

function SectionHeading({ title, copy }: { title: string; copy?: string }) {
  return <header className="section-heading"><h2>{title}</h2>{copy && <p>{copy}</p>}</header>;
}

function CopyNodes({ nodes }: { nodes: CopyNode[] }) {
  return nodes.map((node, index) => node.type === "heading"
    ? <h3 key={index}>{node.text}</h3>
    : node.type === "list"
      ? <ul key={index}>{node.items.map(item => <li key={item}>{item}</li>)}</ul>
      : <p key={index}>{node.text}</p>);
}

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CertificationSection({ blue = false }: { blue?: boolean }) {
  return <section className={`certification-section ${blue ? "certification-section-blue" : ""}`}><div className="content-shell">
    <SectionHeading title={masterContent.certification.title.replace(". ", ".\n")} copy={masterContent.certification.description} />
    <div className="certification-logos" aria-label="Industry memberships and certifications">
      <Image src="/design/nzcb-logo.png" alt="New Zealand Certified Builders" width={146} height={246} unoptimized />
      <Image src={blue ? "/design/lbp-logo.png" : "/design/lbp-logo-white-bg.jpg"} alt="Licensed Building Practitioners" width={blue ? 209 : 382} height={blue ? 118 : 150} unoptimized />
    </div>
  </div></section>;
}

export function IntroSection({ type }: { type: "about" | ServiceKey }) {
  const isService = type !== "about";
  const page = type === "about" ? "about" : servicePages[type];
  const content = pageCopy[page].sections[0];
  const image = type === "about" ? clientImages["about.built-from-the-ground-up"] : serviceMedia[type].overview;
  return <section className={`split-story-section ${isService ? "service-intro-section" : ""}`}><div className="content-shell split-story-grid">
    <div className="split-story-copy"><SectionHeading title={content.title} /><CopyNodes nodes={content.nodes} /></div>
    <div className={`split-story-media ${type === "about" ? "portrait-media" : ""}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
  </div></section>;
}

export function ValuesSection() {
  const content = getCopySection("about", "OUR VALUES");
  const icons = ["value-passion.png", "value-honesty.png", "value-communication.png", "value-experience.png"];
  return <section className="values-section"><div className="content-shell"><SectionHeading title={content.title} /><div className="value-grid">
    {copySubsections(content).map((item, index) => <article className="value-card" key={item.title}><span className="round-icon" aria-hidden="true"><Image src={`/icons/${icons[index]}`} alt="" width={34} height={34} unoptimized /></span><h3>{item.title}</h3><CopyNodes nodes={item.nodes} /></article>)}
  </div></div></section>;
}

export function MissionSection() {
  return <section className="mission-section"><div className="content-shell mission-grid">
    {["OUR MISSION", "OUR PURPOSE"].map(title => { const content = getCopySection("about", title); return <article key={title}><h2>{content.title}</h2><CopyNodes nodes={content.nodes} /></article>; })}
    <Link className="cta-button outline-button" href="/contact-auckland-builders">CONTACT</Link>
  </div></section>;
}

export function BenefitsSection({ service = "service" }: { service?: ServiceKey }) {
  const content = pageCopy[servicePages[service]].sections[1];
  const image = serviceMedia[service].benefits;
  const icons = ["benefit-customisation.png", "benefit-efficiency.png", "benefit-trades.png", "benefit-design.png"];
  return <section className="benefits-section figma-benefits-section"><div className={`content-shell benefits-layout ${image ? "" : "benefits-without-photo"}`}>
    {image && <div className="benefits-photo"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 45vw" /></div>}
    <div className="benefits-content"><SectionHeading title={content.title} /><div className="benefit-grid">
      {copySubsections(content).map((item, index) => <article className="benefit-card" key={item.title}><span><Image src={`/icons/${icons[index]}`} alt="" width={48} height={48} unoptimized /></span><h3>{item.title}</h3><CopyNodes nodes={item.nodes} /></article>)}
    </div><Link className="cta-button outline-button" href="/contact-auckland-builders">CONTACT</Link></div>
  </div></section>;
}

export function ProjectsSection({ relatedTo, compact = false }: { relatedTo?: ProjectKey; compact?: boolean }) {
  const page = relatedTo || (compact ? "services" : "projects");
  const content = getCopySection(page, "OUR PROJECTS");
  const items = projects.filter(project => project.key !== relatedTo);
  return <section className={`projects-showcase ${compact ? "services-projects-showcase" : ""} ${relatedTo ? "projects-showcase-related" : ""}`}><div className="content-shell">
    <SectionHeading title={relatedTo ? "MORE PROJECTS" : content.title} copy={copyParagraphs(content)[0]} />
    <div className={`project-card-grid ${relatedTo ? "project-card-grid-related" : ""}`}>{items.map(project =>
      <Link className="project-tile" href={project.href} key={project.key}>
        <Image src={project.hero.src} alt={project.hero.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <span><strong>{project.name}</strong><b>LEARN MORE&nbsp; →</b></span>
      </Link>
    )}</div>
  </div></section>;
}

export function ProjectOverviewSection({ project }: { project: ProjectKey }) {
  const content = getCopySection(project, "PROJECT OVERVIEW");
  const photos = getProject(project);
  return <><section className="project-overview-section project-overview-reference"><div className="content-shell project-overview-grid">
    <div><SectionHeading title={content.title} /><CopyNodes nodes={content.nodes} /></div>
    <div className="project-overview-photo"><Image src={photos.overview.src} alt={photos.overview.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
  </div></section><PhotoGallery title="PROJECT GALLERY" images={photos.gallery.slice(1)} /></>;
}

function BlogCards({ sections }: { sections: CopySection[] }) {
  return <div className="blog-card-grid">{sections.map(section => {
    const blog = blogs.find(blog => pageCopy[blog.page].hero.title === section.title);
    if (!blog) throw new Error(`Missing blog route: ${section.title}`);
    return <Link className="blog-card" href={blog.href} key={blog.page}><div><Image src={`/design/${blog.image}`} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><span><strong>{section.title}</strong><b>LEARN MORE&nbsp; →</b></span></Link>;
  })}</div>;
}

export function BlogsSection() {
  const content = getCopySection("blogs", "ALL BLOGS");
  return <section className="blogs-grid-section"><div className="content-shell"><SectionHeading title={content.title} copy={copyParagraphs(content)[0]} /><BlogCards sections={copySubsections(content)} /></div></section>;
}

export function ServicesPromoSection() {
  const content = getCopySection("blogs", "OUR SERVICES");
  return <section className="services-promo-section"><div className="content-shell"><h2>{content.title}</h2><div><CopyNodes nodes={content.nodes} /><Link className="cta-button outline-button" href={paths.services}>SERVICES</Link></div></div></section>;
}

export function BlogArticleSection({ page }: { page: BlogKey }) {
  const sections = pageCopy[page].sections.filter(section => !["OUR BLOGS", masterContent.contact.title].includes(section.title));
  const wordCount = sections.flatMap(section => [section.title, ...section.nodes.flatMap(node => node.type === "list" ? node.items : [node.text])]).join(" ").trim().split(/\s+/).length;
  return <article className="article-section"><div className="content-shell article-layout">
    <aside aria-label="Table of contents"><strong>TABLE OF CONTENTS</strong><ol>{sections.map(section => <li key={section.title}><a href={`#${sectionId(section.title)}`}>{section.title}</a></li>)}</ol></aside>
    <div className="article-body"><div className="article-meta"><span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span></div>
      {sections.map((section, index) => <section id={sectionId(section.title)} key={section.title} className={index === sections.length - 1 ? "article-callout" : undefined}><h2>{section.title}</h2><CopyNodes nodes={section.nodes} />{index === sections.length - 1 && <Link className="cta-button outline-button" href="/contact-auckland-builders">CONTACT</Link>}</section>)}
    </div>
  </div></article>;
}

export function RelatedBlogsSection({ page }: { page: BlogKey }) {
  const content = getCopySection(page, "OUR BLOGS");
  return <section className="related-blogs-section"><div className="content-shell"><SectionHeading title={content.title} copy={copyParagraphs(content)[0]} /><BlogCards sections={copySubsections(content)} /></div></section>;
}

export function ServiceAreaSection() {
  return <section className="service-area-section service-area-section-map-only"><ServiceAreaMap className="service-area-map service-area-map-full" /></section>;
}
