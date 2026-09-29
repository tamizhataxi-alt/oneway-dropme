import { routes } from "@/data/routes";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function citiesMatch(a: string, b: string): boolean {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return false;
  return left.includes(right) || right.includes(left);
}

export function estimateDistanceKm(pickup: string, drop: string): number | null {
  const pickupNorm = normalize(pickup);
  const dropNorm = normalize(drop);
  if (!pickupNorm || !dropNorm || pickupNorm === dropNorm) return null;

  const match = routes.find(
    (route) =>
      (citiesMatch(pickup, route.from) && citiesMatch(drop, route.to)) ||
      (citiesMatch(pickup, route.to) && citiesMatch(drop, route.from))
  );

  return match?.distanceKm ?? null;
}
