"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  User,
  ClipboardList,
  UtensilsCrossed,
  ShoppingCart,
  Target,
  History,
  CalendarDays,
  CreditCard,
  Settings,
} from "lucide-react";

const LINKS = [
  { href: "/mon-compte", label: "Mon profil", icon: User, exact: true },
  { href: "/mon-compte/programme", label: "Mon programme", icon: ClipboardList },
  { href: "/mon-compte/repas", label: "Mes repas", icon: UtensilsCrossed },
  { href: "/mon-compte/liste-de-courses", label: "Ma liste de courses", icon: ShoppingCart },
  { href: "/mon-compte/objectifs", label: "Mes objectifs", icon: Target },
  { href: "/mon-compte/historique", label: "Mon historique", icon: History },
  { href: "/mon-compte/reservations", label: "Mes réservations", icon: CalendarDays },
  { href: "/mon-compte/abonnement", label: "Mon abonnement", icon: CreditCard },
  { href: "/mon-compte/parametres", label: "Paramètres", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium",
              isActive ? "bg-brand-red/10 text-brand-red" : "text-ink-soft hover:bg-mist"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
