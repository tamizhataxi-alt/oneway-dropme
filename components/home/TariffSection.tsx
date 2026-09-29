import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { tariffTerms, tariffTrustBadges } from "@/data/tariff";

export default function TariffSection() {
  return (
    <section id="tariff" className="section-pad bg-[#fafbfc]">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <RevealOnScroll>
          <p className="label-mono">Tariff</p>
          <h2 className="headline-lg mt-4 text-brand-navy">Rules you can verify</h2>
          <p className="mt-4 text-muted">
            Estimates follow published minimum km and driver batta — no hidden multipliers on distance.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {tariffTrustBadges.map((badge) => (
              <li
                key={badge.label}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-brand-navy"
              >
                {badge.label}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <ul className="space-y-3 text-sm leading-relaxed text-muted">
            {tariffTerms.map((term) => (
              <li key={term} className="flex gap-3 border-b border-border pb-3 last:border-0">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
