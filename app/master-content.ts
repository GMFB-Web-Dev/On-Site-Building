import sourcePages from "./master-pages.json";

// Extracted verbatim from docs/On Site Copy Writing.docx.
export type CopyNode =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };
export type CopySection = { title: string; nodes: CopyNode[] };
export type CopyPage = { hero: CopySection; sections: CopySection[] };
export type CopyPageKey = keyof typeof sourcePages;
export const pageCopy = sourcePages as Record<CopyPageKey, CopyPage>;

export function getCopySection(page: CopyPageKey, title: string): CopySection {
  const section = pageCopy[page].sections.find(section => section.title.toUpperCase() === title.toUpperCase());
  if (!section) throw new Error(`Missing master copy: ${page} / ${title}`);
  return section;
}

export function copyParagraphs(section: CopySection) {
  return section.nodes.filter((node): node is Extract<CopyNode, { type: "paragraph" }> => node.type === "paragraph").map(node => node.text);
}

export function copySubsections(section: CopySection): CopySection[] {
  const sections: CopySection[] = [];
  for (const node of section.nodes) {
    if (node.type === "heading") sections.push({ title: node.text, nodes: [] });
    else sections.at(-1)?.nodes.push(node);
  }
  return sections;
}

const homeAbout = getCopySection("home", "ABOUT ON SITE BUILDING CONSTRUCTION");
const homeServices = getCopySection("home", "OUR SERVICES");
const homeTestimonials = getCopySection("home", "TESTIMONIALS");
const certification = getCopySection("home", "NZCB CERTIFIED. LBP EXPERTISE.");
const contact = getCopySection("home", "Let’s Talk About Your Project");
const contactItems = copySubsections(contact);
const serviceItems = copySubsections(homeServices);

export const masterContent = {
  business: {
    name: "On Site Building Construction",
    email: copyParagraphs(contactItems[0])[0],
    phone: copyParagraphs(contactItems[1])[0],
    phoneHref: `tel:${copyParagraphs(contactItems[1])[0].replace(/\s/g, "")}`,
    serviceAreas: copyParagraphs(contactItems[2])[0],
  },
  hero: { title: pageCopy.home.hero.title, description: copyParagraphs(pageCopy.home.hero)[0] },
  about: { title: homeAbout.title, paragraphs: copyParagraphs(homeAbout) },
  services: {
    title: homeServices.title,
    description: copyParagraphs(homeServices)[0],
    labels: { renovations: serviceItems[0].title, newBuilds: serviceItems[1].title, designBuild: serviceItems[2].title, extensions: serviceItems[3].title, commercial: serviceItems[4].title },
  },
  work: { title: getCopySection("home", "OUR WORK").title },
  testimonials: { title: homeTestimonials.title, quote: copyParagraphs(homeTestimonials)[0].replace(/^[“”]|[“”]$/g, ""), client: copySubsections(homeTestimonials)[0].title },
  certification: { title: certification.title, description: copyParagraphs(certification)[0] },
  contact: { title: contact.title, description: copyParagraphs(contact)[0], emailLabel: contactItems[0].title.toUpperCase(), phoneLabel: contactItems[1].title.toUpperCase(), areasLabel: contactItems[2].title.toUpperCase() },
};
