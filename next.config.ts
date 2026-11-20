import type { NextConfig } from "next";
import { permanentRedirects } from "./app/site-routes";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["127.0.0.1"],
  // Match the SEO branch's non-streamed status handling. Blog no-store reads render per request.
  redirects: async () => permanentRedirects,
  headers: async () => [
    { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    { source: "/:path*", has: [{ type: "host", value: ".*\\.vercel\\.app|localhost|127\\.0\\.0\\.1" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  ],
  images: {
    qualities: [82],
    remotePatterns: [{ protocol: "https", hostname: "media.gmfb.co.nz", port: "", pathname: "/media/**" }],
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/design/**", search: "" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
