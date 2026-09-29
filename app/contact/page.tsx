import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-white pt-28 md:pt-32">
      <div className="container-page section-pad max-w-2xl">
        <p className="label-mono">Contact</p>
        <h1 className="headline-lg mt-4 text-brand-navy">Talk to our team</h1>
        <p className="mt-4 text-muted">
          Questions about fares, vehicles, or an existing booking? Reach us anytime.
        </p>
        <ul className="mt-10 space-y-4 text-brand-navy">
          <li>
            Phone:{" "}
            <a href={siteConfig.social.phone} className="font-semibold underline">
              +91 {siteConfig.phone}
            </a>
          </li>
          <li>
            Email:{" "}
            <a href={siteConfig.social.email} className="font-semibold underline">
              {siteConfig.email}
            </a>
          </li>
          <li>WhatsApp:{" "}
            <a href={siteConfig.social.whatsapp} className="font-semibold underline">
              Chat on WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
