import { Target, Users, HeartHandshake, Dumbbell, TrendingUp } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Target,
    title: "Objectifs clairs",
    description: "Un plan personnalisé 100% adapté à toi.",
  },
  {
    icon: Users,
    title: "Pour tous",
    description: "Hommes, femmes, débutants ou confirmés.",
  },
  {
    icon: HeartHandshake,
    title: "Bien-être global",
    description: "Corps, mental et hygiène de vie en harmonie.",
  },
  {
    icon: Dumbbell,
    title: "Performance",
    description: "Améliore ta force, ton endurance et ta condition.",
  },
  {
    icon: TrendingUp,
    title: "Résultats durables",
    description: "Des méthodes efficaces pour des changements durables.",
  },
];

export function Advantages() {
  return (
    <section className="border-b border-line bg-mist">
      <div className="container-page grid grid-cols-2 gap-8 py-10 md:grid-cols-5 md:gap-6">
        {ADVANTAGES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-red shadow-sm">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wide text-ink">{title}</h3>
            <p className="text-xs leading-snug text-ink-soft/70">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
