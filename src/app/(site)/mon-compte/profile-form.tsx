"use client";

import { useActionState } from "react";
import { updateAccountAction, type UpdateAccountState } from "@/lib/actions/account";

const initialState: UpdateAccountState = {};

export function ProfileForm({
  firstName,
  lastName,
  phone,
  email,
}: {
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateAccountAction, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-black" htmlFor="firstName">
          Prénom
        </label>
        <input
          id="firstName"
          name="firstName"
          defaultValue={firstName}
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-black" htmlFor="lastName">
          Nom
        </label>
        <input
          id="lastName"
          name="lastName"
          defaultValue={lastName ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-black" htmlFor="phone">
          Téléphone
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={phone ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-black">Email</label>
        <input
          disabled
          value={email}
          className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Profil mis à jour.</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
