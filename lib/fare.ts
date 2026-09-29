import type { Vehicle } from "@/data/vehicles";
import { tariffConfig } from "@/data/tariff";

export type TripType = "oneway" | "round";

export interface FareEstimateInput {
  distanceKm: number;
  vehicle: Vehicle;
  tripType: TripType;
  numberOfDays?: number;
}

export interface FareEstimate {
  billableKm: number;
  ratePerKm: number;
  driverBatta: number;
  baseFare: number;
  totalFare: number;
  tripType: TripType;
}

export function getDriverBattaDrop(distanceKm: number, vehicle: Vehicle): number {
  const usesLongDistanceBatta =
    vehicle.id === "sedan" || vehicle.id === "suv";

  if (usesLongDistanceBatta && distanceKm > tariffConfig.drop.driverBattaAboveKm) {
    return tariffConfig.drop.driverBattaLong;
  }

  return vehicle.driverBatta;
}

export function getDriverBattaRound(days: number, dailyDistanceKm: number): number {
  const perDay =
    dailyDistanceKm > tariffConfig.round.driverBattaHighDistanceKm
      ? tariffConfig.round.driverBattaHighPerDay
      : tariffConfig.round.driverBattaPerDay;
  return days * perDay;
}

export function calculateFare({
  distanceKm,
  vehicle,
  tripType,
  numberOfDays = 1,
}: FareEstimateInput): FareEstimate {
  const days = Math.max(1, numberOfDays);

  if (tripType === "oneway") {
    const billableKm = Math.max(distanceKm, tariffConfig.drop.minimumKm);
    const ratePerKm = vehicle.dropRatePerKm;
    const driverBatta = getDriverBattaDrop(distanceKm, vehicle);
    const baseFare = billableKm * ratePerKm;

    return {
      billableKm,
      ratePerKm,
      driverBatta,
      baseFare,
      totalFare: baseFare + driverBatta,
      tripType,
    };
  }

  const billableKm = Math.max(
    distanceKm,
    tariffConfig.round.minimumKmPerDay * days
  );
  const ratePerKm = vehicle.roundRatePerKm;
  const driverBatta = getDriverBattaRound(days, distanceKm);
  const baseFare = billableKm * ratePerKm;

  return {
    billableKm,
    ratePerKm,
    driverBatta,
    baseFare,
    totalFare: baseFare + driverBatta,
    tripType,
  };
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getVehicleRatePerKm(vehicle: Vehicle, tripType: TripType): number {
  return tripType === "round" ? vehicle.roundRatePerKm : vehicle.dropRatePerKm;
}

export function formatVehicleRatePerKm(vehicle: Vehicle, tripType: TripType): string {
  return `₹${getVehicleRatePerKm(vehicle, tripType)}/km`;
}

export function getHillStationCharge(vehicle: Vehicle): number {
  return vehicle.id === "sedan"
    ? tariffConfig.extras.hillStationSedan
    : tariffConfig.extras.hillStationMuv;
}
