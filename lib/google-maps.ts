import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let initPromise: Promise<void> | null = null;

export function isGoogleMapsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

export async function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only load in the browser");
  }

  if (window.google?.maps?.places) {
    return window.google;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  if (!initPromise) {
    initPromise = (async () => {
      setOptions({
        key: apiKey,
        v: "weekly",
        libraries: ["places"],
      });
      await importLibrary("places");
    })();
  }

  await initPromise;

  if (!window.google?.maps?.places) {
    throw new Error("Google Places failed to load");
  }

  return window.google;
}

export function formatPlaceLabel(place: google.maps.places.PlaceResult): string {
  if (place.formatted_address) return place.formatted_address;
  if (place.name) return place.name;
  return "";
}
