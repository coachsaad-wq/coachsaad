// Next.js 16 a renommé `middleware.ts` en `proxy.ts` (export `proxy` au
// lieu de `middleware`, comportement identique).
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

const TEST_SESSION_COOKIE = "coachsaad_test_session_email";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/mon-compte");

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: req });

  if (!isSupabaseConfigured) {
    // MODE TEST : on vérifie juste la présence du cookie de connexion de
    // test. Le rôle exact (admin/client) est revérifié côté serveur dans
    // chaque page via requireAdmin()/requireUser() (source de vérité).
    const hasTestSession = req.cookies.has(TEST_SESSION_COOKIE);
    if (!hasTestSession) {
      const url = new URL("/connexion", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          req.cookies.set(name, value);
        }
        response = NextResponse.next({ request: req });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL("/connexion", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Le rôle précis (admin) est revérifié côté serveur via requireAdmin()
  // dans les pages /admin/* (source de vérité en base, pas seulement le
  // JWT), pour éviter tout écart si le rôle a changé récemment.
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/mon-compte/:path*"],
};
