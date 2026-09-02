import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Weekday } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seed — MODE TEST : toutes les données créées ci-dessous sont fictives.");

  // --- Tarifs -----------------------------------------------------------
  await prisma.pricingConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // --- Zone de déplacement (50 km, adresse de test) ----------------------
  await prisma.travelZoneConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // --- Horaires de travail ------------------------------------------------
  const weekdayHours: { weekday: Weekday; startTime: string; endTime: string }[] = [
    { weekday: "MONDAY", startTime: "09:00", endTime: "19:00" },
    { weekday: "TUESDAY", startTime: "09:00", endTime: "19:00" },
    { weekday: "WEDNESDAY", startTime: "09:00", endTime: "19:00" },
    { weekday: "THURSDAY", startTime: "09:00", endTime: "19:00" },
    { weekday: "FRIDAY", startTime: "09:00", endTime: "19:00" },
    { weekday: "SATURDAY", startTime: "09:00", endTime: "13:00" },
  ];
  for (const wh of weekdayHours) {
    await prisma.workingHours.upsert({
      where: {
        weekday_startTime_endTime: {
          weekday: wh.weekday,
          startTime: wh.startTime,
          endTime: wh.endTime,
        },
      },
      update: {},
      create: wh,
    });
  }

  // --- Assistant IA ---------------------------------------------------------
  await prisma.assistantConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // --- Contenu (CMS) ------------------------------------------------------
  const content: Record<string, string> = {
    "header.logoText": "COACH SAAD",
    "hero.kicker": "COACHING PERSONNALISÉ",
    "hero.title": "BOUGE TON CORPS, ÉLÈVE TA VIE.",
    "hero.subtitle": "FORCE. CONFIANCE. ÉNERGIE.",
    "hero.description":
      "Un accompagnement sur-mesure pour hommes et femmes qui veulent se sentir bien dans leur corps, gagner en énergie et atteindre leurs objectifs.",
    "about.title": "À PROPOS DE COACH SAAD",
    "about.description":
      "Passionné par le sport et le développement personnel, j'aide chaque personne à transformer son corps et son mindset. Mon approche : humaine, bienveillante et sans jugement.",
    "hero.imagePathLeft": "/images/coach/hero-action.jpg",
    "hero.imagePathRight": "",
    "about.imagePath": "/images/coach/about-portrait.jpg",
    "about.stat.experience": "10",
    "about.stat.clients": "700",
    "about.stat.satisfaction": "95",
    "contact.phone": "06 12 34 56 78",
    "contact.email": "contact@coachsaad.fr",
    "contact.city": "Lille, France",
    "social.instagram": "",
    "social.facebook": "",
    "social.youtube": "",
    "social.tiktok": "",
  };
  for (const [key, value] of Object.entries(content)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  // --- Programmes (6 cartes) ------------------------------------------------
  const programs = [
    {
      slug: "prise-de-muscle",
      title: "PRISE DE MUSCLE",
      description: "Développe ta masse musculaire et gagne en force.",
      icon: "Dumbbell",
      imagePath: "/images/coach/gym-front-curl.jpg",
      order: 1,
    },
    {
      slug: "tonification-sculpt",
      title: "TONIFICATION & SCULPT",
      description: "Sculpte ton corps, affine ta silhouette et gagne en tonicité.",
      icon: "PersonStanding",
      imagePath: null,
      order: 2,
    },
    {
      slug: "perte-de-poids",
      title: "PERTE DE POIDS",
      description: "Perds du poids durablement sans frustration et retrouve ton énergie.",
      icon: "Flame",
      imagePath: "/images/coach/gym-barbell-side.jpg",
      order: 3,
    },
    {
      slug: "bien-etre-mobilite",
      title: "BIEN-ÊTRE & MOBILITÉ",
      description: "Améliore ta souplesse, réduis ton stress et reconnecte-toi à toi.",
      icon: "HeartHandshake",
      imagePath: null,
      order: 4,
    },
    {
      slug: "nutrition",
      title: "NUTRITION",
      description: "Plans alimentaires personnalisés, simples et équilibrés.",
      icon: "Apple",
      imagePath: "/images/coach/program-nutrition.jpg",
      order: 5,
    },
    {
      slug: "cardio-hiit",
      title: "CARDIO & HIIT",
      description: "Brûle des calories, améliore ton endurance et dépasse tes limites.",
      icon: "Timer",
      imagePath: "/images/coach/gym-closeup-arm.jpg",
      order: 6,
    },
  ];
  for (const p of programs) {
    await prisma.programCard.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // --- Témoignages (aucune photo générée — avatars neutres) -----------------
  const testimonials = [
    {
      name: "Inès, 28 ans",
      goal: "Perte de poids",
      quote:
        "Grâce à Coach Saad, j'ai perdu 8 kg et retrouvé confiance en moi. Je me sens enfin bien dans mon corps !",
      result: "-8 kg",
      order: 1,
    },
    {
      name: "Julien, 34 ans",
      goal: "Prise de muscle",
      quote:
        "Des séances variées et efficaces. J'ai pris du muscle et gagné en énergie au quotidien. Je recommande à 100% !",
      result: "+4 kg de muscle",
      order: 2,
    },
    {
      name: "Amélie, 30 ans",
      goal: "Bien-être",
      quote:
        "Un coach à l'écoute, motivant et toujours de bon conseil. Mon bien-être physique et mental s'est transformé.",
      result: "Bien-être retrouvé",
      order: 3,
    },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // --- Comptes de test -----------------------------------------------------
  // MODE TEST (Supabase non configuré) : ces profils sont utilisés par la
  // "connexion de test" (aucun mot de passe réel, voir lib/actions/auth.ts).
  // Une fois Supabase branché, créez les vrais comptes via l'admin
  // (Supabase Auth gère alors les mots de passe, plus jamais ce script).
  const adminEmail = process.env.TEST_ADMIN_EMAIL ?? "admin@test.coachsaad.local";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: "test-admin-coachsaad",
      email: adminEmail,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "Test",
      isTestAccount: true,
    },
  });
  console.log(`Compte admin de test (connexion de test, sans mot de passe) : ${admin.email}`);

  // --- Client de test avec profil nutrition + programme ----------------------
  const clientEmail = "client@test.coachsaad.local";
  const client = await prisma.user.upsert({
    where: { email: clientEmail },
    update: {},
    create: {
      id: "test-client-coachsaad",
      email: clientEmail,
      role: "CLIENT",
      firstName: "Camille",
      lastName: "Test",
      isTestAccount: true,
    },
  });
  console.log(`Compte client de test (connexion de test, sans mot de passe) : ${clientEmail}`);

  const nextEditable = new Date();
  nextEditable.setMonth(nextEditable.getMonth() + 1, 1);
  nextEditable.setHours(0, 0, 0, 0);

  const profile = await prisma.nutritionProfile.upsert({
    where: { userId: client.id },
    update: {},
    create: {
      userId: client.id,
      firstName: "Camille",
      age: 29,
      sex: "FEMME",
      heightCm: 168,
      weightKg: 64,
      goal: "PERTE_DE_POIDS",
      activityLevel: "MODERE",
      sessionsPerWeek: 3,
      sportType: "Renforcement + cardio",
      mealsPerDay: 3,
      likedFoods: "Poulet, riz, légumes, fruits rouges",
      dislikedFoods: "Poisson",
      allergies: "Aucune",
      diet: "Sans restriction",
      nextEditableAt: nextEditable,
    },
  });

  const existingProgram = await prisma.nutritionProgram.findFirst({
    where: { profileId: profile.id },
  });
  if (!existingProgram) {
    await prisma.nutritionProgram.create({
      data: {
        profileId: profile.id,
        calorieEstimate: 1650,
        macros: { proteinesG: 115, glucidesG: 150, lipidesG: 55 },
        meals: [
          {
            jour: "Jour 1",
            repas: [
              { nom: "Petit-déjeuner", description: "Yaourt grec, flocons d'avoine, fruits rouges (~450 kcal)" },
              { nom: "Déjeuner", description: "Poulet grillé, riz complet, légumes vapeur (~600 kcal)" },
              { nom: "Dîner", description: "Œufs, salade, pain complet (~600 kcal)" },
            ],
          },
        ],
        shoppingList: [
          "Blancs de poulet",
          "Riz complet",
          "Yaourt grec",
          "Flocons d'avoine",
          "Fruits rouges",
          "Légumes de saison",
        ],
        advice:
          "Programme de test généré automatiquement (MODE TEST) — objectif perte de poids, ~1650 kcal/jour.",
      },
    });
  }

  await prisma.subscription.upsert({
    where: { id: "seed-nutrition-sub-camille" },
    update: {},
    create: {
      id: "seed-nutrition-sub-camille",
      userId: client.id,
      type: "NUTRITION_IA",
      status: "TEST_MODE",
      currentPeriodEnd: nextEditable,
    },
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
