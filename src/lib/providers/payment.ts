import { env } from "@/lib/env";

export type CheckoutSessionInput = {
  amountCents: number;
  currency: string;
  description: string;
  customerEmail: string;
  metadata: Record<string, string>;
};

export type CheckoutSessionResult = {
  sessionId: string;
  redirectUrl: string;
  isSimulated: boolean;
};

/**
 * Crée une session de paiement.
 * MODE TEST (pas de PAYMENT_SECRET_KEY) : simule un paiement réussi
 * instantanément et redirige directement vers la page de confirmation.
 * MODE PRODUCTION : brancher ici un vrai fournisseur (Stripe...).
 * L'architecture (montant en centimes, webhook, purpose) est déjà
 * prête pour Stripe Checkout + Billing (abonnements récurrents).
 */
export async function createCheckoutSession(
  _input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  if (env.payment.isMock) {
    const sessionId = `test_session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    return {
      sessionId,
      redirectUrl: `${env.siteUrl}/rendez-vous/confirmation?session=${sessionId}&mode=test`,
      isSimulated: true,
    };
  }

  throw new Error(
    "PAYMENT_SECRET_KEY est défini mais aucun fournisseur de paiement réel n'est encore branché. " +
      "Implémentez l'appel API réel (ex: Stripe Checkout) dans src/lib/providers/payment.ts avant la mise en production."
  );
}

export type SubscriptionCheckoutResult = CheckoutSessionResult & {
  providerSubscriptionId: string | null;
};

/**
 * Crée une session d'abonnement récurrent (Nutrition IA, 10€/mois).
 */
export async function createSubscriptionCheckout(
  input: CheckoutSessionInput
): Promise<SubscriptionCheckoutResult> {
  if (env.payment.isMock) {
    const base = await createCheckoutSession(input);
    return {
      ...base,
      redirectUrl: `${env.siteUrl}/nutrition/abonnement/confirmation?session=${base.sessionId}&mode=test`,
      providerSubscriptionId: null,
    };
  }

  throw new Error(
    "PAYMENT_SECRET_KEY est défini mais aucun fournisseur de paiement réel n'est encore branché pour les abonnements. " +
      "Implémentez Stripe Billing dans src/lib/providers/payment.ts avant la mise en production."
  );
}

/**
 * Vérifie la signature d'un webhook de paiement.
 * MODE TEST : accepte tout (aucun webhook réel n'est configuré).
 */
export function verifyWebhookSignature(_rawBody: string, _signature: string | null): boolean {
  if (env.payment.isMock) return true;

  throw new Error(
    "PAYMENT_WEBHOOK_SECRET est défini mais la vérification de signature réelle n'est pas encore implémentée."
  );
}
