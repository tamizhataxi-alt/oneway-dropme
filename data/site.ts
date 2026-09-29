export const siteConfig = {
  name: "ONEWAY DROPME",
  tagline: "Pay For Oneway",
  description:
    "Book reliable one-way and round-trip drop taxi services with transparent fares, comfortable vehicles, and professional drivers across Tamil Nadu.",
  email: "dropme@gmail.com",
  phone: "8939390101",
  whatsapp: "8939390101",
  location: "Tamil Nadu, India",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://onewaydropme.com",
  businessHours: "24/7 Booking Support",
  social: {
    whatsapp: "https://wa.me/918939390101",
    phone: "tel:+918939390101",
    email: "mailto:dropme@gmail.com",
  },
} as const;

export const navLinks = [
  { href: "/fleet", label: "Fleet" },
  { href: "/routes", label: "Routes" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
