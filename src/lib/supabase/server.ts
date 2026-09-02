import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Client Supabase pour Server Components / Server Actions / Route Handlers.
 * Lit et rafraîchit la session via les cookies Next.js.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : ignoré, le middleware/proxy
          // gère déjà le rafraîchissement de session dans ce cas.
        }
      },
    },
  });
}
