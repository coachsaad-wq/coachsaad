import Link from "next/link";
import { Calendar } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { NAV_LINKS } from "@/components/marketing/nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wide text-ink-soft hover:text-brand-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/rendez-vous"
            className="inline-flex items-center gap-2 rounded-md bg-brand-red px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
          >
            <Calendar className="h-4 w-4" />
            Prendre rendez-vous
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
