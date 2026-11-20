import { Fragment, type ReactNode } from "react";
import type { LexicalNode } from "../lib/payload-client";
import { safeHref } from "../lib/blog-content";

function formattedText(node: LexicalNode): ReactNode {
  let text: ReactNode = node.text ?? "";
  const format = typeof node.format === "number" ? node.format : 0;
  if (format & 1) text = <strong>{text}</strong>;
  if (format & 2) text = <em>{text}</em>;
  if (format & 4) text = <s>{text}</s>;
  if (format & 8) text = <u>{text}</u>;
  if (format & 16) text = <code>{text}</code>;
  if (format & 32) text = <sub>{text}</sub>;
  if (format & 64) text = <sup>{text}</sup>;
  if (format & 128) text = <mark>{text}</mark>;
  return text;
}

export function LexicalContent({ nodes }: { nodes: LexicalNode[] }) {
  return nodes.map((node, index) => {
    const children = node.children ? <LexicalContent nodes={node.children} /> : null;
    const id = typeof node.anchor === "string" ? node.anchor : undefined;
    switch (node.type) {
      case "text": return <Fragment key={index}>{formattedText(node)}</Fragment>;
      case "linebreak": return <br key={index} />;
      case "tab": return <Fragment key={index}>{"\t"}</Fragment>;
      case "paragraph": return <p key={index}>{children}</p>;
      case "heading": return node.tag === "h3" ? <h3 key={index} id={id}>{children}</h3> : <h2 key={index} id={id}>{children}</h2>;
      case "list": return node.listType === "number" || node.tag === "ol" ? <ol key={index} start={typeof node.start === "number" ? node.start : undefined}>{children}</ol> : <ul key={index}>{children}</ul>;
      case "listitem": return <li key={index}>{node.checked !== undefined && <input type="checkbox" checked={node.checked} readOnly aria-label="Checklist item" />}{children}</li>;
      case "link": case "autolink": {
        const doc = node.fields?.doc?.value;
        const href = safeHref(node.fields?.url ?? node.url ?? doc?.path);
        return href ? <a key={index} href={href} target={node.fields?.newTab ? "_blank" : undefined} rel={node.fields?.newTab ? "noopener noreferrer" : undefined}>{children}</a> : <Fragment key={index}>{children}</Fragment>;
      }
      case "quote": return <blockquote key={index}>{children}</blockquote>;
      case "horizontalrule": return <hr key={index} />;
      case "root": return <Fragment key={index}>{children}</Fragment>;
      default:
        // Never inject HTML, styles, scripts, or URL schemes provided by the CMS.
        // Preserve readable children of unsupported container nodes.
        return <Fragment key={index}>{children ?? (typeof node.text === "string" ? node.text : null)}</Fragment>;
    }
  });
}
