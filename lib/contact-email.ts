import { CONTACT_FIELDS, type ContactValues } from "@/lib/contact";

/* The team reads these in Toronto, so the headline time is local; the ISO stamp beside it is
   the unambiguous one to match against Resend and Vercel logs. */
const torontoTime = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", dateStyle: "full", timeStyle: "long" });

const details = CONTACT_FIELDS.filter((field) => !field.multiline);
const answers = CONTACT_FIELDS.filter((field) => field.multiline);

const ink = "#1f241d";
const muted = "#5b6158";
const rule = "#e3ded1";
const cell = `padding:10px 0;border-top:1px solid ${rule};vertical-align:top;`;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character] || character);
}

/** Subject, HTML and plain-text bodies for one inquiry. Every submitted value is escaped. */
export function buildContactEmail(values: ContactValues, { submittedAt, source }: { submittedAt: Date; source: string }) {
  const submitted = `${torontoTime.format(submittedAt)} (${submittedAt.toISOString()})`;
  const subject = `Website inquiry — ${values.name}, ${values.company}`.replace(/\s+/g, " ").slice(0, 150);

  const rows = details
    .map((field) => {
      const value = escapeHtml(values[field.name]);
      const shown = field.type === "email" ? `<a href="mailto:${value}" style="color:${ink};">${value}</a>` : value;
      return `<tr><td style="${cell}width:128px;padding-right:16px;color:${muted};">${field.emailLabel}</td><td style="${cell}">${shown}</td></tr>`;
    })
    .join("");
  const sections = answers
    .map((field) => {
      const value = values[field.name];
      const body = value ? escapeHtml(value).replace(/\n/g, "<br>") : `<span style="color:${muted};font-style:italic;">Not provided</span>`;
      return `<h2 style="margin:28px 0 6px;color:#596b4a;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;">${field.emailLabel}</h2><p style="margin:0;">${body}</p>`;
    })
    .join("");

  const html = `<div style="margin:0;padding:24px 12px;background:#f3efe4;"><div style="max-width:640px;margin:0 auto;padding:32px 28px;background:#ffffff;color:${ink};font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;">`
    + `<p style="margin:0 0 6px;color:#596b4a;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;">Elagon website · Contact form</p>`
    + `<h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;line-height:1.2;">New website inquiry</h1>`
    + `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>${sections}`
    + `<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid ${rule};color:${muted};font-size:13px;">Submitted ${escapeHtml(submitted)}<br>Sent from ${escapeHtml(source)}<br>Reply to this email to respond to ${escapeHtml(values.name)} directly.</p>`
    + `</div></div>`;

  const text = [
    "New website inquiry",
    "",
    ...details.map((field) => `${field.emailLabel}: ${values[field.name]}`),
    ...answers.flatMap((field) => ["", field.emailLabel, values[field.name] || "Not provided"]),
    "",
    "—",
    `Submitted: ${submitted}`,
    `Sent from: ${source}`,
    `Reply to this email to respond to ${values.name} directly.`,
  ].join("\n");

  return { subject, html, text };
}
