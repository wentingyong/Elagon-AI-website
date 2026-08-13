import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { allowRequest } from "@/lib/rate-limit";

const inquiry = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().trim().min(2).max(150),
  role: z.string().trim().min(2).max(150),
  workflow: z.string().trim().min(20).max(3000),
  outcome: z.string().trim().min(10).max(2000),
  timeline: z.string().trim().min(1).max(100),
  budget: z.string().trim().min(1).max(100),
  consent: z.literal("accepted"),
  website: z.string().max(0).optional().default(""),
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character] || character);
}

export async function POST(request: NextRequest) {
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowRequest(identifier)) return NextResponse.json({ message: "Too many attempts. Please try again later." }, { status: 429 });
  const parsed = inquiry.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please complete every required field with valid information." }, { status: 400 });
  const data = parsed.data;
  if (data.website) return NextResponse.json({ message: "Thank you. We’ll reply within two business days." });
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") return NextResponse.json({ message: "Inquiry validated. Configure RESEND_API_KEY to deliver email." });
    return NextResponse.json({ message: "Email delivery is not configured. Please contact jordan@elagon.ai." }, { status: 503 });
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Elagon Website <website@elagon.ai>",
    to: [process.env.CONTACT_TO_EMAIL || "jordan@elagon.ai"],
    replyTo: data.email,
    subject: `Website inquiry — ${data.company}`,
    html: `<h1>New Elagon inquiry</h1><p><strong>Name:</strong> ${escapeHtml(data.name)}</p><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p><strong>Company:</strong> ${escapeHtml(data.company)}</p><p><strong>Role:</strong> ${escapeHtml(data.role)}</p><p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p><p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p><h2>Workflow or problem</h2><p>${escapeHtml(data.workflow).replace(/\n/g, "<br>")}</p><h2>Desired outcome</h2><p>${escapeHtml(data.outcome).replace(/\n/g, "<br>")}</p>`,
  });
  if (error) return NextResponse.json({ message: "The inquiry could not be delivered. Please email jordan@elagon.ai." }, { status: 502 });
  return NextResponse.json({ message: "Thank you. We’ll reply within two business days." });
}
