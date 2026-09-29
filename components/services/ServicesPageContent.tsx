import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import ServicePillarsGrid from "@/components/home/ServicePillarsGrid";
import { serviceOfferings } from "@/data/services";
import { tariffTrustBadges } from "@/data/tariff";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/** Unsplash (photo-1613638377394) — illuminated taxi roof sign; saved under /public/images (not promo assets). */
const SERVICES_HERO_IMAGE = "/images/services-hero.jpg";

export default function ServicesPageContent() {
  return (
    <>
      <section className="relative min-h-[28rem] overflow-hidden bg-brand-navy pt-28 text-white md:min-h-[32rem] md:pt-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={SERVICES_HERO_IMAGE}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[center_35%] md:object-center"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(105deg, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.72) 42%, rgba(10,22,40,0.5) 100%), radial-gradient(ellipse 70% 55% at 15% 10%, rgba(0,194,255,0.22), transparent 55%), radial-gradient(ellipse 45% 40% at 95% 85%, rgba(255,149,0,0.15), transparent 50%)",
          }}
        />
        <div className="container-page relative z-10 pb-16 pt-10 md:pb-24 md:pt-14">
          <RevealOnScroll>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-cyan">
              Our services
            </p>
            <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight">
              Travel your way —{" "}
              <span className="bg-gradient-to-r from-brand-cyan to-brand-accent-soft bg-clip-text text-transparent">
                one way, round trip & beyond
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {siteConfig.name} combines intercity drops, airport runs, and tailored outstation plans
              with the same fare logic you see in our booking form — no surprises at the end of the
              road.
            </p>
          </RevealOnScroll>

        </div>
      </section>

      <ServicePillarsGrid />

      <section className="bg-[#f4f7fb] py-16 md:py-24">
        <div className="container-page">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <p className="label-mono">What we offer</p>
            <h2 className="headline-lg mt-4 text-brand-navy">Premium mobility, built for Tamil Nadu</h2>
            <p className="mt-4 text-muted">
              Choose a service type below — every option uses live fare estimates, professional
              drivers, and vehicles matched to your group size.
            </p>
          </RevealOnScroll>

          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceOfferings.map((service, index) => (
              <RevealOnScroll key={service.id} delay={index * 60}>
                <li
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white bg-white p-7 shadow-[0_4px_24px_-8px_rgba(10,22,40,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_56px_-24px_rgba(10,22,40,0.18)]",
                    service.featured && "ring-1 ring-brand-cyan/25"
                  )}
                >
                  {service.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
                      Popular
                    </span>
                  )}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-accent/15 text-brand-navy transition-transform duration-500 group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-cyan-dark">
                    {service.tagline}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-navy">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-border pt-5">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-navy/85">
                        <span className="material-symbols-outlined mt-0.5 text-base text-brand-cyan">
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/#booking"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan-dark transition-colors hover:text-brand-navy"
                  >
                    Get estimate
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>
                </li>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-white py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <RevealOnScroll>
            <p className="label-mono">Fare principles</p>
            <h2 className="headline-lg mt-4 text-brand-navy">Rules you can verify before you pay</h2>
            <p className="mt-4 text-muted">
              Same minimum km and driver batta as our live booking engine — GST-inclusive base rates,
              extras quoted when they apply.
            </p>
            <Link
              href="/terms-and-conditions"
              className="btn-ghost mt-8 inline-flex border-brand-navy/15"
            >
              Full terms & tariff
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {tariffTrustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="rounded-2xl border border-border bg-[#fafbfc] px-5 py-4 text-sm font-medium text-brand-navy"
                >
                  {badge.label}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-brand-navy py-16 text-white md:py-20">
        <div className="container-page flex flex-col items-center text-center">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold md:text-3xl">Ready to plan your trip?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Pick one-way or round trip in the booking form — airport and custom routes are a call
              away at +91 {siteConfig.phone}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/#booking" className="btn-accent px-8">
                Book now
              </Link>
              <Link
                href="/routes"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Browse routes
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
