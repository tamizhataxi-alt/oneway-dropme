import Image from "next/image";
import type { Vehicle } from "@/data/vehicles";
import { formatVehicleRatePerKm } from "@/lib/fare";

type FleetVehicleCardProps = {
  vehicle: Vehicle;
};

export default function FleetVehicleCard({ vehicle }: FleetVehicleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_8px_30px_-18px_rgba(10,22,40,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_64px_-32px_rgba(10,22,40,0.22)]">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-slate-50 via-white to-brand-cyan/[0.07]">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-cyan/10 blur-2xl"
          aria-hidden
        />
        {vehicle.popular && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-navy shadow-sm">
            Popular
          </span>
        )}
        <div className="relative flex h-full items-end justify-center px-4 pb-2 pt-8">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            width={320}
            height={200}
            className="h-auto max-h-[min(72%,11rem)] w-full max-w-[92%] object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width:768px) 100vw, 25vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-5 md:px-5 md:pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-cyan-dark">
          {vehicle.model}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-brand-navy md:text-[1.35rem]">
          {vehicle.name}
        </h3>

        <ul className="mt-4 flex flex-wrap gap-2">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-brand-navy">
            <span className="material-symbols-outlined text-base text-brand-cyan-dark">
              airline_seat_recline_normal
            </span>
            {vehicle.passengers}+1 seats
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-brand-navy">
            <span className="material-symbols-outlined text-base text-brand-cyan-dark">luggage</span>
            {vehicle.luggage}
          </li>
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#f4f7fb] p-2">
          <div className="rounded-xl bg-white px-3 py-2.5 text-center shadow-[0_1px_0_rgba(10,22,40,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">One-way drop</p>
            <p className="mt-1 text-base font-bold text-brand-navy">
              {formatVehicleRatePerKm(vehicle, "oneway")}
            </p>
          </div>
          <div className="rounded-xl bg-white px-3 py-2.5 text-center shadow-[0_1px_0_rgba(10,22,40,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Round trip</p>
            <p className="mt-1 text-base font-bold text-brand-navy">
              {formatVehicleRatePerKm(vehicle, "round")}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {vehicle.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-brand-cyan/15 bg-brand-cyan/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-cyan-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
