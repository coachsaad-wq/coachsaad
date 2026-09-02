"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/lib/actions/auth";

export function AdminMobileNav({ adminEmail }: { adminEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-ink px-4 py-3 md:hidden">
      <Link href="/admin" className="text-sm font-extrabold uppercase tracking-wide text-white">
        Coach Saad <span className="text-brand-red">Admin</span>
      </Link>
      <button
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-white"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-[52px] z-50 overflow-y-auto bg-ink p-4">
          <AdminNav />
          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <p className="px-2 text-xs text-white/40">{adminEmail}</p>
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
        </div>
      )}
    </div>
  );
}
