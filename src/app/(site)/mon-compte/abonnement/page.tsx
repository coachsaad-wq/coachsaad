import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/services/pricing";
import { getPricingConfig } from "@/lib/services/pricing";
import { cancelSubscriptionAction } from "@/lib/actions/nutrition";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  TEST_MODE: "Actif (MODE TEST)",
  CANCELLED: "Annulé",
  PAST_DUE: "Paiement en retard",
};

export default async function AbonnementPage() {
  const user = await requireUser();
  const [subscription, pricing] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: user.id, type: "NUTRITION_IA" },
      orderBy: { createdAt: "desc" },
    }),
    getPricingConfig(),
  ]);

  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Mon abonnement</h2>

      {subscription ? (
        <div className="mt-4 max-w-sm rounded-xl border border-line p-5">
          <p className="text-xs text-ink-soft/50">Nutrition IA</p>
          <p className="mt-1 text-xl font-extrabold text-ink">
            {formatPriceCents(pricing.nutritionMonthly, pricing.currency)}
            <span className="text-sm font-medium text-ink-soft/60"> / mois</span>
          </p>
          <p className="mt-3 text-sm text-ink-soft/70">
            Statut :{" "}
            <span className="font-semibold text-ink">{STATUS_LABELS[subscription.status]}</span>
          </p>
          <p className="text-sm text-ink-soft/70">
            Renouvellement :{" "}
            <span className="font-semibold text-ink">
              {subscription.currentPeriodEnd.toLocaleDateString("fr-FR")}
            </span>
          </p>

          {subscription.status !== "CANCELLED" && (
            <form action={cancelSubscriptionAction} className="mt-4">
              <button className="text-sm font-semibold text-red-600 hover:underline">
                Résilier mon abonnement
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Aucun abonnement actif.
          <Link href="/nutrition/abonnement" className="ml-1 font-semibold text-brand-red underline">
            Découvrir Nutrition IA
          </Link>
        </div>
      )}
    </div>
  );
}
