import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { prisma } from "@/lib/prisma";
import { resolveIcon } from "@/components/marketing/icon-map";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sport",
  description:
    "Coaching sportif personnalisé : prise de muscle, tonification, cardio & HIIT, perte de poids. Pour hommes et femmes, débutants ou confirmés.",
};

const SPORT_SLUGS = ["prise-de-muscle", "tonification-sculpt", "cardio-hiit", "perte-de-poids"];

export default async function SportPage() {
  const programs = await prisma.programCard.findMany({
    where: { slug: { in: SPORT_SLUGS }, isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHero
        kicker="Sport"
        title="Un entraînement qui s'adapte à toi"
        description="Musculation, cardio, HIIT ou tonification : chaque séance est construite autour de tes objectifs, ton niveau et ton emploi du temps — pas l'inverse."
      />

      <section className="container-page grid grid-cols-1 gap-6 py-16 sm:grid-cols-2">
        {programs.map((program) => {
          const Icon = resolveIcon(program.icon);
          return (
            <article
              key={program.id}
              className="overflow-hidden rounded-xl border border-line"
            >
              <div className="relative h-48 w-full">
                {program.imagePath ? (
                  <Image
                    src={program.imagePath}
                    alt={program.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-mist">
                    <Icon className="h-10 w-10 text-neutral-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
                  {program.title}
                </h2>
                <p className="mt-2 text-sm text-ink-soft/70">{program.description}</p>
                <Link
                  href="/rendez-vous"
                  className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-brand-red hover:underline"
                >
                  Réserver une séance →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <CtaBand />
    </>
  );
}
