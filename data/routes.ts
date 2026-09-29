export interface Route {
  slug: string;
  from: string;
  to: string;
  title: string;
  shortDescription: string;
  distanceKm: number;
  distance: string;
  approximateDuration?: string;
  startingPrice: string;
  image: string;
  popular?: boolean;
  featuredOrder?: number;
  content: string;
}

export const routeFilters = [
  "All Routes",
  "Chennai",
  "Salem",
  "Coimbatore",
  "Madurai",
  "Trichy",
] as const;

export type RouteFilter = (typeof routeFilters)[number];

const SEDAN_RATE = 15;

function priceForKm(km: number): string {
  return `₹${(km * SEDAN_RATE).toLocaleString("en-IN")}`;
}

function routeImage(slug: string): string {
  return `/images/routes/${slug}.jpg`;
}

export const routes: Route[] = [
  {
    slug: "chennai-to-coimbatore",
    from: "Chennai",
    to: "Coimbatore",
    title: "Chennai to Coimbatore Taxi",
    shortDescription:
      "Reliable one-way taxi from Chennai to Coimbatore with multiple vehicle options.",
    distanceKm: 510,
    distance: "510 KM",
    approximateDuration: "Approx. 8–9 hours",
    startingPrice: priceForKm(510),
    image: routeImage("chennai-to-coimbatore"),
    popular: true,
    featuredOrder: 1,
    content:
      "Book your Chennai to Coimbatore taxi with Drop Taxi1 for a comfortable intercity journey. Choose from sedan, SUV, or Innova based on your travel needs. We offer transparent per-km pricing with no hidden charges.",
  },
  {
    slug: "chennai-to-salem",
    from: "Chennai",
    to: "Salem",
    title: "Chennai to Salem Taxi",
    shortDescription: "Comfortable one-way taxi service from Chennai to Salem.",
    distanceKm: 345,
    distance: "345 KM",
    approximateDuration: "Approx. 5–6 hours",
    startingPrice: priceForKm(345),
    image: routeImage("chennai-to-salem"),
    popular: true,
    featuredOrder: 2,
    content:
      "Travel from Chennai to Salem with Drop Taxi1's one-way taxi service. We offer flexible pickup times and multiple vehicle categories to suit your budget and comfort preferences.",
  },
  {
    slug: "chennai-to-trichy",
    from: "Chennai",
    to: "Trichy",
    title: "Chennai to Trichy Taxi",
    shortDescription:
      "One-way drop taxi from Chennai to Trichy (Tiruchirappalli) at affordable rates.",
    distanceKm: 335,
    distance: "335 KM",
    approximateDuration: "Approx. 5–6 hours",
    startingPrice: priceForKm(335),
    image: routeImage("chennai-to-trichy"),
    popular: true,
    featuredOrder: 3,
    content:
      "Drop Taxi1 provides reliable Chennai to Trichy taxi service for pilgrims, students, and business travellers. Enjoy a comfortable ride with professional drivers and well-maintained vehicles.",
  },
  {
    slug: "chennai-to-madurai",
    from: "Chennai",
    to: "Madurai",
    title: "Chennai to Madurai Taxi",
    shortDescription:
      "Book a one-way taxi from Chennai to Madurai with transparent fares and professional drivers.",
    distanceKm: 460,
    distance: "460 KM",
    approximateDuration: "Approx. 7–8 hours",
    startingPrice: priceForKm(460),
    image: routeImage("chennai-to-madurai"),
    popular: true,
    featuredOrder: 4,
    content:
      "Travel comfortably from Chennai to Madurai with Drop Taxi1. Our one-way taxi service covers the full route with experienced drivers familiar with NH routes. Ideal for temple visits, business travel, and family trips to Madurai.",
  },
  {
    slug: "chennai-to-pondicherry",
    from: "Chennai",
    to: "Pondicherry",
    title: "Chennai to Pondicherry Taxi",
    shortDescription:
      "Scenic one-way taxi from Chennai to Pondicherry for weekend getaways.",
    distanceKm: 155,
    distance: "155 KM",
    approximateDuration: "Approx. 3–4 hours",
    startingPrice: priceForKm(155),
    image: routeImage("chennai-to-pondicherry"),
    popular: true,
    featuredOrder: 5,
    content:
      "Planning a trip to Pondicherry from Chennai? Book a one-way taxi with Drop Taxi1 for a relaxed coastal drive. Perfect for weekend trips, beach holidays, and short getaways.",
  },
  {
    slug: "chennai-to-bangalore",
    from: "Chennai",
    to: "Bangalore",
    title: "Chennai to Bangalore Taxi",
    shortDescription:
      "Interstate one-way taxi from Chennai to Bangalore.",
    distanceKm: 350,
    distance: "350 KM",
    approximateDuration: "Approx. 6–7 hours",
    startingPrice: priceForKm(350),
    image: routeImage("chennai-to-bangalore"),
    popular: true,
    featuredOrder: 6,
    content:
      "Drop Taxi1 offers Chennai to Bangalore one-way taxi service for interstate travellers. Comfortable vehicles and experienced drivers for a smooth highway journey.",
  },
  {
    slug: "chennai-to-tiruvannamalai",
    from: "Chennai",
    to: "Tiruvannamalai",
    title: "Chennai to Tiruvannamalai Taxi",
    shortDescription:
      "One-way taxi from Chennai to Tiruvannamalai for temple visits.",
    distanceKm: 195,
    distance: "195 KM",
    approximateDuration: "Approx. 4–5 hours",
    startingPrice: priceForKm(195),
    image: routeImage("chennai-to-tiruvannamalai"),
    featuredOrder: 7,
    content:
      "Book a Chennai to Tiruvannamalai taxi with Drop Taxi1 for a comfortable spiritual journey. Professional drivers and transparent fares for your one-way trip.",
  },
  {
    slug: "chennai-to-tirupati",
    from: "Chennai",
    to: "Tirupati",
    title: "Chennai to Tirupati Taxi",
    shortDescription:
      "One-way taxi from Chennai to Tirupati for pilgrimage travel.",
    distanceKm: 150,
    distance: "150 KM",
    approximateDuration: "Approx. 3–4 hours",
    startingPrice: priceForKm(150),
    image: routeImage("chennai-to-tirupati"),
    featuredOrder: 8,
    content:
      "Travel from Chennai to Tirupati with Drop Taxi1's reliable one-way taxi service. Ideal for temple visits with comfortable vehicles and experienced drivers.",
  },
  {
    slug: "chennai-to-vellore",
    from: "Chennai",
    to: "Vellore",
    title: "Chennai to Vellore Taxi",
    shortDescription:
      "Affordable one-way taxi from Chennai to Vellore.",
    distanceKm: 140,
    distance: "140 KM",
    approximateDuration: "Approx. 3 hours",
    startingPrice: priceForKm(140),
    image: routeImage("chennai-to-vellore"),
    featuredOrder: 9,
    content:
      "Book your Chennai to Vellore taxi with Drop Taxi1. Quick intercity travel with transparent per-km pricing and professional drivers.",
  },
  {
    slug: "salem-to-chennai",
    from: "Salem",
    to: "Chennai",
    title: "Salem to Chennai Taxi",
    shortDescription:
      "One-way taxi from Salem to Chennai with Drop Taxi1.",
    distanceKm: 345,
    distance: "345 KM",
    approximateDuration: "Approx. 5–6 hours",
    startingPrice: priceForKm(345),
    image: routeImage("salem-to-chennai"),
    featuredOrder: 10,
    content:
      "Return from Salem to Chennai with our reliable one-way drop taxi. Professional drivers, comfortable vehicles, and transparent fares.",
  },
  {
    slug: "coimbatore-to-chennai",
    from: "Coimbatore",
    to: "Chennai",
    title: "Coimbatore to Chennai Taxi",
    shortDescription: "Book a one-way taxi from Coimbatore to Chennai.",
    distanceKm: 510,
    distance: "510 KM",
    approximateDuration: "Approx. 8–9 hours",
    startingPrice: priceForKm(510),
    image: routeImage("coimbatore-to-chennai"),
    featuredOrder: 11,
    content:
      "Travel from Coimbatore to Chennai with Drop Taxi1. Choose your preferred vehicle and enjoy a comfortable intercity ride with experienced drivers.",
  },
  {
    slug: "madurai-to-chennai",
    from: "Madurai",
    to: "Chennai",
    title: "Madurai to Chennai Taxi",
    shortDescription: "One-way taxi from Madurai to Chennai with Drop Taxi1.",
    distanceKm: 460,
    distance: "460 KM",
    approximateDuration: "Approx. 7–8 hours",
    startingPrice: priceForKm(460),
    image: routeImage("madurai-to-chennai"),
    featuredOrder: 12,
    content:
      "Return from Madurai to Chennai with our reliable one-way drop taxi. Professional drivers, comfortable vehicles, and transparent fares make your journey stress-free.",
  },
  {
    slug: "trichy-to-chennai",
    from: "Trichy",
    to: "Chennai",
    title: "Trichy to Chennai Taxi",
    shortDescription: "Affordable one-way taxi from Trichy to Chennai.",
    distanceKm: 335,
    distance: "335 KM",
    approximateDuration: "Approx. 5–6 hours",
    startingPrice: priceForKm(335),
    image: routeImage("trichy-to-chennai"),
    featuredOrder: 13,
    content:
      "Book your Trichy to Chennai taxi with Drop Taxi1 for a comfortable one-way journey. Transparent pricing and professional service guaranteed.",
  },
  {
    slug: "chennai-to-tirunelveli",
    from: "Chennai",
    to: "Tirunelveli",
    title: "Chennai to Tirunelveli Taxi",
    shortDescription: "Long-distance one-way taxi from Chennai to Tirunelveli.",
    distanceKm: 620,
    distance: "620 KM",
    approximateDuration: "Approx. 9–10 hours",
    startingPrice: priceForKm(620),
    image: "/images/hero-banner.jpg",
    popular: true,
    content:
      "Book a Chennai to Tirunelveli taxi for long-distance travel across Tamil Nadu. Our experienced drivers ensure a safe and comfortable journey with transparent pricing.",
  },
  {
    slug: "bangalore-to-chennai",
    from: "Bangalore",
    to: "Chennai",
    title: "Bangalore to Chennai Taxi",
    shortDescription: "Interstate one-way taxi from Bangalore to Chennai.",
    distanceKm: 350,
    distance: "350 KM",
    approximateDuration: "Approx. 6–7 hours",
    startingPrice: priceForKm(350),
    image: "/images/hero-banner.jpg",
    content:
      "Drop Taxi1 offers Bangalore to Chennai one-way taxi service for interstate travellers. Comfortable vehicles and experienced drivers for a smooth highway journey.",
  },
];

export function getRouteBySlug(slug: string): Route | undefined {
  return routes.find((r) => r.slug === slug);
}

export function getPopularRoutes(): Route[] {
  return routes.filter((r) => r.popular);
}

export function getFeaturedRoutes(): Route[] {
  return [...routes]
    .filter((r) => r.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

/** Top 10 routes for the Routes page (featuredOrder 1–10). */
export function getTenRoutes(): Route[] {
  return getFeaturedRoutes().slice(0, 10);
}

export function filterRoutesByCity(filter: RouteFilter): Route[] {
  if (filter === "All Routes") {
    return [...routes].sort((a, b) => {
      const orderA = a.featuredOrder ?? 999;
      const orderB = b.featuredOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.from.localeCompare(b.from);
    });
  }

  return routes.filter((r) => r.from === filter || r.to === filter);
}

export function getRelatedRoutes(currentSlug: string, limit = 4): Route[] {
  const current = getRouteBySlug(currentSlug);
  if (!current) return routes.slice(0, limit);
  return routes
    .filter(
      (r) =>
        r.slug !== currentSlug &&
        (r.from === current.from ||
          r.to === current.to ||
          r.from === current.to ||
          r.to === current.from)
    )
    .slice(0, limit);
}
