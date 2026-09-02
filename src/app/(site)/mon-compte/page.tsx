import { LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth";
import { ProfileForm } from "@/app/(site)/mon-compte/profile-form";

export default async function MonComptePage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink">Mon profil</h2>
        <div className="mt-4">
          <ProfileForm
            firstName={user.firstName}
            lastName={user.lastName}
            phone={user.phone}
            email={user.email}
          />
        </div>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand-red"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
