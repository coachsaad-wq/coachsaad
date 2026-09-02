import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { ContactForm } from "@/app/(site)/contact/contact-form";
import { getContentMap, content } from "@/lib/services/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacte Coach Saad pour toute question sur les programmes, le coaching à domicile ou Nutrition IA.",
};

export default async function ContactPage() {
  const c = await getContentMap();

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Parlons de tes objectifs"
        description="Une question ? Écris-moi, je réponds personnellement."
      />

      <section className="container-page grid grid-cols-1 gap-12 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
            Envoie-moi un message
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
            Coordonnées
          </h2>
          <ul className="mt-5 flex flex-col gap-4 text-sm text-ink-soft/80">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-red" />
              {content(c, "contact.phone", "—")}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-red" />
              {content(c, "contact.email", "—")}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-red" />
              {content(c, "contact.city", "France")}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
