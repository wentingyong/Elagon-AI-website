import Link from "next/link";
import { navigation, socialLinks } from "@/content/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><Logo inverse /></div>
      <p>Production AI for complex operations.<br />Toronto · Working globally</p>
      <dl className="footer-social">
        {socialLinks.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            {/* mailto stays a plain anchor; the three web profiles open away from the site */}
            <dd>{item.href.startsWith("mailto:")
              ? <a href={item.href}>{item.value}</a>
              : <a href={item.href} target="_blank" rel="noopener noreferrer">{item.value}</a>}</dd>
          </div>
        ))}
      </dl>
      <nav aria-label="Footer navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className="footer-bottom"><span>© Elagon 2026</span><Link href="/contact">Discuss a workflow</Link></div>
    </footer>
  );
}
