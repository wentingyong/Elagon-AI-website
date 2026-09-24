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

/** Digits separated by spaces, ( ) . / or any dash, an optional leading +, then an optional
 *  extension (x, ext, extension or #). Letters anywhere else fail; isPhone counts the digits. */
const PHONE_PATTERN = /^(\+?[\d\s().\/\u2010-\u2015\u2212-]*\d)(?:[\s,]*(?:x|ext\.?|extension|#)\s*\d{1,6})?$/i;

export const CONTACT_TOPICS: readonly string[] = [
  "Automating a business process",
  "Building an AI solution",
  "Improving an existing process or system",
  "AI strategy & opportunity discovery",
  "Integrating AI into our existing software",
  "Website development",
  "Not sure yet",
  "Other",
];

export type ContactFieldName = "name" | "email" | "company" | "phone" | "topic" | "challenge";
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
  /** Renders a dropdown, and the value must be one of these. */
  options?: readonly string[];
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
}

export const CONTACT_FIELDS: readonly ContactField[] = [
  { name: "name", label: "Your name", emailLabel: "Name", maxLength: 120, missing: "Enter your name.", autoComplete: "name" },
  { name: "email", label: "Work email", emailLabel: "Work email", maxLength: 254, missing: "Enter your work email.", type: "email", autoComplete: "email" },
  { name: "company", label: "Company name", emailLabel: "Company", maxLength: 160, missing: "Enter your company name.", autoComplete: "organization" },
  { name: "phone", label: "Phone number", emailLabel: "Phone", maxLength: 40, type: "tel", autoComplete: "tel" },
  { name: "topic", label: "What are you looking for help with?", emailLabel: "Looking for help with", maxLength: 80, missing: "Choose what you’re looking for help with.", options: CONTACT_TOPICS },
  { name: "challenge", label: "Tell us about the challenge or opportunity.", emailLabel: "Challenge or opportunity", maxLength: 5000, missing: "Add a sentence or two about the challenge or opportunity.", multiline: true, rows: 6, placeholder: "What are you trying to improve, automate, or build?" },
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

function isPhone(value: string) {
  const match = PHONE_PATTERN.exec(value);
  const digits = match ? match[1].replace(/\D/g, "").length : 0;
  return digits >= 7 && digits <= 15;
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const value = values[field.name];
    if (!value) {
      if (field.missing) errors[field.name] = field.missing;
    } else if (value.length > field.maxLength) {
      errors[field.name] = `Keep this to ${field.maxLength.toLocaleString("en-CA")} characters or fewer.`;
    } else if (field.options && !field.options.includes(value)) {
      errors[field.name] = field.missing ?? "Choose one of the options.";
    } else if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = "Enter a valid email address, like name@company.com.";
    } else if (field.type === "tel" && !isPhone(value)) {
      errors[field.name] = "Enter a valid phone number, or leave this blank.";
    }
  }
  return errors;
}
