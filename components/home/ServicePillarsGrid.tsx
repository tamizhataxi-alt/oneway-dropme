import { servicePillars } from "@/data/services";
import { cn } from "@/lib/utils";

type ServicePillarsGridProps = {
  className?: string;
};

export default function ServicePillarsGrid({ className }: ServicePillarsGridProps) {
  return (
    <div
      className={cn(
        "border-y border-[#e5e0d8] bg-[#faf8f5]",
        className
      )}
    >
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {servicePillars.map((pillar, index) => (
            <div
              key={pillar.label}
              className={cn(
                "relative min-w-0 px-6 py-10 md:px-8 md:py-12 lg:px-10",
                index % 2 === 0 && index < servicePillars.length - 1 && "sm:border-r sm:border-[#e5e0d8]",
                index < 2 && "sm:border-b sm:border-[#e5e0d8] lg:border-b-0",
                index < servicePillars.length - 1 && "lg:border-r lg:border-[#e5e0d8]"
              )}
            >
              <div
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#ebe6df] md:right-6 md:top-6 md:h-12 md:w-12"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[1.35rem] text-[#4a4a4a] md:text-2xl">
                  {pillar.icon}
                </span>
              </div>

              <p className="sr-only">{pillar.label}</p>
              <div className="mt-6 pr-14 md:mt-8 md:pr-16">
                {pillar.accentInline ? (
                  <p className="text-[clamp(2rem,3.2vw,2.875rem)] font-bold leading-none tracking-tight">
                    <span className="text-brand-navy">{pillar.headline}</span>
                    <span className="text-brand-cyan">{pillar.accent}</span>
                  </p>
                ) : (
                  <p className="flex flex-col gap-0.5 text-[clamp(1.625rem,2.6vw,2.5rem)] font-bold leading-[1.08] tracking-tight">
                    <span className="text-brand-navy">{pillar.headline}</span>
                    <span className="text-brand-cyan">{pillar.accent}</span>
                  </p>
                )}
              </div>
              <p className="mt-4 pr-2 text-sm leading-relaxed text-[#6b7280] md:mt-5 md:pr-4 md:text-[0.9375rem]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
