import Image from "next/image";
import Link from "next/link";
import { ScrollableWorkGallery, TestimonialsCarousel } from "./interactive-sections";
import { RevealObserver } from "./reveal-observer";
import { ServiceAreaMap } from "./service-area-map";
import {
  BenefitsSection,
  BlogArticleSection,
  BlogsSection,
  CertificationSection,
  IntroSection,
  MissionSection,
  ProjectGallerySection,
  ProjectOverviewSection,
  ProjectsSection,
  RelatedBlogsSection,
  ServiceAreaSection,
  ServicesPromoSection,
  ValuesSection,
} from "./content-sections";

export type PageKey = "home" | "services" | "service" | "projects" | "whitford" | "newLynn" | "about" | "blogs" | "blog" | "contact";
export const slugToPage: Record<string, PageKey> = {
  services: "services", "services/residential-new-builds": "service", projects: "projects",
  "projects/whitford-heights": "whitford", "projects/new-lynn": "newLynn", about: "about",
  blogs: "blogs", "blogs/renovate-or-rebuild": "blog", contact: "contact",
};

type Kind = "nav" | "hero" | "form";
type Section = [src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number];
const s = (src: string, height: number, alt: string, kind?: Kind, width?: number, offsetX?: number): Section => [src, height, alt, kind, width, offsetX];

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
  projects: { sections: [
    s("navbar-projects.png",80,"Projects navigation","nav"), s("hero-projects.png",820,"A Closer Look at Our Work","hero"), s("projects-grid.png",1083,"Our projects"),
    s("contact-strip-projects.png",612,"Contact details"), s("contact-form-map-projects.png",878,"Project enquiry form and map","form"), s("footer-projects.png",279,"Footer navigation") ] },
  whitford: { projectHero: ["WHITFORD HEIGHTS","A luxury design-and-build home created from the ground up for a couple in Whitford Heights, combining exceptional living spaces, personal touches and impressive features designed for both comfort and entertainment."], sections: [
    s("navbar-whitford.png",80,"Whitford Heights project navigation","nav"), s("project-whitford.jpg",739,"Whitford Heights project overview"), s("project-gallery.png",531,"Whitford Heights gallery"),
    s("projects-related-whitford.png",624,"Related projects"), s("contact-strip-whitford.png",612,"Contact details"), s("footer-whitford.png",279,"Footer navigation") ] },
  newLynn: { projectHero: ["NEW LYNN","A modern two-storey, four-bedroom home in New Lynn, designed around indoor-outdoor living, with a kitchen that opens directly onto the deck and an inviting outdoor entertainment area."], sections: [
    s("navbar-new-lynn.png",80,"New Lynn project navigation","nav"), s("project-new-lynn.jpg",739,"New Lynn project overview"), s("project-gallery.png",531,"New Lynn project gallery"),
    s("projects-related-new-lynn.png",624,"Related projects"), s("contact-strip-new-lynn.png",612,"Contact details"), s("footer-new-lynn.png",279,"Footer navigation") ] },
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
  contact: { sections: [
    s("navbar-contact.png",80,"Contact navigation","nav"), s("hero-contact.png",820,"Every Great Project Starts with a Chat","hero"), s("contact-strip-contact.png",612,"Contact details",undefined,1438,2),
    s("contact-form.png",878,"Project enquiry form","form"), s("contact-map.png",854,"Auckland, Waikato and Whangārei service area map"), s("footer-contact.png",279,"Footer navigation") ] },
};

function SiteHeader({ file }: { file: string }) {
  const active = file.replace("navbar-", "").replace(".png", "");
  const items = [["Home","/","home"],["About us","/about","about"],["Contact us","/contact","contact"],["Blogs","/blogs","blogs"],["Projects","/projects","projects"]];
  const serviceItems = [["All Services","/services"],["Renovations & Alterations","/services#renovations-alterations"],["Residential New Builds","/services/residential-new-builds"],["Design & Build","/services#design-build"],["Additions & Extensions","/services#additions-extensions"],["Light Commercial Construction","/services#light-commercial-construction"]];
  const servicesActive = active.startsWith("service");
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand header-brand" aria-label="On Site Building Construction Limited home">
      <span className="header-logo"><Image src="/osbc-header-logo.png" alt="On Site Building Construction Limited" fill sizes="(max-width: 800px) 240px, 340px" priority unoptimized /></span>
    </Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link href="/" className={active === "home" ? "active" : ""}>Home</Link>
      <div className={`nav-service-dropdown ${servicesActive ? "active" : ""}`}>
        <Link className="nav-service-trigger" href="/services">Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></Link>
        <div className="service-dropdown-menu">{serviceItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>
      </div>
      {items.slice(1).map(([label,href,key])=><Link key={href} href={href} className={active.includes(key) ? "active" : ""}>{label}</Link>)}
      <a className="phone-button" href="tel:0272868693">027 286 8693</a>
    </nav>
    <details className="mobile-nav"><summary>MENU</summary><nav>
      <Link href="/">Home</Link>
      <details className="mobile-service-menu"><summary>Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg></summary><div>{serviceItems.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div></details>
      {items.slice(1).map(([label,href])=><Link key={href} href={href}>{label}</Link>)}<a href="tel:0272868693">027 286 8693</a>
    </nav></details>
  </div></header>;
}

const heroContent: Record<string,{title:string;copy:string;image:string}> = {
  "hero-home.png": { title:"BUILT AROUND THE WAY YOU LIVE.", copy:"From renovations and extensions to new builds, On Site Building Construction brings over 30 years of experience to every project. We also offer complete design-and-build services throughout Auckland, Waikato and Whangārei.", image:"hero-home-photo.jpg" },
  "hero-services.png": { title:"YOUR HOME. REIMAGINED.", copy:"Whether you’re transforming an existing home or building something new, we take the time to understand your vision, offer honest advice and guide you through every stage of your project.", image:"hero-services-photo.jpg" },
  "hero-service.png": { title:"A NEW HOME, BUILT AROUND YOU", copy:"Every new home starts with understanding what matters to you. We take the time to discuss your plans, offer honest guidance and bring your vision to life.", image:"hero-service-photo.jpg" },
  "hero-projects.png": { title:"A CLOSER LOOK AT OUR WORK", copy:"From home renovations and new builds to light commercial projects, take a look at the work that reflects our passion for building, practical approach and commitment to quality workmanship.", image:"hero-projects-photo.jpg" },
  "hero-about.png": { title:"OUR STORY. YOUR FUTURE PROJECT.", copy:"Founded in 2003, On Site Building Construction brings over 30 years of building experience, honest communication and a genuine passion for creating spaces clients are proud to call home.", image:"hero-about-photo.jpg" },
  "hero-blogs.png": { title:"BUILDING ADVICE, WITHOUT THE GUESSWORK", copy:"Explore practical advice on home renovations, extensions and new builds, with helpful insights to guide your decisions and plan your next project.", image:"hero-blogs-photo.jpg" },
  "hero-blog.png": { title:"RENOVATE OR REBUILD? WHAT’S RIGHT FOR YOUR HOME?", copy:"Deciding whether to renovate your existing home or start fresh? Explore the key considerations to help you understand your options and make an informed decision.", image:"hero-home-photo.jpg" },
  "hero-contact.png": { title:"EVERY GREAT PROJECT STARTS WITH A CHAT", copy:"Whether you’re planning a renovation, extension or new build, we’re here to help. Get in touch with On Site Building Construction to discuss your project.", image:"hero-contact-photo.jpg" },
};

function ResponsiveHero({ file }: { file:string }) {
  const hero = heroContent[file];
  return <section className="responsive-hero"><Image src={`/design/${hero.image}`} alt="" fill priority sizes="100vw" unoptimized/><div className="hero-shade"/><div className="hero-content"><h1>{hero.title}</h1><p>{hero.copy}</p><div><Link className="cta-button cta-button-on-image" href="/contact">CONTACT</Link><Link className="cta-button cta-button-on-image" href="/services">SERVICES</Link></div></div></section>;
}

function HomeAbout() {
  return <section className="home-about-section">
    <div className="home-about-copy">
      <h2>ABOUT ON SITE<br/>BUILDING<br/>CONSTRUCTION</h2>
      <p>Founded in 2003, On Site Building Construction draws on building experience dating back to 1994, with practical skills and care. With strong roots in South Auckland, the business has built its reputation through hard work, experience and word-of-mouth referrals.</p>
      <p>From transforming existing homes to building new ones, we take pride in understanding what our clients want to achieve. We believe good communication, honest advice and a practical approach make all the difference throughout the building journey.</p>
      <p>Working alongside a trusted network of builders and specialist trades, we bring the experience and people needed to see each project through, with a genuine commitment to delivering a result our clients are happy with.</p>
      <Link className="cta-button" href="/about">ABOUT US</Link>
    </div>
    <div className="home-about-placeholder"><Image src="/design/hero-about-photo.jpg" alt="On Site Building Construction project" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div>
  </section>;
}

const serviceCards = [
  ["RENOVATIONS & ALTERATIONS","service-renovations.jpg","/services","renovations-alterations"],
  ["RESIDENTIAL NEW BUILDS","service-new-builds.jpg","/services/residential-new-builds","residential-new-builds"],
  ["DESIGN & BUILD","service-design-build.jpg","/services","design-build"],
  ["ADDITIONS & EXTENSIONS","service-extensions.jpg","/services","additions-extensions"],
];

function ServicesSection() {
  return <section className="services-section"><div className="content-shell"><h2>OUR SERVICES</h2><p>From renovations to new builds, we bring experience to every project.</p><div className="services-grid">
    {serviceCards.map(([title,image,href,id])=><Link id={id} href={href} className="service-card" key={title}><Image src={`/design/${image}`} alt="" fill sizes="(max-width: 800px) 100vw, 25vw" unoptimized/><span><strong>{title}</strong><small>LEARN MORE&nbsp; →</small></span></Link>)}
    <Link id="light-commercial-construction" href="/services" className="service-card service-card-wide"><Image src="/design/light-commercial.jpg" alt="" fill sizes="100vw" unoptimized/><span><strong>LIGHT COMMERCIAL<br/>CONSTRUCTION</strong><small>LEARN MORE&nbsp; →</small></span></Link>
  </div></div></section>;
}

function ContactCTA({ blue = false }: { blue?: boolean }) {
  return <section className={`contact-cta ${blue ? "contact-cta-blue" : ""}`}><div className="content-shell"><div className="contact-heading"><h2>Let’s Talk About Your Project</h2><p>Planning a renovation, extension or new build? Tell us about your plans and let’s discuss how we can bring your project to life.</p></div><div className="contact-methods">
    <a href="mailto:onsitebuilding1@gmail.com"><b><Image src="/icons/email.svg" alt="" width={42} height={42} unoptimized /></b><strong>EMAIL</strong><span>onsitebuilding1@gmail.com</span></a>
    <a href="tel:021715196"><b><Image src="/icons/phone.svg" alt="" width={42} height={42} unoptimized /></b><strong>PHONE</strong><span>021 715 196</span></a>
    <span><b><Image src="/icons/pin.svg" alt="" width={42} height={42} unoptimized /></b><strong>SERVICE AREAS</strong><u>Auckland, Waikato &amp; Whangārei</u></span>
  </div></div></section>;
}

function EnquirySection({ withMap = true }: { withMap?: boolean }) {
  return <section className={`enquiry-section ${withMap ? "with-map" : ""}`}><div className="content-shell enquiry-grid"><form action="/contact" method="get" aria-label="Project enquiry form">
    <div className="field-pair"><label>FIRST NAME*<input name="firstName" placeholder="First Name" /></label><label>LAST NAME*<input name="lastName" placeholder="Last Name" /></label></div>
    <div className="field-pair"><label>EMAIL*<input name="email" type="email" placeholder="Email" /></label><label>PHONE*<input name="phone" type="tel" placeholder="+64 21 345 6789" /></label></div>
    <label>SELECT A SERVICE*<select name="service" defaultValue=""><option value="">Select One...</option><option>Residential new builds</option><option>Renovations and alterations</option><option>Design and build</option></select></label>
    <label>PROJECT SIZE<select name="size" defaultValue="25 sqm"><option>25 sqm</option><option>50 sqm</option><option>100+ sqm</option></select></label>
    <label>UPLOAD FILES HERE<input name="files" placeholder="E.g Designs or Building Consents" /></label>
    <label>MESSAGE<textarea name="message" placeholder="Type your message here..." /></label>
    <label className="checkbox"><input type="checkbox" name="terms" /> I AGREE TO THE TERMS AND CONDITIONS</label><button className="cta-button" type="submit">SUBMIT</button>
  </form>{withMap && <ServiceAreaMap className="map-panel" />}</div></section>;
}

function SiteFooter({ file }: { file: string }) {
  const page = file.replace("footer-", "").replace(".png", "");
  const active = page === "service" ? "services" : page === "blog" ? "blogs" : ["whitford", "new-lynn"].includes(page) ? "projects" : page;
  const items = [["Home","/","home"],["Services","/services","services"],["About us","/about","about"],["Contact us","/contact","contact"],["Blogs","/blogs","blogs"],["Projects","/projects","projects"]];
  return <footer className="site-footer"><div className="content-shell"><div className="footer-top"><Link href="/" className="brand"><span className="brand-mark">OSBC</span><span>ON SITE BUILDING CONSTRUCTION<small>LIMITED</small></span></Link><nav aria-label="Footer navigation">{items.map(([label, href, key]) => <Link key={href} href={href} className={active === key ? "active" : ""} aria-current={active === key ? "page" : undefined}>{label}</Link>)}</nav></div><div className="footer-bottom"><span>© Developed by GMFB LTD. All rights reserved.</span><Link href="#">Privacy Policy</Link></div></div></footer>;
}

function VisualSection({ section }: { section: Section }) {
  const [file,,,kind] = section;
  if (kind === "nav") return <SiteHeader file={file} />;
  if (kind === "hero") return <ResponsiveHero file={file} />;
  if (file === "home-about.jpg") return <HomeAbout />;
  if (file === "home-work.png") return <ScrollableWorkGallery />;
  if (file === "service-work.png") return <ScrollableWorkGallery />;
  if (file.startsWith("testimonials")) return <TestimonialsCarousel />;
  if (file === "home-services.png" || file === "services-list.png") return <ServicesSection />;
  if (file.startsWith("certification-")) return <CertificationSection />;
  if (file === "about-intro.jpg") return <IntroSection type="about" />;
  if (file === "service-intro.jpg") return <IntroSection type="service" />;
  if (file === "about-values.png") return <ValuesSection />;
  if (file === "about-mission.png") return <MissionSection />;
  if (file === "service-benefits.png") return <BenefitsSection />;
  if (file === "projects-grid.png") return <ProjectsSection />;
  if (file === "services-projects.png") return <ProjectsSection compact />;
  if (file === "project-whitford.jpg") return <ProjectOverviewSection project="whitford" />;
  if (file === "project-new-lynn.jpg") return <ProjectOverviewSection project="newLynn" />;
  if (file === "project-gallery.png") return <ProjectGallerySection />;
  if (file === "projects-related-whitford.png") return <ProjectsSection relatedTo="whitford" />;
  if (file === "projects-related-new-lynn.png") return <ProjectsSection relatedTo="newLynn" />;
  if (file === "blogs-grid.png") return <BlogsSection />;
  if (file === "blogs-services.png") return <ServicesPromoSection />;
  if (file === "blog-article.jpg") return <BlogArticleSection />;
  if (file === "blog-related.png") return <RelatedBlogsSection />;
  if (file === "contact-map.png") return <ServiceAreaSection />;
  if (file.startsWith("contact-strip")) return <ContactCTA blue={file.includes("whitford") || file.includes("new-lynn") || file.includes("blogs") || file.includes("blog") || file.includes("about")} />;
  if (file.startsWith("contact-form-map")) return <EnquirySection />;
  if (file === "contact-form.png") return <EnquirySection withMap={false} />;
  if (file.startsWith("footer-")) return <SiteFooter file={file} />;
  return null;
}

function PlaceholderProjectHero({ hero }: { hero: [string,string] }) {
  const image = hero[0] === "NEW LYNN" ? "hero-service-photo.jpg" : "hero-home-photo.jpg";
  return <section className="project-hero"><Image src={`/design/${image}`} alt="" fill priority sizes="100vw" unoptimized /><span className="project-hero-shade"/><div><h1>{hero[0]}</h1><p>{hero[1]}</p><div className="project-actions"><Link className="cta-button cta-button-on-image" href="/contact">CONTACT</Link><Link className="cta-button cta-button-on-image" href="/services">SERVICES</Link></div></div></section>;
}

export function SitePage({ page }: { page: PageKey }) {
  const config = pages[page]; const [nav,...rest] = config.sections;
  return <main className="site-canvas" data-page={page}><RevealObserver/><VisualSection section={nav}/>{config.projectHero && <PlaceholderProjectHero hero={config.projectHero}/>} {rest.map((section,index) =>
    <div key={section[0]} data-reveal={section[3] === "hero" ? undefined : ""}>{config.spacer && index === 1 ? <div style={{height:config.spacer,background:"var(--blue)"}}/> : null}<VisualSection section={section}/></div>)}</main>;
}
