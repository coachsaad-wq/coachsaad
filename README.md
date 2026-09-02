# Coach Saad — Site web

Site vitrine + application (réservation, Nutrition IA, espace client,
administration) pour Coach Saad. Projet **indépendant** de tout autre
projet : nouveau dépôt, à connecter à un nouveau compte Vercel et un
nouveau projet Supabase appartenant au client.

Stack : Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7
· PostgreSQL (Supabase en production) · Supabase Auth.

## MODE TEST par défaut

Le projet fonctionne entièrement sans aucune clé réelle. Tant que les
variables d'environnement externes (Supabase, IA, paiement, email,
cartographie) ne sont pas renseignées, l'application bascule
automatiquement sur des fournisseurs simulés :

| Service | MODE TEST | Fichier |
|---|---|---|
| Authentification | Cookie de connexion de test (comptes de seed) | `src/lib/auth/session.ts`, `src/lib/auth/test-mode.ts` |
| Base de données | Postgres local (`npm run db:dev`) | `prisma/schema.prisma` |
| IA (assistant + Nutrition) | Réponses générées par un moteur de règles local | `src/lib/providers/ai.ts` |
| Paiement | Paiement simulé, toujours réussi | `src/lib/providers/payment.ts` |
| Email | Loggué en console, rien n'est envoyé | `src/lib/providers/email.ts` |
| Cartographie / distance | Distance à vol d'oiseau (Haversine), géocodage simulé | `src/lib/providers/maps.ts` |

Aucune de ces valeurs simulées n'affecte le calcul métier réel (prix,
calories, distance) : seule la source des données change.

## Installation locale

```bash
npm install

# Base de données locale (Postgres, aucune clé requise)
npm run db:dev          # démarre un Postgres local, affiche DATABASE_URL
# copiez l'URL affichée dans .env (voir .env.example)

npm run db:migrate       # applique le schéma
npm run db:seed          # crée les données de démonstration + comptes de test

npm run dev               # http://localhost:3000
```

Comptes de test créés par le seed (connexion de test, sans mot de
passe, visible sur `/connexion` tant que Supabase n'est pas configuré) :

- Admin : `admin@test.coachsaad.local`
- Client : `client@test.coachsaad.local`

## Variables d'environnement

Copiez `.env.example` vers `.env`. Toutes les variables externes
peuvent rester vides en développement (voir tableau MODE TEST
ci-dessus). Détail des variables sensibles :

- `SUPABASE_SERVICE_ROLE_KEY` — accès total à la base, **strictement
  côté serveur**, ne jamais préfixer par `NEXT_PUBLIC_`, ne jamais
  exposer au navigateur ni committer.
- `NEXT_PUBLIC_SITE_URL` — utilisée partout où l'application a besoin
  de sa propre URL (jamais codée en dur). Pour la démo Vercel :
  `https://coach-saad.vercel.app`.

## Connecter le nouveau Supabase du client

1. Créez un nouveau projet sur [supabase.com](https://supabase.com)
   (compte du client, pas un ancien projet).
2. Dans **Project Settings → Database**, copiez la connection string
   (mode "Session") dans `DATABASE_URL`.
3. Dans **Project Settings → API**, copiez `Project URL`,
   `anon public key` et `service_role key` dans
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Appliquez le schéma :
   ```bash
   npx prisma migrate deploy
   ```
5. Dans le **SQL Editor** de Supabase, exécutez
   `supabase/sql/001_auth_and_rls.sql` (trigger de création de profil
   à l'inscription + policies RLS sur toutes les tables).
6. (Optionnel) Créez un bucket Storage pour les photos si vous
   souhaitez migrer l'upload de `/admin/photos` du disque local vers
   Supabase Storage (voir commentaire dans
   `src/lib/actions/admin/photos.ts`).
7. Redémarrez l'application : l'authentification bascule
   automatiquement sur Supabase Auth + RLS dès que les 3 variables
   `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` sont
   renseignées (voir `src/lib/supabase/config.ts`).

## Déployer sur le nouveau Vercel du client

1. Poussez ce dépôt sur le nouveau GitHub du client (dépôt privé
   `coachsaad`) :
   ```bash
   git remote add origin <URL_DU_NOUVEAU_DEPOT_GITHUB>
   git push -u origin main
   ```
2. Sur [vercel.com](https://vercel.com), connectez-vous avec le
   **nouveau compte Vercel du client** → *Add New → Project* →
   importez le dépôt `coachsaad`.
3. Renseignez toutes les variables de `.env.example` dans
   *Settings → Environment Variables* (valeurs du nouveau Supabase +
   `NEXT_PUBLIC_SITE_URL` = l'URL Vercel générée automatiquement, ex.
   `https://coach-saad.vercel.app`).
4. Déployez. L'URL de démonstration est générée automatiquement par
   Vercel — aucun domaine réel n'est nécessaire à ce stade.
5. Une fois un vrai domaine acheté : mettez seulement à jour
   `NEXT_PUBLIC_SITE_URL` (et le domaine dans Vercel) — aucune
   modification de code n'est nécessaire.

## Passage MODE TEST → PRODUCTION

Aucune réécriture de l'application n'est nécessaire. Il suffit de
renseigner les vraies valeurs dans les variables d'environnement :

- `SUPABASE_*` → nouveau projet Supabase du client
- `PAYMENT_SECRET_KEY` / `PAYMENT_PUBLISHABLE_KEY` /
  `PAYMENT_WEBHOOK_SECRET` → implémenter l'appel réel dans
  `src/lib/providers/payment.ts` (l'architecture — montants en
  centimes, purpose, webhook — est déjà prête pour Stripe)
- `AI_API_KEY` → implémenter l'appel réel dans
  `src/lib/providers/ai.ts`
- `EMAIL_API_KEY` → implémenter l'appel réel dans
  `src/lib/providers/email.ts`
- `MAPS_API_KEY` → implémenter l'appel réel dans
  `src/lib/providers/maps.ts`
- `NEXT_PUBLIC_SITE_URL` → domaine définitif
- `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` → ne plus utiliser ;
  créez le premier vrai administrateur via Supabase Auth puis mettez
  à jour son rôle en base (`role = 'ADMIN'`).

## Structure du projet

```
prisma/                    Schéma de base de données + seed (démo)
supabase/sql/               Script SQL (trigger auth + RLS) pour Supabase
src/app/(site)/              Site public + espace client (mon-compte)
src/app/admin/                Back-office (protégé, rôle ADMIN)
src/app/api/                  Route Handlers (assistant, réservation)
src/lib/providers/            Fournisseurs externes (mock ↔ réel)
src/lib/services/             Logique métier (prix, distance, dispo...)
src/lib/actions/               Server Actions (formulaires)
src/components/                Composants UI
public/images/coach/           Photos originales de Coach Saad (traitées
                                uniquement par recadrage/redimensionnement,
                                aucune retouche ni génération IA)
```

## Ce qui reste à fournir par le client

- **Logo définitif** : un wordmark texte provisoire est utilisé
  (`src/components/marketing/logo.tsx`) en attendant le fichier logo
  réel.
- **Photos complémentaires** : certaines sections de la maquette
  (portrait "ambiance calme" du hero, carte "Tonification & Sculpt",
  photos de témoignages) affichent un espace réservé neutre plutôt
  qu'une photo générée, en attendant de vraies photos.
- Nouveau domaine, compte Vercel, projet Supabase, clés API réelles
  (paiement, email, IA, cartographie) — voir `.env.example`.

## Commandes utiles

```bash
npm run dev          # serveur de développement
npm run build         # build de production
npm run db:dev         # Postgres local (test)
npm run db:migrate      # migrations Prisma
npm run db:seed          # données de démonstration
npm run db:studio         # explorateur de base de données (Prisma Studio)
npm run lint               # ESLint
```
