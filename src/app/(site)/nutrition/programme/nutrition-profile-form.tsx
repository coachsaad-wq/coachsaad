"use client";

import { useActionState } from "react";
import {
  saveNutritionProfileAction,
  type NutritionProfileState,
} from "@/lib/actions/nutrition";
import type { NutritionProfile } from "@/generated/prisma/client";

const initialState: NutritionProfileState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-black" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
      />
    </div>
  );
}

export function NutritionProfileForm({ profile }: { profile: NutritionProfile | null }) {
  const [state, formAction, pending] = useActionState(saveNutritionProfileAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" defaultValue={profile?.firstName} required />
        <Field label="Âge" name="age" type="number" defaultValue={profile?.age} required />

        <div>
          <label className="mb-1 block text-sm font-medium text-black" htmlFor="sex">
            Sexe
          </label>
          <select
            id="sex"
            name="sex"
            defaultValue={profile?.sex ?? "HOMME"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="HOMME">Homme</option>
            <option value="FEMME">Femme</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>

        <Field label="Taille (cm)" name="heightCm" type="number" defaultValue={profile?.heightCm} required />
        <Field label="Poids (kg)" name="weightKg" type="number" defaultValue={profile?.weightKg} required />

        <div>
          <label className="mb-1 block text-sm font-medium text-black" htmlFor="goal">
            Objectif
          </label>
          <select
            id="goal"
            name="goal"
            defaultValue={profile?.goal ?? "MAINTIEN"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="PERTE_DE_POIDS">Perte de poids</option>
            <option value="PRISE_DE_MUSCLE">Prise de muscle</option>
            <option value="MAINTIEN">Maintien</option>
            <option value="BIEN_ETRE">Bien-être</option>
            <option value="PERFORMANCE">Performance</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black" htmlFor="activityLevel">
            Niveau d&apos;activité
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            defaultValue={profile?.activityLevel ?? "MODERE"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="SEDENTAIRE">Sédentaire</option>
            <option value="LEGER">Léger</option>
            <option value="MODERE">Modéré</option>
            <option value="ELEVE">Élevé</option>
            <option value="TRES_ELEVE">Très élevé</option>
          </select>
        </div>

        <Field
          label="Séances / semaine"
          name="sessionsPerWeek"
          type="number"
          defaultValue={profile?.sessionsPerWeek}
          required
        />
        <Field label="Type de sport" name="sportType" defaultValue={profile?.sportType} />
        <Field
          label="Repas / jour"
          name="mealsPerDay"
          type="number"
          defaultValue={profile?.mealsPerDay ?? 3}
          required
        />
        <Field label="Budget alimentaire" name="budget" defaultValue={profile?.budget} />
        <Field label="Régime alimentaire" name="diet" defaultValue={profile?.diet} />
        <Field label="Horaires" name="schedule" defaultValue={profile?.schedule} />
      </div>

      <Field label="Aliments appréciés" name="likedFoods" defaultValue={profile?.likedFoods} />
      <Field label="Aliments détestés" name="dislikedFoods" defaultValue={profile?.dislikedFoods} />
      <Field label="Allergies" name="allergies" defaultValue={profile?.allergies} />
      <Field label="Intolérances" name="intolerances" defaultValue={profile?.intolerances} />
      <Field label="Contraintes" name="constraints" defaultValue={profile?.constraints} />
      <Field
        label="Informations complémentaires"
        name="additionalInfo"
        defaultValue={profile?.additionalInfo}
      />

      {state.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-md bg-brand-red px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark disabled:opacity-60 sm:w-fit"
      >
        {pending
          ? "Génération du programme..."
          : profile
            ? "Mettre à jour et régénérer mon programme"
            : "Générer mon programme"}
      </button>
    </form>
  );
}
