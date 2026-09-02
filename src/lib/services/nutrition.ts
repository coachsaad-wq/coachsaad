import type { ActivityLevel, Goal, Sex } from "@/generated/prisma/client";
import { chatCompletion } from "@/lib/providers/ai";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTAIRE: 1.2,
  LEGER: 1.375,
  MODERE: 1.55,
  ELEVE: 1.725,
  TRES_ELEVE: 1.9,
};

const GOAL_ADJUSTMENT: Record<Goal, number> = {
  PERTE_DE_POIDS: -0.15,
  PRISE_DE_MUSCLE: 0.12,
  MAINTIEN: 0,
  BIEN_ETRE: -0.05,
  PERFORMANCE: 0.08,
};

/**
 * Estimation calorique via la formule de Mifflin-St Jeor (référence
 * standard, non spécifique à un fournisseur IA). Le calcul numérique
 * reste donc fiable même en MODE TEST (sans clé IA).
 */
export function estimateCalories(profile: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}) {
  const sexOffset = profile.sex === "HOMME" ? 5 : profile.sex === "FEMME" ? -161 : -78;
  const bmr =
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexOffset;

  const tdee = bmr * ACTIVITY_MULTIPLIER[profile.activityLevel];
  const adjusted = tdee * (1 + GOAL_ADJUSTMENT[profile.goal]);
  const calories = Math.round(adjusted / 10) * 10;

  const proteinPerKg = profile.goal === "PRISE_DE_MUSCLE" ? 2 : 1.8;
  const proteinG = Math.round(profile.weightKg * proteinPerKg);
  const proteinKcal = proteinG * 4;

  const fatKcal = calories * 0.28;
  const fatG = Math.round(fatKcal / 9);

  const carbsKcal = Math.max(calories - proteinKcal - fatKcal, 0);
  const carbsG = Math.round(carbsKcal / 4);

  return {
    calories,
    macros: { proteinesG: proteinG, glucidesG: carbsG, lipidesG: fatG },
  };
}

export function nextMonthlyEditDate(from: Date = new Date()): Date {
  const next = new Date(from.getFullYear(), from.getMonth() + 1, 1, 0, 0, 0, 0);
  return next;
}

export type NutritionProfileInput = {
  firstName: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  sessionsPerWeek: number;
  sportType?: string | null;
  mealsPerDay: number;
  likedFoods?: string | null;
  dislikedFoods?: string | null;
  allergies?: string | null;
  intolerances?: string | null;
  diet?: string | null;
  budget?: string | null;
  schedule?: string | null;
  constraints?: string | null;
  additionalInfo?: string | null;
};

export type GeneratedProgram = {
  calorieEstimate: number;
  macros: { proteinesG: number; glucidesG: number; lipidesG: number };
  meals: { jour: string; repas: { nom: string; description: string }[] }[];
  shoppingList: string[];
  advice: string;
};

/**
 * Génère un programme nutrition complet à partir du profil.
 * Le calcul calorique/macros vient toujours de la formule ci-dessus.
 * Les repas, la liste de courses et les conseils textuels passent par
 * le fournisseur IA (mock déterministe en MODE TEST, vrai modèle en prod).
 */
export async function generateNutritionProgram(
  profile: NutritionProfileInput
): Promise<GeneratedProgram> {
  const { calories, macros } = estimateCalories(profile);

  const prompt = buildNutritionPrompt(profile, calories, macros);
  const raw = await chatCompletion([
    {
      role: "system",
      content:
        "Tu es un assistant nutrition. Réponds uniquement en JSON valide, sans texte autour, avec le format: " +
        '{"meals": [{"jour": string, "repas": [{"nom": string, "description": string}]}], "shoppingList": string[], "advice": string}',
    },
    { role: "user", content: prompt },
  ]);

  const parsed = tryParseJson(raw);
  if (parsed) {
    return {
      calorieEstimate: calories,
      macros,
      meals: parsed.meals,
      shoppingList: parsed.shoppingList,
      advice: parsed.advice,
    };
  }

  // Le mock ai.ts ne renvoie pas de JSON (réponses conversationnelles) :
  // on utilise un plan déterministe basé sur le profil en MODE TEST.
  return buildFallbackProgram(profile, calories, macros);
}

function buildNutritionPrompt(
  profile: NutritionProfileInput,
  calories: number,
  macros: { proteinesG: number; glucidesG: number; lipidesG: number }
) {
  return [
    `Profil: ${profile.firstName}, ${profile.age} ans, ${profile.sex}, ${profile.heightCm}cm, ${profile.weightKg}kg.`,
    `Objectif: ${profile.goal}. Activité: ${profile.activityLevel}, ${profile.sessionsPerWeek} séances/semaine (${profile.sportType ?? "non précisé"}).`,
    `Cible: ${calories} kcal/jour, ${macros.proteinesG}g protéines, ${macros.glucidesG}g glucides, ${macros.lipidesG}g lipides.`,
    `${profile.mealsPerDay} repas par jour.`,
    profile.likedFoods ? `Aime: ${profile.likedFoods}.` : "",
    profile.dislikedFoods ? `N'aime pas: ${profile.dislikedFoods}.` : "",
    profile.allergies ? `Allergies: ${profile.allergies}.` : "",
    profile.intolerances ? `Intolérances: ${profile.intolerances}.` : "",
    profile.diet ? `Régime: ${profile.diet}.` : "",
    profile.budget ? `Budget: ${profile.budget}.` : "",
    "Propose un plan sur 3 jours, une liste de courses et des conseils généraux (pas un avis médical).",
  ]
    .filter(Boolean)
    .join(" ");
}

type ParsedNutritionPlan = {
  meals: GeneratedProgram["meals"];
  shoppingList: string[];
  advice: string;
};

function tryParseJson(raw: string): ParsedNutritionPlan | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.meals) && Array.isArray(parsed.shoppingList)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function buildFallbackProgram(
  profile: NutritionProfileInput,
  calories: number,
  macros: { proteinesG: number; glucidesG: number; lipidesG: number }
): GeneratedProgram {
  const perMealKcal = Math.round(calories / profile.mealsPerDay);
  const mealNames = [
    "Petit-déjeuner",
    "Déjeuner",
    "Collation",
    "Dîner",
    "Collation du soir",
  ].slice(0, profile.mealsPerDay);

  const days = ["Jour 1", "Jour 2", "Jour 3"];
  const meals = days.map((jour) => ({
    jour,
    repas: mealNames.map((nom) => ({
      nom,
      description: `~${perMealKcal} kcal — source de protéines maigres, féculents complets et légumes, adapté à un objectif ${goalLabel(
        profile.goal
      )}. ${profile.dislikedFoods ? `Sans ${profile.dislikedFoods}.` : ""}`.trim(),
    })),
  }));

  const shoppingList = [
    "Sources de protéines (poulet, poisson, œufs, légumineuses selon préférences)",
    "Féculents complets (riz complet, patate douce, avoine)",
    "Légumes variés de saison",
    "Fruits frais",
    "Bonnes graisses (huile d'olive, oléagineux, avocat)",
    "Produits laitiers ou alternatives végétales",
  ];

  const advice =
    `Ce programme est généré automatiquement à partir de ton profil (${calories} kcal/jour, ` +
    `${macros.proteinesG}g protéines / ${macros.glucidesG}g glucides / ${macros.lipidesG}g lipides). ` +
    "Bois suffisamment d'eau, répartis les protéines sur la journée, et ajuste les quantités selon ta " +
    "faim et ton énergie. Ce n'est pas un avis médical : consulte un professionnel de santé en cas de " +
    "besoin spécifique (grossesse, pathologie, trouble alimentaire...).";

  return { calorieEstimate: calories, macros, meals, shoppingList, advice };
}

function goalLabel(goal: Goal) {
  switch (goal) {
    case "PERTE_DE_POIDS":
      return "de perte de poids";
    case "PRISE_DE_MUSCLE":
      return "de prise de muscle";
    case "PERFORMANCE":
      return "de performance";
    case "BIEN_ETRE":
      return "de bien-être";
    default:
      return "de maintien";
  }
}
