import type { Metadata } from "next";
import { clientImages, getProject } from "./client-media";
import legacyImageSizes from "./legacy-image-sizes.json";
import { pageCopy, masterContent } from "./master-content";
import { paths, serviceKeys, blogKeys, type SitePageKey, type ServicePageKey, type BlogPageKey } from "./site-routes";

export const SITE_URL = "https://onsitebuild.co.nz";
export const SITE_NAME = "On Site Building Construction";
export const SEO_UPDATED = "2026-11-17";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

// Search metadata is deliberately separate from the approved page copy.
type PageDetails = { title: string; description: string; label: string };
export const pageDetails: Record<SitePageKey, PageDetails> = {
  home: {
    title: "South Auckland Builders | On Site Building Construction",
    description: "Manurewa-based builders for home renovations, extensions, new homes and light commercial work across Auckland. Discuss your plans with On Site Building.",
    label: "Home",
  },
  services: {
    title: "Building Services Auckland | On Site Building Construction",
    description: "Explore Auckland renovations, extensions, new builds, design and build, and light commercial construction. Based in Manurewa with over 30 years' experience.",
    label: "Building services",
  },
  service: {
    title: "New Home Builders Auckland | On Site Building Construction",
    description: "Build your new Auckland home with experienced South Auckland builders. From foundations to finishing, we coordinate construction and trusted specialist trades.",
    label: "New home builders",
  },
  serviceRenovations: {
    title: "House Renovations South Auckland | On Site Building",
    description: "House renovations and alterations across South Auckland and wider Auckland. Discuss layout changes and structural work with our Manurewa-based builders.",
    label: "House renovations",
  },
  serviceExtensions: {
    title: "Home Extensions Auckland | On Site Building Construction",
    description: "Plan a house extension in South Auckland or wider Auckland. Discuss extra bedrooms, larger living areas and connecting new spaces to your existing home.",
    label: "Home extensions",
  },
  serviceDesignBuild: {
    title: "Design & Build Auckland | On Site Building Construction",
    description: "Turn your ideas into a new Auckland home. On Site Building works alongside an experienced architect to connect practical design with careful construction.",
    label: "Design and build",
  },
  serviceCommercial: {
    title: "Light Commercial Builders Auckland | On Site Building",
    description: "Auckland builders for shops, dairies, laundromats and light commercial alterations. Plan practical layouts and building work with On Site Building Construction.",
    label: "Light commercial building",
  },
  projects: {
    title: "Auckland Building Projects | On Site Building Construction",
    description: "See On Site Building's residential projects in Whitford Heights, Manukau Heights, Botany and New Lynn, with real project photographs and scope details.",
    label: "Building projects",
  },
  whitford: {
    title: "Whitford Heights Design & Build | On Site Building",
    description: "Explore a three-storey, 667 m² design-and-build home in Whitford Heights, Auckland, with five bedrooms, entertainment spaces and real project photographs.",
    label: "Whitford Heights",
  },
  manukau: {
    title: "Manukau Heights New Home | On Site Building Construction",
    description: "View a five-bedroom, two-storey home in Manukau Heights, South Auckland. A residential design-and-build project from initial plans through to handover.",
    label: "Manukau Heights",
  },
  botany: {
    title: "Botany New Home, East Auckland | On Site Building",
    description: "See a six-bedroom, two-storey family home in Botany, East Auckland, featuring brick and plaster finishes and a red roof. View the project photographs.",
    label: "Botany",
  },
  newLynn: {
    title: "New Lynn New Home, West Auckland | On Site Building",
    description: "Explore a four-bedroom, two-storey New Lynn home with kitchen-to-deck access and outdoor entertaining. View this West Auckland residential building project.",
    label: "New Lynn",
  },
  about: {
    title: "About Our South Auckland Builders | On Site Building",
    description: "Meet On Site Building Construction, based in Manurewa, South Auckland. Over 30 years of building experience, practical advice and clear project communication.",
    label: "About us",
  },
  blogs: {
    title: "Auckland Building & Renovation Advice | On Site Building",
    description: "Read practical advice for Auckland renovations, extensions, new homes, design and build, and light commercial projects. Plan your next step with confidence.",
    label: "Building advice",
  },
  blog: {
    title: "Renovate or Rebuild in Auckland? | On Site Building",
    description: "Compare renovating and rebuilding an Auckland home. Consider the existing structure, site, budget, space and lifestyle before deciding which path suits you.",
    label: "Renovate or rebuild",
  },
  blogExtension: {
    title: "Planning a Home Extension in Auckland | On Site Building",
    description: "Plan an Auckland home extension with practical questions about space, site access, budget, existing structure and professional advice before work begins.",
    label: "Planning a home extension",
  },
  blogBlending: {
    title: "Blending Old & New in Auckland Homes | On Site Building",
    description: "Explore how to connect new spaces with an existing Auckland home, considering layouts, materials, rooflines and details that make a renovation feel cohesive.",
    label: "Blending old and new",
  },
  blogCommercial: {
    title: "Light Commercial Construction Auckland | On Site Building",
    description: "Understand light commercial building work in Auckland, from shops and laundromats to internal alterations, practical layouts and specialist trade coordination.",
    label: "Light commercial construction",
  },
  blogDesignBuild: {
    title: "The Auckland Design & Build Process | On Site Building",
    description: "Understand the design-and-build journey for an Auckland home, from initial ideas and architect collaboration to plans, construction and final handover.",
    label: "The design and build process",
  },
  blogNewHome: {
    title: "Building a New Home in Auckland | On Site Building",
    description: "Planning a new Auckland home? Consider the site, budget, layout, design team and building process before you begin, with guidance from On Site Building.",
    label: "Building a new home",
  },
  contact: {
    title: "Contact Our Auckland Builders | On Site Building",
    description: "Discuss your renovation, extension, new home or commercial project. Call 021 715 196 or send your location, budget and plans to our Manurewa building team.",
    label: "Contact",
  },
  serviceAreas: {
    title: "Auckland, Waikato & Whangārei Builders | On Site Building",
    description: "Explore On Site Building's service areas, from Manurewa and South Auckland to wider Auckland, Waikato and Whangārei. Discuss your location and project scope.",
    label: "Service areas",
  },
  privacy: {
    title: "Privacy Policy | On Site Building Construction",
    description: "How On Site Building Construction handles website enquiries, contact details and uploaded project plans, including access, correction and privacy requests.",
    label: "Privacy policy",
  },
  terms: {
    title: "Website Terms | On Site Building Construction",
    description: "Read the terms for using the On Site Building Construction website, including general information, project enquiries, intellectual property and external links.",
    label: "Website terms",
  },
};

const legacyImages: Partial<Record<SitePageKey, string>> = {
  services: "figma-services-hero.webp", serviceDesignBuild: "figma-service-design-build.webp",
  serviceCommercial: "figma-service-commercial.webp", blog: "figma-blog-renovate-rebuild.webp",
  blogExtension: "figma-blog-extension.webp", blogBlending: "figma-blog-blending.webp",
  blogCommercial: "figma-blog-commercial.webp", blogDesignBuild: "figma-blog-design-build.webp", blogNewHome: "figma-blog-new-home.webp",
};
export function pageImage(page: SitePageKey) {
  const replacements: Partial<Record<SitePageKey, string>> = {
    home: "home.hero", about: "about.hero", blogs: "blogs.hero", service: "residential-new-builds.hero",
    serviceRenovations: "renovations-alterations.hero", serviceExtensions: "additions-extensions.hero",
  };
  if (page === "whitford" || page === "manukau" || page === "botany" || page === "newLynn") return getProject(page).hero;
  if (replacements[page]) return clientImages[replacements[page]!];
  if (legacyImages[page]) {
    const filename = legacyImages[page]!;
    return { src: `/design/${filename}`, alt: pageDetails[page].label, ...legacyImageSizes[filename as keyof typeof legacyImageSizes] };
  }
  return clientImages["home.hero"];
}

export function metadataFor(page: SitePageKey): Metadata {
  const details = pageDetails[page];
  const image = pageImage(page);
  const article = blogKeys.includes(page as BlogPageKey);
  return {
    title: { absolute: details.title },
    description: details.description,
    alternates: { canonical: absoluteUrl(paths[page]) },
    openGraph: {
      type: article ? "article" : "website", locale: "en_NZ", siteName: SITE_NAME,
      title: details.title, description: details.description, url: absoluteUrl(paths[page]),
      images: [{ url: absoluteUrl(image.src), width: image.width, height: image.height, alt: image.alt }],
      ...(article ? { modifiedTime: SEO_UPDATED, authors: [absoluteUrl(paths.about)] } : {}),
    },
    twitter: { card: "summary_large_image", title: details.title, description: details.description, images: [{ url: absoluteUrl(image.src), alt: image.alt }] },
  };
}

export function breadcrumbsFor(page: SitePageKey) {
  const crumbs: { name: string; path: string }[] = [{ name: "Home", path: paths.home }];
  if (serviceKeys.includes(page as ServicePageKey)) crumbs.push({ name: "Building services", path: paths.services });
  if (blogKeys.includes(page as BlogPageKey)) crumbs.push({ name: "Building advice", path: paths.blogs });
  if (["whitford", "manukau", "botany", "newLynn"].includes(page)) crumbs.push({ name: "Projects", path: paths.projects });
  if (page !== "home") crumbs.push({ name: pageDetails[page].label, path: paths[page] });
  return crumbs;
}

const businessId = `${SITE_URL}/#business`;
const websiteId = `${SITE_URL}/#website`;
export const regionalCoverage = [
  { "@type": "AdministrativeArea", name: "Auckland", containedInPlace: { "@type": "Country", name: "New Zealand" } },
  { "@type": "AdministrativeArea", name: "Waikato", containedInPlace: { "@type": "Country", name: "New Zealand" } },
  { "@type": "City", name: "Whangārei", containedInPlace: { "@type": "Country", name: "New Zealand" } },
];

/** The client's home address was explicitly supplied for verification only. */
export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": businessId, name: SITE_NAME,
      legalName: "Onsite Building Construction Limited", alternateName: "Onsite Building",
      url: SITE_URL, logo: absoluteUrl("/osbc-header-logo.png"), image: absoluteUrl(clientImages["home.hero"].src),
      telephone: "+6421715196", email: "onsitebuilding1@gmail.com",
      description: "Manurewa-based building company providing renovations, extensions, new homes, design and build, and light commercial construction in Auckland, Waikato and Whangārei.",
      areaServed: regionalCoverage,
      contactPoint: { "@type": "ContactPoint", telephone: "+6421715196", email: "onsitebuilding1@gmail.com", contactType: "project enquiries", availableLanguage: "English" },
    },
    { "@type": "WebSite", "@id": websiteId, url: SITE_URL, name: SITE_NAME, alternateName: "Onsite Building", publisher: { "@id": businessId }, inLanguage: "en-NZ" },
  ],
};

const serviceNames: Record<ServicePageKey, string> = {
  service: masterContent.services.labels.newBuilds,
  serviceRenovations: masterContent.services.labels.renovations,
  serviceExtensions: masterContent.services.labels.extensions,
  serviceDesignBuild: masterContent.services.labels.designBuild,
  serviceCommercial: masterContent.services.labels.commercial,
};

export function pageStructuredData(page: SitePageKey) {
  const details = pageDetails[page];
  const url = absoluteUrl(paths[page]);
  const pageId = `${url}#webpage`;
  const article = blogKeys.includes(page as BlogPageKey);
  const service = serviceKeys.includes(page as ServicePageKey);
  const crumbs = breadcrumbsFor(page);
  const image = pageImage(page);
  const title = page in pageCopy ? pageCopy[page as keyof typeof pageCopy].hero.title : details.label;
  const graph: Record<string, unknown>[] = [{
    "@type": page === "about" ? "AboutPage" : page === "contact" ? "ContactPage" : ["services", "projects", "blogs"].includes(page) ? "CollectionPage" : "WebPage",
    "@id": pageId, url, name: details.title, description: details.description,
    isPartOf: { "@id": websiteId }, about: { "@id": businessId }, inLanguage: "en-NZ",
    primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image.src), caption: image.alt },
    ...(crumbs.length > 1 ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(service || article ? { mainEntity: { "@id": `${url}#${service ? "service" : "article"}` } } : {}),
  }];
  if (crumbs.length > 1) graph.push({
    "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  });
  if (service) graph.push({
    "@type": "Service", "@id": `${url}#service`, url,
    name: serviceNames[page as ServicePageKey], serviceType: serviceNames[page as ServicePageKey], description: details.description,
    provider: { "@id": businessId }, areaServed: regionalCoverage,
    mainEntityOfPage: { "@id": pageId }, image: absoluteUrl(image.src),
  });
  if (article) graph.push({
    "@type": "BlogPosting", "@id": `${url}#article`, url, headline: title,
    description: details.description, image: [absoluteUrl(image.src)],
    dateModified: SEO_UPDATED,
    author: { "@type": "Organization", "@id": businessId, name: SITE_NAME, url: absoluteUrl(paths.about) },
    publisher: { "@id": businessId }, mainEntityOfPage: { "@id": pageId }, inLanguage: "en-NZ",
    articleSection: "Building and renovation advice",
  });
  if (page === "services") graph.push({
    "@type": "ItemList", "@id": `${url}#services`, name: "Building services in Auckland",
    itemListElement: serviceKeys.map((key, index) => ({ "@type": "ListItem", position: index + 1, name: pageDetails[key].label, url: absoluteUrl(paths[key]) })),
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
