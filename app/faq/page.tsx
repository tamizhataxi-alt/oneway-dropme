import FAQSection from "@/components/home/FAQSection";
import { faqPageFaqs } from "@/data/faqs";

export const metadata = {
  title: "FAQ",
  description: "Answers about booking, fares, payments, and one-way taxi service with ONEWAY DROPME.",
};

export default function FAQPage() {
  return (
    <div className="bg-white pt-28 md:pt-32">
      <FAQSection faqs={faqPageFaqs} />
    </div>
  );
}
