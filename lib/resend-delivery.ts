import { Resend, type CreateEmailOptions } from "resend";

export function resendSender(apiKey: string) {
  const resend = new Resend(apiKey);
  return async (email: CreateEmailOptions, idempotencyKey: string) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { data, error } = await resend.emails.send(email, { idempotencyKey, signal: AbortSignal.timeout(8000) });
        if (!error && data?.id) return;
        if (error) {
          const retryable = error.statusCode ? error.statusCode >= 500 || error.statusCode === 429
            : ["application_error", "internal_server_error", "rate_limit_exceeded", "concurrent_idempotent_requests"].includes(error.name);
          if (!retryable) throw new PermanentSendError();
        }
      } catch (error) {
        if (error instanceof PermanentSendError || attempt === 1) throw error;
      }
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 400));
    }
    throw new Error("Email service unavailable");
  };
}

class PermanentSendError extends Error {}
