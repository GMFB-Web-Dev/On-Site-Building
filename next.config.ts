import type { NextConfig } from "next";
import { permanentRedirects } from "./app/site-routes";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["127.0.0.1"],
  redirects: async () => permanentRedirects,
  headers: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: ".*\\.vercel\\.app|.*\\.tmp\\.now|localhost|127\\.0\\.0\\.1" }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
    { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
  ],
  turbopack: {
    rules: {
      // Keep CSS Modules on Next's native pipeline so their class maps survive.
      "app/globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
