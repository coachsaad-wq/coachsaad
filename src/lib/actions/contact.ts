"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/providers/email";
import { getContentMap, content } from "@/lib/services/content";

const contactSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court (10 caractères minimum)").max(2000),
});

export type ContactState = { error?: string; success?: boolean };

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const c = await getContentMap();
  const adminEmail = content(c, "contact.email", "contact@coachsaad.fr");

  await sendEmail({
    to: adminEmail,
    subject: `Nouveau message de contact — ${parsed.data.name}`,
    html: `<p><strong>De :</strong> ${parsed.data.name} (${parsed.data.email})</p><p>${parsed.data.message}</p>`,
  });

  return { success: true };
}
