import { prisma } from "@/lib/prisma";
import { getContentMap, content } from "@/lib/services/content";
import { PhotoSlot } from "@/app/admin/photos/photo-slot";

export default async function AdminPhotosPage() {
  const [c, programs, testimonials] = await Promise.all([
    getContentMap(),
    prisma.programCard.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Photos</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft/60">
        Les photos importées ici sont utilisées telles quelles : aucun recadrage, aucune
        retouche, aucune génération automatique n&apos;est appliquée.
      </p>

      <h2 className="mt-8 text-sm font-extrabold uppercase tracking-wide text-ink">
        Page d&apos;accueil
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PhotoSlot
          targetKey="hero.imagePathLeft"
          label="Hero — photo de gauche"
          currentPath={content(c, "hero.imagePathLeft") || null}
        />
        <PhotoSlot
          targetKey="hero.imagePathRight"
          label="Hero — photo de droite"
          currentPath={content(c, "hero.imagePathRight") || null}
        />
        <PhotoSlot
          targetKey="about.imagePath"
          label="À propos — photo"
          currentPath={content(c, "about.imagePath") || null}
        />
      </div>

      <h2 className="mt-8 text-sm font-extrabold uppercase tracking-wide text-ink">Programmes</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <PhotoSlot
            key={p.id}
            targetKey={`program:${p.slug}`}
            label={p.title}
            currentPath={p.imagePath}
          />
        ))}
      </div>

      <h2 className="mt-8 text-sm font-extrabold uppercase tracking-wide text-ink">
        Témoignages
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <PhotoSlot
            key={t.id}
            targetKey={`testimonial:${t.id}`}
            label={t.name}
            currentPath={t.photoPath}
          />
        ))}
      </div>
    </div>
  );
}
