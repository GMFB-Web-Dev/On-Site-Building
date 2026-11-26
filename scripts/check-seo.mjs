/**
 * Read-only HTTP launch checks; no form submissions, email, server startup or builds.
 * node scripts/check-seo.mjs [http://localhost:3000] [--production-host]
 * --production-host sends the production Host header to a local server only.
 * Optional: --timeout=10000 --concurrency=4. Stdout is one JSON report.
 */
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { parse } = require("next/dist/compiled/node-html-parser");
const ts = require("typescript");
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const canonicalOrigin = "https://onsitebuild.co.nz";
const expected = { pages: 24, Service: 5, BlogPosting: 6, BreadcrumbList: 23 };
const failures = [];
const started = Date.now();
let assertions = 0;
let requests = 0;
let requestErrors = 0;

function check(ok, code, path, detail) {
  assertions++;
  if (!ok) failures.push({ code, path, ...(detail === undefined ? {} : { detail }) });
  return Boolean(ok);
}

function options() {
  const result = { base: "http://localhost:3000", productionHost: false, timeout: 10000, concurrency: 4 };
  let hasBase = false;
  for (const argument of process.argv.slice(2)) {
    if (argument === "--help") return { help: true };
    if (argument === "--production-host") result.productionHost = true;
    else if (/^--(timeout|concurrency)=\d+$/.test(argument)) {
      const [key, value] = argument.slice(2).split("=");
      result[key] = Number(value);
    } else if (!argument.startsWith("--") && !hasBase) {
      result.base = argument;
      hasBase = true;
    } else throw new Error("Unknown or repeated command argument; use --help.");
  }
  const base = new URL(result.base);
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash || base.pathname !== "/") {
    throw new Error("Provide an HTTP(S) origin without credentials, a path, query or fragment.");
  }
  if (result.timeout < 500 || result.timeout > 30000 || result.concurrency < 1 || result.concurrency > 8) {
    throw new Error("Timeout must be 500–30000 ms and concurrency must be 1–8.");
  }
  if (result.productionHost && !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) {
    throw new Error("Production Host simulation is restricted to a local server.");
  }
  return { ...result, base: base.origin, hostname: base.hostname };
}

async function pool(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index], index);
    }
  }));
  return results;
}

function normalized(value = "") {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function sameURL(left, right) {
  try { return new URL(left).href === new URL(right).href; }
  catch { return false; }
}

function publicFiles(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${prefix}/${entry.name}`;
    return entry.isDirectory() ? publicFiles(join(directory, entry.name), path) : [path];
  });
}

function objects(value) {
  if (Array.isArray(value)) return value.flatMap(objects);
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(objects)];
}

function types(node) {
  return Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]].filter(Boolean);
}

function robotsAllowed(groups, path) {
  const specific = groups.filter((group) => group.agents.includes("googlebot"));
  const selected = specific.length ? specific : groups.filter((group) => group.agents.includes("*"));
  const matches = selected.flatMap((group) => group.rules).filter((rule) => {
    if (!rule.value) return false;
    const pattern = rule.value.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    const expression = rule.value.endsWith("$") ? pattern.slice(0, -2) + "$" : pattern;
    return new RegExp(`^${expression}`).test(path);
  }).sort((a, b) => b.value.replace(/\*/g, "").length - a.value.replace(/\*/g, "").length || (a.kind === "allow" ? -1 : 1));
  return !matches.length || matches[0].kind === "allow";
}

async function main() {
  const config = options();
  if (config.help) {
    console.log(JSON.stringify({ usage: "node scripts/check-seo.mjs [base-origin] [--production-host] [--timeout=10000] [--concurrency=4]", defaults: { base: "http://localhost:3000", timeoutMs: 10000, concurrency: 4 }, productionHost: "Local-only Host: onsitebuild.co.nz simulation; otherwise nonproduction origins must return noindex.", methods: ["GET", "HEAD"] }, null, 2));
    return;
  }

  // Load only the approved route registry, never the metadata/schema implementation.
  const source = readFileSync(join(root, "app/site-routes.ts"), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const registry = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
  const entries = Object.entries(registry.paths);
  const approvedCopy = JSON.parse(readFileSync(join(root, "app/master-pages.json"), "utf8"));
  const heroes = JSON.parse(readFileSync(join(root, "app/approved-heroes.json"), "utf8"));
  for (const [key, hero] of Object.entries(heroes)) {
    approvedCopy[key].hero.title = hero.title;
    if (hero.introduction) approvedCopy[key].hero.nodes = [{ type: "paragraph", text: hero.introduction }];
  }
  const routeSet = new Set(entries.map(([, path]) => path));
  const redirects = registry.permanentRedirects;
  if (!Array.isArray(redirects)) throw new Error("The route registry must export permanentRedirects.");
  check(entries.length === expected.pages && routeSet.size === expected.pages, "route-count", "registry", { expected: expected.pages, entries: entries.length, unique: routeSet.size });
  const resourceSet = new Set([...publicFiles(join(root, "public")), "/favicon.ico", "/robots.txt", "/sitemap.xml"]);
  const servicePaths = new Set((registry.serviceKeys || []).map((key) => registry.paths[key]));
  const blogPaths = new Set((registry.blogKeys || []).map((key) => registry.paths[key]));
  const production = config.productionHost || config.hostname === new URL(canonicalOrigin).hostname;
  const images = new Set();
  const documents = new Map();
  const pageResults = [];
  const typePages = { Service: 0, BlogPosting: 0, BreadcrumbList: 0 };
  const entityCounts = { Service: 0, BlogPosting: 0, BreadcrumbList: 0 };
  const titles = new Map();
  const descriptions = new Map();
  const navigation = { internal: 0, resource: 0, external: 0, contact: 0, fragment: 0 };

  async function request(path, method = "GET") {
    requests++;
    const headers = { "user-agent": "OnSiteSEOCheck/1.0", accept: method === "HEAD" ? "*/*" : "text/html,application/xml,text/plain;q=0.9,*/*;q=0.8" };
    if (config.productionHost) headers.host = new URL(canonicalOrigin).host;
    try {
      // Native fetch can replace Host; node:http preserves the local simulation.
      const url = new URL(path, config.base);
      const transport = url.protocol === "https:" ? httpsRequest : httpRequest;
      const response = await new Promise((resolve, reject) => {
        const outgoing = transport(url, { method, headers, signal: AbortSignal.timeout(config.timeout) }, (incoming) => {
          const responseHeaders = new Headers();
          for (const [name, value] of Object.entries(incoming.headers)) {
            for (const item of Array.isArray(value) ? value : [value]) if (item !== undefined) responseHeaders.append(name, item);
          }
          resolve({ status: incoming.statusCode, headers: responseHeaders, body: incoming });
        });
        outgoing.on("error", reject);
        outgoing.end();
      });
      let body = "";
      if (method !== "HEAD") {
        const chunks = [];
        let size = 0;
        for await (const chunk of response.body) {
          size += chunk.length;
          if (size > 8_000_000) throw new Error("ResponseTooLarge");
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks).toString("utf8");
      } else response.body.resume();
      return { status: response.status, headers: response.headers, body };
    } catch (error) {
      requestErrors++;
      check(false, "request-error", path, { method, kind: error.name, code: error.code || error.cause?.code });
      return { status: null, headers: new Headers(), body: "" };
    }
  }

  function resourceURL(value, path, code) {
    try {
      const url = new URL(value);
      const valid = url.origin === canonicalOrigin && !url.search && !url.hash && resourceSet.has(decodeURI(url.pathname));
      if (check(valid, code, path)) images.add(url.pathname);
    } catch { check(false, code, path); }
  }

  function entityURL(value, path, code) {
    try {
      const url = new URL(value);
      check(url.origin === canonicalOrigin && !url.search && (routeSet.has(url.pathname) || resourceSet.has(decodeURI(url.pathname))), code, path);
    } catch { check(false, code, path); }
  }

  function distinct(value, seen, path, code) {
    const key = normalized(value).toLowerCase();
    if (key) {
      check(!seen.has(key), code, path, seen.has(key) ? { alsoAt: seen.get(key) } : undefined);
      seen.set(key, path);
    }
  }

  const firstResponse = await request("/");
  if (firstResponse.status === null) {
    console.log(JSON.stringify({ ok: false, stage: "connectivity", base: config.base, mode: production ? "production" : "preview", durationMs: Date.now() - started, requests: { total: requests, errors: requestErrors }, failureCount: failures.length, failures }, null, 2));
    process.exitCode = 1;
    return;
  }

  await pool(entries, config.concurrency, async ([key, path]) => {
    const response = path === "/" ? firstResponse : await request(path);
    const result = { key, path, status: response.status };
    pageResults.push(result);
    if (!check(response.status === 200, "page-status", path, { actual: response.status })) return;
    check(/text\/html/i.test(response.headers.get("content-type") || ""), "page-content-type", path);
    const document = parse(response.body);
    documents.set(path, document);
    const h1s = document.querySelectorAll("h1");
    check(h1s.length === 1 && Boolean(normalized(h1s[0]?.text)), "primary-heading", path, { count: h1s.length });
    if (approvedCopy[key]) {
      check(normalized(h1s[0]?.text) === normalized(approvedCopy[key].hero.title), "approved-heading", path);
      const introduction = approvedCopy[key].hero.nodes.find((node) => node.type === "paragraph")?.text;
      if (introduction) check(normalized(document.querySelector("main p")?.text) === normalized(introduction), "approved-introduction", path);
    }
    const unresolvedClasses = document.querySelectorAll("[class]").filter((element) => /(?:^|\s)undefined(?:\s|$)/.test(element.getAttribute("class") || ""));
    check(unresolvedClasses.length === 0, "unresolved-css-module", path, { count: unresolvedClasses.length });
    const titleNodes = document.querySelectorAll("title");
    const title = normalized(titleNodes[0]?.text);
    check(titleNodes.length === 1 && Boolean(title), "title", path, { count: titleNodes.length });
    distinct(title, titles, path, "duplicate-title");
    const metas = new Map();
    for (const meta of document.querySelectorAll("meta")) {
      const name = (meta.getAttribute("name") || meta.getAttribute("property") || "").toLowerCase();
      metas.set(name, [...(metas.get(name) || []), normalized(meta.getAttribute("content"))]);
    }
    const meta = (name) => metas.get(name) || [];
    const description = meta("description")[0] || "";
    check(meta("description").length === 1 && Boolean(description), "description", path, { count: meta("description").length });
    distinct(description, descriptions, path, "duplicate-description");
    const canonical = new URL(path, canonicalOrigin).href;
    const canonicals = document.querySelectorAll("link").filter((link) => (link.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical"));
    check(canonicals.length === 1 && sameURL(canonicals[0].getAttribute("href"), canonical), "canonical", path, { count: canonicals.length });
    for (const [name, value] of [["og:title", title], ["og:description", description], ["og:url", canonical], ["twitter:title", title], ["twitter:description", description]]) {
      check(meta(name).length === 1 && (name === "og:url" ? sameURL(meta(name)[0], value) : meta(name)[0] === value) && Boolean(value), "social-metadata", path, { property: name });
    }
    check(meta("og:type").length === 1 && meta("og:type")[0] === (blogPaths.has(path) ? "article" : "website"), "social-type", path);
    check(meta("og:site_name").length === 1 && Boolean(meta("og:site_name")[0]), "social-site-name", path);
    check(meta("twitter:card").length === 1 && ["summary", "summary_large_image"].includes(meta("twitter:card")[0]), "twitter-card", path);
    for (const name of ["og:image", "twitter:image"]) {
      check(meta(name).length > 0, "social-image-missing", path, { property: name });
      for (const value of meta(name)) resourceURL(value, path, "social-image-url");
    }
    const robots = [response.headers.get("x-robots-tag") || "", ...meta("robots"), ...meta("googlebot")].join(",");
    const noindex = /(?:^|[,;:\s])(?:noindex|none)(?:$|[,;:\s])/i.test(robots);
    result.noindex = noindex;
    check(production ? !noindex : noindex, "indexing-policy", path, { expected: production ? "indexable" : "noindex" });

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    check(scripts.length > 0, "structured-data-missing", path);
    const data = [];
    for (const script of scripts) {
      try { data.push(JSON.parse(script.rawText)); }
      catch { check(false, "structured-data-json", path); }
    }
    const nodes = data.flatMap(objects);
    const typed = nodes.filter((node) => types(node).length);
    const definitions = new Set(typed.map((node) => node["@id"]).filter(Boolean));
    const children = typed.filter(node => types(node).includes("Offer")).map(offer => offer.itemOffered);
    for (const child of children) {
      check(child?.["@type"] === "Service" && child.url?.startsWith(canonical + "#") &&
        document.querySelectorAll("[id]").some(el => el.id === child.url.split("#")[1] && el.text === child.name),
        "visible-subservice", path);
    }
    const byType = (type) => typed.filter((node) => types(node).includes(type));
    for (const type of Object.keys(typePages)) {
      const count = byType(type).filter(node => !children.includes(node)).length;
      entityCounts[type] += count;
      if (count) typePages[type]++;
      const wanted = type === "Service" ? servicePaths.has(path) : type === "BlogPosting" ? blogPaths.has(path) : path !== "/";
      check(count === Number(wanted), "structured-data-page-type", path, { type, expected: Number(wanted), actual: count });
    }
    const pageNodes = typed.filter((node) => types(node).some((type) => ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(type)));
    check(pageNodes.length === 1 && pageNodes[0].url === canonical, "webpage-entity", path, { count: pageNodes.length });
    check(byType("Organization").some((node) => node.name && node.url), "organization-entity", path);
    if (path === "/") check(byType("WebSite").length === 1 && Boolean(byType("WebSite")[0].name), "website-entity", path);
    for (const node of nodes) {
      if (typeof node["@id"] === "string") {
        entityURL(node["@id"], path, "entity-id-url");
        check(definitions.has(node["@id"]), "unresolved-entity-reference", path);
      }
      if (typeof node.url === "string") entityURL(node.url, path, "entity-url");
      if (types(node).includes("ImageObject") && typeof node.url === "string") resourceURL(node.url, path, "structured-image-url");
      if (typeof node.item === "string") entityURL(node.item, path, "breadcrumb-url");
      for (const property of ["image", "logo", "contentUrl", "thumbnailUrl"]) {
        const values = Array.isArray(node[property]) ? node[property] : [node[property]];
        for (const value of values) if (typeof value === "string") resourceURL(value, path, "structured-image-url");
      }
    }
    for (const breadcrumb of byType("BreadcrumbList")) {
      const items = breadcrumb.itemListElement;
      check(Array.isArray(items) && items.length >= 2 && items.every((item, index) => item.position === index + 1 && normalized(item.name) && (index === items.length - 1 || item.item)), "breadcrumb-items", path);
    }
    for (const node of [...byType("Service").filter(node => !children.includes(node)), ...byType("BlogPosting")]) {
      check(node.url === canonical && Boolean(node.name || node.headline) && Boolean(node.description), "main-entity-content", path);
      const pageReference = typeof node.mainEntityOfPage === "string" ? node.mainEntityOfPage : node.mainEntityOfPage?.["@id"];
      check(typeof pageReference === "string" && pageReference.split("#")[0] === canonical, "main-entity-page", path);
    }
    for (const article of byType("BlogPosting")) {
      for (const property of ["datePublished", "dateModified"]) {
        if (article[property] !== undefined) check(typeof article[property] === "string" && Number.isFinite(Date.parse(article[property])), "article-date", path, { property });
      }
    }

    // No client address is embedded in this check or echoed in its report.
    const hasPostalData = nodes.some((node) => "streetAddress" in node || types(node).includes("PostalAddress") || (types(node).includes("Organization") && "address" in node));
    check(!hasPostalData && !document.querySelector('[itemprop="streetAddress"]'), "private-address-structured-data", path);
    const visible = parse(response.body);
    for (const node of visible.querySelectorAll("script,style,template")) node.remove();
    const publicText = normalized(`${visible.text} ${visible.querySelectorAll("meta,img,input").map((node) => node.getAttribute("content") || node.getAttribute("alt") || node.getAttribute("value") || "").join(" ")}`);
    const addressShape = /\b\d{1,5}[a-z]?(?:[\/-]\d{1,5}[a-z]?)?\s+(?:[\p{L}][\p{L}'’-]*\s+){1,5}(?:road|rd|street|st|avenue|ave|lane|ln|drive|dr|crescent|cres|terrace|tce|place|pl|way|close|court|ct)\b/iu;
    check(!addressShape.test(publicText) && !addressShape.test(response.body), "address-shaped-public-text-review", path);
  });

  for (const [type, count] of Object.entries(typePages)) {
    check(count === expected[type] && entityCounts[type] === expected[type], "structured-data-total", "site", { type, expected: expected[type], pages: count, entities: entityCounts[type] });
  }

  for (const [path, document] of documents) {
    for (const anchor of document.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href").trim();
      if (!check(Boolean(href), "empty-navigation-link", path)) continue;
      if (/^(mailto|tel):/i.test(href)) {
        navigation.contact++;
        check(Boolean(href.split(":").slice(1).join(":")), "empty-contact-link", path);
        continue;
      }
      let url;
      try { url = new URL(href, new URL(path, config.base)); }
      catch { check(false, "invalid-link", path); continue; }
      if (!check(["http:", "https:"].includes(url.protocol), "link-protocol", path)) continue;
      const internal = [new URL(config.base).hostname, new URL(canonicalOrigin).hostname, `www.${new URL(canonicalOrigin).hostname}`].includes(url.hostname);
      if (!internal) { navigation.external++; continue; }
      if (resourceSet.has(decodeURI(url.pathname))) { navigation.resource++; continue; }
      navigation.internal++;
      if (!check(routeSet.has(url.pathname), "unregistered-navigation-route", path, { destination: url.pathname })) continue;
      if (url.hash) {
        navigation.fragment++;
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { check(false, "invalid-link-fragment", path); continue; }
        const destination = documents.get(url.pathname);
        check(Boolean(destination?.querySelectorAll("[id]").some((node) => node.getAttribute("id") === id)), "missing-link-fragment", path, { destination: url.pathname });
      }
    }
  }

  const query = new URLSearchParams([["utm_source", "seo-launch-check"], ["seo_probe", "one two"], ["seo_probe", "three+four"]]);
  let redirectPasses = 0;
  await pool(redirects, config.concurrency, async ({ source, destination, permanent }) => {
    const registryOK = permanent === true && routeSet.has(destination) && source !== destination;
    check(registryOK, "redirect-registry", source);
    const response = await request(`${source}?${query}`);
    if (!check(response.status === 308, "redirect-status", source, { actual: response.status })) return;
    const location = response.headers.get("location");
    if (!check(Boolean(location), "redirect-location", source)) return;
    let target;
    try { target = new URL(location, config.base); } catch { check(false, "redirect-url", source); return; }
    const destinationOK = target.pathname === destination && [config.base, canonicalOrigin].includes(target.origin) && !target.hash;
    const queryOK = JSON.stringify([...target.searchParams].sort()) === JSON.stringify([...query].sort());
    check(destinationOK, "redirect-destination", source);
    check(queryOK, "redirect-query", source);
    if (destinationOK) {
      const final = await request(`${target.pathname}${target.search}`);
      check(final.status === 200 && !final.headers.has("location"), "redirect-one-hop", source, { actual: final.status });
      if (queryOK && final.status === 200 && !final.headers.has("location") && registryOK) redirectPasses++;
    }
  });

  const [missing, sitemap, robots] = await Promise.all([
    request("/__seo-launch-check-missing-page__"), request("/sitemap.xml"), request("/robots.txt"),
  ]);
  check(missing.status === 404, "unknown-route-status", "unknown", { actual: missing.status });
  check(sitemap.status === 200, "sitemap-status", "/sitemap.xml", { actual: sitemap.status });
  const sitemapURLs = parse(sitemap.body).querySelectorAll("url > loc").map((node) => node.text.trim());
  const canonicalURLs = new Set([...routeSet].map((path) => new URL(path, canonicalOrigin).href));
  check(sitemapURLs.length === expected.pages && new Set(sitemapURLs).size === expected.pages && sitemapURLs.every((url) => canonicalURLs.has(url)), "sitemap-urls", "/sitemap.xml", { entries: sitemapURLs.length, unique: new Set(sitemapURLs).size });
  check(robots.status === 200, "robots-status", "/robots.txt", { actual: robots.status });
  const groups = [];
  const sitemapDeclarations = [];
  let group = { agents: [], rules: [] };
  for (const raw of robots.body.split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(value.toLowerCase());
    } else if (["allow", "disallow"].includes(key)) group.rules.push({ kind: key, value });
    else if (key === "sitemap") sitemapDeclarations.push(value);
  }
  if (group.agents.length) groups.push(group);
  check(groups.some((item) => item.agents.includes("*")), "robots-wildcard-agent", "/robots.txt");
  check([...routeSet].every((path) => robotsAllowed(groups, path)), "robots-allows-pages", "/robots.txt");
  check(!robotsAllowed(groups, "/api/contact"), "robots-disallows-api", "/robots.txt");
  check(sitemapDeclarations.includes(`${canonicalOrigin}/sitemap.xml`), "robots-sitemap", "/robots.txt");

  let imagePasses = 0;
  await pool([...images], config.concurrency, async (path) => {
    const response = await request(path, "HEAD");
    if (check(response.status === 200 && /^image\//i.test(response.headers.get("content-type") || ""), "image-response", path, { actual: response.status })) imagePasses++;
  });
  failures.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code));
  console.log(JSON.stringify({
    ok: failures.length === 0, base: config.base, mode: production ? "production" : "preview", simulatedProductionHost: config.productionHost,
    assertions, durationMs: Date.now() - started, requests: { total: requests, errors: requestErrors },
    pages: { expected: expected.pages, checked: pageResults.length, http200: pageResults.filter((page) => page.status === 200).length, noindex: pageResults.filter((page) => page.noindex).length, uniqueTitles: titles.size, uniqueDescriptions: descriptions.size },
    structuredData: { pageCounts: typePages, entityCounts }, navigation,
    redirects: { checked: redirects.length, passed: redirectPasses }, images: { checked: images.size, passed: imagePasses },
    sitemap: { status: sitemap.status, entries: sitemapURLs.length }, robots: { status: robots.status }, unknownStatus: missing.status,
    failureCount: failures.length, failures: failures.slice(0, 80), ...(failures.length > 80 ? { additionalFailures: failures.length - 80 } : {}),
  }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.log(JSON.stringify({ ok: false, fatal: error.message, durationMs: Date.now() - started }, null, 2));
  process.exitCode = 2;
});
