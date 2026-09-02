import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { getContentMap, content } from "@/lib/services/content";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function MentionsLegalesPage() {
  const c = await getContentMap();

  return (
    <>
      <PageHero kicker="Informations légales" title="Mentions légales" />
      <section className="container-page max-w-3xl py-16">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft/80">
          <div>
            <h2 className="text-base font-bold text-ink">Éditeur du site</h2>
            <p className="mt-2">
              Coach Saad — Coaching sportif indépendant
              <br />
              {content(c, "contact.city", "France")}
              <br />
              Email : {content(c, "contact.email", "—")}
              <br />
              Téléphone : {content(c, "contact.phone", "—")}
            </p>
            <p className="mt-2 text-xs text-ink-soft/50">
              MODE TEST : coordonnées et informations légales définitives à renseigner par
              le client avant mise en production (SIRET, forme juridique, etc.).
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Hébergement</h2>
            <p className="mt-2">
              Vercel Inc. — hébergement de l&apos;application.
              <br />
              Base de données et authentification : Supabase.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble des contenus de ce site (textes, photos, logo) est la
              propriété de Coach Saad, sauf mention contraire.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
