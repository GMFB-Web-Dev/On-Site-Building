import { execFileSync } from "node:child_process";

const file = process.argv[2];
if (!file) throw new Error("Provide the master DOCX path.");
const text = execFileSync("textutil", ["-convert", "txt", "-stdout", file], { encoding: "utf8" })
  .replace(/\r\n?|\u2028|\u2029/g, "\n");
const pageKeys = ["home", "about", "contact", "services", "service", "serviceRenovations", "serviceExtensions", "serviceDesignBuild", "serviceCommercial", "projects", "whitford", "manukau", "botany", "newLynn", "blogs", "blog", "blogExtension", "blogBlending", "blogNewHome", "blogCommercial", "blogDesignBuild"];

function parseSection(raw) {
  const lines = raw.split("\n").map(line => line.trim()).filter(Boolean);
  const title = lines.shift();
  const nodes = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^ALL HEADING/.test(line)) break;
    if (line === "Description:" || /^[—–-]$/.test(line)) continue;
    if (line === "Subheading:") {
      nodes.push({ type: "heading", text: lines[++index] });
    } else if (/^•\s*/.test(line)) {
      const item = line.replace(/^•\s*/, "");
      const previous = nodes.at(-1);
      if (previous?.type === "list") previous.items.push(item);
      else nodes.push({ type: "list", items: [item] });
    } else {
      nodes.push({ type: "paragraph", text: line });
    }
  }
  return { title, nodes };
}

const chunks = text.split(/Hero Section\s*/).slice(1).filter(chunk => /Header:/.test(chunk));
if (chunks.length !== pageKeys.length) throw new Error(`Expected ${pageKeys.length} pages, found ${chunks.length}.`);
const pages = Object.fromEntries(chunks.map((chunk, index) => {
  const [hero, ...sections] = chunk.split(/(?:^|\n)\s*Header:\s*/).slice(1).map(parseSection);
  return [pageKeys[index], { hero, sections }];
}));
process.stdout.write(`${JSON.stringify(pages, null, 2)}\n`);
