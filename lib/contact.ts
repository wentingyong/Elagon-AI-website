/**
 * The contact form's single definition. ContactForm renders these fields and shows the same
 * messages inline that /api/contact enforces, so the browser and the route can never disagree
 * about what a valid inquiry is. No env access here: this module ships to the client.
 */

export const CONTACT_EMAIL = "hello@elagon.ai";

/** The off-screen bot trap. Named so no autofill heuristic or password manager recognises it:
 *  a value here means a bot, and the route drops the submission with a silent success. */
export const HONEYPOT_FIELD = "contact_ref";

/** zod 4's default email pattern (zod/v4/core/regexes.js), copied so the client needs no zod.
 *  Rejects "a@b", leading or doubled dots, and addresses without a real top-level domain. */
export const EMAIL_PATTERN = /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+.-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export type ContactFieldName = "name" | "email" | "company" | "role" | "workflow" | "outcome" | "tried";
export type ContactValues = Record<ContactFieldName, string>;
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

export interface ContactField {
  name: ContactFieldName;
  /** On the form */
  label: string;
  /** In the notification email to the team */
  emailLabel: string;
  maxLength: number;
  /** Shown when the field is left blank. Fields without one are optional. */
  missing?: string;
  multiline?: boolean;
  rows?: number;
  type?: "text" | "email";
  autoComplete?: string;
}

export const CONTACT_FIELDS: readonly ContactField[] = [
  { name: "name", label: "Name", emailLabel: "Name", maxLength: 120, missing: "Enter your name.", autoComplete: "name" },
  { name: "email", label: "Work email", emailLabel: "Work email", maxLength: 254, missing: "Enter your work email.", type: "email", autoComplete: "email" },
  { name: "company", label: "Company", emailLabel: "Company", maxLength: 160, missing: "Enter your company name.", autoComplete: "organization" },
  { name: "role", label: "Role", emailLabel: "Role", maxLength: 160, missing: "Enter your role.", autoComplete: "organization-title" },
  { name: "workflow", label: "Which workflow should we examine?", emailLabel: "Workflow to examine", maxLength: 5000, missing: "Tell us which workflow we should examine.", multiline: true, rows: 4 },
  { name: "outcome", label: "What business result matters?", emailLabel: "Business result that matters", maxLength: 5000, missing: "Tell us what business result matters.", multiline: true, rows: 3 },
  { name: "tried", label: "What have you already tried?", emailLabel: "What they have already tried", maxLength: 5000, multiline: true, rows: 3 },
];

/** Keeps only the known fields, as trimmed strings with Unix line endings. Unknown keys and
 *  non-string values are dropped, so a hand-built request is judged exactly like the form. */
export function normalizeContact(input: unknown): ContactValues {
  const source = input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const values = {} as ContactValues;
  for (const field of CONTACT_FIELDS) {
    const value = source[field.name];
    values[field.name] = typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
  }
  return values;
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const value = values[field.name];
    if (!value) {
      if (field.missing) errors[field.name] = field.missing;
    } else if (value.length > field.maxLength) {
      errors[field.name] = `Keep this to ${field.maxLength.toLocaleString("en-CA")} characters or fewer.`;
    } else if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = "Enter a valid email address, like name@company.com.";
    }
  }
  return errors;
}
