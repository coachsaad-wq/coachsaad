import { prisma } from "@/lib/prisma";
import type { SessionDuration } from "@/generated/prisma/client";
import { checkDistanceForAddress } from "@/lib/services/distance";
import { checkSlotAvailability, computeEndAt } from "@/lib/services/availability";
import { priceForDuration } from "@/lib/services/pricing";
import { createCheckoutSession } from "@/lib/providers/payment";
import { sendEmail, renderTemplate } from "@/lib/providers/email";

export type BookingQuote = {
  distanceKm: number;
  radiusKm: number;
  isWithinZone: boolean;
  priceCents: number;
  isAvailable: boolean;
  unavailableReason?: string;
};

export async function quoteBooking(
  address: string,
  startAt: Date,
  duration: SessionDuration
): Promise<BookingQuote> {
  const [distance, price, availability] = await Promise.all([
    checkDistanceForAddress(address),
    priceForDuration(duration),
    checkSlotAvailability(startAt, duration),
  ]);

  return {
    distanceKm: distance.distanceKm,
    radiusKm: distance.radiusKm,
    isWithinZone: distance.isWithinZone,
    priceCents: price,
    isAvailable: availability.isAvailable,
    unavailableReason: availability.reason,
  };
}

export class BookingError extends Error {}

export async function createBooking(params: {
  userId: string;
  userEmail: string;
  userFirstName: string;
  courseType: string;
  duration: SessionDuration;
  startAt: Date;
  address: string;
}) {
  const { userId, userEmail, userFirstName, courseType, duration, startAt, address } = params;

  const distance = await checkDistanceForAddress(address);
  if (!distance.isWithinZone) {
    throw new BookingError(
      `Zone de déplacement : ${distance.radiusKm} km maximum (adresse à ${distance.distanceKm} km).`
    );
  }

  const availability = await checkSlotAvailability(startAt, duration);
  if (!availability.isAvailable) {
    throw new BookingError(availability.reason ?? "Ce créneau n'est pas disponible.");
  }

  const priceCents = await priceForDuration(duration);
  const endAt = computeEndAt(startAt, duration);

  // Revérification finale dans la transaction pour éviter une double
  // réservation en cas de requêtes concurrentes sur le même créneau.
  const booking = await prisma.$transaction(async (tx) => {
    const conflict = await tx.booking.findFirst({
      where: {
        status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });
    if (conflict) {
      throw new BookingError("Ce créneau vient d'être réservé par quelqu'un d'autre.");
    }

    return tx.booking.create({
      data: {
        userId,
        courseType,
        duration,
        startAt,
        endAt,
        address,
        addressLat: distance.address.lat,
        addressLng: distance.address.lng,
        distanceKm: distance.distanceKm,
        priceCents,
        status: "PENDING_PAYMENT",
      },
    });
  });

  const checkout = await createCheckoutSession({
    amountCents: priceCents,
    currency: "EUR",
    description: `Coaching à domicile — ${courseType}`,
    customerEmail: userEmail,
    metadata: { bookingId: booking.id },
  });

  // MODE TEST : le paiement simulé réussit toujours instantanément.
  const [confirmedBooking] = await prisma.$transaction([
    prisma.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED" } }),
    prisma.payment.create({
      data: {
        userId,
        purpose: "BOOKING",
        amountCents: priceCents,
        status: checkout.isSimulated ? "TEST_SIMULATED" : "SUCCEEDED",
        providerRef: checkout.sessionId,
        bookingId: booking.id,
      },
    }),
  ]);

  const template = renderTemplate("booking_confirmed", {
    firstName: userFirstName,
    date: startAt.toLocaleDateString("fr-FR"),
    time: startAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  });
  await sendEmail({ to: userEmail, ...template });

  return confirmedBooking;
}
