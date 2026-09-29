"use client";

import Image from "next/image";
import { useState } from "react";
import { customerReviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

function ReviewCell({
  index,
  name,
  subtitle,
  quote,
  avatar,
}: (typeof customerReviews)[0] & { index: number }) {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="relative flex min-h-[7.5rem] flex-col justify-center px-6 py-8 md:min-h-[8.5rem] md:px-10 md:py-10">
      <span className="absolute right-6 top-6 text-sm font-medium text-white/90 md:right-10 md:top-8">
        {num}
      </span>

      <div className="flex items-center gap-4 md:gap-5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/20 md:h-[4.25rem] md:w-[4.25rem]">
          <Image
            src={avatar}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="68px"
          />
        </div>

        <div className="min-w-0 flex-1 pr-10 md:pr-12">
          <p className="text-base font-semibold text-white md:text-lg">{name}</p>
          <p className="mt-0.5 text-sm text-white/75 md:text-[0.9375rem]">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/10 md:h-10 md:w-10"
          aria-expanded={open}
          aria-label={open ? "Hide review" : "Read full review"}
        >
          <span
            className={cn(
              "text-xl leading-none transition-transform duration-300",
              open && "rotate-45"
            )}
          >
            +
          </span>
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-500 ease-out",
          open ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-xl pl-[4.5rem] text-sm leading-relaxed text-white/85 md:pl-[5.25rem] md:text-[0.9375rem]">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const rows = [
    customerReviews.slice(0, 2),
    customerReviews.slice(2, 4),
    customerReviews.slice(4, 6),
  ];

  return (
    <section id="reviews" className="bg-[#59b38a] py-16 md:py-20 lg:py-24">
      <div className="container-page">
        <h2 className="max-w-3xl text-[clamp(2.75rem,7vw,4.75rem)] font-normal lowercase leading-[1.05] tracking-tight text-white">
          what riders say.
        </h2>

        <div className="mt-12 border-y border-white/30 md:mt-16">
          {rows.map((pair, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                "grid md:grid-cols-2",
                rowIndex < rows.length - 1 && "border-b border-white/30"
              )}
            >
              {pair.map((review, colIndex) => {
                const globalIndex = rowIndex * 2 + colIndex;
                return (
                  <div
                    key={review.id}
                    className={cn(
                      colIndex === 0 && "border-b border-white/30 md:border-b-0 md:border-r",
                      colIndex === 1 && rowIndex < rows.length - 1 && "md:border-b-0"
                    )}
                  >
                    <ReviewCell index={globalIndex} {...review} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
