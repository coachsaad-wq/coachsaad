import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function MonCompteProgrammePage() {
  const user = await requireUser();
  const profile = await prisma.nutritionProfile.findUnique({
    where: { userId: user.id },
    include: { programs: { where: { isCurrent: true }, take: 1 } },
  });
  const program = profile?.programs[0];

  return (
    <div>
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Mon programme</h2>

      {program ? (
        <div className="mt-4 rounded-xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">
            Estimation calorique
          </p>
          <p className="mt-1 text-2xl font-extrabold text-brand-red">
            {program.calorieEstimate} kcal / jour
          </p>
          <Link
            href="/nutrition/programme"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brand-red"
          >
            Voir le programme complet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Tu n&apos;as pas encore de programme Nutrition IA.
          <Link href="/nutrition/abonnement" className="ml-1 font-semibold text-brand-red underline">
            Découvrir Nutrition IA
          </Link>
        </div>
      )}
    </div>
  );
}
