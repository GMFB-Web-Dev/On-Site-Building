import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseUrl = process.argv[2] || "http://127.0.0.1:3010";
const pages = JSON.parse(readFileSync("app/master-pages.json", "utf8"));
const extracted = JSON.parse(execFileSync(process.execPath, ["scripts/extract-master-copy.mjs", "docs/On Site Copy Writing.docx"], { encoding: "utf8" }));
assert.deepEqual(pages, extracted, "Website copy must match the checked-in master DOCX.");

const { paths: routes, blogKeys } = await import("../app/site-routes.ts");
const normalize = text => text.replace(/\s+/g, " ").trim().toLowerCase();
let checked = 0;
let checkedPages = 0;
for (const [key, page] of Object.entries(pages)) {
  // Published blog copy now belongs to Payload; verify it in the CMS integration suite.
  if (key === "blogs" || blogKeys.includes(key)) continue;
  const response = await fetch(`${baseUrl}${routes[key]}`);
  assert.ok(response.ok, `${routes[key]} returned ${response.status}`);
  const html = await response.text();
  const text = normalize(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
  for (const section of [page.hero, ...page.sections]) {
    for (const expected of [section.title, ...section.nodes.flatMap(node => node.type === "list" ? node.items : [node.text])]) {
      assert.ok(text.includes(normalize(expected)), `${routes[key]} is missing master copy: ${expected}`);
      checked++;
    }
  }
  console.log(`Verified ${routes[key]}`);
  checkedPages++;
}
console.log(`${checked} headings, paragraphs and list items match the DOCX across ${checkedPages} non-blog pages.`);
