import { prisma } from "@/lib/prisma";
import type { SessionDuration } from "@/generated/prisma/client";

/**
 * Le prix est TOUJOURS calculé côté serveur à partir de la configuration
 * en base de données. Le client ne peut jamais imposer un prix : le
 * front-end n'envoie que la durée choisie, jamais un montant.
 */
export async function getPricingConfig() {
  const config = await prisma.pricingConfig.findUnique({
    where: { id: "singleton" },
  });
  if (config) return config;

  return prisma.pricingConfig.create({ data: { id: "singleton" } });
}

export async function priceForDuration(duration: SessionDuration): Promise<number> {
  const config = await getPricingConfig();
  switch (duration) {
    case "MIN60":
      return config.price1h;
    case "MIN90":
      return config.price1h30;
    case "MIN120":
      return config.price2h;
    default:
      throw new Error("Durée de séance inconnue.");
  }
}

export function durationToMinutes(duration: SessionDuration): number {
  switch (duration) {
    case "MIN60":
      return 60;
    case "MIN90":
      return 90;
    case "MIN120":
      return 120;
  }
}

export function formatPriceCents(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    cents / 100
  );
}
