import { handleContactRequest, createContactLimiter } from "../../../lib/contact-handler";
import { resendSender } from "../../../lib/resend-delivery";
import { masterContent } from "../../master-content";

export const maxDuration = 60;
const limit = createContactLimiter();

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  return handleContactRequest(request, {
    apiKey, from: process.env.CONTACT_FROM_EMAIL, to: process.env.CONTACT_TO_EMAIL,
    services: Object.values(masterContent.services.labels), limit,
    acknowledgement: process.env.CONTACT_SEND_ACKNOWLEDGEMENT !== "false",
    send: apiKey ? resendSender(apiKey) : async () => { throw new Error("Email is not configured"); },
  });
}
