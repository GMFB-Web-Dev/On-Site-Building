import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseUrl = process.argv[2] || "http://127.0.0.1:3010";
const pages = JSON.parse(readFileSync("app/master-pages.json", "utf8"));
const extracted = JSON.parse(execFileSync(process.execPath, ["scripts/extract-master-copy.mjs", "docs/On Site Copy Writing.docx"], { encoding: "utf8" }));
assert.deepEqual(pages, extracted, "Website copy must match the checked-in master DOCX.");

const mapping = readFileSync("app/site.tsx", "utf8").split("export const slugToPage")[1].split("};")[0];
const routes = { home: "/", ...Object.fromEntries([...mapping.matchAll(/(?:"([^"]+)"|(\w+))\s*:\s*"([^"]+)"/g)].map(match => [match[3], `/${match[1] || match[2]}`])) };
const normalize = text => text.replace(/\s+/g, " ").trim().toLowerCase();
let checked = 0;
for (const [key, page] of Object.entries(pages)) {
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
}
console.log(`${checked} headings, paragraphs and list items match the DOCX across ${Object.keys(pages).length} pages.`);
