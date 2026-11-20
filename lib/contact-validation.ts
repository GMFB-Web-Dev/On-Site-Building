export const CONTACT_LIMITS = {
  name: 80, email: 254, phone: 32, message: 5000,
  files: 3, fileBytes: 2 * 1024 * 1024, totalFileBytes: 3 * 1024 * 1024,
  bodyBytes: 3 * 1024 * 1024 + 64 * 1024,
} as const;
export const PROJECT_SIZES = ["25 sqm", "50 sqm", "100+ sqm"] as const;
export const FILE_ACCEPT = ".pdf,.png,.jpg,.jpeg";
export type ContactFields = {
  firstName: string; lastName: string; email: string; phone: string;
  service: string; size: string; message: string; sourcePath: string;
  requestId: string; startedAt: number;
};
export type ContactErrors = Partial<Record<keyof ContactFields | "terms" | "files", string>>;

export function validEmail(value: string) {
  return value.length <= CONTACT_LIMITS.email && /^[^\s<>@,;\u0000-\u001f\u007f]+@[^\s<>@,;\u0000-\u001f\u007f]+\.[a-z]{2,63}$/i.test(value);
}

export function validateContact(form: FormData, services: readonly string[], now = Date.now()) {
  const value = (key: string) => typeof form.get(key) === "string" ? String(form.get(key)).trim() : "";
  const fields: ContactFields = {
    firstName: value("firstName"), lastName: value("lastName"), email: value("email"), phone: value("phone"),
    service: value("service"), size: value("size"), message: value("message").replace(/\r\n?/g, "\n"),
    sourcePath: value("sourcePath") || "/", requestId: value("requestId"), startedAt: Number(value("startedAt")),
  };
  const errors: ContactErrors = {};
  for (const key of ["firstName", "lastName"] as const) if (!fields[key] || fields[key].length > CONTACT_LIMITS.name || /[\u0000-\u001f\u007f]/.test(fields[key])) errors[key] = `Enter your ${key === "firstName" ? "first" : "last"} name (up to 80 characters).`;
  if (!validEmail(fields.email)) errors.email = "Enter a valid email address.";
  if (!/^[+()\d .-]{7,32}$/.test(fields.phone) || fields.phone.replace(/\D/g, "").length < 7 || fields.phone.replace(/\D/g, "").length > 15) errors.phone = "Enter a valid phone number.";
  if (!services.includes(fields.service)) errors.service = "Select a service.";
  if (!(PROJECT_SIZES as readonly string[]).includes(fields.size)) errors.size = "Select a project size.";
  if (fields.message.length < 10 || fields.message.length > CONTACT_LIMITS.message || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(fields.message)) errors.message = "Tell us about your project in 10–5,000 characters.";
  if (form.get("terms") !== "on" && form.get("terms") !== "true") errors.terms = "Please agree to the terms and conditions.";
  if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(fields.requestId)) errors.requestId = "Please refresh the page and try again.";
  if (!Number.isFinite(fields.startedAt) || fields.startedAt <= 0 || now - fields.startedAt < 1000) errors.startedAt = "Please take a moment to complete the form, then try again.";
  if (fields.sourcePath.length > 300 || !fields.sourcePath.startsWith("/") || fields.sourcePath.startsWith("//") || /[?#\\\u0000-\u0020]/.test(fields.sourcePath)) errors.sourcePath = "Please refresh the page and try again.";
  return { fields, errors, valid: Object.keys(errors).length === 0, honeypot: !!value("companyWebsite") };
}

export type ContactAttachment = { filename: string; content: Buffer; contentType: string };
export async function contactAttachments(form: FormData): Promise<{ attachments: ContactAttachment[]; error?: string }> {
  const files = form.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length > CONTACT_LIMITS.files) return { attachments: [], error: "Upload up to 3 files." };
  if (files.some(file => file.size > CONTACT_LIMITS.fileBytes) || files.reduce((size, file) => size + file.size, 0) > CONTACT_LIMITS.totalFileBytes) return { attachments: [], error: "Each file must be 2 MB or less, and all files together 3 MB or less." };
  const attachments: ContactAttachment[] = [];
  for (const file of files) {
    const content = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").at(-1)?.toLowerCase();
    const type = extension === "pdf" && content.subarray(0, 5).toString() === "%PDF-" ? "application/pdf"
      : extension === "png" && content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "image/png"
      : ["jpg", "jpeg"].includes(extension ?? "") && content.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? "image/jpeg" : null;
    if (!type || (file.type && file.type !== type)) return { attachments: [], error: "Upload valid PDF, PNG or JPG files." };
    const filename = file.name.split(/[\\/]/).at(-1)!.replace(/[^a-z\d._ -]/gi, "_").replace(/^\.+/, "").slice(-120) || `project-file.${extension}`;
    attachments.push({ filename, content, contentType: type });
  }
  return { attachments };
}
