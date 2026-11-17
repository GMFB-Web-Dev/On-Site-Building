/** One canonical address for each page. Old public URLs are permanently redirected. */
export const paths = {
  home: "/",
  services: "/building-services-auckland",
  service: "/services/new-home-builders-auckland",
  serviceRenovations: "/services/home-renovations-south-auckland",
  serviceDesignBuild: "/services/design-and-build-auckland",
  serviceExtensions: "/services/home-extensions-auckland",
  serviceCommercial: "/services/light-commercial-builders-auckland",
  projects: "/building-projects-auckland",
  whitford: "/projects/whitford-heights-design-build-auckland",
  manukau: "/projects/manukau-heights-new-home-auckland",
  botany: "/projects/botany-new-home-east-auckland",
  newLynn: "/projects/new-lynn-new-home-west-auckland",
  about: "/about-onsite-building-auckland",
  blogs: "/building-advice-auckland",
  blog: "/blogs/renovate-or-rebuild-auckland",
  blogExtension: "/blogs/planning-home-extension-auckland",
  blogBlending: "/blogs/blending-old-new-home-renovation-auckland",
  blogCommercial: "/blogs/light-commercial-construction-auckland",
  blogDesignBuild: "/blogs/design-build-process-auckland",
  blogNewHome: "/blogs/building-new-home-auckland",
  contact: "/contact-auckland-builders",
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

export const permanentRedirects = Object.entries(legacyPaths).map(([key, source]) => ({
  source,
  destination: paths[key as SitePageKey],
  permanent: true,
}));
