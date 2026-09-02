import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { About } from "@/components/marketing/about";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Coach Saad : plus de 10 ans d'expérience, une approche humaine et personnalisée pour t'accompagner vers tes objectifs.",
};

export default function AProposPage() {
  return (
    <>
      <PageHero
        kicker="À propos"
        title="Coach Saad"
        description="Une approche humaine, bienveillante et sans jugement, pensée pour t'accompagner durablement — quel que soit ton point de départ."
      />
      <div className="pt-12">
        <About />
      </div>
      <Testimonials />
      <CtaBand />
    </>
  );
}
