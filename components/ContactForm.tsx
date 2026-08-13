"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", autoComplete: "email" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "role", label: "Role", type: "text", autoComplete: "organization-title" },
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "The message could not be sent.");
      setStatus("success");
      setMessage(result.message || "Thank you. We’ll reply within two business days.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The message could not be sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        {fields.map((field) => <label key={field.name}><span>{field.label} *</span><input name={field.name} type={field.type} autoComplete={field.autoComplete} required /></label>)}
      </div>
      <label><span>Workflow or problem *</span><textarea name="workflow" required rows={4} /></label>
      <label><span>Desired business outcome *</span><textarea name="outcome" required rows={3} /></label>
      <div className="form-grid">
        <label><span>Timeline *</span><select name="timeline" required defaultValue=""><option value="" disabled>Select</option><option>Within 3 months</option><option>3–6 months</option><option>6–12 months</option><option>Exploring</option></select></label>
        <label><span>Budget range *</span><select name="budget" required defaultValue=""><option value="" disabled>Select</option><option>$25k–$75k</option><option>$75k–$200k</option><option>$200k+</option><option>Not defined</option></select></label>
      </div>
      <label className="consent"><input name="consent" type="checkbox" value="accepted" required /><span>I agree that Elagon may use this information to respond to my inquiry. *</span></label>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="form-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send inquiry"}<span>↗</span></button>
      <p className={`form-status is-${status}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
