import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function HistoriquePage() {
  const user = await requireUser();

  const [pastPrograms, payments] = await Promise.all([
    prisma.nutritionProgram.findMany({
      where: { profile: { userId: user.id }, isCurrent: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Historique des paiements
        </h2>
        {payments.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex justify-between rounded-md border border-line px-3 py-2.5 text-sm"
              >
                <span className="text-ink-soft/70">
                  {p.createdAt.toLocaleDateString("fr-FR")} —{" "}
                  {p.purpose === "BOOKING" ? "Réservation" : "Abonnement Nutrition IA"}
                </span>
                <span className="font-semibold text-ink">
                  {(p.amountCents / 100).toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink-soft/60">Aucun paiement pour le moment.</p>
        )}
      </div>

      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Anciens programmes Nutrition IA
        </h2>
        {pastPrograms.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {pastPrograms.map((p) => (
              <li key={p.id} className="rounded-md border border-line px-3 py-2.5 text-sm">
                <span className="text-ink-soft/60">
                  {p.createdAt.toLocaleDateString("fr-FR")} —{" "}
                </span>
                <span className="font-semibold text-ink">{p.calorieEstimate} kcal/jour</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink-soft/60">Aucun ancien programme.</p>
        )}
      </div>
    </div>
  );
}
