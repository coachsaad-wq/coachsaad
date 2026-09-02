import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getPricingConfig, formatPriceCents } from "@/lib/services/pricing";
import { subscribeNutritionAction } from "@/lib/actions/nutrition";

export const metadata: Metadata = { title: "Abonnement Nutrition IA" };

const INCLUDED = [
  "Profil nutritionnel complet",
  "Programme généré par IA (calories, macros, repas, quantités)",
  "Liste de courses automatique",
  "Modification possible chaque mois",
];

export default async function NutritionAbonnementPage() {
  const [user, pricing] = await Promise.all([getCurrentUser(), getPricingConfig()]);

  if (user) {
    const existing = await prisma.subscription.findFirst({
      where: { userId: user.id, type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
    });
    if (existing) redirect("/nutrition/programme");
  }

  return (
    <>
      <PageHero kicker="Nutrition IA" title="Un programme 100% personnalisé" />

      <section className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-brand-red p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white">
            <Sparkles className="h-6 w-6" />
          </span>
          <p className="mt-4 text-4xl font-extrabold text-ink">
            {formatPriceCents(pricing.nutritionMonthly, pricing.currency)}
            <span className="text-base font-medium text-ink-soft/60"> / mois</span>
          </p>
          <p className="mt-1 text-xs text-ink-soft/50">1 abonnement = 1 personne</p>

          <ul className="mx-auto mt-6 flex max-w-xs flex-col gap-2 text-left text-sm text-ink-soft/80">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {item}
              </li>
            ))}
          </ul>

          {user ? (
            <form action={subscribeNutritionAction} className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md bg-brand-red px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-red-dark"
              >
                S&apos;abonner (MODE TEST)
              </button>
            </form>
          ) : (
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/connexion?callbackUrl=/nutrition/abonnement"
                className="rounded-md bg-brand-red px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-red-dark"
              >
                Se connecter pour s&apos;abonner
              </Link>
              <Link
                href="/inscription"
                className="rounded-md border border-line px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink-soft"
              >
                Créer un compte
              </Link>
            </div>
          )}

          <p className="mt-4 text-xs text-ink-soft/50">
            MODE TEST : paiement simulé, aucun montant réel n&apos;est débité. Architecture
            prête pour un vrai fournisseur de paiement récurrent.
          </p>
        </div>
      </section>
    </>
  );
}
