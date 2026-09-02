import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShoppingCart, Info } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { NutritionProfileForm } from "@/app/(site)/nutrition/programme/nutrition-profile-form";

export const metadata: Metadata = { title: "Mon programme Nutrition IA" };

type Macros = { proteinesG: number; glucidesG: number; lipidesG: number };
type Meal = { jour: string; repas: { nom: string; description: string }[] };

export default async function NutritionProgrammePage() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
  });
  if (!subscription) redirect("/nutrition/abonnement");

  const profile = await prisma.nutritionProfile.findUnique({
    where: { userId: user.id },
    include: { programs: { where: { isCurrent: true }, take: 1 } },
  });

  const program = profile?.programs[0];
  const isLocked = profile ? profile.nextEditableAt > new Date() : false;

  return (
    <>
      <PageHero
        kicker="Nutrition IA"
        title="Mon programme"
        description="Généré selon ton profil. Modifiable une fois par mois."
      />

      <section className="container-page grid grid-cols-1 gap-10 py-16 lg:grid-cols-2">
        <div>
          {program ? (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-line p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/50">
                  Estimation calorique
                </p>
                <p className="mt-1 text-3xl font-extrabold text-brand-red">
                  {program.calorieEstimate} kcal / jour
                </p>
                {(() => {
                  const macros = program.macros as unknown as Macros;
                  return (
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                      <div>
                        <p className="font-bold text-ink">{macros.proteinesG}g</p>
                        <p className="text-xs text-ink-soft/50">Protéines</p>
                      </div>
                      <div>
                        <p className="font-bold text-ink">{macros.glucidesG}g</p>
                        <p className="text-xs text-ink-soft/50">Glucides</p>
                      </div>
                      <div>
                        <p className="font-bold text-ink">{macros.lipidesG}g</p>
                        <p className="text-xs text-ink-soft/50">Lipides</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Repas</h2>
                <div className="mt-3 flex flex-col gap-4">
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
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink">
                  <ShoppingCart className="h-4 w-4" /> Liste de courses
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {(program.shoppingList as unknown as string[]).map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-mist px-3 py-1.5 text-xs font-medium text-ink-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-mist p-4 text-sm text-ink-soft/80">
                {program.advice}
              </div>

              <div className="flex items-start gap-2 text-xs text-ink-soft/50">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                {program.aiDisclaimer}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-soft/60">
              Renseigne ton profil pour générer ton premier programme.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
            {profile ? "Mes informations" : "Créer mon profil"}
          </h2>

          {isLocked && profile ? (
            <p className="mt-4 rounded-md bg-mist p-4 text-sm text-ink-soft/70">
              Vos informations pourront être modifiées à partir du prochain renouvellement.
              <br />
              <span className="font-semibold text-ink">
                Prochaine modification possible :{" "}
                {profile.nextEditableAt.toLocaleDateString("fr-FR")}.
              </span>
            </p>
          ) : (
            <div className="mt-4">
              <NutritionProfileForm profile={profile} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
