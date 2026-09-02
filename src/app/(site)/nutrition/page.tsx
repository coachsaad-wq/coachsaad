import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { prisma } from "@/lib/prisma";
import { getPricingConfig, formatPriceCents } from "@/lib/services/pricing";

export const metadata: Metadata = {
  title: "Nutrition",
  description:
    "Plans alimentaires personnalisés et Nutrition IA : un programme nutrition généré selon ton profil, tes objectifs et ton mode de vie, à partir de 10€/mois.",
};

const INCLUDED = [
  "Estimation calorique et macronutriments",
  "Repas et quantités adaptés à ton profil",
  "Liste de courses générée automatiquement",
  "Programme régénéré chaque mois",
];

export default async function NutritionPage() {
  const [program, pricing] = await Promise.all([
    prisma.programCard.findUnique({ where: { slug: "nutrition" } }),
    getPricingConfig(),
  ]);

  return (
    <>
      <PageHero
        kicker="Nutrition"
        title="Manger juste, sans te compliquer la vie"
        description="Des conseils simples pour progresser au quotidien, et un programme 100% personnalisé si tu veux aller plus loin."
      />

      {program?.imagePath && (
        <section className="container-page pt-12">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image src={program.imagePath} alt={program.title} fill className="object-cover" />
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-brand-red bg-mist p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold uppercase tracking-tight text-ink">
            Nutrition IA
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-brand-red">
            {formatPriceCents(pricing.nutritionMonthly, pricing.currency)}
            <span className="text-sm font-medium text-ink-soft"> / mois</span>
          </p>
          <p className="mt-3 text-sm text-ink-soft/70">
            Pour obtenir un programme personnalisé selon ton profil, tes objectifs et ton
            mode de vie.
          </p>

          <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left text-sm text-ink-soft/80">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/nutrition/abonnement"
            className="mt-6 inline-block rounded-md bg-brand-red px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-red-dark"
          >
            Découvrir Nutrition IA
          </Link>

          <p className="mt-4 text-xs text-ink-soft/50">
            Programme généré par une intelligence artificielle à titre informatif. Ne
            remplace pas l&apos;avis d&apos;un médecin ou d&apos;un diététicien.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
