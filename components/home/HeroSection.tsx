import BookingForm from "@/components/BookingForm";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { siteConfig } from "@/data/site";

export default function HeroSection() {
  return (
    <section id="booking" className="border-b border-slate-200 bg-white py-10 md:py-14 lg:py-16">
      <div className="container-page">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_min(100%,440px)] lg:gap-14 xl:gap-16">
          <RevealOnScroll>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-dark">
              Instant fare estimate
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-brand-navy">
              Book your one-way trip
              <span className="block text-brand-accent">Pay for oneway</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              Four steps — trip details, vehicle, fare, and payment. Same minimum km and driver
              batta rules with transparent pricing from {siteConfig.name}.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-slate-200 pt-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Min one-way
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-brand-navy">130 km</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Round min / day
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-brand-navy">250 km</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-slate-600">
              Need help?{" "}
              <a href={siteConfig.social.phone} className="font-semibold text-brand-navy underline">
                +91 {siteConfig.phone}
              </a>
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={100} className="w-full justify-self-end lg:max-w-[440px]">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cyan-dark">
                Book in 4 steps
              </p>
              <span className="rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-accent">
                Live estimate
              </span>
            </div>
            <BookingForm standalone className="shadow-[0_24px_56px_-28px_rgba(10,22,40,0.15)]" />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
