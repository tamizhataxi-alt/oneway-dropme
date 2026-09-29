import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-brand-cyan text-brand-navy">
      <div className="container-page section-pad grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/logo.jpg" alt={siteConfig.name} width={140} height={56} className="h-12 w-auto object-contain" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-navy/75">
            {siteConfig.tagline} — transparent one-way and round-trip taxi booking with instant fare estimates.
          </p>
        </div>

        <div>
          <p className="label-mono text-brand-navy/60">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/fleet" className="hover:underline">Fleet</Link></li>
            <li><Link href="/routes" className="hover:underline">Routes</Link></li>
            <li><Link href="/services" className="hover:underline">Services</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:underline">Terms</Link></li>
          </ul>
        </div>

        <div>
          <p className="label-mono text-brand-navy/60">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={siteConfig.social.phone} className="font-semibold hover:underline">
                +91 {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.social.email} className="hover:underline">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.location}</li>
            <li>{siteConfig.businessHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-navy/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-navy/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Pay For Oneway — reliable drop taxi service.</p>
        </div>
      </div>
    </footer>
  );
}
