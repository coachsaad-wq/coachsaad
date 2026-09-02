import { getAssistantConfig } from "@/lib/services/assistant";
import { updateAssistantAction } from "@/lib/actions/admin/settings";

export default async function AdminAssistantPage() {
  const config = await getAssistantConfig();
  const suggestions = Array.isArray(config.suggestions)
    ? (config.suggestions as unknown[]).filter((s): s is string => typeof s === "string")
    : [];

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Assistant IA</h1>

      <form
        action={updateAssistantAction}
        className="mt-6 flex max-w-2xl flex-col gap-4 rounded-xl border border-line bg-paper p-5"
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={config.isActive}
            className="h-4 w-4 accent-brand-red"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-ink">
            Assistant activé
          </label>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            name="name"
            defaultValue={config.name}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="greeting">
            Message d&apos;accueil
          </label>
          <textarea
            id="greeting"
            name="greeting"
            defaultValue={config.greeting}
            rows={2}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="hintText">
            Texte de la bulle flottante (avant ouverture du chat)
          </label>
          <input
            id="hintText"
            name="hintText"
            defaultValue={config.hintText}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="suggestions">
            Suggestions (une par ligne)
          </label>
          <textarea
            id="suggestions"
            name="suggestions"
            defaultValue={suggestions.join("\n")}
            rows={4}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="systemInstructions">
            Instructions de l&apos;assistant
          </label>
          <textarea
            id="systemInstructions"
            name="systemInstructions"
            defaultValue={config.systemInstructions}
            rows={6}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="nutritionPitch">
            Message Nutrition IA
          </label>
          <textarea
            id="nutritionPitch"
            name="nutritionPitch"
            defaultValue={config.nutritionPitch}
            rows={2}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="nutritionCta">
            Texte du bouton
          </label>
          <input
            id="nutritionCta"
            name="nutritionCta"
            defaultValue={config.nutritionCta}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>

        <button className="w-fit rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
