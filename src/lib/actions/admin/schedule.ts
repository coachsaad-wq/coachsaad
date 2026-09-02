"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const workingHoursSchema = z.object({
  weekday: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function addWorkingHoursAction(formData: FormData) {
  await requireAdmin();
  const parsed = workingHoursSchema.parse({
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  await prisma.workingHours.create({ data: parsed });
  revalidatePath("/admin/calendrier");
}

export async function removeWorkingHoursAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.workingHours.delete({ where: { id } });
  revalidatePath("/admin/calendrier");
}

const blockedSlotSchema = z.object({
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  reason: z.string().max(200).optional(),
});

export async function addBlockedSlotAction(formData: FormData) {
  await requireAdmin();
  const parsed = blockedSlotSchema.parse({
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    reason: formData.get("reason") || undefined,
  });

  await prisma.blockedSlot.create({
    data: {
      startAt: new Date(parsed.startAt),
      endAt: new Date(parsed.endAt),
      reason: parsed.reason,
    },
  });
  revalidatePath("/admin/calendrier");
}

export async function removeBlockedSlotAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.blockedSlot.delete({ where: { id } });
  revalidatePath("/admin/calendrier");
}
