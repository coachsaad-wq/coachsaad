"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sendEmail, renderTemplate } from "@/lib/providers/email";

export async function cancelBookingAction(formData: FormData) {
  await requireAdmin();
  const bookingId = formData.get("bookingId") as string;

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: { user: true },
  });

  const template = renderTemplate("booking_cancelled", {
    firstName: booking.user.firstName,
    date: booking.startAt.toLocaleDateString("fr-FR"),
  });
  await sendEmail({ to: booking.user.email, ...template });

  revalidatePath("/admin/reservations");
}
