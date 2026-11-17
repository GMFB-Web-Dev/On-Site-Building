import { SitePage } from "./site";
import { metadataFor } from "./seo";
import { PageStructuredData } from "./seo-components";

export const metadata = metadataFor("home");

export default function Home() {
  return <><PageStructuredData page="home" /><SitePage page="home" /></>;
}
