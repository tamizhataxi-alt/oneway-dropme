"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const atTop = !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-out",
        atTop
          ? "border-b border-slate-200 bg-white shadow-sm"
          : "border-b border-brand-cyan-dark/15 bg-brand-cyan/95 shadow-lg shadow-brand-cyan/20 backdrop-blur-md"
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 md:h-[4.75rem]">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.jpg"
            alt={siteConfig.name}
            width={132}
            height={52}
            className="max-h-10 w-auto object-contain md:max-h-11"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active ? "text-brand-navy" : "text-brand-navy/85 hover:text-brand-navy"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={siteConfig.social.phone} className="text-sm font-semibold text-brand-navy">
            +91 {siteConfig.phone.slice(0, 5)} {siteConfig.phone.slice(5)}
          </a>
          <Link href="/#booking" className="btn-accent px-5 py-2.5 text-sm">
            Book now
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/15 bg-white lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn("h-0.5 w-5 bg-brand-navy transition-transform", open && "translate-y-2 rotate-45")}
            />
            <span className={cn("h-0.5 w-5 bg-brand-navy transition-opacity", open && "opacity-0")} />
            <span
              className={cn("h-0.5 w-5 bg-brand-navy transition-transform", open && "-translate-y-2 -rotate-45")}
            />
          </div>
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t transition-all duration-500 lg:hidden",
          atTop ? "border-slate-200 bg-white" : "border-brand-navy/10 bg-brand-cyan",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container-page flex flex-col gap-4 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-brand-navy"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#booking" className="btn-accent w-full" onClick={() => setOpen(false)}>
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
