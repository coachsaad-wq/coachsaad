import { env } from "@/lib/env";

export type GeocodeResult = { lat: number; lng: number; label: string };

/**
 * Géocode une adresse en coordonnées.
 * MODE TEST (pas de MAPS_API_KEY) : renvoie des coordonnées déterministes
 * dérivées de l'adresse pour permettre de tester tout le flux de
 * réservation (calcul de distance, règle des 50 km) sans clé réelle.
 * MODE PRODUCTION : brancher ici un vrai fournisseur (Google Maps
 * Geocoding API, ORS, Mapbox...) en utilisant `env.maps.apiKey`.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (env.maps.isMock) {
    return mockGeocode(address);
  }

  throw new Error(
    "MAPS_API_KEY est défini mais aucun fournisseur de cartographie réel n'est encore branché. " +
      "Implémentez l'appel API réel dans src/lib/providers/maps.ts avant la mise en production."
  );
}

/** Distance à vol d'oiseau (formule de Haversine), en kilomètres. */
export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; // rayon de la Terre en km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * Géocodage simulé : produit des coordonnées stables (mêmes coordonnées
 * pour la même adresse) réparties autour du centre de Lille, uniquement
 * pour permettre de tester la logique de distance en MODE TEST.
 * Ne représente pas la véritable position de l'adresse saisie.
 */
function mockGeocode(address: string): GeocodeResult {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((hash % 1000) / 1000) * 0.9 - 0.45; // ~ +/-50km
  const lngOffset = (((hash >> 8) % 1000) / 1000) * 0.9 - 0.45;

  return {
    lat: 50.6292 + latOffset,
    lng: 3.0573 + lngOffset,
    label: address,
  };
}
