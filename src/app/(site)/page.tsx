import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Advantages } from "@/components/marketing/advantages";
import { ProgramsGrid } from "@/components/marketing/programs-grid";
import { About } from "@/components/marketing/about";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBand } from "@/components/marketing/cta-band";
import { getContentMap, content } from "@/lib/services/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Coaching sportif personnalisé à Lille",
  description:
    "Coach Saad accompagne hommes et femmes vers leurs objectifs : prise de muscle, perte de poids, bien-être, nutrition et coaching à domicile.",
};

export default async function HomePage() {
  const c = await getContentMap();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Coach Saad",
    description:
      "Coaching sportif personnalisé, nutrition et bien-être, à Lille et à domicile.",
    url: env.siteUrl,
    telephone: content(c, "contact.phone", undefined),
    email: content(c, "contact.email", undefined),
    address: {
      "@type": "PostalAddress",
      addressLocality: content(c, "contact.city", "Lille, France"),
      addressCountry: "FR",
    },
    priceRange: "€€",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Advantages />
      <ProgramsGrid />
      <About />
      <Testimonials />
      <CtaBand />
    </>
  );
}
