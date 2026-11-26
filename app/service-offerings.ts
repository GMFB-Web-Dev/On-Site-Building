import type { ServicePageKey } from "./site-routes";

export const serviceOfferings: Record<ServicePageKey, string[]> = {
  service: ["New home foundations", "New home framing", "Interior finishing for new homes"],
  serviceRenovations: ["Kitchen renovations", "Bathroom renovations", "Interior layout changes", "Structural alterations"],
  serviceExtensions: ["Bedroom additions", "Living area extensions", "Additional rooms"],
  serviceDesignBuild: ["Home design with an architect", "Construction planning", "Design-to-build coordination"],
  serviceCommercial: ["Retail fit-outs", "Commercial layout alterations", "Internal partition construction"],
};

export function offeringAnchor(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
