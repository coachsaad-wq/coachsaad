import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContentMap, content } from "@/lib/services/content";

export async function Hero() {
  const c = await getContentMap();
  const imageLeft = content(c, "hero.imagePathLeft");
  const imageRight = content(c, "hero.imagePathRight");

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[36rem]">
      <div className="relative order-1 md:order-1 h-[16rem] md:h-full">
        {imageLeft ? (
          <Image
            src={imageLeft}
            alt="Coach Saad en séance de coaching sportif"
            fill
            priority
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-mist" />
        )}
      </div>

      <div className="order-2 flex flex-col justify-center gap-5 bg-ink px-6 py-12 text-white md:px-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {content(c, "hero.kicker", "Coaching personnalisé")}
        </span>
        <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-tight md:text-4xl">
          {content(c, "hero.title", "Bouge ton corps, élève ta vie.")
            .split(" ")
            .map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-brand-red">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
          {content(c, "hero.subtitle", "Force. Confiance. Énergie.")}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-white/70">
          {content(
            c,
            "hero.description",
            "Un accompagnement sur-mesure pour hommes et femmes qui veulent se sentir bien dans leur corps, gagner en énergie et atteindre leurs objectifs."
          )}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/programmes"
            className="inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
          >
            Découvrir les programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/rendez-vous"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      <div className="relative order-3 h-[16rem] md:h-full">
        {imageRight ? (
          <Image
            src={imageRight}
            alt="Coach Saad, ambiance calme et zen"
            fill
            priority
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-mist px-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Photo à venir
            </span>
            <span className="text-xs text-neutral-400">
              Ambiance bien-être — en attente d&apos;une photo réelle
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
