import Link from "next/link";
import { navigation } from "@/content/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><Logo inverse /></div>
      <p>AI systems for complex operations.<br />Toronto · Working globally</p>
      <nav aria-label="Footer navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className="footer-bottom"><span>© Elagon 2026</span><Link href="/contact">Start a conversation</Link></div>
    </footer>
  );
}
