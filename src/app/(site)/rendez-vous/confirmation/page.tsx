import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/services/pricing";

export default async function ConfirmationPage({
  searchParams,
}: PageProps<"/rendez-vous/confirmation">) {
  const params = await searchParams;
  const bookingId = typeof params.booking === "string" ? params.booking : undefined;
  const booking = bookingId
    ? await prisma.booking.findUnique({ where: { id: bookingId } })
    : null;

  return (
    <section className="container-page flex flex-col items-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold uppercase tracking-tight text-ink">
        Réservation confirmée
      </h1>

      {booking ? (
        <div className="mt-6 w-full max-w-sm rounded-xl border border-line p-5 text-left text-sm">
          <p className="flex justify-between py-1">
            <span className="text-ink-soft/60">Cours</span>
            <span className="font-medium">{booking.courseType}</span>
          </p>
          <p className="flex justify-between py-1">
            <span className="text-ink-soft/60">Date</span>
            <span className="font-medium">
              {booking.startAt.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </span>
          </p>
          <p className="flex justify-between py-1">
            <span className="text-ink-soft/60">Prix</span>
            <span className="font-medium">{formatPriceCents(booking.priceCents)}</span>
          </p>
        </div>
      ) : (
        <p className="mt-4 max-w-md text-sm text-ink-soft/70">
          Ta réservation a bien été enregistrée (MODE TEST : paiement simulé, aucun
          montant réel n&apos;a été débité).
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href="/mon-compte/reservations"
          className="rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          Voir mes réservations
        </Link>
        <Link
          href="/"
          className="rounded-md border border-line px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink-soft"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
