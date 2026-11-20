"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function TagManager({ id }: { id: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    // Deliberately exclude query values: enquiry forms may put personal details in URLs.
    window.dataLayer.push({ event: "onsite_page_view", page_path: pathname });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="tel:"],a[href^="mailto:"]');
      if (!anchor) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "onsite_contact_click", contact_method: anchor.protocol === "tel:" ? "phone" : "email", page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <Script id="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`}</Script>;
}
