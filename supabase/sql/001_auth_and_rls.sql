-- ============================================================
-- COACH SAAD — Auth Supabase + Row Level Security
-- ============================================================
-- À exécuter UNE FOIS dans le nouveau projet Supabase du client
-- (SQL Editor), APRÈS avoir appliqué les migrations Prisma :
--
--   npx prisma migrate deploy
--   (avec DATABASE_URL pointant vers ce projet Supabase)
--
-- puis ce script (SQL Editor Supabase, ou `psql` / `supabase db push`).
-- Il ne recrée PAS les tables : Prisma reste la source de vérité pour
-- le schéma. Ce script ajoute uniquement le lien avec Supabase Auth et
-- les policies RLS.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Lien auth.users -> public."User" (trigger)
-- ------------------------------------------------------------
-- À l'inscription (Supabase Auth), on crée automatiquement le profil
-- applicatif correspondant, avec le rôle CLIENT par défaut.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public."User" ("id", "email", "role", "firstName", "lastName", "phone", "isTestAccount", "createdAt", "updatedAt")
  values (
    new.id,
    new.email,
    'CLIENT',
    coalesce(new.raw_user_meta_data->>'firstName', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'lastName',
    new.raw_user_meta_data->>'phone',
    false,
    now(),
    now()
  )
  on conflict ("id") do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2. Fonction utilitaire : l'utilisateur courant est-il admin ?
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public."User" u
    where u."id" = auth.uid() and u."role" = 'ADMIN'
  );
$$;

-- ------------------------------------------------------------
-- 3. Activation de RLS sur toutes les tables applicatives
-- ------------------------------------------------------------
alter table public."User" enable row level security;
alter table public."Booking" enable row level security;
alter table public."NutritionProfile" enable row level security;
alter table public."NutritionProgram" enable row level security;
alter table public."Subscription" enable row level security;
alter table public."Payment" enable row level security;
alter table public."ConsentLog" enable row level security;
alter table public."ContentBlock" enable row level security;
alter table public."ProgramCard" enable row level security;
alter table public."Testimonial" enable row level security;
alter table public."PricingConfig" enable row level security;
alter table public."TravelZoneConfig" enable row level security;
alter table public."WorkingHours" enable row level security;
alter table public."BlockedSlot" enable row level security;
alter table public."AssistantConfig" enable row level security;

-- ------------------------------------------------------------
-- 4. Policies — données propres à chaque utilisateur
-- ------------------------------------------------------------

-- User : chacun voit/modifie son propre profil ; les admins voient tout.
create policy "user_select_own_or_admin" on public."User"
  for select using (auth.uid() = "id" or public.is_admin());
create policy "user_update_own_or_admin" on public."User"
  for update using (auth.uid() = "id" or public.is_admin());
create policy "user_admin_all" on public."User"
  for all using (public.is_admin());

-- Booking : le client ne voit/gère que ses réservations ; admin tout.
create policy "booking_select_own_or_admin" on public."Booking"
  for select using (auth.uid()::text = "userId" or public.is_admin());
create policy "booking_insert_own" on public."Booking"
  for insert with check (auth.uid()::text = "userId");
create policy "booking_update_own_or_admin" on public."Booking"
  for update using (auth.uid()::text = "userId" or public.is_admin());
create policy "booking_admin_delete" on public."Booking"
  for delete using (public.is_admin());

-- NutritionProfile : appartient au client via userId.
create policy "nutrition_profile_owner_or_admin" on public."NutritionProfile"
  for all using (auth.uid()::text = "userId" or public.is_admin());

-- NutritionProgram : appartient au client via le profil parent.
create policy "nutrition_program_owner_or_admin" on public."NutritionProgram"
  for all using (
    public.is_admin()
    or exists (
      select 1 from public."NutritionProfile" np
      where np."id" = "NutritionProgram"."profileId" and np."userId" = auth.uid()::text
    )
  );

-- Subscription / Payment : lecture propre + écriture réservée aux
-- fonctions serveur (service role), jamais depuis le navigateur.
create policy "subscription_select_own_or_admin" on public."Subscription"
  for select using (auth.uid()::text = "userId" or public.is_admin());
create policy "payment_select_own_or_admin" on public."Payment"
  for select using (auth.uid()::text = "userId" or public.is_admin());

-- ConsentLog (RGPD) : chacun peut créer/consulter ses propres entrées.
create policy "consent_log_owner_or_admin" on public."ConsentLog"
  for all using (auth.uid()::text = "userId" or public.is_admin());

-- ------------------------------------------------------------
-- 5. Policies — contenu public (site vitrine, configuration)
-- ------------------------------------------------------------
-- Lecture publique (visiteurs anonymes inclus), écriture admin only.

create policy "content_block_public_read" on public."ContentBlock"
  for select using (true);
create policy "content_block_admin_write" on public."ContentBlock"
  for all using (public.is_admin());

create policy "program_card_public_read" on public."ProgramCard"
  for select using ("isActive" = true or public.is_admin());
create policy "program_card_admin_write" on public."ProgramCard"
  for all using (public.is_admin());

create policy "testimonial_public_read" on public."Testimonial"
  for select using ("isPublished" = true or public.is_admin());
create policy "testimonial_admin_write" on public."Testimonial"
  for all using (public.is_admin());

create policy "pricing_config_public_read" on public."PricingConfig"
  for select using (true);
create policy "pricing_config_admin_write" on public."PricingConfig"
  for all using (public.is_admin());

create policy "travel_zone_public_read" on public."TravelZoneConfig"
  for select using (true);
create policy "travel_zone_admin_write" on public."TravelZoneConfig"
  for all using (public.is_admin());

create policy "working_hours_public_read" on public."WorkingHours"
  for select using (true);
create policy "working_hours_admin_write" on public."WorkingHours"
  for all using (public.is_admin());

create policy "blocked_slot_public_read" on public."BlockedSlot"
  for select using (true);
create policy "blocked_slot_admin_write" on public."BlockedSlot"
  for all using (public.is_admin());

create policy "assistant_config_public_read" on public."AssistantConfig"
  for select using (true);
create policy "assistant_config_admin_write" on public."AssistantConfig"
  for all using (public.is_admin());

-- ------------------------------------------------------------
-- Notes
-- ------------------------------------------------------------
-- - Ce projet accède principalement à la base via Prisma, depuis du
--   code serveur de confiance (Route Handlers / Server Actions), en
--   utilisant DATABASE_URL (connexion Postgres directe). Cette
--   connexion s'exécute avec le rôle propriétaire de la base et
--   CONTOURNE la RLS par conception (comme la clé service role) :
--   l'autorisation "un client ne voit que ses données" y est donc
--   appliquée explicitement dans le code (filtre `where userId = ...`),
--   déjà en place dans src/lib/auth/session.ts et les Server Actions.
-- - Les policies RLS ci-dessus constituent une seconde couche de
--   protection réelle, appliquée automatiquement si l'application (ou
--   un futur client mobile) interroge un jour Supabase directement via
--   supabase-js avec la clé anonyme + le JWT utilisateur.
-- - SUPABASE_SERVICE_ROLE_KEY contourne aussi la RLS : à n'utiliser que
--   côté serveur (voir src/lib/supabase/admin.ts, jamais importé côté
--   client).
