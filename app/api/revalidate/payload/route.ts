import { revalidatePath } from "next/cache";
import { handlePayloadWebhook } from "../../../../lib/payload-webhook";

export async function POST(request: Request) {
  return handlePayloadWebhook(request, process.env.REVALIDATION_SECRET, revalidatePath);
}
