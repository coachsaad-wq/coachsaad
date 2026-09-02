import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true } },
      subscriptions: { where: { status: { in: ["ACTIVE", "TEST_MODE"] } } },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Clients</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Réservations</th>
              <th className="px-4 py-3">Nutrition IA</th>
              <th className="px-4 py-3">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {c.firstName} {c.lastName}
                  {c.isTestAccount && (
                    <span className="ml-2 rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-soft/50">
                      Test
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c._count.bookings}</td>
                <td className="px-4 py-3">
                  {c.subscriptions.length > 0 ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Actif
                    </span>
                  ) : (
                    <span className="text-ink-soft/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3">{c.createdAt.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft/50">
                  Aucun client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
