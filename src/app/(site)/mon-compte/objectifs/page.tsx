import Link from "next/link";
import { Target } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const GOAL_LABELS: Record<string, string> = {
  PERTE_DE_POIDS: "Perte de poids",
  PRISE_DE_MUSCLE: "Prise de muscle",
  MAINTIEN: "Maintien",
  BIEN_ETRE: "Bien-être",
  PERFORMANCE: "Performance",
};

export default async function ObjectifsPage() {
  const user = await requireUser();
  const profile = await prisma.nutritionProfile.findUnique({ where: { userId: user.id } });

  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink">
        <Target className="h-4 w-4" /> Mes objectifs
      </h2>

      {profile ? (
        <div className="mt-4 grid max-w-sm grid-cols-2 gap-3">
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-ink-soft/50">Objectif</p>
            <p className="mt-1 font-semibold text-ink">{GOAL_LABELS[profile.goal]}</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-ink-soft/50">Séances / semaine</p>
            <p className="mt-1 font-semibold text-ink">{profile.sessionsPerWeek}</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-ink-soft/50">Poids actuel</p>
            <p className="mt-1 font-semibold text-ink">{profile.weightKg} kg</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-ink-soft/50">Taille</p>
            <p className="mt-1 font-semibold text-ink">{profile.heightCm} cm</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Aucun objectif enregistré pour le moment.
          <Link href="/nutrition/abonnement" className="ml-1 font-semibold text-brand-red underline">
            Découvrir Nutrition IA
          </Link>
        </div>
      )}
    </div>
  );
}
