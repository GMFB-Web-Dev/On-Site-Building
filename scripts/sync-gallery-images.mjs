import { readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.argv[2] || "tmp/supplied-images/Images";
const checkOnly = process.argv.includes("--check");
const existing = {
  "RENOVATIONS & ALTERATIONS/Gallery 1.png": "renovations-gallery-1.webp",
  "RENOVATIONS & ALTERATIONS/Gallery 2.png.png": "renovations-benefits.webp",
  "RENOVATIONS & ALTERATIONS/Gallery 3.png.png": "renovations-intro.webp",
  "RENOVATIONS & ALTERATIONS/Gallery 4.png": "renovations-hero.webp",
  "ADDITIONS & EXTENSIONS/HERO.png": "extensions-hero.webp",
  "ADDITIONS & EXTENSIONS/ADDITIONS & EXTENSIONS.png": "extensions-intro.webp",
  "ADDITIONS & EXTENSIONS/Sunlit Polished Wooden Deck Corner.png": "extensions-deck.webp",
  "DESIGN & BUILD/DESIGN & BUILD.png": "design-build-intro.webp",
  "DESIGN & BUILD/WHY DESIGN & BUILD.png": "design-build-benefits.webp",
  "Whitford/Modern Glass-Balcony House.png": "work-whitford.webp",
  "Whitford/Modern Glass Atrium Lounge.png": "whitford-overview.webp",
  "Manukau Heights/Modern Stone-Clad Home with Terraced Landscaping.png": "work-manukau.webp",
  "Manukau Heights/Modern Stone Home with Driveway and No. 12.png": "manukau-heights-hero.webp",
  "Manukau Heights/Modern Stone Home with Glass Balcony.png": "manukau-heights-overview.webp",
  "New Lynn/Modern Charcoal and White Suburban Home.png": "new-lynn-hero.webp",
  "New Lynn/Clean Modern Charcoal Kitchen.png": "new-lynn-overview.webp",
  "Botany/Upscale Suburban Home with Red-Tiled Roof.png": "botany-hero.webp",
  "Botany/Elegant Burgundy and Cream Living Room.png": "botany-overview.webp",
};
for (const index of [3, 4, 5]) existing[`Residential New Builds/Gallery ${index}.png`] = `newbuild-gallery-${index}.webp`;
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sources = {
  home: ["Whitford/Modern Glass-Balcony House.png", "DESIGN & BUILD/WHY DESIGN & BUILD.png", "Manukau Heights/Modern Stone-Clad Home with Terraced Landscaping.png"],
  service: readdirSync(path.join(root, "Residential New Builds")).filter(file => /^Gallery\s*\d*\.png(?:\.png)?$/i.test(file)).sort((a, b) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0)).map(file => `Residential New Builds/${file}`),
  serviceRenovations: readdirSync(path.join(root, "RENOVATIONS & ALTERATIONS")).filter(file => /^Gallery\s*\d+\.png(?:\.png)?$/i.test(file)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(file => `RENOVATIONS & ALTERATIONS/${file}`),
  serviceExtensions: ["ADDITIONS & EXTENSIONS/HERO.png", "ADDITIONS & EXTENSIONS/ADDITIONS & EXTENSIONS.png", "ADDITIONS & EXTENSIONS/Sunlit Polished Wooden Deck Corner.png"],
  serviceDesignBuild: ["DESIGN & BUILD/DESIGN & BUILD.png", "DESIGN & BUILD/WHY DESIGN & BUILD.png"],
};
for (const [key, folder] of Object.entries({ whitford: "Whitford", newLynn: "New Lynn", manukau: "Manukau Heights", botany: "Botany" })) {
  sources[key] = readdirSync(path.join(root, folder)).filter(file => /\.(png|jpe?g)$/i.test(file) && !/^hero\./i.test(file)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(file => `${folder}/${file}`);
}
const galleries = {};
for (const [key, files] of Object.entries(sources)) {
  galleries[key] = [];
  for (const source of files) {
    const output = existing[source] || `${slug(source.replace(/\.(png|jpe?g)$/i, ""))}.webp`;
    if (!checkOnly) await sharp(path.join(root, source)).rotate().webp({ quality: 88 }).toFile(path.join("public/images", output));
    const filename = path.basename(source).replace(/\.(png|jpe?g)(?:\.png)?$/i, "");
    galleries[key].push({ src: `/images/${output}`, alt: `${path.dirname(source)} — ${filename}`, source });
  }
}
process.stdout.write(`${JSON.stringify(galleries, null, 2)}\n`);
