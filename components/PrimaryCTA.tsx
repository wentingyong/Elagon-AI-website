import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";

export function PrimaryCTA({ href, children, inverse = false, ghost = false }: { href: string; children: React.ReactNode; inverse?: boolean; ghost?: boolean }) {
  return <Link className={`primary-cta ${inverse ? "is-inverse" : ""} ${ghost ? "is-ghost" : ""}`} href={href}>{children}<span><ArrowIcon /></span></Link>;
}
