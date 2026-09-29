import RevealOnScroll from "@/components/layout/RevealOnScroll";

const steps = [
  {
    n: "01",
    title: "Trip details",
    body: "Pickup, drop, date, time, and mobile — round trip adds return date with inclusive day count.",
  },
  {
    n: "02",
    title: "Choose vehicle",
    body: "Sedan, SUV, Innova, or Crysta with the correct drop or round per-km rate.",
  },
  {
    n: "03",
    title: "Fare estimate",
    body: "Billable km, batta, and total — adjust distance if needed; tolls quoted separately.",
  },
  {
    n: "04",
    title: "Confirm & pay",
    body: "UPI/card (full fare), pay at drop, or ₹500 advance with balance at drop.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-pad bg-white">
      <div className="container-page">
        <RevealOnScroll>
          <p className="label-mono">How we do it</p>
          <h2 className="headline-lg mt-4 max-w-3xl text-brand-navy">
            Four steps, same logic every time
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.n} delay={i * 70}>
              <div className="rounded-2xl border border-border p-6 md:p-8">
                <p className="text-sm font-medium text-brand-cyan-dark">{step.n}</p>
                <h3 className="mt-3 text-xl font-medium text-brand-navy">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
