"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  Users,
  Sparkles,
  CreditCard,
  Receipt,
  Dumbbell,
  MessageSquareQuote,
  ImageIcon,
  FileText,
  Tag,
  MapPin,
  Settings,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/admin/calendrier", label: "Calendrier & horaires", icon: CalendarClock },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/nutrition", label: "Nutrition IA", icon: Sparkles },
  { href: "/admin/abonnements", label: "Abonnements", icon: CreditCard },
  { href: "/admin/paiements", label: "Paiements", icon: Receipt },
  { href: "/admin/programmes", label: "Programmes", icon: Dumbbell },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/photos", label: "Photos", icon: ImageIcon },
  { href: "/admin/contenu", label: "Contenu", icon: FileText },
  { href: "/admin/tarifs", label: "Tarifs", icon: Tag },
  { href: "/admin/zone", label: "Zone de déplacement", icon: MapPin },
  { href: "/admin/assistant", label: "Assistant IA", icon: Sparkles },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
              isActive ? "bg-brand-red text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
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
