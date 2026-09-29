import Link from "next/link";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import FeaturedServiceCards from "@/components/home/FeaturedServiceCards";
import ServicePillarsGrid from "@/components/home/ServicePillarsGrid";
import { serviceOfferings } from "@/data/services";

const featured = serviceOfferings.filter((s) => s.featured);

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#fafbfc] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(4rem,8vw,7rem)]">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealOnScroll className="max-w-2xl">
            <p className="label-mono">Services</p>
            <h2 className="headline-lg mt-4 text-brand-navy">
              One way, round trip &amp; more
            </h2>
            <p className="mt-4 text-muted">
              Intercity drops, airport runs, and outstation plans — same fare logic as our booking
              form. Full tariff rules live on the services page.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={60}>
            <Link href="/services" className="btn-accent">
              View all services
            </Link>
          </RevealOnScroll>
        </div>
      </div>

      <ServicePillarsGrid className="mt-10 md:mt-12" />

      <div className="container-page mt-12">
        <FeaturedServiceCards services={featured} />

        <RevealOnScroll delay={120}>
          <p className="mt-10 text-center text-sm text-muted">
            Corporate travel, pilgrimage circuits, and custom routes —{" "}
            <Link href="/services" className="font-semibold text-brand-navy underline-offset-2 hover:underline">
              see every service
            </Link>
            {" · "}
            <Link
              href="/services#pricing"
              className="font-semibold text-brand-navy underline-offset-2 hover:underline"
            >
              fare rules &amp; batta
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
