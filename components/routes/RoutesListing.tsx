import Link from "next/link";
import { getTenRoutes } from "@/data/routes";

export default function RoutesListing() {
  const routeList = getTenRoutes();

  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {routeList.map((route, index) => (
        <li key={route.slug}>
          <article className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div>
              <p className="text-xs font-medium text-brand-cyan-dark">
                ({String(index + 1).padStart(2, "0")}) {route.distance}
                {route.approximateDuration ? ` · ${route.approximateDuration}` : ""}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-brand-navy md:text-xl">
                {route.from} → {route.to}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{route.shortDescription}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">From {route.startingPrice}</p>
              <Link
                href={`/book?pickup=${encodeURIComponent(route.from)}&drop=${encodeURIComponent(route.to)}`}
                className="text-sm font-semibold text-brand-cyan-dark underline-offset-2 hover:underline"
              >
                Book this route →
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
