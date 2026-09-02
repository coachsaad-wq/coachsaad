import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/services/pricing";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmée", className: "bg-green-100 text-green-700" },
  PENDING_PAYMENT: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  CANCELLED: { label: "Annulée", className: "bg-red-100 text-red-700" },
  COMPLETED: { label: "Terminée", className: "bg-neutral-100 text-neutral-600" },
};

export default async function ReservationsPage() {
  const user = await requireUser();
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { startAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
        Mes réservations
      </h2>

      {bookings.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {bookings.map((b) => {
            const status = STATUS_LABELS[b.status];
            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-4"
              >
                <div>
                  <p className="font-semibold text-ink">{b.courseType}</p>
                  <p className="text-sm text-ink-soft/60">
                    {b.startAt.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                    {" — "}
                    {b.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-ink">
                    {formatPriceCents(b.priceCents)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Aucune réservation pour le moment.
          <Link href="/rendez-vous" className="ml-1 font-semibold text-brand-red underline">
            Prendre rendez-vous
          </Link>
        </div>
      )}
    </div>
  );
}
