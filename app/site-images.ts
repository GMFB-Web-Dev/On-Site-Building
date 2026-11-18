import galleryAssignments from "./gallery-images.json";

// Source paths are recorded in docs/image-audit.md for the supplied Images ZIP.
export const homeAboutImage = { src: "/images/home-about.webp", alt: "Completed charcoal and white home with a double garage" };
export const aboutPortraitImage = { src: "/images/about-rakesh.webp", alt: "Rakesh from On Site Building Construction" };

export const pageHeroImages: Record<string, { src: string; alt: string }> = {
  home: { src: "/images/home-hero.webp", alt: "Completed white home with glass balconies" },
  about: { src: "/images/about-hero.webp", alt: "Modern glass atrium and lounge" },
  blogs: { src: "/images/blogs-hero.webp", alt: "Completed charcoal kitchen" },
  service: { src: "/images/new-lynn-hero.webp", alt: "Completed charcoal and white residential new build" },
  serviceRenovations: { src: "/images/renovations-hero.webp", alt: "Renovated kitchen with white cabinetry" },
  serviceExtensions: { src: "/images/extensions-hero.webp", alt: "Timber terrace connecting to the home" },
};

export const serviceSectionImages: Record<string, { intro: string; benefits: string }> = {
  renovations: { intro: "/images/renovations-intro.webp", benefits: "/images/renovations-benefits.webp" },
  extensions: { intro: "/images/extensions-intro.webp", benefits: "/images/extensions-benefits.webp" },
  designBuild: { intro: "/images/design-build-intro.webp", benefits: "/images/design-build-benefits.webp" },
};

export const serviceCardImages: Record<string, string> = {
  "renovations-alterations": serviceSectionImages.renovations.intro,
  "residential-new-builds": pageHeroImages.service.src,
  "design-build": serviceSectionImages.designBuild.intro,
  "additions-extensions": serviceSectionImages.extensions.intro,
};

type GalleryImages = readonly (readonly [string, string])[];
const gallery = (key: keyof typeof galleryAssignments): GalleryImages => galleryAssignments[key].map(image => [image.src, image.alt] as const);

export const homeWorkImages = gallery("home");
export const suppliedServiceGalleries: Record<string, GalleryImages> = {
  service: gallery("service"),
  serviceRenovations: gallery("serviceRenovations"),
  serviceExtensions: gallery("serviceExtensions"),
  serviceDesignBuild: gallery("serviceDesignBuild"),
};
export const suppliedProjectGalleries = {
  whitford: gallery("whitford"),
  newLynn: gallery("newLynn"),
  manukau: gallery("manukau"),
  botany: gallery("botany"),
};

export const projectImages = {
  whitford: {
    hero: { src: "/images/whitford-hero.webp", alt: "Whitford home with glass balconies and stone accents" },
    overview: { src: "/images/whitford-overview.webp", alt: "Whitford glass atrium and open-plan lounge" },
  },
  newLynn: {
    hero: { src: "/images/new-lynn-hero.webp", alt: "New Lynn charcoal and white two-storey home" },
    overview: { src: "/images/new-lynn-overview.webp", alt: "New Lynn modern charcoal kitchen" },
  },
  manukau: {
    hero: { src: "/images/manukau-heights-hero.webp", alt: "Manukau Heights brick home and driveway" },
    overview: { src: "/images/manukau-heights-overview.webp", alt: "Manukau Heights brick exterior and glass balcony" },
  },
  botany: {
    hero: { src: "/images/botany-hero.webp", alt: "Botany brick and plaster family home with a red-tiled roof" },
    overview: { src: "/images/botany-overview.webp", alt: "Botany living room with burgundy carpet and cream furnishings" },
  },
};
