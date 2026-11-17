import legalContent from "../legal-content.json";
import { LegalPage } from "../legal-page";
import { metadataFor } from "../seo";
import { PageStructuredData } from "../seo-components";

export const metadata = metadataFor("privacy");

export default function PrivacyPolicyPage() {
  return <><PageStructuredData page="privacy" /><LegalPage document={legalContent.privacy} /></>;
}
