import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/services/pricing";
import { Users, CalendarDays, Sparkles, Wallet } from "lucide-react";

export default async function AdminDashboardPage() {
  const [revenueAgg, bookingsCount, upcomingBookings, clientsCount, activeSubs] =
    await Promise.all([
      prisma.payment.aggregate({
        _sum: { amountCents: true },
        where: { status: { in: ["SUCCEEDED", "TEST_SIMULATED"] } },
      }),
      prisma.booking.count(),
      prisma.booking.findMany({
        where: { status: "CONFIRMED", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        take: 5,
        include: { user: true },
      }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.subscription.count({
        where: { type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
      }),
    ]);

  const stats = [
    {
      icon: Wallet,
      label: "Chiffre d'affaires",
      value: formatPriceCents(revenueAgg._sum.amountCents ?? 0),
    },
    { icon: CalendarDays, label: "Réservations", value: bookingsCount },
    { icon: Users, label: "Clients", value: clientsCount },
    { icon: Sparkles, label: "Abonnements Nutrition IA", value: activeSubs },
  ];

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">
        Tableau de bord
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-line bg-paper p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-xs text-ink-soft/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Prochains cours
        </h2>
        {upcomingBookings.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {upcomingBookings.map((b) => (
              <li key={b.id} className="flex justify-between text-sm">
                <span className="text-ink-soft/70">
                  {b.startAt.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                  {" — "}
                  {b.courseType}
                </span>
                <span className="font-medium text-ink">
                  {b.user.firstName} {b.user.lastName}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink-soft/60">Aucun cours à venir.</p>
        )}
      </div>
    </div>
  );
}
