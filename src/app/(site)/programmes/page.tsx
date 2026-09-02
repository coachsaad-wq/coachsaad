import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { resolveIcon } from "@/components/marketing/icon-map";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Tous les programmes Coach Saad : prise de muscle, tonification, perte de poids, bien-être, nutrition, cardio & HIIT.",
};

export default async function ProgrammesPage() {
  const programs = await prisma.programCard.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHero
        kicker="Programmes"
        title="Des programmes adaptés à tes objectifs"
        description="Chaque programme est personnalisable selon ton niveau, ton emploi du temps et tes préférences."
      />

      <section className="container-page py-16">
        <div className="flex flex-col gap-10">
          {programs.map((program, i) => {
            const Icon = resolveIcon(program.icon);
            const reversed = i % 2 === 1;
            return (
              <article
                key={program.id}
                id={program.slug}
                className="grid scroll-mt-24 grid-cols-1 items-center gap-8 rounded-2xl border border-line p-6 md:grid-cols-2 md:p-8"
              >
                <div className={reversed ? "md:order-2" : ""}>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl">
                    {program.imagePath ? (
                      <Image
                        src={program.imagePath}
                        alt={program.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-mist">
                        <Icon className="h-12 w-12 text-neutral-300" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={reversed ? "md:order-1" : ""}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-xl font-extrabold uppercase tracking-tight text-ink">
                    {program.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft/70">
                    {program.description}
                  </p>
                  <Link
                    href="/rendez-vous"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
                  >
                    Réserver ce programme
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
