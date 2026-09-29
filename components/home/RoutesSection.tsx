import Link from "next/link";
import RouteCard from "@/components/home/RouteCard";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { routes } from "@/data/routes";

const featured = routes
  .filter((r) => r.popular)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
  .slice(0, 3);

export default function RoutesSection() {
  return (
    <section id="routes" className="bg-white py-[clamp(4rem,8vw,6.5rem)]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <RevealOnScroll>
            <p className="label-mono">Popular routes</p>
            <h2 className="headline-lg mt-4 text-brand-navy">One-way drops across Tamil Nadu</h2>
            <p className="mt-4 text-muted">
              Sedan starting fares on our most booked corridors — tap More to book or see the full
              list on the routes page.
            </p>
          </RevealOnScroll>
        </div>

        <div className="mt-14 grid gap-16 md:grid-cols-3 md:gap-10 lg:mt-16 lg:gap-12">
          {featured.map((route, i) => (
            <RevealOnScroll key={route.slug} delay={i * 80}>
              <RouteCard route={route} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={120} className="mt-14 flex justify-center lg:mt-16">
          <Link href="/routes" className="btn-accent">
            View all routes
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
