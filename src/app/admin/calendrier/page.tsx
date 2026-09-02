import { prisma } from "@/lib/prisma";
import {
  addWorkingHoursAction,
  removeWorkingHoursAction,
  addBlockedSlotAction,
  removeBlockedSlotAction,
} from "@/lib/actions/admin/schedule";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

export default async function AdminCalendrierPage() {
  const [workingHours, blockedSlots] = await Promise.all([
    prisma.workingHours.findMany({ orderBy: [{ weekday: "asc" }, { startTime: "asc" }] }),
    prisma.blockedSlot.findMany({ orderBy: { startAt: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">
        Calendrier & horaires
      </h1>

      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Horaires de disponibilité
        </h2>

        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="px-4 py-3">Jour</th>
                <th className="px-4 py-3">Début</th>
                <th className="px-4 py-3">Fin</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {workingHours.map((wh) => (
                <tr key={wh.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">{WEEKDAY_LABELS[wh.weekday]}</td>
                  <td className="px-4 py-3">{wh.startTime}</td>
                  <td className="px-4 py-3">{wh.endTime}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={removeWorkingHoursAction}>
                      <input type="hidden" name="id" value={wh.id} />
                      <button className="text-xs font-semibold text-red-600 hover:underline">
                        Supprimer
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          action={addWorkingHoursAction}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-line bg-paper p-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Jour</label>
            <select
              name="weekday"
              className="rounded-md border border-line px-3 py-2 text-sm"
              required
            >
              {Object.entries(WEEKDAY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Début</label>
            <input type="time" name="startTime" required className="rounded-md border border-line px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Fin</label>
            <input type="time" name="endTime" required className="rounded-md border border-line px-3 py-2 text-sm" />
          </div>
          <button className="rounded-md bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Ajouter
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Créneaux bloqués / congés
        </h2>

        <div className="mt-4 flex flex-col gap-2">
          {blockedSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-md border border-line bg-paper px-4 py-2.5 text-sm"
            >
              <span>
                {slot.startAt.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                {" → "}
                {slot.endAt.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                {slot.reason && <span className="text-ink-soft/50"> — {slot.reason}</span>}
              </span>
              <form action={removeBlockedSlotAction}>
                <input type="hidden" name="id" value={slot.id} />
                <button className="text-xs font-semibold text-red-600 hover:underline">
                  Supprimer
                </button>
              </form>
            </div>
          ))}
          {blockedSlots.length === 0 && (
            <p className="text-sm text-ink-soft/50">Aucun créneau bloqué.</p>
          )}
        </div>

        <form
          action={addBlockedSlotAction}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-line bg-paper p-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Début</label>
            <input type="datetime-local" name="startAt" required className="rounded-md border border-line px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Fin</label>
            <input type="datetime-local" name="endAt" required className="rounded-md border border-line px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Raison</label>
            <input name="reason" placeholder="Congés..." className="rounded-md border border-line px-3 py-2 text-sm" />
          </div>
          <button className="rounded-md bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Bloquer
          </button>
        </form>
      </section>
    </div>
  );
}
