import Image from "next/image";
import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="brand-logo" aria-label="Elagon home">
      <Image
        src={inverse ? "/brand/elagon-logo-white.svg" : "/brand/elagon-logo-black.svg"}
        alt="Elagon"
        width={246}
        height={50}
        priority
      />
    </Link>
  );
}
