"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ATTACHMENT_HELP, getAttachments, PROJECT_BUDGETS, PROJECT_SIZES, PROJECT_TIMEFRAMES, validateAttachmentMetadata, validateContactFields,
  type ContactErrors, type ContactField,
} from "./lib/contact-validation";
import styles from "./enquiry-form.module.css";

type EnquiryFormProps = { services: string[]; phone: string; phoneHref: string; email: string };
type SubmissionResponse = { ok?: boolean; message?: string; errors?: ContactErrors };

const fieldLabels: Record<ContactField, string> = {
  firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone",
  service: "Service", location: "Project suburb or town", size: "Project size", budget: "Estimated budget",
  timeframe: "Preferred timeframe", message: "Message", consent: "Contact permission", files: "Attachments",
};

export function EnquiryForm({ services, phone, phoneHref, email }: EnquiryFormProps) {
  const id = useId();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  const submissionId = useRef("");
  const notice = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message || success) notice.current?.focus();
  }, [message, success]);

  const fieldProps = (field: ContactField) => ({
    id: `${id}-${field}`, name: field, "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
  });
  const fieldError = (field: ContactField) => errors[field]
    ? <span id={`${id}-${field}-error`} className={styles.error}>{errors[field]}</span> : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const validation = validateContactFields(data, services);
    const attachmentError = validateAttachmentMetadata(getAttachments(data));
    if (attachmentError) validation.errors.files = attachmentError;
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      setMessage("Please check the highlighted fields.");
      notice.current?.focus();
      return;
    }
    submissionId.current ||= crypto.randomUUID();
    data.set("submissionId", submissionId.current);
    submitting.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await fetch("/api/contact", { method: "POST", body: data, signal: AbortSignal.timeout(25_000) });
      const body: SubmissionResponse | null = await result.json().catch(() => null);
      if (!result.ok || !body?.ok) {
        setErrors(body?.errors || {});
        setMessage(body?.message || (result.status === 413 ? "Please keep your attachments under 3 MB combined." : "We couldn't submit your enquiry. Please try again, or contact us directly."));
        return;
      }
      form.reset();
      submissionId.current = "";
      setSuccess(true);
    } catch {
      setMessage("We couldn't confirm your enquiry was submitted. Your details are still here. Please try again, or contact us directly.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  if (success) return <div className={styles.success} ref={notice} tabIndex={-1} role="status">
    <h3>Thank you for your enquiry</h3>
    <p>Your enquiry has been submitted. We&apos;ll be in touch to discuss your project.</p>
    <button type="button" className="cta-button" onClick={() => { setSuccess(false); setErrors({}); setMessage(""); }}>SEND ANOTHER ENQUIRY</button>
  </div>;

  return <form className={styles.form} action="/api/contact" method="post" encType="multipart/form-data" noValidate onSubmit={onSubmit} aria-label="Project enquiry form" aria-busy={pending}>
    {message && <div className={styles.notice} role="alert" ref={notice} tabIndex={-1}>
      {message}
      {Object.keys(errors).length > 0 && <ul>{(Object.keys(errors) as ContactField[]).map(field => <li key={field}><a href={`#${id}-${field}`}>{fieldLabels[field]}: {errors[field]}</a></li>)}</ul>}
      {!Object.keys(errors).length && <p>Call <a href={phoneHref}>{phone}</a> or email <a href={`mailto:${email}`}>{email}</a>.</p>}
    </div>}
    <fieldset className={styles.fields} disabled={pending}>
      <p className={styles.hint}>Fields marked * are required.</p>
      <div className="field-pair">
        <label htmlFor={`${id}-firstName`}>FIRST NAME*<input {...fieldProps("firstName")} autoComplete="given-name" placeholder="First name" maxLength={80} required />{fieldError("firstName")}</label>
        <label htmlFor={`${id}-lastName`}>LAST NAME*<input {...fieldProps("lastName")} autoComplete="family-name" placeholder="Last name" maxLength={80} required />{fieldError("lastName")}</label>
      </div>
      <div className="field-pair">
        <label htmlFor={`${id}-email`}>EMAIL*<input {...fieldProps("email")} type="email" autoComplete="email" placeholder="Email" maxLength={254} required />{fieldError("email")}</label>
        <label htmlFor={`${id}-phone`}>PHONE*<input {...fieldProps("phone")} type="tel" autoComplete="tel" placeholder="+64 21 345 6789" maxLength={30} required />{fieldError("phone")}</label>
      </div>
      <label htmlFor={`${id}-service`}>SELECT A SERVICE*<select {...fieldProps("service")} defaultValue="" required><option value="">Select a service...</option>{services.map(service => <option key={service} value={service}>{service.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase())}</option>)}</select>{fieldError("service")}</label>
      <div className="field-pair">
        <label htmlFor={`${id}-location`}>PROJECT SUBURB OR TOWN*<input {...fieldProps("location")} autoComplete="address-level2" placeholder="e.g. Manurewa" maxLength={120} required aria-describedby={`${id}-location-help${errors.location ? ` ${id}-location-error` : ""}`} />{fieldError("location")}</label>
        <label htmlFor={`${id}-size`}>PROJECT SIZE<select {...fieldProps("size")} defaultValue=""><option value="">Select a size (optional)</option>{PROJECT_SIZES.map(size => <option key={size}>{size}</option>)}</select>{fieldError("size")}</label>
      </div>
      <p id={`${id}-location-help`} className={styles.hint}>Your project&apos;s location and size help us confirm whether we can travel to your area.</p>
      <div className="field-pair">
        <label htmlFor={`${id}-budget`}>ESTIMATED BUDGET (NZD)<select {...fieldProps("budget")} defaultValue=""><option value="">Select a budget (optional)</option>{PROJECT_BUDGETS.map(budget => <option key={budget}>{budget}</option>)}</select>{fieldError("budget")}</label>
        <label htmlFor={`${id}-timeframe`}>PREFERRED TIMEFRAME<select {...fieldProps("timeframe")} defaultValue=""><option value="">Select a timeframe (optional)</option>{PROJECT_TIMEFRAMES.map(timeframe => <option key={timeframe}>{timeframe}</option>)}</select>{fieldError("timeframe")}</label>
      </div>
      <label htmlFor={`${id}-files`}>UPLOAD FILES<input {...fieldProps("files")} className={styles.upload} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple aria-describedby={`${id}-files-help${errors.files ? ` ${id}-files-error` : ""}`} /><span id={`${id}-files-help`} className={styles.hint}>{ATTACHMENT_HELP} For larger plans, contact us directly.</span>{fieldError("files")}</label>
      <label htmlFor={`${id}-message`}>MESSAGE (OPTIONAL)<textarea {...fieldProps("message")} placeholder="Tell us what you would like to build or change, and whether you already have plans..." maxLength={5000} rows={5} />{fieldError("message")}</label>
      <div>
        <label className={styles.consent} htmlFor={`${id}-consent`}><input {...fieldProps("consent")} type="checkbox" required /><span>I agree that On Site Building Construction may use my details to respond to my enquiry. Read our <Link href="/privacy-policy">Privacy Policy</Link>.*</span></label>
        {fieldError("consent")}
      </div>
      <div className={styles.trap} aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field blank<input id={`${id}-website`} name="website" type="text" autoComplete="off" tabIndex={-1} /></label></div>
      <button className="cta-button" type="submit" disabled={pending}>{pending ? "SENDING..." : "SUBMIT ENQUIRY"}</button>
    </fieldset>
    <p className={styles.status} role="status" aria-live="polite">{pending ? "Submitting your enquiry. Please keep this page open." : ""}</p>
    <noscript><p>Please enable JavaScript to use this form, or contact us at <a href={phoneHref}>{phone}</a> or <a href={`mailto:${email}`}>{email}</a>.</p></noscript>
  </form>;
}
