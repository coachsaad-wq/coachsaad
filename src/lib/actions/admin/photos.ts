"use server";

import { revalidatePath } from "next/cache";
import path from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export type UploadPhotoState = { error?: string; success?: boolean };

/**
 * Enregistre une photo importée par l'administrateur TELLE QUELLE :
 * aucun redimensionnement, aucun recadrage, aucune retouche, aucune
 * génération IA. Le fichier original est utilisé sans modification.
 *
 * MODE TEST : écrit dans /public/images/coach/uploads (disque local).
 * PRODUCTION : remplacer cet écriture disque par un upload vers le
 * bucket Supabase Storage du client (voir src/lib/supabase/admin.ts),
 * sans changer le reste de la logique (aucun traitement de l'image).
 */
export async function uploadPhotoAction(
  _prevState: UploadPhotoState,
  formData: FormData
): Promise<UploadPhotoState> {
  await requireAdmin();

  const file = formData.get("file");
  const targetKey = formData.get("targetKey");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Aucun fichier sélectionné." };
  }
  if (typeof targetKey !== "string" || !targetKey) {
    return { error: "Emplacement invalide." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Format non supporté (JPEG, PNG ou WebP uniquement)." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Fichier trop volumineux (8 Mo maximum)." };
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const safeKey = targetKey.replace(/[^a-z0-9-_:]/gi, "-");
  const filename = `${safeKey.replace(/:/g, "-")}-${Date.now()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "images", "coach", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  const publicPath = `/images/coach/uploads/${filename}`;

  if (targetKey.startsWith("program:")) {
    const slug = targetKey.slice("program:".length);
    await prisma.programCard.update({ where: { slug }, data: { imagePath: publicPath } });
  } else if (targetKey.startsWith("testimonial:")) {
    const id = targetKey.slice("testimonial:".length);
    await prisma.testimonial.update({ where: { id }, data: { photoPath: publicPath } });
  } else {
    await prisma.contentBlock.upsert({
      where: { key: targetKey },
      update: { value: publicPath },
      create: { key: targetKey, value: publicPath },
    });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/");
  revalidatePath("/programmes");

  return { success: true };
}
