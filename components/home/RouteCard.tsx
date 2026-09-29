import Image from "next/image";
import Link from "next/link";
import type { Route } from "@/data/routes";
import { getRouteCardImagePath } from "@/lib/route-card-image";

type RouteCardProps = {
  route: Route;
};

export default function RouteCard({ route }: RouteCardProps) {
  const bookHref = `/book?pickup=${encodeURIComponent(route.from)}&drop=${encodeURIComponent(route.to)}`;

  return (
    <article className="group flex flex-col items-center text-center">
      <h3 className="max-w-[16rem] text-base font-bold uppercase leading-snug tracking-[0.12em] text-brand-navy sm:text-lg md:max-w-none md:text-xl">
        {route.from}
        <span className="mx-2 font-normal text-brand-cyan">→</span>
        {route.to}
      </h3>

      <div className="relative mx-auto mt-8 aspect-square w-[17.5rem] max-w-full shrink-0 sm:w-[19rem] md:mt-10 md:w-[15.5rem] lg:w-[17rem]">
        <div
          className="pointer-events-none absolute inset-0 rounded-full shadow-[0_22px_44px_-18px_rgba(10,22,40,0.28)] transition-transform duration-500 group-hover:scale-[1.02]"
          aria-hidden
        />
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[#f6f4ef] p-[3px] ring-1 ring-black/[0.04]">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-[#f6f4ef]">
            <Image
              src={getRouteCardImagePath(route.slug)}
              alt={`${route.to} — one-way taxi from ${route.from}`}
              fill
              unoptimized
              sizes="(max-width:768px) 280px, 272px"
              className="rounded-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex max-w-sm flex-col gap-3 px-2 md:mt-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan-dark">
          {route.distance}
          {route.approximateDuration ? (
            <span className="font-normal normal-case tracking-normal text-muted">
              {" "}
              · {route.approximateDuration}
            </span>
          ) : null}
        </p>
        <p className="text-sm leading-relaxed text-muted md:text-[0.9375rem]">
          {route.shortDescription}
        </p>
        <p className="text-sm font-semibold text-brand-navy">
          Sedan from <span className="text-base md:text-lg">{route.startingPrice}</span>
        </p>
      </div>

      <Link
        href={bookHref}
        className="mt-7 inline-flex min-w-[7.5rem] items-center justify-center rounded-sm bg-[#ffcc00] px-8 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-black shadow-[0_4px_14px_-4px_rgba(255,204,0,0.65)] transition-all duration-300 hover:bg-[#f5c400] hover:shadow-[0_8px_20px_-6px_rgba(255,204,0,0.75)] md:mt-8"
      >
        More
      </Link>
    </article>
  );
}
