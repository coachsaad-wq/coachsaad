"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { NAV_LINKS } from "@/components/marketing/nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-ink"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div
        className={clsx(
          "fixed inset-x-0 top-20 z-40 border-t border-line bg-paper shadow-lg transition-[max-height,opacity] duration-200 overflow-hidden",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-mist"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rendez-vous"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-brand-red px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
          >
            Prendre rendez-vous
          </Link>
        </nav>
      </div>
    </div>
  );
}
