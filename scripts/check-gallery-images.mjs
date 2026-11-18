import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const baseUrl = process.argv[2] || "http://127.0.0.1:3010";
const manifest = JSON.parse(readFileSync("app/gallery-images.json", "utf8"));
const discovered = JSON.parse(execFileSync(process.execPath, ["scripts/sync-gallery-images.mjs", "tmp/supplied-images/Images", "--check"], { encoding: "utf8" }));
assert.deepEqual(manifest, discovered, "A supplied gallery file is missing or assigned incorrectly.");
const routes = {
  home: "/", service: "/services/residential-new-builds", serviceRenovations: "/services/renovations-alterations",
  serviceExtensions: "/services/additions-extensions", serviceDesignBuild: "/services/design-build",
  whitford: "/projects/whitford-heights", newLynn: "/projects/new-lynn", manukau: "/projects/manukau-heights", botany: "/projects/botany",
};
for (const [key, images] of Object.entries(manifest)) {
  const response = await fetch(`${baseUrl}${routes[key]}`);
  assert.ok(response.ok);
  const html = await response.text();
  const gallery = html.match(/class="home-work-row"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(gallery, `Missing gallery on ${routes[key]}`);
  assert.equal((gallery.match(/<figure/g) || []).length, images.length, `Incorrect image count on ${routes[key]}`);
  const dots = html.match(/class="work-dots"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.equal((dots?.match(/<button/g) || []).length, images.length, `Incorrect dot count on ${routes[key]}`);
  for (const image of images) {
    assert.ok(gallery.includes(encodeURIComponent(image.src)), `Missing optimized image for ${image.source} on ${routes[key]}`);
    assert.ok(existsSync(`public${image.src}`), `Missing asset ${image.src}`);
    assert.equal((await fetch(`${baseUrl}${image.src}`)).status, 200);
  }
  console.log(`${routes[key]}: all ${images.length} supplied gallery images and dots verified.`);
}
