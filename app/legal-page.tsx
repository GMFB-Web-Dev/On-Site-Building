import Link from "next/link";
import { SiteFooter, SiteHeader } from "./site";
import styles from "./legal.module.css";
import { Breadcrumbs } from "./seo-components";

type LegalDocument = {
  path: string;
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    links?: { label: string; href: string }[];
  }[];
};

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className="site-canvas">
      <SiteHeader file="navbar-legal.png" />
      <Breadcrumbs page={document.path === "/privacy-policy" ? "privacy" : "terms"} />
      <main className={styles.main} id="main-content">
        <article className={styles.document} aria-labelledby="legal-title">
          <header className={styles.heading}>
            <p className={styles.eyebrow}>On Site Building</p>
            <h1 id="legal-title">{document.title}</h1>
            <p className={styles.updated}>Last updated: {document.lastUpdated}</p>
            {document.intro.map((paragraph) => (
              <p className={styles.intro} key={paragraph}>{paragraph}</p>
            ))}
          </header>

          <nav className={styles.policyLinks} aria-label="Legal information">
            <Link href="/privacy-policy" aria-current={document.path === "/privacy-policy" ? "page" : undefined}>
              Privacy Policy
            </Link>
            <Link href="/terms" aria-current={document.path === "/terms" ? "page" : undefined}>
              Website Terms
            </Link>
          </nav>

          <div className={styles.sections}>
            {document.sections.map((section, index) => (
              <section className={styles.section} key={section.heading} aria-labelledby={`legal-section-${index}`}>
                <h2 id={`legal-section-${index}`}>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.links?.map((link) => (
                  <p className={styles.resourceLink} key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <aside className={styles.contact} aria-label="Contact On Site Building">
            <p>Questions? Get in touch with our team.</p>
            <div>
              <a href="mailto:onsitebuilding1@gmail.com">onsitebuilding1@gmail.com</a>
              <a href="tel:+6421715196">021 715 196</a>
            </div>
          </aside>
        </article>
      </main>
      <SiteFooter file="footer-legal.png" />
    </div>
  );
}
