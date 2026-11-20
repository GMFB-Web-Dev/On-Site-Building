"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CONTACT_LIMITS, FILE_ACCEPT, PROJECT_SIZES, type ContactErrors } from "../lib/contact-validation";

export function EnquiryForm({ services }: { services: string[] }) {
  const id = useId();
  const startedAt = useRef(0);
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  useEffect(() => { if (status === "success") statusRef.current?.focus(); }, [status]);

  const errorId = (name: keyof ContactErrors) => errors[name] ? `${id}-${name}-error` : undefined;
  const error = (name: keyof ContactErrors) => errors[name] ? <span className="form-field-error" id={errorId(name)}>{errors[name]}</span> : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const uploads = Array.from(fileInput.current?.files ?? []);
    if (uploads.length > CONTACT_LIMITS.files || uploads.some(file => file.size > CONTACT_LIMITS.fileBytes) || uploads.reduce((sum, file) => sum + file.size, 0) > CONTACT_LIMITS.totalFileBytes) {
      setErrors({ files: "Choose up to 3 files, no larger than 2 MB each or 3 MB in total." });
      fileInput.current?.focus();
      return;
    }
    const data = new FormData(form);
    requestId.current ??= crypto.randomUUID();
    data.set("requestId", requestId.current);
    data.set("startedAt", String(startedAt.current));
    data.set("sourcePath", window.location.pathname);
    submitting.current = true;
    setStatus("sending"); setErrors({}); setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: data, signal: AbortSignal.timeout(45_000) });
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: string; fields?: ContactErrors } | null;
      if (!response.ok || !result?.ok) {
        setStatus("error"); setMessage(result?.error || "Your enquiry couldn’t be sent. Please try again or call 021 715 196.");
        setErrors(result?.fields ?? {});
        const first = Object.keys(result?.fields ?? {}).find(name => form.elements.namedItem(name) instanceof HTMLElement);
        if (first) requestAnimationFrame(() => (form.elements.namedItem(first) as HTMLElement | null)?.focus());
        return;
      }
      form.reset(); setFiles([]); requestId.current = null; startedAt.current = Date.now();
      setStatus("success");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "onsite_enquiry_sent", page_path: window.location.pathname });
    } catch {
      setStatus("error"); setMessage("We couldn’t confirm that your enquiry was sent. Your details are still here—please try again or call 021 715 196.");
    } finally { submitting.current = false; }
  }

  return <form action="/api/contact" method="post" encType="multipart/form-data" onSubmit={submit} aria-label="Project enquiry form" aria-busy={status === "sending"}
    onChange={() => { requestId.current = null; if (status === "success") setStatus("idle"); }}>
    {status === "success" && <div className="form-feedback form-feedback-success" role="status" tabIndex={-1} ref={statusRef}><strong>Thank you for your enquiry.</strong><p>Your message has been sent to our team. We’ll be in touch to discuss your project.</p></div>}
    {status === "error" && <div className="form-feedback form-feedback-error" role="alert">{message}</div>}
    <fieldset className="enquiry-fields" disabled={status === "sending"}>
      <legend className="visually-hidden">Your project details</legend>
      <div className="form-honeypot" aria-hidden="true"><label>Company website<input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="field-pair">
        <label>FIRST NAME*<input name="firstName" autoComplete="given-name" required maxLength={CONTACT_LIMITS.name} placeholder="First Name" aria-invalid={!!errors.firstName} aria-describedby={errorId("firstName")} />{error("firstName")}</label>
        <label>LAST NAME*<input name="lastName" autoComplete="family-name" required maxLength={CONTACT_LIMITS.name} placeholder="Last Name" aria-invalid={!!errors.lastName} aria-describedby={errorId("lastName")} />{error("lastName")}</label>
      </div>
      <div className="field-pair">
        <label>EMAIL*<input name="email" type="email" autoComplete="email" required maxLength={CONTACT_LIMITS.email} placeholder="Email" aria-invalid={!!errors.email} aria-describedby={errorId("email")} />{error("email")}</label>
        <label>PHONE*<input name="phone" type="tel" autoComplete="tel" required maxLength={CONTACT_LIMITS.phone} placeholder="+64 21 345 6789" aria-invalid={!!errors.phone} aria-describedby={errorId("phone")} />{error("phone")}</label>
      </div>
      <label>SELECT A SERVICE*<select name="service" defaultValue="" required aria-invalid={!!errors.service} aria-describedby={errorId("service")}><option value="">Select One...</option>{services.map(service => <option key={service}>{service}</option>)}</select>{error("service")}</label>
      <label>PROJECT SIZE<select name="size" defaultValue={PROJECT_SIZES[0]} aria-invalid={!!errors.size} aria-describedby={errorId("size")}>{PROJECT_SIZES.map(size => <option key={size}>{size}</option>)}</select>{error("size")}</label>
      <label>UPLOAD FILES HERE<input ref={fileInput} name="files" type="file" accept={FILE_ACCEPT} multiple aria-invalid={!!errors.files} aria-describedby={`${id}-files-help${errorId("files") ? ` ${errorId("files")}` : ""}`} onChange={event => setFiles(Array.from(event.target.files ?? []).map(file => file.name))} />
        <span className="form-help" id={`${id}-files-help`}>PDF, PNG or JPG. Up to 3 files, 2 MB each and 3 MB in total.</span>{error("files")}
      </label>
      {files.length > 0 && <div className="form-upload-summary"><ul>{files.map((file, index) => <li key={index}>{file}</li>)}</ul><button type="button" onClick={() => { if (fileInput.current) fileInput.current.value = ""; setFiles([]); setErrors(current => ({ ...current, files: undefined })); requestId.current = null; }}>Clear attachments</button></div>}
      <label>MESSAGE*<textarea name="message" required minLength={10} maxLength={CONTACT_LIMITS.message} placeholder="Type your message here..." aria-invalid={!!errors.message} aria-describedby={errorId("message")} />{error("message")}</label>
      <div><label className="checkbox"><input type="checkbox" name="terms" required aria-invalid={!!errors.terms} aria-describedby={errorId("terms")} /> I AGREE TO THE TERMS AND CONDITIONS</label>{error("terms")}</div>
      <button className="cta-button" type="submit">{status === "sending" ? "SENDING…" : "SUBMIT"}</button>
    </fieldset>
    <noscript><p>Please enable JavaScript to use the enquiry form, or email <a href="mailto:onsitebuilding1@gmail.com">onsitebuilding1@gmail.com</a>.</p></noscript>
  </form>;
}
