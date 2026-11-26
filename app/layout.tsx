import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL, siteStructuredData } from "./seo";
import { JsonLd } from "./seo-components";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Construction",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en-NZ" className={`${montserrat.variable} ${manrope.variable}`}><body><a className="skip-link" href="#main-content">Skip to main content</a><JsonLd scriptKey="site-schema" data={siteStructuredData} />{children}</body></html>;
}
