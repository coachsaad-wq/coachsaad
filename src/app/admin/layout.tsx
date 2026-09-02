import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { logoutAction } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminMobileNav adminEmail={admin.email} />

      <aside className="hidden w-64 shrink-0 flex-col bg-ink p-4 md:flex">
        <Link href="/admin" className="mb-6 px-2 text-sm font-extrabold uppercase tracking-wide text-white">
          Coach Saad <span className="text-brand-red">Admin</span>
        </Link>
        <AdminNav />
        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4">
          <p className="px-2 text-xs text-white/40">{admin.email}</p>
          <form action={logoutAction}>
            <button className="flex items-center gap-2 px-2 text-sm text-white/70 hover:text-white">
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </form>
          <Link href="/" className="px-2 text-xs text-white/40 hover:text-white/70">
            ← Retour au site
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-mist p-6 md:p-10">{children}</main>
    </div>
  );
}
