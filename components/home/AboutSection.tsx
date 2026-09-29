import RevealOnScroll from "@/components/layout/RevealOnScroll";

export default function AboutSection() {
  return (
    <section className="bg-white pb-[clamp(4rem,8vw,7rem)] pt-[30rem] sm:pt-[28rem] md:pt-[23rem] lg:pt-[21rem]">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <RevealOnScroll>
          <p className="label-mono">About us</p>
          <h2 className="headline-lg mt-4 text-brand-navy">
            Built on clear fares, not fine print
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            We combine route distance, vehicle rates, and batta rules into one estimate you can
            review before you pay. Round trips use inclusive calendar days; one-way trips bill a
            single pickup-to-drop distance — never doubled.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3">
            {[
              { value: "4", label: "Booking steps" },
              { value: "24/7", label: "Support" },
              { value: "4", label: "Vehicle classes" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-medium tracking-tight text-brand-navy md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
