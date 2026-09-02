"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logCookieConsentAction } from "@/lib/actions/rgpd";

const STORAGE_KEY = "coachsaad_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage n'existe que côté client : ce contrôle ne peut pas être
    // fait pendant le rendu (SSR), un effet au montage est nécessaire ici.
    if (!localStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function choose(choice: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    void logCookieConsentAction(choice);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border border-line bg-paper p-4 shadow-xl sm:flex-row sm:items-center">
      <p className="flex-1 text-xs text-ink-soft/70">
        Nous utilisons des cookies pour faire fonctionner le site et mesurer son audience.{" "}
        <Link href="/confidentialite" className="underline">
          En savoir plus
        </Link>
        .
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => choose("declined")}
          className="rounded-md border border-line px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft"
        >
          Refuser
        </button>
        <button
          onClick={() => choose("accepted")}
          className="rounded-md bg-brand-red px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
