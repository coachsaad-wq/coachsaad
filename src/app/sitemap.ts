import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const ROUTES = [
  "",
  "/sport",
  "/nutrition",
  "/bien-etre",
  "/programmes",
  "/a-propos",
  "/contact",
  "/rendez-vous",
  "/connexion",
  "/inscription",
  "/nutrition/abonnement",
  "/confidentialite",
  "/mentions-legales",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
