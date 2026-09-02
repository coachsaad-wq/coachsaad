/**
 * MODE TEST : tant que ces 3 variables ne sont pas renseignées avec le
 * NOUVEAU projet Supabase du client, l'authentification réelle est
 * désactivée et l'application bascule sur un mode "connexion de test"
 * (voir src/lib/auth/session.ts). Aucune donnée réelle n'est concernée.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
