"use client";

import { useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArrowIcon } from "@/components/ArrowIcon";
import { CONTACT_EMAIL, CONTACT_FIELDS, HONEYPOT_FIELD, normalizeContact, validateContact, type ContactErrors, type ContactField, type ContactFieldName } from "@/lib/contact";

type Phase = "idle" | "sending" | "success";
type Failure = "invalid" | "rate_limited" | "unavailable" | "send_failed" | "network" | "timeout";

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

/* /api/contact answers with a code and the wording lives here, so every failure — including a
   platform error page that isn't JSON — reads plainly and keeps the direct address in reach. */
const failures: Record<Failure, ReactNode> = {
  invalid: "Some details need another look—see the highlighted fields.",
  rate_limited: <>You’ve sent a few messages in a short time. Please wait about 10 minutes, or email {email}.</>,
  unavailable: <>The form isn’t available right now. Please email {email} and we’ll reply within two business days.</>,
  send_failed: <>We couldn’t send your message. Your answers are still here—try again, or email {email}.</>,
  network: <>We couldn’t reach the server. Check your connection and try again, or email {email}.</>,
  timeout: <>We couldn’t confirm your message was sent. Please email {email} rather than sending it again.</>,
};
const failureByStatus: Partial<Record<number, Failure>> = { 400: "invalid", 429: "rate_limited", 503: "unavailable" };
const isFailure = (code: unknown): code is Failure => typeof code === "string" && Object.hasOwn(failures, code);

const fieldId = (name: ContactFieldName) => `contact-${name}`;
const errorId = (name: ContactFieldName) => `contact-${name}-error`;

// Lands keyboard and screen-reader users on the confirmation, which replaces the form.
const focusOnMount = (element: HTMLElement | null) => element?.focus();

/** Only messages for fields this form renders, whatever else the response carries. */
function knownErrors(input: unknown) {
  const found: ContactErrors = {};
  if (input === null || typeof input !== "object") return found;
  for (const field of CONTACT_FIELDS) {
    const message = (input as Record<string, unknown>)[field.name];
    if (typeof message === "string" && message) found[field.name] = message;
  }
  return found;
}

function Field({ field, error }: { field: ContactField; error?: string }) {
  const described = error ? errorId(field.name) : undefined;
  // Always explicit: otherwise a required dropdown still on "Choose one" can be announced as invalid before any submit.
  const control = { id: fieldId(field.name), name: field.name, required: Boolean(field.missing), "aria-invalid": Boolean(error), "aria-describedby": described };
  const isEmail = field.type === "email";
  return (
    <div className="contact-field">
      <label htmlFor={control.id}>
        <span>{field.label}{!field.missing && <> <span className="field-optional">(optional)</span></>}</span>
        {field.options ? (
          // Uncontrolled with an empty default, so no option is ever chosen on the visitor's behalf.
          <select {...control} defaultValue=""><option value="" disabled>Choose one</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
        ) : field.multiline ? (
          // No maxLength on textareas: it silently cuts pasted text, so length is validated with a message instead.
          <textarea {...control} rows={field.rows} placeholder={field.placeholder} data-lenis-prevent />
        ) : (
          <input {...control} type={field.type ?? "text"} maxLength={field.maxLength} autoComplete={field.autoComplete} autoCapitalize={isEmail ? "off" : undefined} spellCheck={isEmail ? false : undefined} />
        )}
      </label>
      {error && <p className="field-error" id={described}>{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [failure, setFailure] = useState<Failure | null>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Blocks a second submit in the same tick (double click, Enter + click) before React re-renders.
  const inFlight = useRef(false);

  /* Committed before focus moves, so the screen reader announces the field together with its
     invalid state and message. */
  function showErrors(found: ContactErrors) {
    flushSync(() => {
      setErrors(found);
      setFailure("invalid");
    });
    const first = CONTACT_FIELDS.find((field) => found[field.name]);
    if (first) document.getElementById(fieldId(first.name))?.focus();
  }

  // A field already showing an error re-checks as it is corrected; untouched fields stay quiet.
  function recheck(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as ContactFieldName;
    if (!errors[name]) return;
    const message = validateContact(normalizeContact(Object.fromEntries(new FormData(event.currentTarget))))[name];
    const next = { ...errors };
    if (message) next[name] = message;
    else delete next[name];
    setErrors(next);
    if (!Object.keys(next).length && failure === "invalid") setFailure(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const values = normalizeContact(data);
    const found = validateContact(values);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }

    inFlight.current = true;
    setErrors({});
    setFailure(null);
    setPhase("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? "" }),
        signal: AbortSignal.timeout(30_000),
      });
      const body = (await response.json().catch(() => null)) as { ok?: unknown; code?: unknown; fieldErrors?: unknown } | null;
      // The route only answers ok once Resend has accepted the email.
      if (response.ok && body?.ok === true) {
        setPhase("success");
        return;
      }
      setPhase("idle");
      const serverErrors = knownErrors(body?.fieldErrors);
      if (Object.keys(serverErrors).length) {
        showErrors(serverErrors);
        return;
      }
      const code = body?.code;
      setFailure(isFailure(code) ? code : failureByStatus[response.status] ?? "send_failed");
    } catch (error) {
      setPhase("idle");
      // The request may still land after a timeout, so that case steers away from resending.
      setFailure(error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "network");
    } finally {
      inFlight.current = false;
    }
  }

  if (phase === "success") {
    return (
      <div className="contact-form contact-success" role="group" tabIndex={-1} ref={focusOnMount} aria-labelledby="contact-success-title" aria-describedby="contact-success-message">
        <h2 id="contact-success-title">Received.</h2>
        <p id="contact-success-message">An Elagon principal will review your request and respond with an honest view of the fit and the most practical next step.</p>
      </div>
    );
  }

  const sending = phase === "sending";
  // Short text fields pair up in the grid; the dropdown and the long answer run full width.
  const paired = CONTACT_FIELDS.filter((field) => !field.multiline && !field.options);
  const fullWidth = CONTACT_FIELDS.filter((field) => field.multiline || field.options);

  return (
    <form className="contact-form" method="post" aria-label="Contact form" onSubmit={submit} onChange={recheck} noValidate>
      <p className="contact-form-note">All fields are required unless marked optional.</p>
      <div className="form-grid">{paired.map((field) => <Field key={field.name} field={field} error={errors[field.name]} />)}</div>
      {fullWidth.map((field) => <Field key={field.name} field={field} error={errors[field.name]} />)}
      <input className="honeypot" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" data-1p-ignore data-lpignore="true" data-bwignore data-form-type="other" />
      {/* aria-disabled rather than disabled: disabling the focused button would drop keyboard focus to the page. */}
      <button className="form-submit" type="submit" aria-disabled={sending || undefined}><span>{sending ? "Sending…" : "Talk to an AI expert"}</span><ArrowIcon direction="up-right" /></button>
      <p className={`form-status${failure ? " is-error" : ""}`} role="status" aria-live="polite">{sending ? "Sending your message…" : failure && failures[failure]}</p>
    </form>
  );
}
