import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, HONEYPOT_FIELD, normalizeContact, validateContact } from "@/lib/contact";
import { buildContactEmail } from "@/lib/contact-email";
import { allowRequest } from "@/lib/rate-limit";

const DEFAULT_FROM = "Elagon Website <website@elagon.ai>";

/* Responses carry a code, never copy: ContactForm owns the wording (and the mailto fallback),
   which also lets it cope when a platform error page comes back instead of this JSON. */
const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

function sourcePage(request: NextRequest) {
  const referer = request.headers.get("referer");
  if (referer && URL.canParse(referer)) {
    const url = new URL(referer);
    return url.origin + url.pathname;
  }
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const payload: unknown = await request.json().catch(() => null);

  // Checked first so bots get a silent success and never learn which fields are validated.
  const trap = payload !== null && typeof payload === "object" ? (payload as Record<string, unknown>)[HONEYPOT_FIELD] : undefined;
  if (typeof trap === "string" && trap.trim()) {
    console.warn("contact: honeypot filled, submission dropped");
    return reply(200, { ok: true });
  }

  const values = normalizeContact(payload);
  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length) return reply(400, { ok: false, code: "invalid", fieldErrors });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("contact: RESEND_API_KEY is not set, inquiry not delivered");
    return reply(503, { ok: false, code: "unavailable" });
  }

  // Counted only for real send attempts, so correcting a validation error never locks anyone out.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowRequest(`contact:${ip}`)) {
    console.warn("contact: rate limit reached");
    return reply(429, { ok: false, code: "rate_limited" });
  }

  const { subject, html, text } = buildContactEmail(values, { submittedAt: new Date(), source: sourcePage(request) });
  try {
    const { data, error } = await new Resend(key).emails.send({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
      to: [CONTACT_EMAIL],
      replyTo: values.email,
      subject,
      html,
      text,
    });
    if (data?.id) {
      console.info("contact: inquiry sent", { id: data.id });
      return reply(200, { ok: true });
    }
    // No submitted details in the log: name, status and message are enough to diagnose delivery.
    console.error("contact: Resend rejected the inquiry", { name: error?.name, statusCode: error?.statusCode, message: error?.message });
  } catch (error) {
    console.error("contact: Resend request failed", error);
  }
  return reply(502, { ok: false, code: "send_failed" });
}
