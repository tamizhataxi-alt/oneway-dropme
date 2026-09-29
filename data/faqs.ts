import { siteConfig } from "@/data/site";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Home page — short list */
export const homeFaqs: FaqItem[] = [
  {
    question: "How is the one-way fare calculated?",
    answer:
      "We use one-way driving distance between pickup and drop. Minimum billable distance is 130 km for drop trips. Fare = billable km × vehicle rate + driver batta.",
  },
  {
    question: "How do round-trip days work?",
    answer:
      "Days are counted inclusively from pickup date to return date (calendar days). Minimum 250 km per day applies; driver batta is per day.",
  },
  {
    question: "What payment options do you offer?",
    answer:
      "Pay full fare via UPI or card, pay at drop, or pay ₹500 advance online and settle the balance at drop.",
  },
  {
    question: "Are tolls included in the estimate?",
    answer:
      "Tolls, parking, hill station, and permit charges are calculated separately and are not included in the online estimate.",
  },
];

/** Full list for /faq */
export const faqPageFaqs: FaqItem[] = [
  ...homeFaqs,
  {
    question: "What is a one-way drop taxi?",
    answer:
      "You pay only for pickup to drop distance — the return leg is not doubled on your bill. That is the core of our Pay For Oneway model across Tamil Nadu.",
  },
  {
    question: "How do I book with ONEWAY DROPME?",
    answer:
      `Use the 4-step form on our homepage: trip details, vehicle, fare estimate, then confirm with your preferred payment. You can also call +91 ${siteConfig.phone} or WhatsApp us for help.`,
  },
  {
    question: "Can I change or cancel after booking?",
    answer:
      "Contact us as early as possible by phone or WhatsApp. Changes to date, time, or route depend on vehicle availability; cancellation terms are in our terms & conditions.",
  },
  {
    question: "How soon will I get a confirmation?",
    answer:
      "Online bookings receive a confirmation ID (ODM-…) immediately after successful submission or payment. Our team may call to verify trip details on busy routes.",
  },
  {
    question: "What are driver batta and waiting charges for drop trips?",
    answer:
      "Driver batta is ₹400 per drop trip (₹600 when trip distance is above 400 km). Waiting is ₹150 per hour where applicable.",
  },
  {
    question: "What are round-trip minimum km and batta per day?",
    answer:
      "Minimum 250 km per calendar day (300 km/day for Karnataka). Driver batta is ₹500 per day, or ₹600 per day if more than 500 km is travelled in a single day.",
  },
  {
    question: "Can I adjust distance in the fare estimate?",
    answer:
      "Yes, on step 3 you can edit billable km after we fetch or estimate route distance. Published minimum km still applies.",
  },
  {
    question: "Are hill station, night, and pet charges included?",
    answer:
      "Hill station charges (₹300 sedan / ₹500 MUV), night charge ₹200 for drop trips starting 11 pm–5 am, and pet washing charges are extra — not in the online base estimate.",
  },
  {
    question: "Extra stops, luggage, or passengers?",
    answer:
      "Only pickup and drop are included; more than two points may incur charges. Extra luggage ₹300; extra person ₹300 as per tariff.",
  },
  {
    question: "How does the ₹500 advance payment work?",
    answer:
      "You pay ₹500 online to confirm; that amount is deducted from your total estimated fare. The remaining balance is paid to the driver at drop.",
  },
  {
    question: "Is online payment secure?",
    answer:
      "Card and UPI payments run through Razorpay. We do not store your card details on our servers.",
  },
  {
    question: "Which vehicles can I choose?",
    answer:
      "Sedan, SUV, Toyota Innova, and Innova Crysta — each with drop and round per-km rates shown in the booking flow.",
  },
  {
    question: "Do you provide airport transfers?",
    answer:
      "Yes — Chennai and other major airports. Share flight time and terminal when booking for smoother pickup.",
  },
  {
    question: "Do you operate outside Tamil Nadu?",
    answer:
      "We focus on Tamil Nadu and common interstate routes (e.g. Bangalore). Contact us for other corridors.",
  },
  {
    question: "How can I reach support?",
    answer:
      `Call +91 ${siteConfig.phone}, email ${siteConfig.email}, or WhatsApp us. Booking support is available 24/7.`,
  },
  {
    question: "What if my online payment fails?",
    answer:
      "Try again or choose Pay at Drop. If money was debited but booking failed, contact us with your payment reference.",
  },
];
