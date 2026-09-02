import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTestSessionEmail } from "@/lib/auth/test-mode";
import type { Role } from "@/generated/prisma/client";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  isTestAccount: boolean;
};

/**
 * Résout l'utilisateur actuellement connecté.
 * - Supabase configuré : session Supabase Auth réelle.
 * - MODE TEST (Supabase non configuré) : cookie de connexion de test,
 *   uniquement pour permettre de tester le reste de l'application.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = await prisma.user.findUnique({ where: { id: user.id } });
    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      isTestAccount: profile.isTestAccount,
    };
  }

  const testEmail = await getTestSessionEmail();
  if (!testEmail) return null;

  const profile = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    isTestAccount: profile.isTestAccount,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/mon-compte");
  return user;
}
