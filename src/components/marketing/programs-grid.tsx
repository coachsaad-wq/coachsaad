import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { resolveIcon } from "@/components/marketing/icon-map";

export async function ProgramsGrid() {
  const programs = await prisma.programCard.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="container-page py-16">
      <h2 className="text-center text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
        Des programmes adaptés à <span className="text-brand-red">tes objectifs</span>
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => {
          const Icon = resolveIcon(program.icon);
          return (
            <article
              key={program.id}
              className="group overflow-hidden rounded-xl border border-line bg-paper transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full">
                {program.imagePath ? (
                  <Image
                    src={program.imagePath}
                    alt={program.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-mist">
                    <Icon className="h-10 w-10 text-neutral-300" />
                  </div>
                )}
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-red shadow">
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">
                  {program.description}
                </p>
                <Link
                  href={`/programmes#${program.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-brand-red px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
                >
                  {program.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/programmes"
          className="rounded-md border border-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-ink hover:text-white"
        >
          Voir tous les programmes
        </Link>
      </div>
    </section>
  );
}
