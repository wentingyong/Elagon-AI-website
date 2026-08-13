import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = { title: "Contact", description: "Start a conversation with Elagon about a critical workflow." };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <section className="contact-page">
        <div className="contact-intro"><p className="eyebrow">Contact</p><h1>Bring us the<br /><em>workflow that matters.</em></h1><p>Tell us what should work differently, what measurable outcome matters, and what is standing in the way.</p><dl><div><dt>Best fit</dt><dd>Enterprises and PE-backed companies with an accountable owner and a material operational outcome.</dd></div><div><dt>Response</dt><dd>A senior member of the team replies within two business days.</dd></div><div><dt>Direct</dt><dd><Link href="mailto:jordan@elagon.ai">jordan@elagon.ai</Link></dd></div></dl></div>
        <ContactForm />
      </section>
    </>
  );
}
