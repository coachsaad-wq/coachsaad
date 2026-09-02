"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  clearTestSessionEmail,
  setTestSessionEmail,
} from "@/lib/auth/test-mode";

const registerSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(80),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  phone: z.string().max(30).optional(),
});

export type RegisterState = { error?: string; success?: boolean };

export async function registerClient(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const { firstName, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName } },
    });
    if (error || !data.user) {
      return { error: error?.message ?? "Impossible de créer le compte." };
    }

    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        firstName,
        phone,
        role: "CLIENT",
      },
    });

    return { success: true };
  }

  // MODE TEST — pas de Supabase : on crée directement le profil et on
  // ouvre une session de test (aucun vrai mot de passe n'est vérifié).
  const testUser = await prisma.user.create({
    data: {
      id: `test_${Date.now().toString(36)}`,
      email,
      firstName,
      phone,
      role: "CLIENT",
      isTestAccount: true,
    },
  });
  await setTestSessionEmail(testUser.email);

  return { success: true };
}

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase n'est pas encore configuré (MODE TEST). Utilisez les boutons de connexion de test ci-dessous.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/mon-compte";
  redirect(callbackUrl);
}

/** MODE TEST UNIQUEMENT : connexion instantanée à un compte de seed. */
export async function testLoginAction(email: string, callbackUrl = "/mon-compte") {
  if (isSupabaseConfigured) {
    throw new Error("La connexion de test est désactivée : Supabase est configuré.");
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Compte de test introuvable — avez-vous lancé `npm run db:seed` ?");

  await setTestSessionEmail(user.email);
  redirect(callbackUrl);
}

export async function logoutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } else {
    await clearTestSessionEmail();
  }
  redirect("/");
}
