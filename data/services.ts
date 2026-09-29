export interface ServiceOffering {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  featured?: boolean;
  /** Hero image for featured cards on home / services */
  cardImage?: string;
}

export const serviceOfferings: ServiceOffering[] = [
  {
    id: "oneway",
    icon: "route",
    title: "One-way drop",
    tagline: "Pay for oneway",
    description:
      "Single pickup to drop — distance billed once, never doubled. Ideal for relocations, one-direction intercity travel, and point-to-point drops across Tamil Nadu.",
    highlights: ["130 km minimum running", "Transparent per-km rates", "Sedan to Innova Crysta"],
    featured: true,
    cardImage: "/images/services/oneway-drop.jpg",
  },
  {
    id: "round",
    icon: "sync_alt",
    title: "Round trip",
    tagline: "Multi-day comfort",
    description:
      "Keep the same vehicle for out-and-back journeys. Calendar-day billing with daily minimum km and driver batta — perfect for weddings, family trips, and business circuits.",
    highlights: ["250 km min per day", "Inclusive calendar days", "Flexible return dates"],
    featured: true,
    cardImage: "/images/services/round-trip.jpg",
  },
  {
    id: "airport",
    icon: "flight",
    title: "Airport transfer",
    tagline: "On-time pickups",
    description:
      "Chennai and regional airport runs with flight-aware scheduling. Meet-and-greet style pickups, luggage-friendly vehicles, and fixed-route clarity before you land.",
    highlights: ["Chennai & major airports", "Night & early-morning slots", "Flight delay buffer"],
    featured: true,
    cardImage: "/images/services/airport-transfer.jpg",
  },
  {
    id: "outstation",
    icon: "landscape",
    title: "Outstation travel",
    tagline: "Highway-ready fleet",
    description:
      "Long-distance Tamil Nadu routes — temples, coastlines, hill stations, and industrial hubs. Experienced highway drivers and vehicles maintained for intercity comfort.",
    highlights: ["Popular routes pre-priced", "Hill station add-ons", "24/7 dispatch"],
  },
  {
    id: "corporate",
    icon: "business_center",
    title: "Corporate travel",
    tagline: "Professional service",
    description:
      "Executive pickups, client visits, and team movements with GST-friendly invoicing and consistent vehicle standards for your company travel policy.",
    highlights: ["Priority support", "Multiple vehicle classes", "Repeat route booking"],
  },
  {
    id: "pilgrimage",
    icon: "temple_hindu",
    title: "Pilgrimage & tours",
    tagline: "Spiritual circuits",
    description:
      "Tirupati, Rameswaram, Madurai, Tiruvannamalai, and custom temple circuits — plan multi-stop days with a driver who knows the routes and timings.",
    highlights: ["Multi-stop day plans", "Family-sized vehicles", "Flexible halt times"],
  },
];

export const servicePillars = [
  {
    icon: "verified_user",
    label: "Verified drivers",
    headline: "Verified",
    accent: "drivers",
    accentInline: false,
    description:
      "Background-checked intercity drivers who know Tamil Nadu highways and keep vehicles trip-ready.",
  },
  {
    icon: "payments",
    label: "Clear fares",
    headline: "Clear",
    accent: "fares",
    accentInline: false,
    description:
      "Per-km rates, batta, and minimum km match the live booking estimate — no hidden distance multipliers.",
  },
  {
    icon: "support_agent",
    label: "24/7 support",
    headline: "24",
    accent: "/7",
    accentInline: true,
    description:
      "Call or WhatsApp us anytime for booking help, route questions, and active trip assistance.",
  },
  {
    icon: "directions_car",
    label: "Premium fleet",
    headline: "Premium",
    accent: "fleet",
    accentInline: false,
    description:
      "Sedan, SUV, Innova, and Innova Crysta — choose the class that fits your group and luggage.",
  },
] as const;
