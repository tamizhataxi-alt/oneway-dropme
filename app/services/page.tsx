import ServicesPageContent from "@/components/services/ServicesPageContent";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Services",
  description: `One-way drop, round trip, airport transfer, outstation, corporate and pilgrimage travel with ${siteConfig.name}.`,
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
