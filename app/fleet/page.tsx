import FleetSection from "@/components/home/FleetSection";

export const metadata = {
  title: "Fleet",
  description: "Sedan, SUV, and Innova options with transparent per-km one-way rates.",
};

export default function FleetPage() {
  return (
    <div className="bg-[#fafbfc] pt-28 md:pt-32">
      <FleetSection />
    </div>
  );
}
