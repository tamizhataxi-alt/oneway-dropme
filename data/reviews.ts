export interface CustomerReview {
  id: string;
  name: string;
  subtitle: string;
  quote: string;
  avatar: string;
}

export const customerReviews: CustomerReview[] = [
  {
    id: "1",
    name: "Arun Kumar",
    subtitle: "Chennai → Coimbatore · One-way drop",
    quote:
      "Fare matched the website estimate — 510 km billed clearly with batta shown upfront. Driver was on time at 5 am and the sedan was clean for the full highway run.",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    id: "2",
    name: "Meena Rajesh",
    subtitle: "Madurai → Chennai · Innova Crysta",
    quote:
      "Booked for family with luggage. Crysta was comfortable, AC worked all the way, and paying balance at drop was exactly as promised after ₹500 advance online.",
    avatar: "https://i.pravatar.cc/160?img=45",
  },
  {
    id: "3",
    name: "Vikram S.",
    subtitle: "Round trip · Trichy wedding",
    quote:
      "Three-day round trip with inclusive day count explained on the call. Same vehicle throughout; per-day minimum km was clear before we paid.",
    avatar: "https://i.pravatar.cc/160?img=33",
  },
  {
    id: "4",
    name: "Priya Natarajan",
    subtitle: "Airport pickup · Chennai",
    quote:
      "Flight landed late but the driver waited. Pickup from terminal to Pondicherry — tolls discussed separately, no surprise on the base fare.",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "5",
    name: "Karthick M.",
    subtitle: "Salem → Bangalore · SUV",
    quote:
      "Interstate drop at night. Night charge was mentioned when we booked after 11 pm. WhatsApp support helped adjust pickup landmark in minutes.",
    avatar: "https://i.pravatar.cc/160?img=15",
  },
  {
    id: "6",
    name: "Divya Lakshmi",
    subtitle: "Chennai → Tirupati · Pilgrimage",
    quote:
      "Temple trip with parents — driver knew the route and halt points. One-way pricing saved us compared to local round-trip quotes we got elsewhere.",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
];
