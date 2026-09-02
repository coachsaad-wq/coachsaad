"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, testLoginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

function ConnexionForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/mon-compte";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-black">CONNEXION</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Accédez à votre espace client ou à l&apos;administration.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
          <label className="mb-1 block text-sm font-medium text-black" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-black underline">
          Créer un compte
        </Link>
      </p>

      <div className="mt-8 rounded-md border border-dashed border-neutral-300 p-4 text-xs text-neutral-500">
        <p className="font-semibold text-neutral-700">
          MODE TEST — Supabase n&apos;est pas encore configuré
        </p>
        <p className="mt-1">
          Le formulaire ci-dessus nécessite un vrai projet Supabase. En
          attendant, utilisez la connexion de test :
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <form action={testLoginAction.bind(null, "admin@test.coachsaad.local", callbackUrl)}>
            <button className="w-full rounded-md border border-neutral-300 px-3 py-2 text-left font-medium text-neutral-800 hover:border-black">
              Connexion test — Admin
            </button>
          </form>
          <form action={testLoginAction.bind(null, "client@test.coachsaad.local", callbackUrl)}>
            <button className="w-full rounded-md border border-neutral-300 px-3 py-2 text-left font-medium text-neutral-800 hover:border-black">
              Connexion test — Client
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  );
}
