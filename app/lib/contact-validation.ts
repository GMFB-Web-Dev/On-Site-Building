export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 3_000_000;
export const MAX_REQUEST_BYTES = MAX_ATTACHMENT_BYTES + 100_000;
export const ATTACHMENT_HELP = "PDF, JPG or PNG. Up to 3 files, 3 MB combined.";
export const PROJECT_SIZES = ["25 sqm", "50 sqm", "100+ sqm", "Not sure yet"] as const;
export const PROJECT_BUDGETS = ["Under $25,000", "$25,000–$50,000", "$50,000–$100,000", "$100,000–$250,000", "$250,000+", "Not sure yet"] as const;
export const PROJECT_TIMEFRAMES = ["Planning ahead", "Within 3 months", "3–6 months", "6–12 months", "Flexible / Not sure yet"] as const;

export type ContactField = "firstName" | "lastName" | "email" | "phone" | "service" | "location" | "size" | "budget" | "timeframe" | "message" | "consent" | "files";
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactFields = Record<Exclude<ContactField, "files" | "consent">, string>;

const SINGLE_LINE_CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
const MESSAGE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function isEmail(value: string) {
  return value.length <= 254 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value);
}

export function validateContactFields(form: FormData, services: readonly string[]) {
  const errors: ContactErrors = {};
  const read = (key: Exclude<ContactField, "files" | "consent">) => {
    const entries = form.getAll(key);
    if (entries.length > 1 || entries.some(entry => typeof entry !== "string")) {
      errors[key] = "Please enter one value for this field.";
      return "";
    }
    return typeof entries[0] === "string" ? entries[0].trim() : "";
  };
  const fields: ContactFields = {
    firstName: read("firstName"), lastName: read("lastName"), email: read("email"),
    phone: read("phone"), service: read("service"), location: read("location"), size: read("size"),
    budget: read("budget"), timeframe: read("timeframe"), message: read("message"),
  };

  for (const field of ["firstName", "lastName"] as const) {
    if (!fields[field] || fields[field].length > 80 || SINGLE_LINE_CONTROL.test(fields[field])) {
      errors[field] = `Please enter your ${field === "firstName" ? "first" : "last"} name (up to 80 characters).`;
    }
  }
  if (!isEmail(fields.email)) errors.email = "Please enter a valid email address.";
  const phoneDigits = fields.phone.replace(/\D/g, "");
  if (!/^[+\d\s().-]+$/.test(fields.phone) || fields.phone.length > 30 || phoneDigits.length < 7 || phoneDigits.length > 15 || SINGLE_LINE_CONTROL.test(fields.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!services.includes(fields.service)) errors.service = "Please select a service.";
  const rawLocation = form.get("location");
  if (!fields.location || fields.location.length > 120 || (typeof rawLocation === "string" && SINGLE_LINE_CONTROL.test(rawLocation))) {
    errors.location = "Please enter your project's suburb or town on one line (up to 120 characters).";
  }
  if (fields.size && !PROJECT_SIZES.some(size => size === fields.size)) errors.size = "Please select a project size.";
  if (fields.budget && !PROJECT_BUDGETS.some(budget => budget === fields.budget)) errors.budget = "Please select a budget from the list, or leave it blank.";
  if (fields.timeframe && !PROJECT_TIMEFRAMES.some(timeframe => timeframe === fields.timeframe)) errors.timeframe = "Please select a timeframe from the list, or leave it blank.";
  if (fields.message.length > 5000 || MESSAGE_CONTROL.test(fields.message)) errors.message = "Please keep your message to 5,000 characters without control characters.";
  if (form.getAll("consent").length !== 1 || form.get("consent") !== "on") {
    errors.consent = "Please confirm that we may use your details to respond to your enquiry.";
  }
  return { fields, errors };
}

export function getAttachments(form: FormData) {
  return form.getAll("files").filter((item): item is File => typeof item !== "string" && (item.size > 0 || item.name !== ""));
}

export function validateAttachmentMetadata(files: readonly File[]): string | undefined {
  if (files.length > MAX_ATTACHMENTS) return "Please choose no more than 3 files.";
  if (files.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENT_BYTES) return "Please keep your attachments under 3 MB combined.";
  for (const file of files) {
    if (!file.size) return "One of your files is empty. Please remove it and try again.";
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name) || (file.type && !["application/pdf", "image/jpeg", "image/png"].includes(file.type))) {
      return "Please attach PDF, JPG or PNG files only.";
    }
  }
}
