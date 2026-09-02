import { env } from "@/lib/env";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Appelle le fournisseur IA (assistant gratuit + Nutrition IA).
 * MODE TEST (pas de AI_API_KEY) : renvoie une réponse générée par un
 * moteur de règles local (mockChatCompletion), avec de vrais conseils
 * généraux — pas juste un texte "Lorem ipsum" — pour que l'interface
 * soit testable de bout en bout sans dépenser de crédits API.
 * MODE PRODUCTION : brancher ici un vrai fournisseur (API Claude,
 * OpenAI...) en utilisant `env.ai.apiKey`.
 */
export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  if (env.ai.isMock) {
    return mockChatCompletion(messages);
  }

  throw new Error(
    "AI_API_KEY est défini mais aucun fournisseur IA réel n'est encore branché. " +
      "Implémentez l'appel API réel dans src/lib/providers/ai.ts avant la mise en production."
  );
}

// ---------------------------------------------------------------------------
// Moteur de règles MODE TEST — assistant gratuit
// ---------------------------------------------------------------------------

const PERSONALIZED_TRIGGERS = [
  "fais-moi mon programme",
  "fais moi mon programme",
  "mon programme alimentaire",
  "mes calories",
  "donne-moi mes calories",
  "mes repas pour la semaine",
  "repas de la semaine",
  "quantités adaptées",
  "quantité adaptée",
  "adapté à mon poids",
  "adaptées à mon poids",
  "programme personnalisé",
  "mon programme nutrition",
];

const KEYWORD_ANSWERS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["perdre du poids", "perte de poids", "maigrir"],
    answer:
      "Pour perdre du poids durablement : crée un léger déficit calorique (environ 300 à 500 kcal/jour sous ta dépense), privilégie les protéines à chaque repas pour préserver ta masse musculaire, bouge régulièrement (marche, cardio, renfo) et dors suffisamment. Évite les régimes trop restrictifs : mieux vaut un déficit modéré tenu dans la durée qu'une restriction sévère abandonnée après 2 semaines.",
  },
  {
    keywords: ["commencer la musculation", "débuter la musculation", "musculation débutant"],
    answer:
      "Pour commencer la musculation : 2 à 3 séances par semaine en full-body, en te concentrant sur les mouvements polyarticulaires (squat, développé, tirage, soulevé de terre light, pompes). Apprends d'abord la technique avec des charges légères, augmente progressivement, et laisse au moins 48h de repos entre deux séances qui sollicitent les mêmes groupes musculaires.",
  },
  {
    keywords: ["manger après le sport", "repas après le sport", "après l'entraînement"],
    answer:
      "Après le sport, vise un repas ou une collation avec des protéines (pour la récupération musculaire) et des glucides (pour reconstituer les réserves d'énergie), dans les 1 à 2h qui suivent. Exemple simple : yaourt grec + fruit + un peu de granola, ou poulet/riz/légumes si c'est l'heure d'un vrai repas.",
  },
  {
    keywords: ["améliorer mon cardio", "améliorer le cardio", "cardio débutant", "endurance"],
    answer:
      "Pour progresser en cardio : alterne des séances à intensité modérée (30-40 min, tu peux encore parler) et des séances plus courtes et intenses (fractionné/HIIT, ex: 30s effort / 30s repos x10). Augmente progressivement la durée ou l'intensité d'une semaine sur l'autre plutôt que de tout donner d'un coup.",
  },
  {
    keywords: ["hiit"],
    answer:
      "Le HIIT (High Intensity Interval Training) alterne des efforts courts très intenses et des phases de récupération courtes. Une séance type : 20 min avec 8 x (30s sprint/effort maximal + 30-60s récupération active). C'est efficace pour le cardio et la dépense calorique, mais 2 séances par semaine suffisent pour laisser le corps récupérer.",
  },
  {
    keywords: ["mobilité", "souplesse", "étirement"],
    answer:
      "Pour la mobilité : 10 à 15 minutes, 3 à 4 fois par semaine, en travaillant les articulations qui te limitent le plus (hanches, chevilles, épaules selon ton activité). Les étirements dynamiques avant l'effort et statiques après l'effort sont complémentaires.",
  },
  {
    keywords: ["récupération", "courbatures", "repos"],
    answer:
      "La récupération est aussi importante que l'entraînement : dors 7-9h, hydrate-toi bien, mange suffisamment de protéines, et prévois au moins 1 à 2 jours de repos complet par semaine. Les courbatures normales s'estompent en 2-3 jours ; une douleur vive ou articulaire mérite d'être surveillée.",
  },
  {
    keywords: ["motivation", "motivé", "abandonner", "démotivé"],
    answer:
      "Pour rester motivé : fixe-toi un objectif précis et réaliste, planifie tes séances comme un rendez-vous non négociable, et mesure tes progrès autrement que sur la balance (photos, performances, énergie au quotidien). Les résultats durables viennent de la régularité, pas de la perfection.",
  },
  {
    keywords: ["prise de muscle", "prendre du muscle", "masse musculaire"],
    answer:
      "Pour prendre du muscle : entraîne-toi en résistance 3 à 5 fois par semaine avec une surcharge progressive (plus de poids, répétitions ou séries au fil du temps), mange en léger surplus calorique avec suffisamment de protéines (environ 1,6 à 2g par kg de poids de corps), et laisse du temps de récupération entre les séances.",
  },
];

function isPersonalizedRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return PERSONALIZED_TRIGGERS.some((t) => lower.includes(t));
}

function mockChatCompletion(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content ?? "";
  const lower = question.toLowerCase();

  if (isPersonalizedRequest(lower)) {
    return (
      "Je peux te donner des conseils généraux gratuitement, mais un vrai programme " +
      "personnalisé (calories précises, repas, quantités selon ton poids et tes objectifs) " +
      "demande de connaître ton profil complet.\n\n" +
      "**NUTRITION IA — 10 €/mois** : pour obtenir un programme personnalisé selon ton " +
      "profil, tes objectifs et ton mode de vie.\n\n" +
      "👉 Découvrir Nutrition IA"
    );
  }

  const match = KEYWORD_ANSWERS.find((entry) =>
    entry.keywords.some((k) => lower.includes(k))
  );
  if (match) return match.answer;

  return (
    "Bonne question ! Je peux t'aider sur le sport, la nutrition générale, la perte de " +
    "poids, la prise de muscle, le cardio, le HIIT, la mobilité, la récupération ou la " +
    "motivation. Précise un peu ta question (par exemple : \"comment perdre du poids ?\" " +
    "ou \"que manger après le sport ?\") et je te donne un vrai conseil."
  );
}
