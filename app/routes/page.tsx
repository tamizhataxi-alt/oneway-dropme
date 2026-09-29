import Link from "next/link";
import RoutesListing from "@/components/routes/RoutesListing";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Routes",
  description:
    "Popular one-way taxi routes across Tamil Nadu — Chennai, Coimbatore, Madurai, Trichy, Salem, and more.",
};

export default function RoutesPage() {
  return (
    <div className="bg-white pt-28 md:pt-32">
      <div className="container-page section-pad">
        <p className="label-mono">Routes</p>
        <h1 className="headline-lg mt-4 max-w-3xl text-brand-navy">
          Popular one-way trips across Tamil Nadu
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Ten of our most booked intercity routes with approximate distance and sedan starting fares.
          Need another city pair? Call us — we cover all of {siteConfig.location}.
        </p>

        <RoutesListing />

        <div className="mt-16 flex flex-wrap gap-3">
          <Link href="/#booking" className="btn-accent">
            Book any route
          </Link>
          <Link href="/services#pricing" className="btn-ghost">
            View services &amp; fares
          </Link>
        </div>
      </div>
    </div>
  );
}
