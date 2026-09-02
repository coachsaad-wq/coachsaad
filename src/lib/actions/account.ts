"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(80),
  lastName: z.string().max(80).optional(),
  phone: z.string().max(30).optional(),
});

export type UpdateAccountState = { error?: string; success?: boolean };

export async function updateAccountAction(
  _prevState: UpdateAccountState,
  formData: FormData
): Promise<UpdateAccountState> {
  const user = await requireUser();

  const parsed = updateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  revalidatePath("/mon-compte");
  return { success: true };
}
