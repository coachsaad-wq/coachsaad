import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { getContentMap, content } from "@/lib/services/content";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default async function ConfidentialitePage() {
  const c = await getContentMap();
  const email = content(c, "contact.email", "contact@coachsaad.fr");

  return (
    <>
      <PageHero kicker="RGPD" title="Politique de confidentialité" />
      <section className="container-page max-w-3xl py-16">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft/80">
          <div>
            <h2 className="text-base font-bold text-ink">Données collectées</h2>
            <p className="mt-2">
              Nous collectons les données que vous nous fournissez directement : identité
              (prénom, nom), coordonnées (email, téléphone), données de profil sportif et
              nutritionnel (âge, taille, poids, objectifs, habitudes alimentaires),
              historique de réservations et de paiements.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Finalités</h2>
            <p className="mt-2">
              Ces données sont utilisées pour gérer votre compte, vos réservations de
              coaching, générer vos programmes Nutrition IA, traiter vos paiements et vous
              contacter dans le cadre du service.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Base légale</h2>
            <p className="mt-2">
              Exécution du contrat (fourniture du service de coaching), consentement
              (cookies non essentiels, assistant IA) et intérêt légitime (amélioration du
              service).
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Conservation</h2>
            <p className="mt-2">
              Vos données sont conservées pendant la durée de votre relation avec Coach
              Saad, puis archivées ou supprimées conformément aux obligations légales.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Vos droits</h2>
            <p className="mt-2">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement, de portabilité et d&apos;opposition sur vos
              données. Vous pouvez exercer ces droits directement depuis votre espace
              client (Paramètres) ou en nous contactant à {email}.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Sous-traitants</h2>
            <p className="mt-2">
              Hébergement (Vercel), base de données et authentification (Supabase),
              paiement, email transactionnel et intelligence artificielle, selon les
              fournisseurs configurés. En MODE TEST, aucune donnée n&apos;est transmise à un
              fournisseur externe réel : ces services sont simulés.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">Assistant IA</h2>
            <p className="mt-2">
              Les échanges avec l&apos;assistant ne sont pas utilisés pour vous identifier.
              Les programmes Nutrition IA sont générés automatiquement à titre informatif et
              ne constituent pas un avis médical.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
