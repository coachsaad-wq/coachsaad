import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  TEST_MODE: "Actif (MODE TEST)",
  CANCELLED: "Annulé",
  PAST_DUE: "Paiement en retard",
};

export default async function AdminAbonnementsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Abonnements</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Renouvellement</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {s.user.firstName} {s.user.lastName}
                </td>
                <td className="px-4 py-3">Nutrition IA</td>
                <td className="px-4 py-3">{STATUS_LABELS[s.status]}</td>
                <td className="px-4 py-3">{s.currentPeriodEnd.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft/50">
                  Aucun abonnement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
