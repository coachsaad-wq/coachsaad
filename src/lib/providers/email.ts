import { env } from "@/lib/env";

export type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

export type EmailTemplate =
  | "account_created"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_reminder"
  | "payment_received"
  | "subscription_started"
  | "subscription_renewed";

/**
 * Envoie un email transactionnel.
 * MODE TEST (pas de EMAIL_API_KEY) : n'envoie rien, log dans la console
 * pour permettre de vérifier le contenu pendant les tests.
 * MODE PRODUCTION : brancher ici un vrai fournisseur (Resend, SendGrid...).
 */
export async function sendEmail(input: EmailInput): Promise<{ isSimulated: boolean }> {
  if (env.email.isMock) {
    console.log("[EMAIL - MODE TEST] Aucun email réel envoyé.");
    console.log(`  À: ${input.to}`);
    console.log(`  Sujet: ${input.subject}`);
    console.log(`  Contenu: ${input.html.slice(0, 200)}...`);
    return { isSimulated: true };
  }

  throw new Error(
    "EMAIL_API_KEY est défini mais aucun fournisseur d'email réel n'est encore branché. " +
      "Implémentez l'appel API réel dans src/lib/providers/email.ts avant la mise en production."
  );
}

export function renderTemplate(template: EmailTemplate, data: Record<string, string>) {
  const templates: Record<EmailTemplate, { subject: string; html: (d: Record<string, string>) => string }> = {
    account_created: {
      subject: "Bienvenue chez Coach Saad",
      html: (d) => `<p>Bonjour ${d.firstName}, votre compte a bien été créé.</p>`,
    },
    booking_confirmed: {
      subject: "Votre réservation est confirmée",
      html: (d) => `<p>Bonjour ${d.firstName}, votre séance du ${d.date} à ${d.time} est confirmée.</p>`,
    },
    booking_cancelled: {
      subject: "Votre réservation a été annulée",
      html: (d) => `<p>Bonjour ${d.firstName}, votre séance du ${d.date} a été annulée.</p>`,
    },
    booking_reminder: {
      subject: "Rappel : votre séance approche",
      html: (d) => `<p>Bonjour ${d.firstName}, rappel de votre séance le ${d.date} à ${d.time}.</p>`,
    },
    payment_received: {
      subject: "Paiement reçu",
      html: (d) => `<p>Bonjour ${d.firstName}, nous avons bien reçu votre paiement de ${d.amount}.</p>`,
    },
    subscription_started: {
      subject: "Bienvenue sur Nutrition IA",
      html: (d) => `<p>Bonjour ${d.firstName}, votre abonnement Nutrition IA (10€/mois) est actif.</p>`,
    },
    subscription_renewed: {
      subject: "Votre abonnement Nutrition IA a été renouvelé",
      html: (d) => `<p>Bonjour ${d.firstName}, votre abonnement a été renouvelé. Vous pouvez mettre à jour votre profil.</p>`,
    },
  };

  const t = templates[template];
  return { subject: t.subject, html: t.html(data) };
}
