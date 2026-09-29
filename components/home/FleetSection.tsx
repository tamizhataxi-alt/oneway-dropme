import Link from "next/link";
import FleetVehicleCard from "@/components/home/FleetVehicleCard";
import RevealOnScroll from "@/components/layout/RevealOnScroll";
import { vehicles } from "@/data/vehicles";

export default function FleetSection() {
  return (
    <section id="fleet" className="relative overflow-hidden bg-[#fafbfc] py-[clamp(4rem,8vw,7rem)]">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-cyan/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealOnScroll className="max-w-2xl">
            <p className="label-mono">Fleet</p>
            <h2 className="headline-lg mt-4 text-brand-navy">We move you one way</h2>
            <p className="mt-4 text-muted">
              Same vehicles and per-km rates as our standard tariff — sedan to Innova Crysta.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={60}>
            <Link href="/#booking" className="btn-accent">
              Book a vehicle
            </Link>
          </RevealOnScroll>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <RevealOnScroll key={vehicle.id} delay={index * 70}>
              <FleetVehicleCard vehicle={vehicle} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={200}>
          <p className="mt-10 text-center text-sm text-muted">
            Driver batta and hill-station rules apply on top of km rates —{" "}
            <Link
              href="/services#pricing"
              className="font-semibold text-brand-navy underline-offset-2 hover:underline"
            >
              see full fare rules
            </Link>
            {" · "}
            <Link href="/fleet" className="font-semibold text-brand-navy underline-offset-2 hover:underline">
              Fleet page
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
