import { prisma } from "@/lib/prisma";

const PURPOSE_LABELS: Record<string, string> = {
  BOOKING: "Réservation",
  NUTRITION_SUBSCRIPTION: "Abonnement Nutrition IA",
};

const STATUS_LABELS: Record<string, string> = {
  TEST_SIMULATED: "Simulé (MODE TEST)",
  SUCCEEDED: "Réussi",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

export default async function AdminPaiementsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Paiements</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Objet</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {p.user.firstName} {p.user.lastName}
                </td>
                <td className="px-4 py-3">{PURPOSE_LABELS[p.purpose]}</td>
                <td className="px-4 py-3">{(p.amountCents / 100).toFixed(2)} €</td>
                <td className="px-4 py-3">{STATUS_LABELS[p.status]}</td>
                <td className="px-4 py-3">{p.createdAt.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft/50">
                  Aucun paiement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
