import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { SITE_NAME, SITE_URL, siteStructuredData } from "./seo";
import { JsonLd } from "./seo-components";
import { TagManager } from "./tag-manager";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Construction",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const configuredId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-NQCNX9N7";
  const gtmId = /^GTM-[A-Z0-9]+$/.test(configuredId) ? configuredId : undefined;
  return <html lang="en-NZ" className={`${montserrat.variable} ${manrope.variable}`}><body>
    {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" /></noscript>}
    <JsonLd data={siteStructuredData} />{children}
    {gtmId && <Suspense fallback={null}><TagManager id={gtmId} /></Suspense>}
  </body></html>;
}
