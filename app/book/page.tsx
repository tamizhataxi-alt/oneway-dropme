import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book",
};

interface BookPageProps {
  searchParams: Promise<{ pickup?: string; drop?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { pickup = "", drop = "" } = await searchParams;

  return (
    <div className="bg-white pt-28 md:pt-32">
      <div className="container-page section-pad max-w-xl">
        <p className="label-mono">Booking</p>
        <h1 className="headline-lg mt-4 text-brand-navy">Complete your trip</h1>
        <div className="mt-8">
          <BookingForm standalone defaultPickup={pickup} defaultDrop={drop} />
        </div>
      </div>
    </div>
  );
}
