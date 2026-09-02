import { CheckCircle2, AlertTriangle } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function StatusRow({ label, isReal }: { label: string; isReal: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-0">
      <span className="text-sm text-ink-soft/80">{label}</span>
      {isReal ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
          <CheckCircle2 className="h-4 w-4" /> Fournisseur réel connecté
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
          <AlertTriangle className="h-4 w-4" /> MODE TEST (simulé)
        </span>
      )}
    </div>
  );
}

export default async function AdminParametresPage() {
  const admin = await requireAdmin();

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-tight text-ink">Paramètres</h1>

      <div className="mt-6 max-w-xl rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Statut des intégrations
        </h2>
        <div className="mt-3">
          <StatusRow label="Authentification (Supabase Auth)" isReal={isSupabaseConfigured} />
          <StatusRow label="Base de données Supabase" isReal={isSupabaseConfigured} />
          <StatusRow label="Paiement" isReal={!env.payment.isMock} />
          <StatusRow label="Emails transactionnels" isReal={!env.email.isMock} />
          <StatusRow label="Intelligence artificielle" isReal={!env.ai.isMock} />
          <StatusRow label="Cartographie / distance" isReal={!env.maps.isMock} />
        </div>
        <p className="mt-4 text-xs text-ink-soft/50">
          Renseignez les variables d&apos;environnement correspondantes pour passer en
          production, sans avoir à modifier l&apos;application (voir .env.example).
        </p>
      </div>

      <div className="mt-6 max-w-xl rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Compte administrateur
        </h2>
        <p className="mt-2 text-sm text-ink-soft/70">{admin.email}</p>
        {admin.isTestAccount && (
          <p className="mt-1 text-xs text-amber-600">
            Compte de test — à remplacer par un vrai compte administrateur avant la mise en
            production.
          </p>
        )}
      </div>
    </div>
  );
}
