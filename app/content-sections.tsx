import Image from "next/image";
import Link from "next/link";
import { ServiceAreaMap } from "./service-area-map";

const projects = [
  { title: "NEW LYNN", location: "Auckland", image: "hero-service-photo.jpg", href: "/projects/new-lynn" },
  { title: "MANUKAU HEIGHTS", location: "South Auckland", image: "work-1.jpg", href: "/projects" },
  { title: "WHITFORD HEIGHTS", location: "East Auckland", image: "hero-home-photo.jpg", href: "/projects/whitford-heights" },
  { title: "BOTANY", location: "East Auckland", image: "work-3.jpg", href: "/projects" },
];

const servicesProjects = [
  { title: "PAPAKURA", location: "South Auckland", image: "figma-newbuild-work-1.png", href: "/projects" },
  { title: "TAKANINI COMPLEX", location: "South Auckland", image: "figma-newbuild-work-2.png", href: "/projects" },
  { title: "WHITFORD HEIGHTS", location: "East Auckland", image: "figma-newbuild-work-3.png", href: "/projects/whitford-heights" },
  { title: "BRUCE PULMAN", location: "Takanini", image: "figma-newbuild-hero.png", href: "/projects" },
];

const blogs = [
  { title: "Renovate or Rebuild? What’s Right for Your Home?", image: "figma-blog-renovate-rebuild.png", href: "/blogs/renovate-or-rebuild" },
  { title: "Planning a Home Extension: What to Consider First", image: "figma-blog-extension.png", href: "/blogs" },
  { title: "Blending Old and New in a Home Renovation", image: "figma-blog-blending.png", href: "/blogs" },
  { title: "What Is Light Commercial Construction?", image: "figma-blog-commercial.png", href: "/blogs" },
  { title: "How Does the Design and Build Process Work?", image: "figma-blog-design-build.png", href: "/blogs" },
  { title: "What to Know Before Building a New Home", image: "figma-blog-new-home.png", href: "/blogs" },
];

function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return <header className="section-heading">
    {eyebrow && <span>{eyebrow}</span>}
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </header>;
}

export function CertificationSection() {
  return <section className="certification-section"><div className="content-shell">
    <SectionHeading title={"NZCB CERTIFIED.\nLBP EXPERTISE."} copy="Led by an experienced Licensed Building Practitioner (LBP) and long-standing member of New Zealand Certified Builders (NZCB), On Site Building Construction brings over 30 years of industry experience to residential and commercial builds." />
    <div className="certification-logos" aria-label="Industry memberships and certifications">
      <Image src="/design/nzcb-logo.png" alt="New Zealand Certified Builders" width={146} height={246} unoptimized />
      <Image src="/design/lbp-logo.png" alt="Licensed Building Practitioner" width={209} height={118} unoptimized />
    </div>
  </div></section>;
}

const introCopy = {
  about: {
    eyebrow: "",
    title: "BUILT FROM THE GROUND UP",
    image: "hero-about-photo.jpg",
    paragraphs: [
      "On Site Building Construction was founded in 2003, drawing on building experience dating back to 1994. What began with practical skills, hard work and a passion for building has grown into a trusted construction business serving Auckland, Waikato and Whangārei.",
      "We take the time to understand each client’s ideas, offer honest advice and keep communication clear from start to finish. Whether it is a renovation, extension, new home or light commercial project, our approach stays personal and practical.",
      "Together with a trusted network of builders and specialist trades, we bring the experience and care needed to create spaces our clients are proud of.",
    ],
  },
  service: {
    eyebrow: "",
    title: "RESIDENTIAL NEW BUILDS",
    image: "figma-newbuild-intro.png",
    paragraphs: [
      "On Site Building Construction undertakes residential new builds, constructing homes from the ground up. From foundations and framing through to the finishing stages, we coordinate building work and specialist trades to bring each project together.",
      "Whether you have plans ready or are exploring your options, we begin by understanding your section, design requirements and what you want from your home. We can work alongside an architect if design input is needed.",
      "Throughout the build, On Site works with trusted builders and subcontractors, maintaining open communication and discussing changes as they arise. Our focus is on practical advice, quality workmanship and delivering a finished home that reflects your needs.",
    ],
  },
  renovations: {
    eyebrow: "",
    title: "RENOVATIONS & ALTERATIONS",
    image: "figma-service-renovations.png",
    paragraphs: [
      "A thoughtful renovation can make your existing home work better without losing the character and features you already value. We start by understanding what is not working and what you want the finished space to achieve.",
      "From layout changes and modern upgrades to substantial alterations, our team brings practical advice, careful planning and experienced coordination to every stage of the work.",
      "We manage the details and trusted trades so new and existing construction come together as one considered, well-built home.",
    ],
  },
  designBuild: {
    eyebrow: "",
    title: "DESIGN & BUILD",
    image: "figma-service-design-build.png",
    paragraphs: [
      "Our design-and-build service brings planning, design and construction together through one coordinated process. That means decisions can be tested early against your site, priorities and available budget.",
      "We work closely with designers, consultants and trusted trades to keep information moving and make sure the finished plans are practical to build.",
      "With one experienced team guiding the project, you have clearer communication, fewer handovers and a more connected path from the first conversation to completion.",
    ],
  },
  extensions: {
    eyebrow: "",
    title: "ADDITIONS & EXTENSIONS",
    image: "figma-service-extensions.png",
    paragraphs: [
      "An extension should feel like it has always belonged to your home. We help shape additional living, bedroom, workspace or entertaining areas around the way your household needs to grow.",
      "Our team considers structure, flow, light and the relationship between old and new so the added space works naturally with the rest of the property.",
      "From early planning through construction, we coordinate the details and trades required to deliver a seamless, practical result.",
    ],
  },
  commercial: {
    eyebrow: "",
    title: "LIGHT COMMERCIAL CONSTRUCTION",
    image: "figma-service-commercial.png",
    paragraphs: [
      "Light commercial projects need practical planning, durable construction and clear coordination. We work with owners and project teams to understand how the space needs to function and what delivery constraints matter most.",
      "Our experience covers fit-outs, alterations and smaller commercial builds, with trusted trades coordinated around quality, programme and site requirements.",
      "We keep communication straightforward and the work moving so you can make informed decisions throughout the project.",
    ],
  },
};

export function IntroSection({ type }: { type: keyof typeof introCopy }) {
  const content = introCopy[type];
  const isService = type !== "about";
  return <section className={`split-story-section ${isService ? "service-intro-section" : ""}`}><div className="content-shell split-story-grid">
    <div className="split-story-copy"><SectionHeading eyebrow={content.eyebrow} title={content.title} />
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {!isService && <Link className="cta-button outline-button" href="/contact">TALK TO US</Link>}
    </div>
    <div className="split-story-media"><Image src={`/design/${content.image}`} alt="On Site Building Construction project" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div>
  </div></section>;
}

const values = [
  { title: "PASSION", icon: "value-passion.png", copy: "Building is more than a job to us. We genuinely love what we do and take pride in bringing our clients’ ideas to life." },
  { title: "HONESTY", icon: "value-honesty.png", copy: "We believe in being upfront with our clients, providing honest advice and realistic expectations throughout every stage of their project." },
  { title: "COMMUNICATION", icon: "value-communication.png", copy: "We take the time to understand your vision, answer questions and keep you informed, making the building process easier to navigate." },
  { title: "EXPERIENCE", icon: "value-experience.png", copy: "With over 30 years in the building industry, we bring practical knowledge and experience to every project, from renovations to new builds." },
];

export function ValuesSection() {
  return <section className="values-section"><div className="content-shell">
    <SectionHeading title="OUR VALUES" />
    <div className="value-grid">{values.map(({ title, icon, copy }) => <article className="value-card" key={title}>
      <span className="round-icon" aria-hidden="true"><Image src={`/icons/${icon}`} alt="" width={96} height={96} unoptimized /></span><h3>{title}</h3><p>{copy}</p>
    </article>)}</div>
  </div></section>;
}

export function MissionSection() {
  return <section className="mission-section"><div className="content-shell mission-grid">
    <article><h2>OUR MISSION</h2><p>To make the building process clear, collaborative and rewarding while delivering quality workmanship that stands the test of time.</p></article>
    <article><h2>OUR PURPOSE</h2><p>To create well-built spaces that improve the way people live and work, guided by honest advice, practical thinking and genuine care.</p></article>
    <Link className="cta-button outline-button" href="/contact">CONTACT US</Link>
  </div></section>;
}

const serviceBenefits = {
  service: {
    title: "WHY NEW BUILDS",
    image: "figma-newbuild-benefits.png",
    imageAlt: "A completed residential new build",
    items: [
      ["CUSTOMISATION", "Building from the ground up gives you the freedom to create a home that suits your lifestyle, from the floor plan and room layouts to the finishing details."],
      ["EFFICIENCY", "A new build allows you to consider modern materials, insulation and energy-efficient features from the beginning, helping create a comfortable, practical home."],
      ["TRUSTED TRADES", "Every new home requires different skills. We work with a trusted network of builders and specialist trades, coordinating the people needed throughout the construction process."],
      ["DESIGN & BUILD SUPPORT", "Whether you already have plans or are starting from scratch, we work alongside an experienced architect to help bring your ideas into a practical, well-planned new home."],
    ],
  },
  renovations: {
    title: "WHY RENOVATE",
    image: "figma-service-renovations.png",
    imageAlt: "A carefully renovated home interior",
    items: [
      ["BETTER USE OF SPACE", "Improve flow, storage and everyday function without leaving the home you know."],
      ["PRESERVE WHAT YOU LOVE", "Keep the character and features that make your property feel like home."],
      ["MODERN COMFORT", "Upgrade performance, finishes and services for warmer, easier living."],
      ["CAREFUL INTEGRATION", "New work is planned to connect naturally with the existing structure."],
    ],
  },
  designBuild: {
    title: "WHY DESIGN & BUILD",
    image: "figma-service-design-build.png",
    imageAlt: "Architectural plans and a completed building project",
    items: [
      ["ONE POINT OF CONTACT", "A coordinated team keeps communication simple throughout the project."],
      ["BUILDABLE DESIGN", "Construction experience informs design decisions from the beginning."],
      ["BUDGET ALIGNMENT", "Scope and selections can be tested against your priorities early."],
      ["CONNECTED DELIVERY", "Design, consultants, trades and construction move through one clear process."],
    ],
  },
  extensions: {
    title: "WHY EXTEND",
    image: "figma-service-extensions.png",
    imageAlt: "A seamless residential home extension",
    items: [
      ["ROOM TO GROW", "Add the living, bedroom or work space your household needs."],
      ["STAY WHERE YOU ARE", "Gain more space while keeping the location and community you value."],
      ["SEAMLESS CONNECTION", "Layouts, materials and details are planned to unite old and new."],
      ["LONG-TERM VALUE", "A well-designed extension can improve both daily life and property value."],
    ],
  },
  commercial: {
    title: "WHY WORK WITH US",
    image: "figma-service-commercial.png",
    imageAlt: "A completed light commercial construction project",
    items: [
      ["PRACTICAL PLANNING", "Project decisions are shaped around how the space needs to perform."],
      ["DURABLE DELIVERY", "Materials and construction are selected for reliable commercial use."],
      ["COORDINATED TRADES", "Trusted specialists are managed through one experienced team."],
      ["CLEAR COMMUNICATION", "Straightforward updates help owners make informed decisions throughout."],
    ],
  },
};

export function BenefitsSection({ service = "service" }: { service?: keyof typeof serviceBenefits }) {
  const content = serviceBenefits[service];
  const icons = ["benefit-customisation.png", "benefit-efficiency.png", "benefit-trades.png", "benefit-design.png"];
  return <section className="benefits-section figma-benefits-section"><div className="content-shell benefits-layout">
    <div className="benefits-photo"><Image src={`/design/${content.image}`} alt={content.imageAlt} fill sizes="(max-width: 900px) 100vw, 45vw" unoptimized /></div>
    <div className="benefits-content"><SectionHeading title={content.title} />
      <div className="benefit-grid">{content.items.map(([title, copy], index) => <article className="benefit-card" key={title}><span><Image src={`/icons/${icons[index]}`} alt="" width={48} height={48} unoptimized /></span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <Link className="cta-button outline-button" href="/contact">CONTACT</Link>
    </div>
  </div></section>;
}

export function ProjectsSection({ relatedTo, compact = false }: { relatedTo?: "whitford" | "newLynn"; compact?: boolean }) {
  let cards = compact ? servicesProjects : projects;
  if (relatedTo === "whitford") cards = projects.filter((project) => project.title !== "WHITFORD HEIGHTS").slice(0, 3);
  if (relatedTo === "newLynn") cards = projects.filter((project) => project.title !== "NEW LYNN").slice(0, 3);
  return <section className={`projects-showcase ${relatedTo || compact ? "projects-showcase-compact" : ""} ${compact ? "services-projects-showcase" : ""}`}><div className="content-shell">
    <SectionHeading eyebrow={relatedTo ? "EXPLORE MORE" : undefined} title={relatedTo ? "RELATED PROJECTS" : "OUR PROJECTS"} copy={relatedTo ? "Take a look at more projects completed by On Site Building Construction." : compact ? "Take a closer look at the homes and spaces we’ve helped bring to life." : "Explore a selection of residential builds, renovations and construction projects completed across Auckland."} />
    <div className="project-card-grid">{cards.map((project) => <Link className="project-tile" href={project.href} key={project.title}>
      <Image src={`/design/${project.image}`} alt={`${project.title} building project`} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized />
      <span>{!compact && <small>{project.location}</small>}<strong>{project.title}</strong><b>{compact ? "LEARN MORE" : "VIEW PROJECT"}&nbsp; →</b></span>
    </Link>)}</div>
  </div></section>;
}

const projectDetails = {
  whitford: {
    title: "WHITFORD HEIGHTS",
    image: "hero-home-photo.jpg",
    copy: "A luxury design-and-build home created from the ground up for a couple in Whitford Heights. The home combines generous living spaces, personal touches and impressive features designed for comfort and entertainment.",
    scope: ["Design and build", "New residential home", "Interior and exterior construction", "Outdoor entertaining areas"],
  },
  newLynn: {
    title: "NEW LYNN",
    image: "hero-service-photo.jpg",
    copy: "A modern two-storey, four-bedroom home designed around indoor-outdoor living. The kitchen opens directly onto the deck, creating an inviting entertainment area and a natural connection between the home and garden.",
    scope: ["Residential new build", "Four bedrooms", "Two-storey construction", "Indoor-outdoor living"],
  },
};

export function ProjectOverviewSection({ project }: { project: keyof typeof projectDetails }) {
  const details = projectDetails[project];
  return <section className="project-overview-section"><div className="content-shell project-overview-grid">
    <div><SectionHeading eyebrow="PROJECT OVERVIEW" title={details.title} /><p>{details.copy}</p><h3>PROJECT SCOPE</h3><ul>{details.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="project-overview-photo"><Image src={`/design/${details.image}`} alt={`${details.title} project`} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div>
  </div></section>;
}

export function ProjectGallerySection() {
  return <section className="project-gallery-section"><div className="content-shell"><SectionHeading eyebrow="THE DETAILS" title="PROJECT GALLERY" />
    <div className="project-gallery-grid">{["work-1.jpg", "work-2.jpg", "work-3.jpg"].map((image, index) => <figure key={image}><Image src={`/design/${image}`} alt={`Project detail ${index + 1}`} fill sizes="(max-width: 800px) 100vw, 33vw" unoptimized /></figure>)}</div>
  </div></section>;
}

export function BlogsSection() {
  return <section className="blogs-grid-section"><div className="content-shell"><SectionHeading title="ALL BLOGS" copy="From real building challenges to fresh ideas, there’s always something worth exploring." />
    <div className="blog-card-grid">{blogs.map((blog) => <Link className="blog-card" href={blog.href} key={blog.title}><div><Image src={`/design/${blog.image}`} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div><span><strong>{blog.title}</strong><b>LEARN MORE&nbsp; →</b></span></Link>)}</div>
  </div></section>;
}

export function ServicesPromoSection() {
  return <section className="services-promo-section"><div className="content-shell"><h2>OUR SERVICES</h2><div><p>From full home renovations and extensions to residential new builds, design and build, and light commercial work, explore the types of projects we undertake.</p><Link className="cta-button outline-button" href="/services">SERVICES</Link></div></div></section>;
}

const articleSections = [
  ["Renovate or Rebuild: Where Do You Start?", "The right answer depends on your existing home, site, budget and long-term plans. Begin by getting clear on what is not working now and what you want the finished home to achieve."],
  ["Understanding Whether Your Home Is Worth Renovating", "A professional assessment can reveal the condition of the structure, foundations, roof and services. Homes with sound bones, a good position on the site and features worth retaining are often strong renovation candidates."],
  ["When Renovating Makes More Sense", "Renovation may suit you when you like your home’s character, the existing layout can be adapted, or you want to improve the property in stages. It can also reduce disruption to landscaping and established outdoor spaces."],
  ["When Rebuilding Might Be the Better Option", "Rebuilding can make sense when extensive structural work is required, the existing layout is fundamentally wrong, or you want complete control over performance, materials and room placement."],
  ["Comparing Costs and Certainty", "Do not compare headline prices alone. Renovations can uncover hidden conditions, while a new build usually allows clearer pricing once design and site investigations are complete. A realistic contingency is important for either path."],
  ["Building Consents and Approvals", "Both options may require design work, engineering and council approval. Planning these early helps protect the programme and makes it easier to understand the true scope before construction begins."],
];

export function BlogArticleSection() {
  return <article className="article-section"><div className="content-shell article-layout">
    <aside><strong>IN THIS ARTICLE</strong><ol>{articleSections.map(([title]) => <li key={title}><a href={`#${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}>{title}</a></li>)}</ol></aside>
    <div className="article-body"><p className="article-lead">Deciding whether to renovate your existing home or start again with a new build is a significant choice. Here are the practical considerations that help make the direction clearer.</p>
      {articleSections.map(([title, copy], index) => <section id={title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")} key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{copy}</p>{index === 2 && <ul><li>Preserve the character and history you value</li><li>Improve priority areas without replacing everything</li><li>Adapt the work to suit your available budget</li></ul>}</section>)}
      <div className="article-callout"><h2>Not sure which option is right?</h2><p>We can look at your goals, your current home and the practical realities of the site, then help you understand the best next step.</p><Link className="cta-button outline-button" href="/contact">TALK TO OUR TEAM</Link></div>
    </div>
  </div></article>;
}

export function RelatedBlogsSection() {
  return <section className="related-blogs-section"><div className="content-shell"><SectionHeading eyebrow="KEEP READING" title="RELATED ARTICLES" /><div className="blog-card-grid">{blogs.slice(1, 4).map((blog) => <Link className="blog-card" href={blog.href} key={blog.title}><div><Image src={`/design/${blog.image}`} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" unoptimized /></div><span><strong>{blog.title}</strong><b>READ ARTICLE&nbsp; →</b></span></Link>)}</div></div></section>;
}

export function ServiceAreaSection() {
  return <section className="service-area-section"><div className="content-shell service-area-grid"><div><SectionHeading eyebrow="WHERE WE BUILD" title="OUR SERVICE AREA" copy="On Site Building Construction works across Auckland, Waikato and Whangārei. Get in touch to discuss your location and project." /><Link className="cta-button outline-button" href="/contact">CHECK YOUR LOCATION</Link></div><ServiceAreaMap className="service-area-map" /></div></section>;
}
