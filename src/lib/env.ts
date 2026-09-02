// Lecture centralisée des variables d'environnement.
// Toute variable externe (paiement, email, IA, cartographie) est
// optionnelle : son absence active automatiquement un fournisseur
// "mock" (MODE TEST), sans jamais bloquer le développement.

function isTestMode(providerEnvVar: string | undefined) {
  return !providerEnvVar || providerEnvVar.trim().length === 0;
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET ?? "",

  ai: {
    apiKey: process.env.AI_API_KEY,
    isMock: isTestMode(process.env.AI_API_KEY),
  },
  payment: {
    secretKey: process.env.PAYMENT_SECRET_KEY,
    publishableKey: process.env.PAYMENT_PUBLISHABLE_KEY,
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET,
    isMock: isTestMode(process.env.PAYMENT_SECRET_KEY),
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM ?? "test@coachsaad.local",
    isMock: isTestMode(process.env.EMAIL_API_KEY),
  },
  maps: {
    apiKey: process.env.MAPS_API_KEY,
    isMock: isTestMode(process.env.MAPS_API_KEY),
  },
};
