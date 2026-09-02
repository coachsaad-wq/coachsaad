import { prisma } from "@/lib/prisma";

const GOAL_LABELS: Record<string, string> = {
  PERTE_DE_POIDS: "Perte de poids",
  PRISE_DE_MUSCLE: "Prise de muscle",
  MAINTIEN: "Maintien",
  BIEN_ETRE: "Bien-être",
  PERFORMANCE: "Performance",
};

export default async function AdminNutritionPage() {
  const profiles = await prisma.nutritionProfile.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: true,
      programs: { where: { isCurrent: true }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Nutrition IA</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Objectif</th>
              <th className="px-4 py-3">Programme actuel</th>
              <th className="px-4 py-3">Prochaine modification</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  {p.user.firstName} {p.user.lastName}
                </td>
                <td className="px-4 py-3">{GOAL_LABELS[p.goal]}</td>
                <td className="px-4 py-3">
                  {p.programs[0] ? `${p.programs[0].calorieEstimate} kcal/j` : "—"}
                </td>
                <td className="px-4 py-3">{p.nextEditableAt.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft/50">
                  Aucun profil Nutrition IA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
