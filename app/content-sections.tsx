import Image from "next/image";
import Link from "next/link";
import { ServiceAreaMap } from "./service-area-map";
import { copyParagraphs, copySubsections, getCopySection, masterContent, pageCopy, type CopyNode, type CopyPageKey } from "./master-content";
import { aboutPortraitImage, projectImages, serviceSectionImages, suppliedProjectGalleries } from "./site-images";
import { ScrollableWorkGallery } from "./interactive-sections";
import { paths } from "./site-routes";

type ProjectKey = "whitford" | "newLynn" | "manukau" | "botany";
type ServiceKey = "service" | "renovations" | "designBuild" | "extensions" | "commercial";

const servicePages: Record<ServiceKey, CopyPageKey> = { service: "service", renovations: "serviceRenovations", extensions: "serviceExtensions", designBuild: "serviceDesignBuild", commercial: "serviceCommercial" };
const serviceImages: Record<ServiceKey, string> = { service: "figma-newbuild-intro.png", renovations: "figma-service-renovations.png", extensions: "figma-service-extensions.png", designBuild: "figma-service-design-build.png", commercial: "figma-service-commercial.png" };

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
  return <section className={`split-story-section ${isService ? "service-intro-section" : ""}`}><div className="content-shell split-story-grid">
    <div className="split-story-copy"><SectionHeading title={content.title} /><CopyNodes nodes={content.nodes} /></div>
    {isService
      ? <div className="split-story-media"><Image src={serviceSectionImages[type]?.intro ?? `/design/${serviceImages[type]}`} alt={content.title} fill sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1040px) calc(100vw - 48px), min(50vw - 64px, 616px)" /></div>
      : <div className="split-story-media about-portrait"><Image src={aboutPortraitImage.src} alt={aboutPortraitImage.alt} width={1017} height={1547} sizes="(max-width: 452px) calc(100vw - 32px), 420px" /></div>}
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
  const icons = ["benefit-customisation.png", "benefit-efficiency.png", "benefit-trades.png", "benefit-design.png"];
  return <section className="benefits-section figma-benefits-section"><div className="content-shell benefits-layout">
    <div className="benefits-photo"><Image src={serviceSectionImages[service]?.benefits ?? `/design/${service === "service" ? "figma-newbuild-benefits.png" : serviceImages[service]}`} alt={pageCopy[servicePages[service]].sections[0].title} fill sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1040px) calc(100vw - 48px), 624px" /></div>
    <div className="benefits-content"><SectionHeading title={content.title} /><div className="benefit-grid">
      {copySubsections(content).map((item, index) => <article className="benefit-card" key={item.title}><span><Image src={`/icons/${icons[index]}`} alt="" width={48} height={48} unoptimized /></span><h3>{item.title}</h3><CopyNodes nodes={item.nodes} /></article>)}
    </div><Link className="cta-button outline-button" href="/contact-auckland-builders">CONTACT</Link></div>
  </div></section>;
}

export function ProjectsSection({ relatedTo, compact = false }: { relatedTo?: ProjectKey; compact?: boolean }) {
  const page = relatedTo || (compact ? "services" : "projects");
  const content = getCopySection(page, "OUR PROJECTS");
  const allProjects = !relatedTo && !compact;
  return <section className={`projects-showcase ${relatedTo || compact ? "projects-showcase-compact" : ""} ${compact ? "services-projects-showcase" : ""} ${allProjects ? "projects-showcase-all" : ""} ${relatedTo ? "projects-showcase-related" : ""}`}><div className="content-shell">
    <SectionHeading title={content.title} copy={copyParagraphs(content)[0]} />
    <div className="project-card-grid">{relatedTo ? (Object.keys(projectImages) as ProjectKey[]).filter(project => project !== relatedTo).map(project =>
      <Link className="project-tile project-tile-placeholder" href={paths[project]} key={project}><span><strong>{pageCopy[project].hero.title}</strong><b>LEARN MORE&nbsp; →</b></span></Link>
    ) : copySubsections(content).map(project => {
      const card = <span><strong>{project.title}</strong>{project.title === "Whitford Heights" && <b>LEARN MORE&nbsp; →</b>}</span>;
      return project.title === "Whitford Heights"
        ? <Link className="project-tile" href="/projects/whitford-heights-design-build-auckland" key={project.title}><Image src={projectImages.whitford.hero.src} alt={projectImages.whitford.hero.alt} fill sizes="(max-width: 800px) calc(100vw - 32px), min(50vw - 39px, 641px)" />{card}</Link>
        : <article className="project-tile project-tile-placeholder" id={sectionId(project.title)} key={project.title}>{card}</article>;
    })}</div>
  </div></section>;
}

export function ProjectOverviewSection({ project }: { project: ProjectKey }) {
  const content = getCopySection(project, "PROJECT OVERVIEW");
  return <section className="project-overview-section project-overview-reference"><div className="content-shell project-overview-grid">
    <div><SectionHeading title={content.title} /><CopyNodes nodes={content.nodes} /></div>
    <div className="project-overview-photo"><Image src={projectImages[project].overview.src} alt={projectImages[project].overview.alt} fill sizes="(max-width: 800px) calc(100vw - 32px), min(50vw - 45px, 609px)" /></div>
  </div></section>;
}

export function ProjectGallerySection({ project }: { project: ProjectKey }) {
  return <ScrollableWorkGallery gallery={suppliedProjectGalleries[project]} heading="PROJECT GALLERY" />;
}

export function ServicesPromoSection() {
  const content = getCopySection("blogs", "OUR SERVICES");
  return <section className="services-promo-section"><div className="content-shell"><h2>{content.title}</h2><div><CopyNodes nodes={content.nodes} /><Link className="cta-button outline-button" href="/services-auckland">SERVICES</Link></div></div></section>;
}

export function ServiceAreaSection() {
  return <section className="service-area-section service-area-section-map-only"><ServiceAreaMap className="service-area-map service-area-map-full" /></section>;
}
