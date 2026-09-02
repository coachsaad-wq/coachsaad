"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function updateContentAction(formData: FormData) {
  await requireAdmin();

  const entries = Array.from(formData.entries()).filter(
    ([key]) => key !== "$ACTION_ID" && !key.startsWith("$ACTION_")
  );

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.contentBlock.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  revalidatePath("/admin/contenu");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/a-propos");
}
