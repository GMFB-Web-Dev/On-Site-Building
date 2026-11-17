import legalContent from "../legal-content.json";
import { LegalPage } from "../legal-page";
import { metadataFor } from "../seo";
import { PageStructuredData } from "../seo-components";

export const metadata = metadataFor("terms");

export default function TermsPage() {
  return <><PageStructuredData page="terms" /><LegalPage document={legalContent.terms} /></>;
}
