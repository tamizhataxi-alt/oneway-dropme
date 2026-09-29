export const tariffConfig = {
  drop: {
    minimumKm: 130,
    driverBatta: 400,
    driverBattaLong: 600,
    driverBattaAboveKm: 400,
    waitingPerHour: 150,
  },
  round: {
    minimumKmPerDay: 250,
    minimumKmPerDayKarnataka: 300,
    driverBattaPerDay: 500,
    driverBattaHighPerDay: 600,
    driverBattaHighDistanceKm: 500,
  },
  extras: {
    hillStationSedan: 300,
    hillStationMuv: 500,
    nightCharge: 200,
    nightStartHour: 23,
    nightEndHour: 5,
    petWashingSedan: 400,
    petWashingMuv: 500,
    extraLuggage: 300,
    extraPerson: 300,
  },
} as const;

export const tariffTerms = [
  "Rates given above are inclusive of GST.",
  "Drop Trips — Driver Batta Rs. 400. [Rs. 600 for above 400 kms] — Waiting Charges Rs. 150 per hour.",
  "Drop Trips — Minimum running must be 130 Kms.",
  "Round Trips — Driver batta is Rs. 500/- per day.",
  "Round Trips — Driver batta is Rs. 600/- per day if the distance travelled is more than 500kms in a single day.",
  "Round Trips — Minimum running must be 250 Kms per day. For Karnataka it is minimum 300 Kms per day.",
  "Round Trips — 1 day means 1 calendar day (from 00:00 hrs to 23:59 hrs)",
  "Hill station charges — Rs. 300 for sedan Rs.500 for MUV.",
  "Night Charges — Rs. 200 — Applicable if trip starts between 11 pm - 5 am only for Drop trip",
  "Washing Charges — for carrying Pet Rs. 400 for Sedan & Rs. 500 for MUV.",
  "Luggage charges — Rs. 300 for carrying extra Luggage. Check Luggage Policy for more details.",
  "Only 2 (Pickup & drop) points are allowed. More than that charges will be applicable.",
  "A charge of Rs.300 applies for extra person",
] as const;

export const tariffTrustBadges = [
  { icon: "support_agent", label: "24/7 Taxi Support" },
  { icon: "my_location", label: "Live Tracking" },
  { icon: "verified_user", label: "Elite Drivers" },
  { icon: "shield", label: "Secure Rides" },
] as const;
