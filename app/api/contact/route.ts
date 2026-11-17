import { createContactHandler } from "../../lib/contact-handler";
import { masterContent } from "../../master-content";

export const maxDuration = 30;

const handleContact = createContactHandler({ services: Object.values(masterContent.services.labels) });

export async function POST(request: Request) {
  return handleContact(request);
}
