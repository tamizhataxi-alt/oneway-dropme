import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import type { ServiceOffering } from "@/data/services";

type FeaturedServiceCardsProps = {
  services: ServiceOffering[];
};

export default function FeaturedServiceCards({ services }: FeaturedServiceCardsProps) {
  return (
    <div className="grid gap-7 md:grid-cols-3">
      {services.map((service, index) => (
        <RevealOnScroll key={service.id} delay={index * 70}>
          <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_8px_30px_-18px_rgba(10,22,40,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_64px_-32px_rgba(10,22,40,0.22)]">
            <div className="relative aspect-[5/3] overflow-hidden rounded-[1.35rem] bg-slate-100">
              {service.cardImage ? (
                <Image
                  src={service.cardImage}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/25 to-brand-accent/15" />
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/55 via-[#0a1628]/10 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-brand-navy shadow-lg backdrop-blur-sm md:h-12 md:w-12">
                <span className="material-symbols-outlined text-2xl">{service.icon}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-5 pt-5 md:px-5 md:pb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-cyan-dark">
                {service.tagline}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-brand-navy md:text-[1.35rem]">
                {service.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
                {service.description}
              </p>
              <Link
                href="/#booking"
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-cyan-dark"
              >
                Book now
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  );
}
