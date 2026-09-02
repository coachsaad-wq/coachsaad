import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/services/pricing";
import { cancelBookingAction } from "@/lib/actions/admin/bookings";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmée",
  PENDING_PAYMENT: "En attente",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

export default async function AdminReservationsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startAt: "desc" },
    include: { user: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Réservations</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Cours</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Adresse</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {b.user.firstName} {b.user.lastName}
                </td>
                <td className="px-4 py-3">{b.courseType}</td>
                <td className="px-4 py-3">
                  {b.startAt.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="max-w-[16rem] truncate px-4 py-3">{b.address}</td>
                <td className="px-4 py-3">{formatPriceCents(b.priceCents)}</td>
                <td className="px-4 py-3">{STATUS_LABELS[b.status]}</td>
                <td className="px-4 py-3 text-right">
                  {b.status === "CONFIRMED" && (
                    <form action={cancelBookingAction}>
                      <input type="hidden" name="bookingId" value={b.id} />
                      <button className="text-xs font-semibold text-red-600 hover:underline">
                        Annuler
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft/50">
                  Aucune réservation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
