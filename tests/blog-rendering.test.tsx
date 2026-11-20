import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { LexicalContent } from "../app/blog-lexical";

test("Lexical output preserves semantic formatting and escapes untrusted markup", () => {
  const html = renderToStaticMarkup(<LexicalContent nodes={[
    { type: "heading", tag: "h2", children: [{ type: "text", text: "A complete section" }] },
    { type: "paragraph", children: [{ type: "text", text: "<script>alert(1)</script>", format: 3 }] },
    { type: "heading", tag: "h3", children: [{ type: "text", text: "A subsection" }] },
    { type: "list", listType: "number", children: [{ type: "listitem", children: [{ type: "text", text: "First item" }] }] },
    { type: "link", fields: { url: "javascript:alert(1)" }, children: [{ type: "text", text: "Unsafe link text survives" }] },
    { type: "link", fields: { url: "https://example.com", newTab: true }, children: [{ type: "text", text: "A safe link" }] },
    { type: "html", text: "<img src=x onerror=alert(1)>" },
  ]} />);
  assert(html.includes("<h2>A complete section</h2>"));
  assert(html.includes("<h3>A subsection</h3>"));
  assert(html.includes("<em><strong>&lt;script&gt;"));
  assert(html.includes("<ol><li>First item</li></ol>"));
  assert(html.includes("Unsafe link text survives"));
  assert(html.includes('rel="noopener noreferrer"'));
  assert(!html.includes("javascript:"));
  assert(!html.includes("<script>"));
  assert(!html.includes("<img"));
});
