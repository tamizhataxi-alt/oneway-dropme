import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { siteConfig } from "@/data/site";

export default function CTASection() {
  return (
    <section className="section-pad bg-white">
      <RevealOnScroll>
        <div className="container-page rounded-3xl bg-brand-cyan px-8 py-14 text-center md:px-16 md:py-20">
          <p className="label-mono text-brand-navy/70">Start a trip</p>
          <h2 className="headline-lg mt-4 text-brand-navy">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-navy/75">
            Book online or speak with our team — same fare rules, same vehicles, {siteConfig.tagline}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/#booking" className="btn-accent">
              Book now
            </a>
            <a href={siteConfig.social.whatsapp} className="btn-ghost border-brand-navy/20 bg-white/40">
              WhatsApp us
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
