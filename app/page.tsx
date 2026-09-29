import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import FleetSection from "@/components/home/FleetSection";
import PromoBanner from "@/components/home/PromoBanner";
import RoutesSection from "@/components/home/RoutesSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import ServicesSection from "@/components/home/ServicesSection";

export default function HomePage() {
  return (
    <>
      <PromoBanner />
      <AboutSection />
      <FleetSection />
      <RoutesSection />
      <ServicesSection />
      <ReviewsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
