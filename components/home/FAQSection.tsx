"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { homeFaqs, type FaqItem } from "@/data/faqs";
import { cn } from "@/lib/utils";

type FAQSectionProps = {
  faqs?: FaqItem[];
};

export default function FAQSection({ faqs = homeFaqs }: FAQSectionProps) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section-pad bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <RevealOnScroll>
          <p className="label-mono">FAQ</p>
          <h2 className="headline-lg mt-4 text-brand-navy">Before we get started</h2>
        </RevealOnScroll>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <RevealOnScroll key={faq.question} delay={index * 50}>
                <div className="rounded-2xl border border-border">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 p-5 text-left"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium text-brand-navy md:text-base">
                      {String(index + 1).padStart(2, "0")} — {faq.question}
                    </span>
                    <span
                      className={cn(
                        "text-xl leading-none text-brand-cyan-dark transition-transform duration-300",
                        isOpen && "rotate-45"
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
