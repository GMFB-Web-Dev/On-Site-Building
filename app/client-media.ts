import imageData from "./client-images.json";
import { paths } from "./site-routes";

export type SiteImage = { src: string; alt: string; width: number; height: number };
export type GalleryImage = SiteImage & { href?: string; label?: string };
export type ProjectKey = "whitford" | "manukau" | "botany" | "newLynn";
export type ServiceKey = "service" | "renovations" | "designBuild" | "extensions" | "commercial";
export const clientImages: Record<string, SiteImage> = imageData;

function gallery(prefix: string): SiteImage[] {
  return Object.entries(clientImages)
    .filter(([key]) => key.startsWith(`${prefix}.gallery.`))
    .sort(([a], [b]) => Number(a.split(".").at(-1)) - Number(b.split(".").at(-1)))
    .map(([, image]) => image);
}

const definitions = [
  { key: "whitford", name: "Whitford Heights", slug: "whitford-heights", overview: "whitford-lounge.webp" },
  { key: "manukau", name: "Manukau Heights", slug: "manukau-heights", overview: "manukau-heights-kitchen.webp" },
  { key: "botany", name: "Botany", slug: "botany", overview: "" },
  { key: "newLynn", name: "New Lynn", slug: "new-lynn", overview: "new-lynn-kitchen.webp" },
] as const;

export const projects = definitions.map((project) => {
  // One supplied Manukau frontage has not been confirmed as the same project.
  const photos = gallery(`project.${project.slug}`).filter(image => !image.src.endsWith("manukau-heights-front-driveway.webp"));
  const overview = photos.find(image => project.overview && image.src.endsWith(project.overview)) ?? photos[0];
  return { ...project, href: paths[project.key], hero: clientImages[`project.${project.slug}.hero`], overview, gallery: photos.filter(image => image.src !== overview.src) };
});

export function getProject(key: ProjectKey) {
  return projects.find(project => project.key === key)!;
}

const legacyImage = (filename: string, alt: string): SiteImage => ({ src: `/design/${filename}`, alt, width: 1440, height: 1080 });
export const serviceMedia: Record<ServiceKey, { overview: SiteImage; benefits?: SiteImage; gallery: SiteImage[] }> = {
  service: {
    overview: clientImages["residential-new-builds.gallery.4"],
    benefits: clientImages["residential-new-builds.gallery.7"],
    gallery: [1, 2, 3, 6].map(number => clientImages[`residential-new-builds.gallery.${number}`]),
  },
  renovations: { overview: clientImages["renovations-alterations.overview"], benefits: clientImages["renovations-alterations.why-renovate"], gallery: [clientImages["renovations-alterations.gallery.1"]] },
  designBuild: { overview: clientImages["design-build.overview"], benefits: clientImages["design-build.why-design-build"], gallery: [] },
  extensions: { overview: clientImages["additions-extensions.overview"], benefits: clientImages["additions-extensions.why-extend"], gallery: [clientImages["additions-extensions.gallery.1"]] },
  commercial: { overview: legacyImage("figma-service-commercial.webp", "Light commercial construction"), gallery: [] },
};

export const servicePageKeys: Record<string, ServiceKey> = { service: "service", serviceRenovations: "renovations", serviceDesignBuild: "designBuild", serviceExtensions: "extensions", serviceCommercial: "commercial" };
