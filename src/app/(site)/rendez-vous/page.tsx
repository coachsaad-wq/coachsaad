import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { BookingWizard } from "@/app/(site)/rendez-vous/booking-wizard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Réserve ta séance de coaching à domicile avec Coach Saad.",
};

export default async function RendezVousPage() {
  const programs = await prisma.programCard.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { title: true },
  });

  return (
    <>
      <PageHero
        kicker="Coaching à domicile"
        title="Prendre rendez-vous"
        description="Choisis ton créneau, ton adresse, et réserve en quelques minutes."
      />
      <section className="container-page py-16">
        <BookingWizard courseTypes={programs.map((p) => p.title)} />
      </section>
    </>
  );
}
