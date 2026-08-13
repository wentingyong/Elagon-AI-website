import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";

export function PrimaryCTA({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return <Link className={`primary-cta ${inverse ? "is-inverse" : ""}`} href={href}>{children}<span><ArrowIcon /></span></Link>;
}
