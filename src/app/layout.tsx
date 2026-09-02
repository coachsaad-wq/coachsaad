import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = {
  default: "Coach Saad — Coaching sportif personnalisé",
  template: "%s — Coach Saad",
};
const description =
  "Coaching personnalisé, sport, nutrition et bien-être à Lille. Coaching à domicile et Nutrition IA.";

// Le site est entièrement piloté par la base de données (contenu
// éditable en admin, disponibilités, sessions utilisateur) : tout est
// rendu à la demande plutôt que pré-généré au build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Coach Saad",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
