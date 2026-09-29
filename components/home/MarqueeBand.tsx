export default function MarqueeBand() {
  const items = [
    "ONEWAY DROPME",
    "Pay For Oneway",
    "130 km minimum drop",
    "250 km / day round",
    "UPI · Card · Pay at drop",
    "₹500 advance option",
  ];

  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border bg-white py-4">
      <div className="animate-marquee flex w-max gap-10 px-4">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="whitespace-nowrap text-sm font-medium text-brand-navy/70">
            {item}
            <span className="mx-10 text-brand-cyan">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
