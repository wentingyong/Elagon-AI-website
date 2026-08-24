import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";
import { buildMetadata, seoCopy } from "@/lib/seo";

export const metadata = buildMetadata(seoCopy.contact);

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <section className="contact-page">
        <div className="contact-intro"><p className="eyebrow">Contact</p><h1>Start with<br /><em>the workflow.</em></h1><p>Tell us what happens today, what should be different and how the business would measure the change.</p><dl><div><dt>Good starting point</dt><dd>One important workflow, one accountable owner and one result worth improving.</dd></div><div><dt>First response</dt><dd>A senior member of the team replies within two business days.</dd></div><div><dt>Direct</dt><dd><Link href="mailto:jordan@elagon.ai">jordan@elagon.ai</Link></dd></div></dl></div>
        <ContactForm />
      </section>
    </>
  );
}
