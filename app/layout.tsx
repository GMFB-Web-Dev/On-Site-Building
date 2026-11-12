import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "./globals.css";
import { masterContent } from "./master-content";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: masterContent.business.name,
  description: masterContent.hero.description,
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${montserrat.variable} ${manrope.variable}`}><body>{children}</body></html>;
}
