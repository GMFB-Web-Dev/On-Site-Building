/** One canonical address for each page. Old public URLs are permanently redirected. */
export const paths = {
  home: "/",
  services: "/services-auckland",
  service: "/services-auckland/new-homes-manurewa-builders",
  serviceRenovations: "/services-auckland/home-renovations-manurewa-builders",
  serviceDesignBuild: "/services-auckland/design-and-build-manurewa-builders",
  serviceExtensions: "/services-auckland/home-extensions-manurewa-builders",
  serviceCommercial: "/services-auckland/light-commercial-construction-manurewa-builders",
  projects: "/auckland-house-building-projects",
  whitford: "/projects/whitford-heights-design-build-auckland",
  manukau: "/projects/manukau-heights-new-home-auckland",
  botany: "/projects/botany-new-home-east-auckland",
  newLynn: "/projects/new-lynn-new-home-west-auckland",
  about: "/manurewa-builder",
  blogs: "/manurewa-building-advice",
  blog: "/blogs/renovate-or-rebuild-manurewa",
  blogExtension: "/blogs/planning-home-extension-manurewa",
  blogBlending: "/blogs/blending-old-new-home-renovation-manurewa",
  blogCommercial: "/blogs/light-commercial-construction-manurewa",
  blogDesignBuild: "/blogs/design-build-process-manurewa",
  blogNewHome: "/blogs/building-new-home-manurewa",
  contact: "/manurewa-builder-quotes",
  serviceAreas: "/building-service-areas-auckland-waikato-whangarei",
  privacy: "/privacy-policy",
  terms: "/terms",
} as const;

export type SitePageKey = keyof typeof paths;
export type PageKey = Exclude<SitePageKey, "privacy" | "terms">;
export type ServicePageKey = "service" | "serviceRenovations" | "serviceDesignBuild" | "serviceExtensions" | "serviceCommercial";
export type BlogPageKey = "blog" | "blogExtension" | "blogBlending" | "blogCommercial" | "blogDesignBuild" | "blogNewHome";

export const serviceKeys: ServicePageKey[] = ["serviceRenovations", "serviceExtensions", "service", "serviceDesignBuild", "serviceCommercial"];
export const blogKeys: BlogPageKey[] = ["blog", "blogExtension", "blogBlending", "blogCommercial", "blogDesignBuild", "blogNewHome"];

export const slugToPage: Record<string, PageKey> = Object.fromEntries(
  Object.entries(paths)
    .filter(([key]) => !["home", "privacy", "terms"].includes(key))
    .map(([key, path]) => [path.slice(1), key as PageKey]),
);

export const legacyPaths: Partial<Record<SitePageKey, string>> = {
  services: "/services",
  service: "/services/residential-new-builds",
  serviceRenovations: "/services/renovations-alterations",
  serviceDesignBuild: "/services/design-build",
  serviceExtensions: "/services/additions-extensions",
  serviceCommercial: "/services/light-commercial-construction",
  projects: "/projects",
  whitford: "/projects/whitford-heights",
  manukau: "/projects/manukau-heights",
  botany: "/projects/botany",
  newLynn: "/projects/new-lynn",
  about: "/about",
  blogs: "/blogs",
  blog: "/blogs/renovate-or-rebuild",
  blogExtension: "/blogs/planning-a-home-extension",
  blogBlending: "/blogs/blending-old-and-new",
  blogCommercial: "/blogs/light-commercial-construction",
  blogDesignBuild: "/blogs/design-and-build-process",
  blogNewHome: "/blogs/building-a-new-home",
  contact: "/contact",
};

export const previousCanonicalPaths: Partial<Record<SitePageKey,string>> = {
  services: "/building-services-auckland",
  service: "/services/new-home-builders-auckland",
  serviceDesignBuild: "/services/design-and-build-auckland",
  serviceExtensions: "/services/home-extensions-auckland",
  serviceCommercial: "/services/light-commercial-builders-auckland",
};

const launchPaths = {
  service: "/services-auckland/new-home-builders-south-auckland",
  serviceRenovations: "/services-auckland/home-renovations-south-auckland",
  serviceDesignBuild: "/services-auckland/design-and-build-east-auckland",
  serviceExtensions: "/services-auckland/home-extensions-south-auckland",
  serviceCommercial: "/services-auckland/light-commercial-builders-south-auckland",
  about: "/about-onsite-building-auckland",
  projects: "/building-projects-auckland",
  contact: "/contact-auckland-builders",
  blogs: "/building-advice-auckland",
  blog: "/blogs/renovate-or-rebuild-auckland",
  blogExtension: "/blogs/planning-home-extension-auckland",
  blogBlending: "/blogs/blending-old-new-home-renovation-auckland",
  blogCommercial: "/blogs/light-commercial-construction-auckland",
  blogDesignBuild: "/blogs/design-build-process-auckland",
  blogNewHome: "/blogs/building-new-home-auckland",
} as const;

const previousServiceDetailPaths = serviceKeys.map(key => [key, launchPaths[key].replace(`${paths.services}/`, "/services/")] as const);

export const permanentRedirects = [
  ...Object.entries(legacyPaths),
  ...Object.entries(previousCanonicalPaths),
  ...previousServiceDetailPaths,
  ...Object.entries(launchPaths),
  ["about", "/south-auckland-building-company"],
].map(([key, source]) => ({
  source,
  destination: paths[key as SitePageKey],
  permanent: true,
}));
