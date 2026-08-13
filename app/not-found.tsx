import { PrimaryCTA } from "@/components/PrimaryCTA";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() { return <><SiteHeader /><section className="not-found"><p className="eyebrow">404</p><h1>This path has not<br /><em>been built.</em></h1><PrimaryCTA href="/">Return home</PrimaryCTA></section></>; }
