"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerClient, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(registerClient, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-black">CRÉER UN COMPTE</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Rejoignez Coach Saad pour réserver vos séances et accéder à Nutrition IA.
      </p>

      {state.success ? (
        <div className="mt-8 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Compte créé avec succès.{" "}
          <Link href="/mon-compte" className="font-semibold underline">
            Accéder à mon espace
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="firstName">
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="phone">
              Téléphone (optionnel)
            </label>
            <input
              id="phone"
              name="phone"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
            <p className="mt-1 text-xs text-neutral-500">
              MODE TEST : sans Supabase configuré, ce mot de passe n&apos;est pas
              encore vérifié à la connexion.
            </p>
          </div>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-black underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
