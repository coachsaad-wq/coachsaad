import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type Meal = { jour: string; repas: { nom: string; description: string }[] };

export default async function MesRepasPage() {
  const user = await requireUser();
  const profile = await prisma.nutritionProfile.findUnique({
    where: { userId: user.id },
    include: { programs: { where: { isCurrent: true }, take: 1 } },
  });
  const program = profile?.programs[0];

  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Mes repas</h2>

      {program ? (
        <div className="mt-4 flex flex-col gap-4">
          {(program.meals as unknown as Meal[]).map((day) => (
            <div key={day.jour} className="rounded-xl border border-line p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-red">
                {day.jour}
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {day.repas.map((r) => (
                  <li key={r.nom} className="text-sm">
                    <span className="font-semibold text-ink">{r.nom} : </span>
                    <span className="text-ink-soft/70">{r.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Aucun repas généré pour le moment.
          <Link href="/nutrition/abonnement" className="ml-1 font-semibold text-brand-red underline">
            Découvrir Nutrition IA
          </Link>
        </div>
      )}
    </div>
  );
}
