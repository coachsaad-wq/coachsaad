import { prisma } from "@/lib/prisma";
import type { SessionDuration, Weekday } from "@/generated/prisma/client";
import { durationToMinutes } from "@/lib/services/pricing";

const WEEKDAYS: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[date.getDay()];
}

function timeStringToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export type AvailabilityCheckResult = {
  isAvailable: boolean;
  reason?: string;
};

/**
 * Vérifie qu'un créneau (début + durée) est réservable :
 * - dans les horaires de travail définis en admin
 * - pas dans un créneau bloqué (congé, blocage exceptionnel)
 * - pas en conflit avec une réservation déjà confirmée/en attente
 * Contrôle 100% côté serveur, exécuté juste avant la création de la
 * réservation pour empêcher deux réservations sur le même créneau
 * (condition de course incluse : la contrainte unique n'existe pas en
 * DB pour un intervalle, donc on revérifie dans la transaction).
 */
export async function checkSlotAvailability(
  startAt: Date,
  duration: SessionDuration
): Promise<AvailabilityCheckResult> {
  const endAt = new Date(startAt.getTime() + durationToMinutes(duration) * 60000);

  if (startAt.getTime() <= Date.now()) {
    return { isAvailable: false, reason: "Impossible de réserver dans le passé." };
  }

  const weekday = weekdayOf(startAt);
  const startMinutes = startAt.getHours() * 60 + startAt.getMinutes();
  const endMinutes = startMinutes + durationToMinutes(duration);

  const workingHours = await prisma.workingHours.findMany({
    where: { weekday, isActive: true },
  });

  const fitsWorkingHours = workingHours.some((wh) => {
    const whStart = timeStringToMinutes(wh.startTime);
    const whEnd = timeStringToMinutes(wh.endTime);
    return startMinutes >= whStart && endMinutes <= whEnd;
  });

  if (!fitsWorkingHours) {
    return {
      isAvailable: false,
      reason: "Ce créneau est en dehors des horaires de disponibilité.",
    };
  }

  const blocked = await prisma.blockedSlot.findFirst({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });
  if (blocked) {
    return { isAvailable: false, reason: "Ce créneau est bloqué (congé ou indisponibilité)." };
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });
  if (conflict) {
    return { isAvailable: false, reason: "Ce créneau est déjà réservé." };
  }

  return { isAvailable: true };
}

export function computeEndAt(startAt: Date, duration: SessionDuration): Date {
  return new Date(startAt.getTime() + durationToMinutes(duration) * 60000);
}
