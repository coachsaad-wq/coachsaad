import { getContentMap } from "@/lib/services/content";
import { updateContentAction } from "@/lib/actions/admin/content";

const LABELS: Record<string, string> = {
  "header.logoText": "Texte du logo",
  "hero.kicker": "Hero — sur-titre",
  "hero.title": "Hero — titre",
  "hero.subtitle": "Hero — sous-titre",
  "hero.description": "Hero — description",
  "about.title": "À propos — titre",
  "about.description": "À propos — description",
  "about.stat.experience": "Statistique — années d'expérience",
  "about.stat.clients": "Statistique — clients accompagnés",
  "about.stat.satisfaction": "Statistique — % satisfaction",
  "contact.phone": "Téléphone",
  "contact.email": "Email de contact",
  "contact.city": "Ville",
  "social.instagram": "Lien Instagram",
  "social.facebook": "Lien Facebook",
  "social.youtube": "Lien YouTube",
  "social.tiktok": "Lien TikTok",
};

const HIDDEN_SUFFIXES = ["imagePathLeft", "imagePathRight", "imagePath"];

export default async function AdminContenuPage() {
  const map = await getContentMap();
  const keys = Object.keys(map).filter(
    (k) => !HIDDEN_SUFFIXES.some((suffix) => k.endsWith(suffix))
  );

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Contenu</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Modifie les textes du site sans toucher au code. Les photos se gèrent dans la section{" "}
        <a href="/admin/photos" className="text-brand-red underline">
          Photos
        </a>
        .
      </p>

      <form action={updateContentAction} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-line bg-paper p-5 sm:grid-cols-2">
          {keys.map((key) => (
            <div key={key} className={key.includes("description") ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs font-medium text-ink-soft" htmlFor={key}>
                {LABELS[key] ?? key}
              </label>
              {key.includes("description") ? (
                <textarea
                  id={key}
                  name={key}
                  defaultValue={map[key]}
                  rows={3}
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                />
              ) : (
                <input
                  id={key}
                  name={key}
                  defaultValue={map[key]}
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <button className="w-fit rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
