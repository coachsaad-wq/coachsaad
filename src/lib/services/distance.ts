import { prisma } from "@/lib/prisma";
import { geocodeAddress, haversineDistanceKm } from "@/lib/providers/maps";

export async function getTravelZoneConfig() {
  const config = await prisma.travelZoneConfig.findUnique({
    where: { id: "singleton" },
  });
  if (config) return config;

  return prisma.travelZoneConfig.create({ data: { id: "singleton" } });
}

export type DistanceCheckResult = {
  distanceKm: number;
  radiusKm: number;
  isWithinZone: boolean;
  address: { lat: number; lng: number; label: string };
};

/**
 * Calcule la distance entre l'adresse de départ (configurable en admin)
 * et l'adresse du client, et vérifie la règle des 50 km.
 * Contrôle 100% côté serveur : impossible à contourner depuis le
 * navigateur, quel que soit ce que le front-end envoie.
 */
export async function checkDistanceForAddress(
  clientAddress: string
): Promise<DistanceCheckResult> {
  const zone = await getTravelZoneConfig();
  const geocoded = await geocodeAddress(clientAddress);

  const distanceKm = haversineDistanceKm(
    { lat: zone.originLat, lng: zone.originLng },
    { lat: geocoded.lat, lng: geocoded.lng }
  );

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    radiusKm: zone.radiusKm,
    isWithinZone: distanceKm <= zone.radiusKm,
    address: geocoded,
  };
}
