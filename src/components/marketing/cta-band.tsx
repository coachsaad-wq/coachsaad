import Link from "next/link";
import { Calendar } from "lucide-react";

export function CtaBand() {
  return (
    <section className="border-t border-line bg-ink">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
            Prêt(e) à changer <span className="text-brand-red">ta vie</span> ?
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Réserve ton appel découverte gratuit et construisons ensemble ton plan
            d&apos;action.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link
            href="/rendez-vous"
            className="inline-flex items-center gap-2 rounded-md bg-brand-red px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
          >
            <Calendar className="h-4 w-4" />
            Prendre rendez-vous
          </Link>
          <span className="text-xs text-white/40">
            Appel découverte 100% offert et sans engagement.
          </span>
        </div>
      </div>
    </section>
  );
}
