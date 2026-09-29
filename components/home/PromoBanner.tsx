"use client";

import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { siteConfig } from "@/data/site";

export default function PromoBanner() {
  return (
    <section
      id="hero-banner"
      className="relative w-full bg-[#0a1628] pt-[4.5rem] leading-none md:pt-[4.75rem]"
      aria-label="Promotional banner"
    >
      <Image
        src="/promo-banner.jpg"
        alt={`${siteConfig.name} — Explore Tamil Nadu with comfort and convenience`}
        width={1024}
        height={434}
        unoptimized
        priority
        className="block h-auto w-full max-w-none"
        sizes="100vw"
      />

      <div className="absolute inset-x-0 top-[57%] z-10 flex justify-center px-4 sm:top-[63%] md:top-[65%] md:px-6">
        <div className="w-full max-w-[440px] md:max-w-[520px] lg:max-w-[560px]">
          <BookingForm
            standalone
            className="shadow-[0_24px_56px_-28px_rgba(10,22,40,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}
