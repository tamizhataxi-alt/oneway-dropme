import { tariffTerms } from "@/data/tariff";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="bg-white pt-28 md:pt-32">
      <div className="container-page section-pad max-w-3xl">
        <p className="label-mono">Legal</p>
        <h1 className="headline-lg mt-4 text-brand-navy">Terms &amp; conditions</h1>
        <p className="mt-4 text-muted">
          By booking with {siteConfig.name}, you agree to the tariff and trip rules below.
        </p>
        <ul className="mt-10 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted">
          {tariffTerms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
