"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const programSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  ctaLabel: z.string().min(1).max(60),
  order: z.coerce.number().int(),
  isActive: z.coerce.boolean(),
});

export async function updateProgramAction(formData: FormData) {
  await requireAdmin();
  const parsed = programSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    ctaLabel: formData.get("ctaLabel"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "on",
  });

  const { id, ...data } = parsed;
  await prisma.programCard.update({ where: { id }, data });
  revalidatePath("/admin/programmes");
  revalidatePath("/");
  revalidatePath("/programmes");
}
