import { isGoogleMapsConfigured, loadGoogleMaps } from "@/lib/google-maps";

export async function getDrivingDistanceKm(
  origin: string,
  destination: string
): Promise<number | null> {
  if (!isGoogleMapsConfigured()) return null;

  const pickup = origin.trim();
  const drop = destination.trim();
  if (!pickup || !drop) return null;

  const google = await loadGoogleMaps();

  return new Promise((resolve) => {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [pickup],
        destinations: [drop],
        travelMode: google.maps.TravelMode.DRIVING,
        region: "in",
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== "OK" || !response?.rows[0]?.elements[0]) {
          resolve(null);
          return;
        }

        const element = response.rows[0].elements[0];
        if (element.status !== "OK" || !element.distance?.value) {
          resolve(null);
          return;
        }

        resolve(Math.ceil(element.distance.value / 1000));
      }
    );
  });
}
