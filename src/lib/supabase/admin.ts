import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Client Supabase "service role" — accès total, contourne RLS.
 * NE JAMAIS importer ce fichier depuis un composant client ou exposer
 * cette clé au navigateur. Réservé aux opérations serveur de confiance
 * (administration, création de comptes, webhooks, Storage).
 */
export function createSupabaseAdminClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY n'est pas défini. Cette action nécessite le nouveau projet Supabase du client (MODE TEST : non disponible)."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
