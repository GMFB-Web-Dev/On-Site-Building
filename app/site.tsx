import Image from "next/image";
import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { PhotoGallery } from "./interactive-sections";
import { HeroSlideshow } from "./hero-slideshow";
import { EnquiryForm } from "./enquiry-form";
import { clientImages, getProject, projects, serviceMedia, servicePageKeys, type ProjectKey, type SiteImage } from "./client-media";
import { RevealObserver } from "./reveal-observer";
import { ServiceAreaMap } from "./service-area-map";
import { masterContent, pageCopy, copyParagraphs, type CopyPageKey } from "./master-content";
import type { BlogKey } from "./content-sections";
import {
  BenefitsSection,
  BlogArticleSection,
  BlogsSection,
  CertificationSection,
  IntroSection,
  MissionSection,
  ProjectOverviewSection,
  ProjectsSection,
  RelatedBlogsSection,
  ServiceAreaSection,
  ServicesPromoSection,
  ValuesSection,
} from "./content-sections";

import { paths, type PageKey } from "./site-routes";
import { CoverageSection, coverageRegions } from "./service-coverage";
export type { PageKey } from "./site-routes";
export { slugToPage } from "./site-routes";

type Kind = "nav" | "hero" | "form";
type Section = [src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number];
const s = (src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number): Section => [src, height, alt, kind, width, offsetX];

function projectHero(page: "whitford" | "newLynn" | "manukau" | "botany"): [string, string] {
  const hero = pageCopy[page].hero;
  return [hero.title, copyParagraphs(hero)[0]];
}

const pages: Record<Exclude<PageKey, "serviceAreas">, { sections: Section[]; projectHero?: [string, string]; spacer?: number }> = {
  home: { sections: [
    s("navbar-home.png",80,"On Site Building Construction navigation","nav"), s("hero-home.png",820,"Built Around the Way You Live","hero"),
    s("home-about.jpg",739,"About On Site Building Construction"), s("home-services.png",953,"Our services"), s("home-work.png",700,"Our work"),
    s("testimonials.png",379,"Testimonials"), s("certification-home.png",467,"NZCB certified and LBP expertise"), s("contact-strip-home.png",612,"Contact details"),
    s("contact-form-map.png",878,"Project enquiry form and service area map","form"), s("footer-home.png",279,"Footer navigation") ] },
  services: { sections: [
    s("navbar-services.png",80,"Services navigation","nav"), s("hero-services.png",820,"Your Home. Reimagined.","hero"), s("services-list.png",953,"Our services"),
    s("services-projects.png",624,"Our projects"), s("certification-services.png",467,"NZCB certified and LBP expertise"), s("contact-strip-whitford.png",612,"Contact details"),
    s("footer-services.png",279,"Footer navigation") ] },
  service: { sections: [
    s("navbar-service.png",80,"Residential new builds navigation","nav"), s("hero-service.png",820,"A New Home, Built Around You","hero"), s("service-intro.jpg",739,"Residential new builds"),
    s("service-benefits.png",852,"Why new builds"), s("service-work.png",700,"Our work"), s("contact-strip-service.png",612,"Contact details"),
    s("contact-form-map-service.png",878,"Project enquiry form and map","form"), s("footer-service.png",279,"Footer navigation") ] },
  serviceRenovations: { sections: [
    s("navbar-service.png",80,"Renovations and alterations navigation","nav"), s("hero-service-renovations.png",820,"Your Home Reimagined","hero"), s("service-intro-renovations.jpg",739,"Renovations and alterations"),
    s("service-benefits-renovations.png",852,"Why renovate"), s("service-work.png",700,"Our work"), s("contact-strip-service.png",612,"Contact details"),
    s("contact-form-map-service.png",878,"Project enquiry form and map","form"), s("footer-service.png",279,"Footer navigation") ] },
  serviceDesignBuild: { sections: [
    s("navbar-service.png",80,"Design and build navigation","nav"), s("hero-service-design-build.png",820,"Designed with purpose and built with care","hero"), s("service-intro-design-build.jpg",739,"Design and build"),
    s("service-benefits-design-build.png",852,"Why design and build"), s("service-work.png",700,"Our work"), s("contact-strip-service.png",612,"Contact details"),
    s("contact-form-map-service.png",878,"Project enquiry form and map","form"), s("footer-service.png",279,"Footer navigation") ] },
  serviceExtensions: { sections: [
    s("navbar-service.png",80,"Additions and extensions navigation","nav"), s("hero-service-extensions.png",820,"More space for the way you live","hero"), s("service-intro-extensions.jpg",739,"Additions and extensions"),
    s("service-benefits-extensions.png",852,"Why extend"), s("service-work.png",700,"Our work"), s("contact-strip-service.png",612,"Contact details"),
    s("contact-form-map-service.png",878,"Project enquiry form and map","form"), s("footer-service.png",279,"Footer navigation") ] },
  serviceCommercial: { sections: [
    s("navbar-service.png",80,"Light commercial construction navigation","nav"), s("hero-service-commercial.png",820,"Practical spaces with professional delivery","hero"), s("service-intro-commercial.jpg",739,"Light commercial construction"),
    s("service-benefits-commercial.png",852,"Why work with us"), s("service-work.png",700,"Our work"), s("contact-strip-service.png",612,"Contact details"),
    s("contact-form-map-service.png",878,"Project enquiry form and map","form"), s("footer-service.png",279,"Footer navigation") ] },
  projects: { sections: [
    s("navbar-projects.png",80,"Projects navigation","nav"), s("hero-projects.png",820,"A Closer Look at Our Work","hero"), s("projects-grid.png",1083,"Our projects"),
    s("contact-strip-projects.png",612,"Contact details"), s("contact-form-map-projects.png",878,"Project enquiry form and map","form"), s("footer-projects.png",279,"Footer navigation") ] },
  whitford: { projectHero: projectHero("whitford"), sections: [
    s("navbar-whitford.png",80,"Whitford Heights project navigation","nav"), s("project-whitford.jpg",739,"Whitford Heights project overview"),
    s("projects-related-whitford.png",624,"Related projects"), s("contact-strip-whitford.png",612,"Contact details"), s("footer-whitford.png",279,"Footer navigation") ] },
  newLynn: { projectHero: projectHero("newLynn"), sections: [
    s("navbar-new-lynn.png",80,"New Lynn project navigation","nav"), s("project-new-lynn.jpg",739,"New Lynn project overview"),
    s("projects-related-new-lynn.png",624,"Related projects"), s("contact-strip-new-lynn.png",612,"Contact details"), s("footer-new-lynn.png",279,"Footer navigation") ] },
  manukau: { projectHero: projectHero("manukau"), sections: [
    s("navbar-manukau.png",80,"Manukau Heights project navigation","nav"), s("project-manukau.jpg",739,"Manukau Heights project overview"),
    s("projects-related-manukau.png",624,"Related projects"), s("contact-strip-projects.png",612,"Contact details"), s("footer-projects.png",279,"Footer navigation") ] },
  botany: { projectHero: projectHero("botany"), sections: [
    s("navbar-botany.png",80,"Botany project navigation","nav"), s("project-botany.jpg",739,"Botany project overview"),
    s("projects-related-botany.png",624,"Related projects"), s("contact-strip-projects.png",612,"Contact details"), s("footer-projects.png",279,"Footer navigation") ] },
  about: { spacer: 1, sections: [
    s("navbar-about.png",80,"About navigation","nav"), s("hero-about.png",820,"Our Story. Your Future Project.","hero"), s("about-intro.jpg",739,"Built from the ground up"),
    s("about-values.png",435,"Our values"), s("certification-about.png",467,"NZCB certified and LBP expertise"), s("testimonials-about.png",379,"Testimonials"), s("about-mission.png",325,"Our mission and purpose"),
    s("contact-strip-home.png",612,"Contact details"), s("contact-form-map-about.png",878,"Project enquiry form and map","form"), s("footer-about.png",279,"Footer navigation") ] },
  blogs: { sections: [
    s("navbar-blogs.png",80,"Blogs navigation","nav"), s("hero-blogs.png",820,"Building Advice, Without the Guesswork","hero"), s("blogs-grid.png",1538,"All blogs"),
    s("blogs-services.png",265,"Our services"), s("contact-strip-blogs.png",612,"Contact details"), s("footer-blogs.png",279,"Footer navigation") ] },
  blog: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog.png",820,"Renovate or Rebuild? What's Right for Your Home?","hero"), s("blog-article.jpg",5249,"Renovate or Rebuild article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  blogExtension: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog-extension.png",820,"Planning a Home Extension: What to Consider First","hero"), s("blog-article-placeholder-extension.jpg",2600,"Lorem ipsum article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  blogBlending: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog-blending.png",820,"Blending Old and New in a Home Renovation","hero"), s("blog-article-placeholder-blending.jpg",2600,"Lorem ipsum article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  blogCommercial: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog-commercial.png",820,"What Is Light Commercial Construction?","hero"), s("blog-article-placeholder-commercial.jpg",2600,"Lorem ipsum article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  blogDesignBuild: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog-design-build.png",820,"How Does the Design and Build Process Work?","hero"), s("blog-article-placeholder-design-build.jpg",2600,"Lorem ipsum article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  blogNewHome: { sections: [
    s("navbar-blog.png",80,"Blog navigation","nav"), s("hero-blog-new-home.png",820,"What to Know Before Building a New Home","hero"), s("blog-article-placeholder-new-home.jpg",2600,"Lorem ipsum article"),
    s("blog-related.png",624,"Related blogs"), s("contact-strip-blog.png",612,"Contact details"), s("footer-blog.png",279,"Footer navigation") ] },
  contact: { sections: [
    s("navbar-contact.png",80,"Contact navigation","nav"), s("hero-contact.png",820,"Every Great Project Starts with a Chat","hero"), s("contact-strip-contact.png",612,"Contact details",undefined,1438,2),
    s("contact-form.png",878,"Project enquiry form","form"), s("contact-map.png",854,"Auckland, Waikato and Whangārei service area map"), s("footer-contact.png",279,"Footer navigation") ] },
};

const displayServiceLabel = (name: string) =>
  name.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());

export function SiteHeader({ file }: { file: string }) {
  const active = file.replace("navbar-", "").replace(".png", "");
  const labels = masterContent.services.labels;
  const serviceItems = [[labels.renovations,paths.serviceRenovations],[labels.newBuilds,paths.service],[labels.designBuild,paths.serviceDesignBuild],[labels.extensions,paths.serviceExtensions],[labels.commercial,paths.serviceCommercial],["Service Areas",paths.serviceAreas],["All Services",paths.services]];
  const projectItems = [...projects.map(project => [project.name, project.href]), ["All Projects", paths.projects]];
  const servicesActive = active.startsWith("service");
  const projectsActive = ["projects", "whitford", "new-lynn", "manukau", "botany"].includes(active);
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand header-brand" aria-label="On Site Building Construction Limited home">
      <span className="header-logo"><Image src="/osbc-header-logo-cropped.svg" alt="On Site Building Construction Limited" fill sizes="(max-width: 800px) 240px, 340px" priority unoptimized /></span>
    </Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
      <div className={`nav-service-dropdown ${servicesActive ? "active" : ""}`}>
        <Link className="nav-service-trigger" href="/services-auckland">Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></Link>
        <div className="service-dropdown-menu">{serviceItems.map(([label,href])=><Link key={label} href={href}>{displayServiceLabel(label)}</Link>)}</div>
      </div>
      <Link href={paths.about} className={active === "about" ? "active" : ""}>About us</Link>
      <div className={`nav-service-dropdown ${projectsActive ? "active" : ""}`}>
        <Link className="nav-service-trigger" href="/building-projects-auckland">Projects <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></Link>
        <div className="service-dropdown-menu">{projectItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>
      </div>
      <Link href={paths.blogs} className={active.startsWith("blog") ? "active" : ""}>Blogs</Link>
      <Link href={paths.contact} className={active === "contact" ? "active" : ""}>Contact us</Link>
      <a className="phone-button" href={masterContent.business.phoneHref}>{masterContent.business.phone}</a>
    </nav>
    <MobileNavigation>
      <Link href="/">Home</Link>
      <details className="mobile-service-menu" name="mobile-navigation-section"><summary>Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></summary><div>{serviceItems.map(([label,href])=><Link key={label} href={href}>{displayServiceLabel(label)}</Link>)}</div></details>
      <Link href={paths.about}>About us</Link>
      <details className="mobile-service-menu" name="mobile-navigation-section"><summary>Projects <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></summary><div>{projectItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div></details>
      <Link href={paths.blogs}>Blogs</Link>
      <Link href={paths.contact}>Contact us</Link>
      <a href={masterContent.business.phoneHref}>{masterContent.business.phone}</a>
    </MobileNavigation>
  </div></header>;
}

const heroContent: Record<string, { page: CopyPageKey; image: string }> = {
  "hero-home.png": { page: "home", image: "figma-blog-renovate-rebuild.webp" },
  "hero-services.png": { page: "services", image: "figma-services-hero.webp" },
  "hero-service.png": { page: "service", image: "figma-newbuild-hero.png" },
  "hero-service-renovations.png": { page: "serviceRenovations", image: "figma-service-renovations.png" },
  "hero-service-design-build.png": { page: "serviceDesignBuild", image: "figma-service-design-build.webp" },
  "hero-service-extensions.png": { page: "serviceExtensions", image: "figma-service-extensions.png" },
  "hero-service-commercial.png": { page: "serviceCommercial", image: "figma-service-commercial.webp" },
  "hero-projects.png": { page: "projects", image: "figma-blog-extension.webp" },
  "hero-about.png": { page: "about", image: "figma-blog-commercial.webp" },
  "hero-blogs.png": { page: "blogs", image: "figma-blogs-hero.png" },
  "hero-blog.png": { page: "blog", image: "figma-blog-renovate-rebuild.webp" },
  "hero-blog-extension.png": { page: "blogExtension", image: "figma-blog-extension.webp" },
  "hero-blog-blending.png": { page: "blogBlending", image: "figma-blog-blending.webp" },
  "hero-blog-commercial.png": { page: "blogCommercial", image: "figma-blog-commercial.webp" },
  "hero-blog-design-build.png": { page: "blogDesignBuild", image: "figma-blog-design-build.webp" },
  "hero-blog-new-home.png": { page: "blogNewHome", image: "figma-blog-new-home.webp" },
  "hero-contact.png": { page: "contact", image: "figma-blog-new-home.webp" },
};

// Keep every approved hero as the first slide; additional images are client supplied.
// Light Commercial, contact and individual blog articles stay static where no distinct
// relevant client photography is available.
const homeSlides = [
  clientImages["home.hero"], clientImages["project.new-lynn.hero"], clientImages["project.manukau-heights.hero"],
];
const heroAlternatives: Partial<Record<CopyPageKey, SiteImage[]>> = {
  home: homeSlides,
  services: [clientImages["project.whitford-heights.hero"], clientImages["project.botany.hero"]],
  about: [clientImages["about.hero"], clientImages["project.whitford-heights.gallery.7"]],
  service: [clientImages["residential-new-builds.hero"], clientImages["residential-new-builds.gallery.6"], clientImages["residential-new-builds.gallery.3"]],
  serviceRenovations: [clientImages["renovations-alterations.hero"], clientImages["renovations-alterations.gallery.2"], clientImages["renovations-alterations.gallery.1"]],
  serviceDesignBuild: [clientImages["design-build.why-design-build"], clientImages["design-build.overview"]],
  serviceExtensions: [clientImages["additions-extensions.hero"], clientImages["additions-extensions.gallery.1"], clientImages["additions-extensions.why-extend"]],
  projects: [clientImages["project.botany.hero"], clientImages["project.whitford-heights.gallery.10"]],
};

function HeroOverlay() {
  return <span className="hero-shade" aria-hidden="true" />;
}

function ResponsiveHero({ file }: { file:string }) {
  const { page, image } = heroContent[file];
  const replacementKeys: Record<string, string> = {
    home: "home.hero", about: "about.hero", blogs: "blogs.hero", service: "residential-new-builds.hero",
    serviceRenovations: "renovations-alterations.hero", serviceExtensions: "additions-extensions.hero",
  };
  const replacement = clientImages[replacementKeys[page]];
  const original: SiteImage = replacement ?? { src: `/design/${image}`, alt: "", width: 1440, height: 820 };
  const extra = heroAlternatives[page] ?? [];
  const images = [original, ...extra].filter((photo, index, all) => all.findIndex(other => other.src === photo.src) === index);
  const hero = pageCopy[page].hero;
  const secondary = file === "hero-services.png" ? { label: "ABOUT US", href: "/about-onsite-building-auckland" } : { label: "SERVICES", href: "/services-auckland" };
  return <section className="responsive-hero"><HeroSlideshow images={images} label={`${hero.title} photographs`} /><HeroOverlay/><div className="hero-content"><h1>{hero.title}</h1><p>{copyParagraphs(hero)[0]}</p><div><Link className="cta-button cta-button-on-image" href="/contact-auckland-builders">CONTACT</Link><Link className="cta-button cta-button-on-image" href={secondary.href}>{secondary.label}</Link></div></div></section>;
}

function HomeAbout() {
  return <section className="home-about-section">
    <div className="home-about-copy">
      <h2>{masterContent.about.title}</h2>
      {masterContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link className="cta-button" href="/about-onsite-building-auckland">ABOUT US</Link>
    </div>
    <div className="home-about-placeholder"><Image src={clientImages["home.about"].src} alt={clientImages["home.about"].alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
  </section>;
}

const serviceCards = [
  [masterContent.services.labels.renovations,clientImages["renovations-alterations.hero"].src,"/services/home-renovations-south-auckland","renovations-alterations"],
  [masterContent.services.labels.newBuilds,clientImages["residential-new-builds.hero"].src,"/services/new-home-builders-south-auckland","residential-new-builds"],
  [masterContent.services.labels.designBuild,clientImages["design-build.overview"].src,"/services/design-and-build-east-auckland","design-build"],
  [masterContent.services.labels.extensions,clientImages["additions-extensions.hero"].src,"/services/home-extensions-south-auckland","additions-extensions"],
];

function ServicesSection() {
  return <section className="services-section"><div className="content-shell"><h2>{masterContent.services.title}</h2><p>{masterContent.services.description}</p><div className="services-grid">
    {serviceCards.map(([title,image,href,id])=><Link id={id} href={href} className="service-card" key={title}><Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 25vw" /><span><strong>{title}</strong><small>LEARN MORE&nbsp; →</small></span></Link>)}
    <Link id="light-commercial-construction" href="/services/light-commercial-builders-south-auckland" className="service-card service-card-wide"><Image src="/design/figma-service-commercial.webp" alt="" fill sizes="100vw" /><span><strong>{masterContent.services.labels.commercial}</strong><small>LEARN MORE&nbsp; →</small></span></Link>
  </div></div></section>;
}

function ContactCTA({ blue = false }: { blue?: boolean }) {
  return <section className={`contact-cta ${blue ? "contact-cta-blue" : ""}`}><div className="content-shell"><div className="contact-heading"><h2>{masterContent.contact.title}</h2><p>{masterContent.contact.description}</p></div><div className="contact-methods">
    <a href={`mailto:${masterContent.business.email}`}><b><Image src="/icons/email.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.emailLabel}</strong><span>{masterContent.business.email}</span></a>
    <a href={masterContent.business.phoneHref}><b><Image src="/icons/phone.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.phoneLabel}</strong><span>{masterContent.business.phone}</span></a>
    <span><b><Image src="/icons/pin.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.areasLabel}</strong><Link href={paths.serviceAreas} className="contact-areas-link">{coverageRegions.map(region => region.id === "north-auckland" ? "North Shore" : region.name).join(" · ")}</Link></span>
  </div></div></section>;
}

function EnquirySection({ withMap = true }: { withMap?: boolean }) {
  return <section className={`enquiry-section ${withMap ? "with-map" : ""}`}><div className="content-shell enquiry-grid"><EnquiryForm services={Object.values(masterContent.services.labels)} phone={masterContent.business.phone} phoneHref={masterContent.business.phoneHref} email={masterContent.business.email} />{withMap && <ServiceAreaMap className="map-panel" />}</div></section>;
}

export function SiteFooter({ file }: { file: string }) {
  const labels = masterContent.services.labels;
  const services = [
    [labels.renovations, paths.serviceRenovations],
    [labels.newBuilds, paths.service],
    [labels.designBuild, paths.serviceDesignBuild],
    [labels.extensions, paths.serviceExtensions],
    [labels.commercial, paths.serviceCommercial],
    ["All Services", paths.services],
  ] as const;
  const projectLinks = [
    ...projects.map(project => [project.name, project.href] as const),
    ["All Projects", paths.projects] as const,
  ];
  return <footer className="site-footer"><div className="content-shell">
    <div className="footer-top">
      <div className="footer-brand-column">
        <Link href="/" className="brand header-brand footer-brand" aria-label="On Site Building Construction Limited home"><span className="header-logo"><Image src="/osbc-header-logo-cropped.svg" alt="On Site Building Construction Limited" fill sizes="(max-width: 800px) 240px, 340px" unoptimized /></span></Link>
        <div className="footer-contact-details">
          <div><strong>Phone</strong><a href={masterContent.business.phoneHref}>{masterContent.business.phone}</a></div>
          <div><strong>Email</strong><a href={`mailto:${masterContent.business.email}`}>{masterContent.business.email}</a></div>
        </div>
      </div>
      <nav className="footer-link-column" aria-label="Footer services">
        <h2>Services</h2>
        <ul>{services.map(([label,href]) => <li key={href}><Link href={href}>{displayServiceLabel(label)}</Link></li>)}</ul>
      </nav>
      <nav className="footer-link-column" aria-label="Footer projects">
        <h2>Projects</h2>
        <ul>{projectLinks.map(([label,href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
      </nav>
      <nav className="footer-link-column footer-regions" aria-label="Footer service areas">
        <h2>Service Areas</h2>
        <ul>{coverageRegions.map(region => <li key={region.id}><Link href={`${paths.serviceAreas}#coverage-${region.id}`}>{region.name}</Link></li>)}</ul>
      </nav>
    </div>
    <div className="footer-bottom"><span>© 2026 Onsite Building Construction Limited. All rights reserved.</span><nav aria-label="Legal links"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></nav></div>
  </div></footer>;
}

function VisualSection({ section, page }: { section: Section; page: PageKey }) {
  const [file,,,kind] = section;
  if (kind === "nav") return <SiteHeader file={file} />;
  if (kind === "hero") return <ResponsiveHero file={file} />;
  if (file === "home-about.jpg") return <HomeAbout />;
  if (file === "home-work.png") return <PhotoGallery title="OUR WORK" images={projects.map(project => ({ ...project.hero, href: project.href, label: project.name }))} />;
  if (file === "service-work.png") return <PhotoGallery title="OUR WORK" images={serviceMedia[servicePageKeys[page]].gallery} />;
  if (file.startsWith("testimonials")) return null;
  if (file === "home-services.png" || file === "services-list.png") return <ServicesSection />;
  if (file.startsWith("certification-")) return <CertificationSection blue={file === "certification-about.png" || file === "certification-home.png"} />;
  if (file === "about-intro.jpg") return <IntroSection type="about" />;
  if (file === "service-intro.jpg") return <IntroSection type="service" />;
  if (file === "service-intro-renovations.jpg") return <IntroSection type="renovations" />;
  if (file === "service-intro-design-build.jpg") return <IntroSection type="designBuild" />;
  if (file === "service-intro-extensions.jpg") return <IntroSection type="extensions" />;
  if (file === "service-intro-commercial.jpg") return <IntroSection type="commercial" />;
  if (file === "about-values.png") return <ValuesSection />;
  if (file === "about-mission.png") return <MissionSection />;
  if (file === "service-benefits.png") return <BenefitsSection />;
  if (file === "service-benefits-renovations.png") return <BenefitsSection service="renovations" />;
  if (file === "service-benefits-design-build.png") return <BenefitsSection service="designBuild" />;
  if (file === "service-benefits-extensions.png") return <BenefitsSection service="extensions" />;
  if (file === "service-benefits-commercial.png") return <BenefitsSection service="commercial" />;
  if (file === "projects-grid.png") return <ProjectsSection />;
  if (file === "services-projects.png") return <ProjectsSection compact />;
  if (file === "project-whitford.jpg") return <ProjectOverviewSection project="whitford" />;
  if (file === "project-new-lynn.jpg") return <ProjectOverviewSection project="newLynn" />;
  if (file === "project-manukau.jpg") return <ProjectOverviewSection project="manukau" />;
  if (file === "project-botany.jpg") return <ProjectOverviewSection project="botany" />;
  if (file === "projects-related-whitford.png") return <ProjectsSection relatedTo="whitford" />;
  if (file === "projects-related-new-lynn.png") return <ProjectsSection relatedTo="newLynn" />;
  if (file === "projects-related-manukau.png") return <ProjectsSection relatedTo="manukau" />;
  if (file === "projects-related-botany.png") return <ProjectsSection relatedTo="botany" />;
  if (file === "blogs-grid.png") return <BlogsSection />;
  if (file === "blogs-services.png") return <ServicesPromoSection />;
  if (file.startsWith("blog-article")) return <BlogArticleSection page={page as BlogKey} />;
  if (file === "blog-related.png") return <RelatedBlogsSection page={page as BlogKey} />;
  if (file === "contact-map.png") return <ServiceAreaSection />;
  if (file.startsWith("contact-strip")) return <ContactCTA blue={file.includes("whitford") || file.includes("new-lynn") || file.includes("blogs") || file.includes("blog") || file.includes("about")} />;
  if (file.startsWith("contact-form-map")) return <EnquirySection />;
  if (file === "contact-form.png") return <EnquirySection withMap={false} />;
  if (file.startsWith("footer-")) return <SiteFooter file={file} />;
  return null;
}

function ProjectHero({ hero, project }: { hero: [string,string]; project: ProjectKey }) {
  const photos = getProject(project);
  const images = [photos.hero, ...photos.gallery.slice(0,1)];
  return <section className="project-hero"><HeroSlideshow images={images} label={`${photos.name} project photographs`} /><HeroOverlay/><div><h1>{hero[0]}</h1><p>{hero[1]}</p><div className="project-actions"><Link className="cta-button cta-button-on-image" href="/contact-auckland-builders">CONTACT</Link><Link className="cta-button cta-button-on-image" href="/services-auckland">SERVICES</Link></div></div></section>;
}

export function SitePage({ page }: { page: PageKey }) {
  if (page === "serviceAreas") return <div className="site-canvas">
    <SiteHeader file="navbar-services.png" />
    <main id="main-content">
      <header className="interior-intro content-shell"><h1>Service Areas</h1><p>Based in South Auckland, we work across Auckland, Waikato and Whangārei.</p></header>
      <CoverageSection />
    </main><SiteFooter file="footer-serviceAreas.png" />
  </div>;
  const config = pages[page];
  const [nav, ...rest] = config.sections;
  const footer = rest.find(section => section[0].startsWith("footer-"));
  return <div className="site-canvas" data-page={page}>
    <RevealObserver /><VisualSection section={nav} page={page} />
    <main id="main-content">
      {config.projectHero && <ProjectHero hero={config.projectHero} project={page as ProjectKey} />}
      {rest.filter(section => !section[0].startsWith("testimonials") && !section[0].startsWith("footer-")).map((section, index) =>
        <div key={section[0]} data-reveal={section[3] === "hero" ? undefined : ""}>
          {config.spacer && index === 1 ? <div style={{height:config.spacer,background:"var(--blue)"}} /> : null}
          <VisualSection section={section} page={page} />
        </div>)}
    </main>
    {footer && <VisualSection section={footer} page={page} />}
  </div>;
}
