import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Wind, Moon } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bien-être",
  description:
    "Mobilité, gestion du stress et hygiène de vie : une approche douce et accessible, pensée aussi bien pour les femmes que pour les hommes.",
};

const PILLARS = [
  {
    icon: Wind,
    title: "Respiration & détente",
    description: "Des outils simples pour relâcher les tensions et retrouver son calme.",
  },
  {
    icon: HeartHandshake,
    title: "Mobilité douce",
    description: "Travail articulaire progressif, sans jamais forcer sur le corps.",
  },
  {
    icon: Moon,
    title: "Hygiène de vie",
    description: "Sommeil, récupération et petites habitudes qui changent tout.",
  },
];

export default async function BienEtrePage() {
  const program = await prisma.programCard.findUnique({
    where: { slug: "bien-etre-mobilite" },
  });

  return (
    <>
      <PageHero
        kicker="Bien-être"
        title="Une approche plus douce, pour tout le monde"
        description="Le bien-être n'est pas réservé aux sportifs confirmés. Ici, on avance à ton rythme, avec bienveillance et sans jugement."
      />

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-line p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist text-brand-red">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-ink">
                {title}
              </h2>
              <p className="mt-2 text-sm text-ink-soft/70">{description}</p>
            </div>
          ))}
        </div>

        {program && (
          <div className="mt-10 grid grid-cols-1 items-center gap-8 rounded-2xl border border-line p-6 md:grid-cols-2 md:p-8">
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-mist">
              {program.imagePath && (
                <Image src={program.imagePath} alt={program.title} fill className="object-cover" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">
                {program.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft/70">
                {program.description}
              </p>
              <Link
                href="/rendez-vous"
                className="mt-5 inline-block rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-red-dark"
              >
                Réserver une séance
              </Link>
            </div>
          </div>
        )}
      </section>

      <CtaBand />
    </>
  );
}
