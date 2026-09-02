import { prisma } from "@/lib/prisma";
import { updateProgramAction } from "@/lib/actions/admin/programs";

export default async function AdminProgrammesPage() {
  const programs = await prisma.programCard.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Programmes</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Les photos se modifient depuis la section{" "}
        <a href="/admin/photos" className="text-brand-red underline">
          Photos
        </a>
        .
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {programs.map((p) => (
          <form
            key={p.id}
            action={updateProgramAction}
            className="grid grid-cols-1 items-end gap-3 rounded-xl border border-line bg-paper p-4 md:grid-cols-[1fr_2fr_1fr_5rem_5rem_5rem]"
          >
            <input type="hidden" name="id" value={p.id} />
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Titre</label>
              <input
                name="title"
                defaultValue={p.title}
                className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Description</label>
              <input
                name="description"
                defaultValue={p.description}
                className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Bouton</label>
              <input
                name="ctaLabel"
                defaultValue={p.ctaLabel}
                className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Ordre</label>
              <input
                name="order"
                type="number"
                defaultValue={p.order}
                className="w-full rounded-md border border-line px-2.5 py-1.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isActive" defaultChecked={p.isActive} className="h-4 w-4 accent-brand-red" />
              <label className="text-xs text-ink-soft">Actif</label>
            </div>
            <button className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              Enregistrer
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
