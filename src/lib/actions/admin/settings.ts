"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const pricingSchema = z.object({
  price1h: z.coerce.number().int().min(0),
  price1h30: z.coerce.number().int().min(0),
  price2h: z.coerce.number().int().min(0),
  nutritionMonthly: z.coerce.number().int().min(0),
});

export async function updatePricingAction(formData: FormData) {
  await requireAdmin();
  const parsed = pricingSchema.parse({
    price1h: Math.round(Number(formData.get("price1h")) * 100),
    price1h30: Math.round(Number(formData.get("price1h30")) * 100),
    price2h: Math.round(Number(formData.get("price2h")) * 100),
    nutritionMonthly: Math.round(Number(formData.get("nutritionMonthly")) * 100),
  });

  await prisma.pricingConfig.upsert({
    where: { id: "singleton" },
    update: parsed,
    create: { id: "singleton", ...parsed },
  });

  revalidatePath("/admin/tarifs");
  revalidatePath("/nutrition");
  revalidatePath("/rendez-vous");
}

const zoneSchema = z.object({
  originLabel: z.string().min(1).max(200),
  radiusKm: z.coerce.number().min(1).max(500),
});

export async function updateZoneAction(formData: FormData) {
  await requireAdmin();
  const parsed = zoneSchema.parse({
    originLabel: formData.get("originLabel"),
    radiusKm: formData.get("radiusKm"),
  });

  await prisma.travelZoneConfig.upsert({
    where: { id: "singleton" },
    update: parsed,
    create: { id: "singleton", ...parsed },
  });

  revalidatePath("/admin/zone");
  revalidatePath("/rendez-vous");
}

const assistantSchema = z.object({
  isActive: z.coerce.boolean(),
  name: z.string().min(1).max(80),
  greeting: z.string().min(1).max(500),
  hintText: z.string().min(1).max(120),
  suggestions: z.string(),
  systemInstructions: z.string().min(1).max(4000),
  nutritionPitch: z.string().min(1).max(300),
  nutritionCta: z.string().min(1).max(80),
});

export async function updateAssistantAction(formData: FormData) {
  await requireAdmin();
  const suggestionsRaw = String(formData.get("suggestions") ?? "");
  const suggestions = suggestionsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = assistantSchema.parse({
    isActive: formData.get("isActive") === "on",
    name: formData.get("name"),
    greeting: formData.get("greeting"),
    hintText: formData.get("hintText"),
    suggestions: suggestionsRaw,
    systemInstructions: formData.get("systemInstructions"),
    nutritionPitch: formData.get("nutritionPitch"),
    nutritionCta: formData.get("nutritionCta"),
  });

  await prisma.assistantConfig.upsert({
    where: { id: "singleton" },
    update: {
      isActive: parsed.isActive,
      name: parsed.name,
      greeting: parsed.greeting,
      hintText: parsed.hintText,
      suggestions,
      systemInstructions: parsed.systemInstructions,
      nutritionPitch: parsed.nutritionPitch,
      nutritionCta: parsed.nutritionCta,
    },
    create: {
      id: "singleton",
      isActive: parsed.isActive,
      name: parsed.name,
      greeting: parsed.greeting,
      hintText: parsed.hintText,
      suggestions,
      systemInstructions: parsed.systemInstructions,
      nutritionPitch: parsed.nutritionPitch,
      nutritionCta: parsed.nutritionCta,
    },
  });

  revalidatePath("/admin/assistant");
  revalidatePath("/");
}
