export interface Vehicle {
  id: string;
  name: string;
  model: string;
  description: string;
  dropRatePerKm: number;
  roundRatePerKm: number;
  driverBatta: number;
  ratePerKm: string;
  passengers: number;
  luggage: string;
  image: string;
  popular?: boolean;
  tags: string[];
}

export const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    model: "Dzire / Etios",
    description: "Comfortable sedan for city and highway travel",
    dropRatePerKm: 15,
    roundRatePerKm: 14,
    driverBatta: 400,
    ratePerKm: "₹15/km",
    passengers: 4,
    luggage: "2 bags",
    image: "/images/vehicles/sedan.png",
    popular: true,
    tags: ["AC", "Clean", "Verified"],
  },
  {
    id: "suv",
    name: "SUV",
    model: "Ertiga / Fortuner",
    description: "Spacious SUV for families and extra luggage",
    dropRatePerKm: 20,
    roundRatePerKm: 19,
    driverBatta: 400,
    ratePerKm: "₹20/km",
    passengers: 6,
    luggage: "4 bags",
    image: "/images/vehicles/suv.png",
    tags: ["AC", "Clean", "Verified"],
  },
  {
    id: "innova",
    name: "Innova",
    model: "Toyota Innova",
    description: "Popular MPV for outstation and group travel",
    dropRatePerKm: 20,
    roundRatePerKm: 19,
    driverBatta: 500,
    ratePerKm: "₹20/km",
    passengers: 7,
    luggage: "4 bags",
    image: "/images/vehicles/innova.png",
    popular: true,
    tags: ["AC", "Clean", "Verified"],
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    model: "Toyota Innova Crysta",
    description: "Premium MPV with enhanced comfort",
    dropRatePerKm: 22,
    roundRatePerKm: 21,
    driverBatta: 500,
    ratePerKm: "₹22/km",
    passengers: 7,
    luggage: "6 bags",
    image: "/images/vehicles/innova-crysta.png",
    tags: ["AC", "Clean", "Verified"],
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}
