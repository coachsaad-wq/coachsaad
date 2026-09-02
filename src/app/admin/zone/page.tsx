import { getTravelZoneConfig } from "@/lib/services/distance";
import { updateZoneAction } from "@/lib/actions/admin/settings";

export default async function AdminZonePage() {
  const zone = await getTravelZoneConfig();

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">
        Zone de déplacement
      </h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Rayon maximum de déplacement pour le coaching à domicile. Valeur initiale : 50 km.
      </p>

      <form
        action={updateZoneAction}
        className="mt-6 grid max-w-md grid-cols-1 gap-4 rounded-xl border border-line bg-paper p-5"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="originLabel">
            Adresse de départ
          </label>
          <input
            id="originLabel"
            name="originLabel"
            defaultValue={zone.originLabel}
            className="w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor="radiusKm">
            Rayon maximum (km)
          </label>
          <input
            id="radiusKm"
            name="radiusKm"
            type="number"
            defaultValue={zone.radiusKm}
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
