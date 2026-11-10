import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "On Site Building Construction",
  description: "Renovations, residential new builds, design and build, extensions and light commercial construction across Auckland, Waikato and Whangārei.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${montserrat.variable} ${manrope.variable}`}><body>{children}</body></html>;
}
