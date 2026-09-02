"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getPricingConfig } from "@/lib/services/pricing";
import { createSubscriptionCheckout } from "@/lib/providers/payment";
import { sendEmail, renderTemplate } from "@/lib/providers/email";
import { generateNutritionProgram, nextMonthlyEditDate } from "@/lib/services/nutrition";
import { nutritionProfileSchema } from "@/lib/validation/nutrition";

export async function subscribeNutritionAction() {
  const user = await requireUser();
  const pricing = await getPricingConfig();

  const existing = await prisma.subscription.findFirst({
    where: { userId: user.id, type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
  });
  if (existing) {
    redirect("/nutrition/programme");
  }

  const checkout = await createSubscriptionCheckout({
    amountCents: pricing.nutritionMonthly,
    currency: pricing.currency,
    description: "Abonnement Nutrition IA",
    customerEmail: user.email,
    metadata: { userId: user.id },
  });

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await prisma.subscription.create({
    data: {
      userId: user.id,
      type: "NUTRITION_IA",
      status: "TEST_MODE",
      providerSubscriptionId: checkout.providerSubscriptionId,
      currentPeriodEnd: periodEnd,
    },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      purpose: "NUTRITION_SUBSCRIPTION",
      amountCents: pricing.nutritionMonthly,
      currency: pricing.currency,
      status: checkout.isSimulated ? "TEST_SIMULATED" : "SUCCEEDED",
      providerRef: checkout.sessionId,
    },
  });

  const template = renderTemplate("subscription_started", { firstName: user.firstName });
  await sendEmail({ to: user.email, ...template });

  redirect("/nutrition/programme");
}

export async function cancelSubscriptionAction() {
  const user = await requireUser();

  await prisma.subscription.updateMany({
    where: { userId: user.id, type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/mon-compte/abonnement");
}

export type NutritionProfileState = { error?: string; success?: boolean };

export async function saveNutritionProfileAction(
  _prevState: NutritionProfileState,
  formData: FormData
): Promise<NutritionProfileState> {
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, type: "NUTRITION_IA", status: { in: ["ACTIVE", "TEST_MODE"] } },
  });
  if (!subscription) {
    return { error: "Un abonnement Nutrition IA actif est requis." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = nutritionProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const existingProfile = await prisma.nutritionProfile.findUnique({
    where: { userId: user.id },
  });

  // Verrou mensuel contrôlé côté serveur — jamais côté client.
  if (existingProfile && existingProfile.nextEditableAt > new Date()) {
    return {
      error: `Vos informations pourront être modifiées à partir du prochain renouvellement. Prochaine modification possible : ${existingProfile.nextEditableAt.toLocaleDateString(
        "fr-FR"
      )}.`,
    };
  }

  const data = parsed.data;
  const nextEditableAt = nextMonthlyEditDate();

  const profile = await prisma.nutritionProfile.upsert({
    where: { userId: user.id },
    update: { ...data, lastEditedAt: new Date(), nextEditableAt },
    create: { ...data, userId: user.id, nextEditableAt },
  });

  const generated = await generateNutritionProgram(data);

  // On conserve l'historique : l'ancien programme n'est jamais supprimé,
  // seulement marqué comme non courant.
  await prisma.$transaction([
    prisma.nutritionProgram.updateMany({
      where: { profileId: profile.id, isCurrent: true },
      data: { isCurrent: false },
    }),
    prisma.nutritionProgram.create({
      data: {
        profileId: profile.id,
        calorieEstimate: generated.calorieEstimate,
        macros: generated.macros,
        meals: generated.meals,
        shoppingList: generated.shoppingList,
        advice: generated.advice,
        isCurrent: true,
      },
    }),
  ]);

  redirect("/nutrition/programme");
}
