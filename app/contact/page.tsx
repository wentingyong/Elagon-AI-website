import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";
import { CONTACT_EMAIL } from "@/lib/contact";
import { buildMetadata, seoCopy } from "@/lib/seo";

export const metadata = buildMetadata(seoCopy.contact);

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <section className="contact-page">
        <div className="contact-intro"><p className="eyebrow">Contact</p><h1>Let’s talk<br /><em>AI.</em></h1><p>Tell us a little about your business and what you’re looking to accomplish. Our team will review your request and get in touch to discuss where AI can create value.</p><dl><div><dt>First response</dt><dd>A senior member of the team replies within two business days.</dd></div><div><dt>Direct</dt><dd><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></dd></div></dl></div>
        <ContactForm />
      </section>
    </>
  );
}
