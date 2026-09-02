import { prisma } from "@/lib/prisma";
import {
  createTestimonialAction,
  togglePublishTestimonialAction,
  deleteTestimonialAction,
} from "@/lib/actions/admin/testimonials";

export default async function AdminTemoignagesPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Témoignages</h1>

      <div className="mt-6 flex flex-col gap-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">
                  {t.name} {t.goal && <span className="text-ink-soft/50">— {t.goal}</span>}
                </p>
                <p className="mt-1 text-sm text-ink-soft/70">{t.quote}</p>
                {t.result && (
                  <span className="mt-2 inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-semibold text-brand-red">
                    {t.result}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <form action={togglePublishTestimonialAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="isPublished" value={String(t.isPublished)} />
                  <button className="text-xs font-semibold text-ink-soft hover:text-brand-red">
                    {t.isPublished ? "Dépublier" : "Publier"}
                  </button>
                </form>
                <form action={deleteTestimonialAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="text-xs font-semibold text-red-600 hover:underline">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-sm text-ink-soft/50">Aucun témoignage.</p>
        )}
      </div>

      <form
        action={createTestimonialAction}
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-dashed border-line bg-paper p-4 sm:grid-cols-2"
      >
        <h2 className="col-span-full text-sm font-extrabold uppercase tracking-wide text-ink">
          Ajouter un témoignage
        </h2>
        <input name="name" placeholder="Nom, âge" required className="rounded-md border border-line px-3 py-2 text-sm" />
        <input name="goal" placeholder="Objectif (ex: Perte de poids)" className="rounded-md border border-line px-3 py-2 text-sm" />
        <textarea
          name="quote"
          placeholder="Témoignage"
          required
          rows={3}
          className="col-span-full rounded-md border border-line px-3 py-2 text-sm"
        />
        <input name="result" placeholder="Résultat (ex: -8 kg)" className="rounded-md border border-line px-3 py-2 text-sm" />
        <input name="order" type="number" placeholder="Ordre" defaultValue={0} className="rounded-md border border-line px-3 py-2 text-sm" />
        <button className="col-span-full w-fit rounded-md bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
          Ajouter
        </button>
      </form>
    </div>
  );
}
