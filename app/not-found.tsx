import Link from "next/link";
import { SiteHeader, SiteFooter } from "./site";
import { paths } from "./site-routes";

export default function NotFound() {
  return <div className="site-canvas"><SiteHeader file="navbar-home.png" /><main id="main-content" className="not-found content-shell">
    <p className="section-kicker">PAGE NOT FOUND</p><h1>Let’s get you back on site.</h1>
    <p>This page may have moved, or the address may be incorrect. Explore our Auckland building services or get in touch about your project.</p>
    <div><Link className="cta-button" href={paths.home}>HOME</Link><Link className="cta-button" href={paths.services}>BUILDING SERVICES</Link><Link className="cta-button" href={paths.contact}>CONTACT US</Link></div>
  </main><SiteFooter file="footer-home.png" /></div>;
}
