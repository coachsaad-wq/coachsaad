import { z } from "zod";

export const nutritionProfileSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(80),
  age: z.coerce.number().int().min(14).max(100),
  sex: z.enum(["HOMME", "FEMME", "AUTRE"]),
  heightCm: z.coerce.number().int().min(100).max(250),
  weightKg: z.coerce.number().min(30).max(300),
  goal: z.enum([
    "PERTE_DE_POIDS",
    "PRISE_DE_MUSCLE",
    "MAINTIEN",
    "BIEN_ETRE",
    "PERFORMANCE",
  ]),
  activityLevel: z.enum([
    "SEDENTAIRE",
    "LEGER",
    "MODERE",
    "ELEVE",
    "TRES_ELEVE",
  ]),
  sessionsPerWeek: z.coerce.number().int().min(0).max(14),
  sportType: z.string().max(200).optional(),
  mealsPerDay: z.coerce.number().int().min(2).max(6).default(3),
  likedFoods: z.string().max(1000).optional(),
  dislikedFoods: z.string().max(1000).optional(),
  allergies: z.string().max(1000).optional(),
  intolerances: z.string().max(1000).optional(),
  diet: z.string().max(200).optional(),
  budget: z.string().max(200).optional(),
  schedule: z.string().max(500).optional(),
  constraints: z.string().max(1000).optional(),
  additionalInfo: z.string().max(2000).optional(),
});

export type NutritionProfileInput = z.infer<typeof nutritionProfileSchema>;
