import "server-only";
import { cookies } from "next/headers";

/**
 * MODE TEST UNIQUEMENT — actif seulement quand Supabase n'est pas encore
 * configuré (voir isSupabaseConfigured). Simule une session via un simple
 * cookie contenant l'email d'un compte de seed. Ce mécanisme est
 * volontairement désactivé dès que Supabase est branché : il ne doit
 * jamais servir de mécanisme d'authentification en production.
 */
const TEST_SESSION_COOKIE = "coachsaad_test_session_email";

export async function getTestSessionEmail(): Promise<string | null> {
  const store = await cookies();
  return store.get(TEST_SESSION_COOKIE)?.value ?? null;
}

export async function setTestSessionEmail(email: string) {
  const store = await cookies();
  store.set(TEST_SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearTestSessionEmail() {
  const store = await cookies();
  store.delete(TEST_SESSION_COOKIE);
}
