import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { requestAccountDeletionAction, requestDataExportAction } from "@/lib/actions/rgpd";
import { logoutAction } from "@/lib/actions/auth";

export default async function ParametresPage() {
  const user = await requireUser();

  const [deletionRequested, exportRequested] = await Promise.all([
    prisma.consentLog.findFirst({
      where: { userId: user.id, type: "ACCOUNT_DELETION_REQUEST" },
    }),
    prisma.consentLog.findFirst({
      where: { userId: user.id, type: "DATA_EXPORT_REQUEST" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">
          Mes données (RGPD)
        </h2>

        <div className="mt-4 flex max-w-md flex-col gap-3">
          <div className="rounded-xl border border-line p-4">
            <p className="text-sm font-semibold text-ink">Exporter mes données</p>
            <p className="mt-1 text-xs text-ink-soft/60">
              Reçois une copie de toutes tes données personnelles.
            </p>
            {exportRequested ? (
              <p className="mt-3 text-xs font-semibold text-green-600">
                Demande envoyée le {exportRequested.createdAt.toLocaleDateString("fr-FR")}.
              </p>
            ) : (
              <form action={requestDataExportAction} className="mt-3">
                <button className="rounded-md border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:border-brand-red hover:text-brand-red">
                  Demander l&apos;export
                </button>
              </form>
            )}
          </div>

          <div className="rounded-xl border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-700">Supprimer mon compte</p>
            <p className="mt-1 text-xs text-ink-soft/60">
              Cette action est irréversible et supprime définitivement tes données.
            </p>
            {deletionRequested ? (
              <p className="mt-3 text-xs font-semibold text-red-600">
                Demande envoyée le {deletionRequested.createdAt.toLocaleDateString("fr-FR")}.
                Traitement sous 30 jours.
              </p>
            ) : (
              <form action={requestAccountDeletionAction} className="mt-3">
                <button className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-700">
                  Demander la suppression
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <form action={logoutAction}>
        <button className="text-sm font-semibold text-ink-soft hover:text-brand-red">
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
