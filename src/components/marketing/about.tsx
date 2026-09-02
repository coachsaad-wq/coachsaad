import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Users, Heart, ShieldCheck, User } from "lucide-react";
import { getContentMap, content } from "@/lib/services/content";

const CHECKLIST = [
  "Plus de 10 ans d'expérience",
  "Approche 100% personnalisée",
  "Suivi nutritionnel inclus",
  "Disponibilité et écoute à chaque étape",
];

export async function About() {
  const c = await getContentMap();
  const imagePath = content(c, "about.imagePath");
  const stats = [
    { icon: User, value: `+${content(c, "about.stat.experience", "10")} ANS`, label: "D'expérience" },
    { icon: Users, value: `+${content(c, "about.stat.clients", "700")}`, label: "Clients accompagnés" },
    { icon: Heart, value: `${content(c, "about.stat.satisfaction", "95")}%`, label: "De clients satisfaits" },
    { icon: ShieldCheck, value: "Résultats", label: "Garantis" },
  ];

  return (
    <section className="container-page py-4">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-ink text-white lg:grid-cols-2">
        <div className="relative min-h-[20rem] lg:min-h-[26rem]">
          {imagePath ? (
            <Image
              src={imagePath}
              alt="Coach Saad"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}
        </div>

        <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            À propos
          </span>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
            {content(c, "about.title", "Coach Saad")}
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            {content(c, "about.description")}
          </p>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/a-propos"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
          >
            En savoir plus sur moi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-line bg-paper p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-brand-red">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold uppercase text-ink">{value}</p>
              <p className="text-xs text-ink-soft/60">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
