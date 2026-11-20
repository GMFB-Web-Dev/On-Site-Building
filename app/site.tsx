import Image from "next/image";
import Link from "next/link";
import { MobileNavigation } from "./mobile-navigation";
import { ScrollableWorkGallery, TestimonialsCarousel } from "./interactive-sections";
import { RevealObserver } from "./reveal-observer";
import { ServiceAreaMap } from "./service-area-map";
import { masterContent, pageCopy, copyParagraphs, type CopyPageKey } from "./master-content";
export { slugToPage } from "./site-routes";
import { homeAboutImage, projectImages, pageHeroImages, serviceCardImages } from "./site-images";
import {
  BenefitsSection,
  CertificationSection,
  IntroSection,
  MissionSection,
  ProjectOverviewSection,
  ProjectGallerySection,
  ProjectsSection,
  ServiceAreaSection,
  ServicesPromoSection,
  ValuesSection,
} from "./content-sections";

export type PageKey = "home" | "services" | "service" | "serviceRenovations" | "serviceDesignBuild" | "serviceExtensions" | "serviceCommercial" | "projects" | "whitford" | "newLynn" | "manukau" | "botany" | "about" | "blogs" | "blog" | "blogExtension" | "blogBlending" | "blogCommercial" | "blogDesignBuild" | "blogNewHome" | "contact";

type Kind = "nav" | "hero" | "form";
type Section = [src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number];
const s = (src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number): Section => [src, height, alt, kind, width, offsetX];

function projectHero(page: "whitford" | "newLynn" | "manukau" | "botany"): [string, string] {
  const hero = pageCopy[page].hero;
  return [hero.title, copyParagraphs(hero)[0]];
}

const pages: Record<PageKey, { sections: Section[]; projectHero?: [string, string]; spacer?: number }> = {
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

export function SiteHeader({ file }: { file: string }) {
  const active = file.replace("navbar-", "").replace(".png", "");
  const items = [["Home","/","home"],["About us","/about-onsite-building-auckland","about"],["Contact us","/contact-auckland-builders","contact"],["Blogs","/building-advice-auckland","blogs"]];
  const labels = masterContent.services.labels;
  const serviceItems = [[labels.renovations,"/services-auckland/home-renovations-south-auckland"],[labels.newBuilds,"/services-auckland/new-home-builders-south-auckland"],[labels.designBuild,"/services-auckland/design-and-build-east-auckland"],[labels.extensions,"/services-auckland/home-extensions-south-auckland"],[labels.commercial,"/services-auckland/light-commercial-builders-south-auckland"]];
  const projectItems = [["New Lynn","/projects/new-lynn-new-home-west-auckland"],["Manukau Heights","/projects/manukau-heights-new-home-auckland"],["Whitford Heights","/projects/whitford-heights-design-build-auckland"],["Botany","/projects/botany-new-home-east-auckland"]];
  const servicesActive = active.startsWith("service");
  const projectsActive = ["projects", "whitford", "new-lynn", "manukau", "botany"].includes(active);
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand header-brand" aria-label="On Site Building Construction Limited home">
      <span className="header-logo"><Image src="/osbc-header-logo.png" alt="On Site Building Construction Limited" fill loading="eager" unoptimized /></span>
    </Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
      <div className={`nav-service-dropdown ${servicesActive ? "active" : ""}`}>
        <Link className="nav-service-trigger" href="/services-auckland">Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></Link>
        <div className="service-dropdown-menu">{serviceItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>
      </div>
      {items.slice(1).map(([label,href,key])=><Link key={href} href={href} className={key === "blogs" ? (active.startsWith("blog") ? "active" : "") : (active.includes(key) ? "active" : "")}>{label}</Link>)}
      <div className={`nav-service-dropdown ${projectsActive ? "active" : ""}`}>
        <Link className="nav-service-trigger" href="/building-projects-auckland">Projects <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></Link>
        <div className="service-dropdown-menu">{projectItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>
      </div>
      <a className="phone-button" href={masterContent.business.phoneHref}>{masterContent.business.phone}</a>
    </nav>
    <MobileNavigation>
      <Link href="/">Home</Link>
      <details className="mobile-service-menu" name="mobile-navigation-section"><summary><Link href="/services-auckland">Services</Link> <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></summary><div>{serviceItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div></details>
      {items.slice(1).map(([label,href])=><Link key={href} href={href}>{label}</Link>)}
      <details className="mobile-service-menu" name="mobile-navigation-section"><summary>Projects <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></summary><div>{projectItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div></details>
      <a href={masterContent.business.phoneHref}>{masterContent.business.phone}</a>
    </MobileNavigation>
  </div></header>;
}

const heroContent: Record<string, { page: CopyPageKey; image: string }> = {
  "hero-home.png": { page: "home", image: "figma-blog-renovate-rebuild.png" },
  "hero-services.png": { page: "services", image: "figma-services-hero.png" },
  "hero-service.png": { page: "service", image: "figma-newbuild-hero.png" },
  "hero-service-renovations.png": { page: "serviceRenovations", image: "figma-service-renovations.png" },
  "hero-service-design-build.png": { page: "serviceDesignBuild", image: "figma-service-design-build.png" },
  "hero-service-extensions.png": { page: "serviceExtensions", image: "figma-service-extensions.png" },
  "hero-service-commercial.png": { page: "serviceCommercial", image: "figma-service-commercial.png" },
  "hero-projects.png": { page: "projects", image: "figma-blog-extension.png" },
  "hero-about.png": { page: "about", image: "figma-blog-commercial.png" },
  "hero-blogs.png": { page: "blogs", image: "figma-blogs-hero.png" },
  "hero-blog.png": { page: "blog", image: "figma-blog-renovate-rebuild.png" },
  "hero-blog-extension.png": { page: "blogExtension", image: "figma-blog-extension.png" },
  "hero-blog-blending.png": { page: "blogBlending", image: "figma-blog-blending.png" },
  "hero-blog-commercial.png": { page: "blogCommercial", image: "figma-blog-commercial.png" },
  "hero-blog-design-build.png": { page: "blogDesignBuild", image: "figma-blog-design-build.png" },
  "hero-blog-new-home.png": { page: "blogNewHome", image: "figma-blog-new-home.png" },
  "hero-contact.png": { page: "contact", image: "figma-blog-new-home.png" },
};

export function HeroOverlay() {
  return <span className="hero-shade" aria-hidden="true" />;
}

export function ResponsiveHero({ file }: { file:string }) {
  const { page, image } = heroContent[file];
  const hero = pageCopy[page].hero;
  const secondary = file === "hero-services.png" ? { label: "ABOUT US", href: "/about-onsite-building-auckland" } : { label: "SERVICES", href: "/services-auckland" };
  const assignedImage = pageHeroImages[page];
  return <section className="responsive-hero"><Image src={assignedImage?.src ?? `/design/${image}`} alt={assignedImage?.alt ?? ""} fill preload sizes="(max-width: 800px) max(100vw, 520px), 100vw" /><HeroOverlay/><div className="hero-content"><h1>{hero.title}</h1><p>{copyParagraphs(hero)[0]}</p><div><Link className="cta-button cta-button-on-image" href="/contact-auckland-builders">CONTACT</Link><Link className="cta-button cta-button-on-image" href={secondary.href}>{secondary.label}</Link></div></div></section>;
}

function HomeAbout() {
  return <section className="home-about-section">
    <div className="home-about-copy">
      <h2>{masterContent.about.title}</h2>
      {masterContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link className="cta-button" href="/about-onsite-building-auckland">ABOUT US</Link>
    </div>
    <div className="home-about-photo"><Image src={homeAboutImage.src} alt={homeAboutImage.alt} fill sizes="(max-width: 800px) calc(100vw - 48px), 50vw" /></div>
  </section>;
}

const serviceCards = [
  [masterContent.services.labels.renovations,"figma-service-renovations.png","/services-auckland/home-renovations-south-auckland","renovations-alterations"],
  [masterContent.services.labels.newBuilds,"figma-service-new-builds.png","/services-auckland/new-home-builders-south-auckland","residential-new-builds"],
  [masterContent.services.labels.designBuild,"figma-service-design-build.png","/services-auckland/design-and-build-east-auckland","design-build"],
  [masterContent.services.labels.extensions,"figma-service-extensions.png","/services-auckland/home-extensions-south-auckland","additions-extensions"],
];

function ServicesSection() {
  return <section className="services-section"><div className="content-shell"><h2>{masterContent.services.title}</h2><p>{masterContent.services.description}</p><div className="services-grid">
    {serviceCards.map(([title,image,href,id])=><Link id={id} href={href} className="service-card" key={title}><Image src={serviceCardImages[id] ?? `/design/${image}`} alt="" fill sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1040px) calc(50vw - 40px), min(25vw - 36px, 304px)" /><span><strong>{title}</strong><small>LEARN MORE&nbsp; →</small></span></Link>)}
    <Link id="light-commercial-construction" href="/services-auckland/light-commercial-builders-south-auckland" className="service-card service-card-wide"><Image src="/design/figma-service-commercial.png" alt="" fill sizes="(max-width: 800px) calc(100vw - 32px), min(100vw - 48px, 1312px)" /><span><strong>{masterContent.services.labels.commercial}</strong><small>LEARN MORE&nbsp; →</small></span></Link>
  </div></div></section>;
}

export function ContactCTA({ blue = false }: { blue?: boolean }) {
  return <section className={`contact-cta ${blue ? "contact-cta-blue" : ""}`}><div className="content-shell"><div className="contact-heading"><h2>{masterContent.contact.title}</h2><p>{masterContent.contact.description}</p></div><div className="contact-methods">
    <a href={`mailto:${masterContent.business.email}`}><b><Image src="/icons/email.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.emailLabel}</strong><span>{masterContent.business.email}</span></a>
    <a href={masterContent.business.phoneHref}><b><Image src="/icons/phone.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.phoneLabel}</strong><span>{masterContent.business.phone}</span></a>
    <span><b><Image src="/icons/pin.svg" alt="" width={42} height={42} unoptimized /></b><strong>{masterContent.contact.areasLabel}</strong><u>{masterContent.business.serviceAreas}</u></span>
  </div></div></section>;
}

function EnquirySection({ withMap = true }: { withMap?: boolean }) {
  return <section className={`enquiry-section ${withMap ? "with-map" : ""}`}><div className="content-shell enquiry-grid"><form action="/contact-auckland-builders" method="get" aria-label="Project enquiry form">
    <div className="field-pair"><label>FIRST NAME*<input name="firstName" placeholder="First Name" /></label><label>LAST NAME*<input name="lastName" placeholder="Last Name" /></label></div>
    <div className="field-pair"><label>EMAIL*<input name="email" type="email" placeholder="Email" /></label><label>PHONE*<input name="phone" type="tel" placeholder="+64 21 345 6789" /></label></div>
    <label>SELECT A SERVICE*<select name="service" defaultValue=""><option value="">Select One...</option>{Object.values(masterContent.services.labels).map((label) => <option key={label}>{label}</option>)}</select></label>
    <label>PROJECT SIZE<select name="size" defaultValue="25 sqm"><option>25 sqm</option><option>50 sqm</option><option>100+ sqm</option></select></label>
    <label>UPLOAD FILES HERE<input name="files" placeholder="E.g Designs or Building Consents" /></label>
    <label>MESSAGE<textarea name="message" placeholder="Type your message here..." /></label>
    <label className="checkbox"><input type="checkbox" name="terms" /> I AGREE TO THE TERMS AND CONDITIONS</label><button className="cta-button" type="submit">SUBMIT</button>
  </form>{withMap && <ServiceAreaMap className="map-panel" />}</div></section>;
}

export function SiteFooter({ file }: { file: string }) {
  const page = file.replace("footer-", "").replace(".png", "");
  const active = page === "service" ? "services" : page === "blog" ? "blogs" : ["whitford", "new-lynn"].includes(page) ? "projects" : page;
  const items = [["Home","/","home"],["Services","/services-auckland","services"],["About us","/about-onsite-building-auckland","about"],["Contact us","/contact-auckland-builders","contact"],["Blogs","/building-advice-auckland","blogs"],["Projects","/building-projects-auckland","projects"]];
  return <footer className="site-footer"><div className="content-shell"><div className="footer-top"><Link href="/" className="brand header-brand footer-brand" aria-label="On Site Building Construction Limited home"><span className="header-logo"><Image src="/osbc-header-logo.png" alt="On Site Building Construction Limited" fill unoptimized /></span></Link><nav aria-label="Footer navigation">{items.map(([label, href, key]) => <Link key={href} href={href} className={active === key ? "active" : ""} aria-current={active === key ? "page" : undefined}>{label}</Link>)}</nav></div><div className="footer-bottom"><span>© Developed by GMFB LTD. All rights reserved.</span><Link href="#">Privacy Policy</Link></div></div></footer>;
}

function VisualSection({ section, page }: { section: Section; page: PageKey }) {
  const [file,,,kind] = section;
  if (kind === "nav") return <SiteHeader file={file} />;
  if (kind === "hero") return <ResponsiveHero file={file} />;
  if (file === "home-about.jpg") return <HomeAbout />;
  if (file === "home-work.png") return <ScrollableWorkGallery />;
  if (file === "service-work.png") return <ScrollableWorkGallery service page={page} />;
  if (file.startsWith("testimonials")) return <TestimonialsCarousel />;
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
  if (file === "blogs-services.png") return <ServicesPromoSection />;
  if (file === "contact-map.png") return <ServiceAreaSection />;
  if (file.startsWith("contact-strip")) return <ContactCTA blue={file.includes("whitford") || file.includes("new-lynn") || file.includes("blogs") || file.includes("blog") || file.includes("about")} />;
  if (file.startsWith("contact-form-map")) return <EnquirySection />;
  if (file === "contact-form.png") return <EnquirySection withMap={false} />;
  if (file.startsWith("footer-")) return <SiteFooter file={file} />;
  return null;
}

function ProjectHero({ hero, project }: { hero: [string,string]; project: keyof typeof projectImages }) {
  const image = projectImages[project].hero;
  return <section className="project-hero"><Image src={image.src} alt={image.alt} fill preload sizes="(max-width: 800px) max(100vw, 560px), 100vw" /><HeroOverlay/><div><h1>{hero[0]}</h1><p>{hero[1]}</p><div className="project-actions"><Link className="cta-button cta-button-on-image" href="/contact-auckland-builders">CONTACT</Link><Link className="cta-button cta-button-on-image" href="/services-auckland">SERVICES</Link></div></div></section>;
}

export function SitePage({ page }: { page: PageKey }) {
  const config = pages[page]; const [nav,...rest] = config.sections;
  return <main className="site-canvas" data-page={page}><RevealObserver/><VisualSection section={nav} page={page}/>{config.projectHero && <ProjectHero hero={config.projectHero} project={page as keyof typeof projectImages}/>} {rest.map((section,index) =>
    <div key={section[0]} data-reveal={section[3] === "hero" ? undefined : ""}>{config.spacer && index === 1 ? <div style={{height:config.spacer,background:"var(--blue)"}}/> : null}<VisualSection section={section} page={page}/>{config.projectHero && index === 0 && <ProjectGallerySection project={page as keyof typeof projectImages}/>}</div>)}</main>;
}
