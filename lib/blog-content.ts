import type { BlogPost, LexicalNode, SupplementalContent } from "./payload-client";
import { legacyPaths, paths, type SitePageKey } from "../app/site-routes";

export function safeHref(value: unknown): string | undefined {
  if (typeof value !== "string" || /[\u0000-\u0020\\]/.test(value)) return;
  if (value.startsWith("/") && !value.startsWith("//")) {
    const url = new URL(value, "https://onsitebuild.co.nz");
    const legacy = Object.entries(legacyPaths).find(([, path]) => path === url.pathname);
    return `${legacy ? paths[legacy[0] as SitePageKey] : url.pathname}${url.search}${url.hash}`;
  }
  if (value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    if (["https:", "http:", "mailto:", "tel:"].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { return; }
}

export function nodeText(node: LexicalNode): string {
  if (node.type === "linebreak") return " ";
  if (typeof node.text === "string") return node.text;
  return node.children?.map(nodeText).join(node.type === "root" || node.type === "list" ? " " : "") ?? "";
}

export function contentNodes(value: SupplementalContent | undefined): LexicalNode[] {
  if (typeof value === "string") return value.trim() ? [{ type: "paragraph", children: [{ type: "text", text: value }] }] : [];
  return value?.root?.children ?? [];
}

function heading(text: string): LexicalNode {
  return { type: "heading", tag: "h2", children: [{ type: "text", text }] };
}

export type BlogDocument = {
  sections: { id: string; nodes: LexicalNode[] }[];
  headings: { id: string; title: string; level: number }[];
  readingMinutes: number;
};

export function blogDocument(post: BlogPost): BlogDocument {
  const nodes = [...contentNodes(post.body)];
  if (post.template === "guide") {
    const tools = contentNodes(post.tools);
    if (tools.length) nodes.push(heading("Tools and materials"), ...tools);
    for (const [index, step] of (post.steps ?? []).entries()) {
      nodes.push(heading(step.title || step.heading || `Step ${index + 1}`));
      for (const field of [step.description, step.body, step.content]) nodes.push(...contentNodes(field));
    }
  }
  if (post.template === "case-study" || post.template === "caseStudy") {
    for (const [key, value] of Object.entries(post.caseStudy ?? {})) {
      const content = contentNodes(value);
      if (content.length) nodes.push(heading(key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase())), ...content);
    }
  }
  const headings: BlogDocument["headings"] = [];
  const counts = new Map<string, number>();
  function identify(node: LexicalNode): LexicalNode {
    const copy: LexicalNode = { ...node, children: node.children?.map(identify) };
    if (node.type === "heading") {
      const title = nodeText(node).trim();
      const base = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      const count = (counts.get(base) ?? 0) + 1;
      counts.set(base, count);
      const id = `article-${base}${count === 1 ? "" : `-${count}`}`;
      copy.anchor = id;
      headings.push({ id, title, level: node.tag === "h3" ? 3 : 2 });
    }
    return copy;
  }
  const identified = nodes.map(identify);
  const sections: BlogDocument["sections"] = [];
  for (const node of identified) {
    if (!sections.length || (node.type === "heading" && node.tag !== "h3")) sections.push({ id: `article-section-${sections.length + 1}`, nodes: [] });
    sections.at(-1)!.nodes.push(node);
  }
  const words = nodes.map(nodeText).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return { sections, headings, readingMinutes: Math.max(1, Math.ceil(words / 200)) };
}
