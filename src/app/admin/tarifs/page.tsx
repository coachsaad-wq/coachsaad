import { getPricingConfig } from "@/lib/services/pricing";
import { updatePricingAction } from "@/lib/actions/admin/settings";

export default async function AdminTarifsPage() {
  const pricing = await getPricingConfig();

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Tarifs</h1>

      <form
        action={updatePricingAction}
        className="mt-6 grid max-w-md grid-cols-1 gap-4 rounded-xl border border-line bg-paper p-5"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="price1h">
            Coaching à domicile — 1h (€)
          </label>
          <input
            id="price1h"
            name="price1h"
            type="number"
            step="0.01"
            defaultValue={(pricing.price1h / 100).toFixed(2)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="price1h30">
            Coaching à domicile — 1h30 (€)
          </label>
          <input
            id="price1h30"
            name="price1h30"
            type="number"
            step="0.01"
            defaultValue={(pricing.price1h30 / 100).toFixed(2)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="price2h">
            Coaching à domicile — 2h (€)
          </label>
          <input
            id="price2h"
            name="price2h"
            type="number"
            step="0.01"
            defaultValue={(pricing.price2h / 100).toFixed(2)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="nutritionMonthly">
            Nutrition IA — abonnement mensuel (€)
          </label>
          <input
            id="nutritionMonthly"
            name="nutritionMonthly"
            type="number"
            step="0.01"
            defaultValue={(pricing.nutritionMonthly / 100).toFixed(2)}
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
