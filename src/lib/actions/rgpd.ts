"use server";

import { revalidatePath } from "next/cache";
import { requireUser, getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/providers/email";

export async function logCookieConsentAction(choice: "accepted" | "declined") {
  const user = await getCurrentUser();
  await prisma.consentLog.create({
    data: {
      userId: user?.id,
      type: "COOKIES",
      details: `Bannière cookies : ${choice}`,
    },
  });
}

export async function requestAccountDeletionAction() {
  const user = await requireUser();

  await prisma.consentLog.create({
    data: {
      userId: user.id,
      type: "ACCOUNT_DELETION_REQUEST",
      details: `Demande de suppression de compte par ${user.email}`,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Demande de suppression de compte reçue",
    html: `<p>Bonjour ${user.firstName}, votre demande de suppression de compte a bien été enregistrée. Notre équipe la traitera sous 30 jours conformément au RGPD.</p>`,
  });

  revalidatePath("/mon-compte/parametres");
}

export async function requestDataExportAction() {
  const user = await requireUser();

  await prisma.consentLog.create({
    data: {
      userId: user.id,
      type: "DATA_EXPORT_REQUEST",
      details: `Demande d'export de données par ${user.email}`,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Demande d'export de vos données reçue",
    html: `<p>Bonjour ${user.firstName}, votre demande d'export de données a bien été enregistrée. Vous recevrez vos données par email sous 30 jours conformément au RGPD.</p>`,
  });

  revalidatePath("/mon-compte/parametres");
}
