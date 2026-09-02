import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  TiktokIcon,
} from "@/components/marketing/social-icons";
import { getContentMap, content } from "@/lib/services/content";

const QUICK_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/sport", label: "Sport" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/bien-etre", label: "Bien-être" },
];

const SECONDARY_LINKS = [
  { href: "/programmes", label: "Programmes" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/rendez-vous", label: "Prendre rendez-vous" },
];

export async function Footer() {
  const c = await getContentMap();
  const phone = content(c, "contact.phone", "—");
  const email = content(c, "contact.email", "—");
  const city = content(c, "contact.city", "France");

  const socials = [
    { href: content(c, "social.instagram"), Icon: InstagramIcon, label: "Instagram" },
    { href: content(c, "social.facebook"), Icon: FacebookIcon, label: "Facebook" },
    { href: content(c, "social.youtube"), Icon: YoutubeIcon, label: "YouTube" },
    { href: content(c, "social.tiktok"), Icon: TiktokIcon, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Coaching personnalisé — sport, nutrition et bien-être pour hommes et
            femmes, à Lille et à domicile.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Liens rapides
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
            &nbsp;
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {SECONDARY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Contact
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-red" /> {phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-red" /> {email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-red" /> {city}
            </li>
          </ul>
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socials.map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-brand-red"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Coach Saad. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
