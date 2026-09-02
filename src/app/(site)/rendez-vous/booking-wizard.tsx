"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";

type Duration = "MIN60" | "MIN90" | "MIN120";

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "MIN60", label: "1 heure" },
  { value: "MIN90", label: "1 heure 30" },
  { value: "MIN120", label: "2 heures" },
];

type Quote = {
  distanceKm: number;
  radiusKm: number;
  isWithinZone: boolean;
  priceCents: number;
  isAvailable: boolean;
  unavailableReason?: string;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    cents / 100
  );
}

export function BookingWizard({ courseTypes }: { courseTypes: string[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState(courseTypes[0] ?? "");
  const [duration, setDuration] = useState<Duration>("MIN60");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);

  async function fetchQuote() {
    setQuoting(true);
    setQuoteError(null);
    setQuote(null);
    try {
      const res = await fetch("/api/booking/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, date, time, duration }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQuoteError(data.error ?? "Erreur lors du calcul.");
        return;
      }
      setQuote(data);
      setStep(4);
    } catch {
      setQuoteError("Erreur lors du calcul de la distance.");
    } finally {
      setQuoting(false);
    }
  }

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    setRequiresAuth(false);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseType, duration, date, time, address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Erreur lors de la réservation.");
        if (data.requiresAuth) setRequiresAuth(true);
        return;
      }
      router.push(`/rendez-vous/confirmation?booking=${data.bookingId}`);
    } catch {
      setSubmitError("Erreur lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = ["Cours", "Date & heure", "Adresse", "Récapitulatif"];

  return (
    <div className="mx-auto max-w-xl">
      <ol className="mb-8 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-soft/50">
        {steps.map((label, i) => (
          <li key={label} className={clsx("flex items-center gap-2", i + 1 <= step && "text-brand-red")}>
            <span
              className={clsx(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                i + 1 <= step ? "border-brand-red bg-brand-red text-white" : "border-line"
              )}
            >
              {i + 1 < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Type de cours</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {courseTypes.map((c) => (
                <button
                  key={c}
                  onClick={() => setCourseType(c)}
                  className={clsx(
                    "rounded-md border px-3 py-2.5 text-left text-sm font-medium",
                    courseType === c ? "border-brand-red bg-brand-red/5 text-brand-red" : "border-line text-ink-soft"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Durée</label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={clsx(
                    "rounded-md border px-3 py-2.5 text-sm font-medium",
                    duration === d.value ? "border-brand-red bg-brand-red/5 text-brand-red" : "border-line text-ink-soft"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!courseType}
            className="mt-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
          >
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-brand-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="time">
              Heure
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-brand-red focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink-soft"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!date || !time}
              className="flex-1 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="address">
              Adresse du cours
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Numéro, rue, ville"
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-brand-red focus:outline-none"
            />
            <p className="mt-2 text-xs text-ink-soft/60">
              Zone de déplacement : 50 km maximum autour de Lille (MODE TEST : distance
              calculée automatiquement, sans clé cartographie réelle).
            </p>
          </div>

          {quoteError && <p className="text-sm text-red-600">{quoteError}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink-soft"
            >
              Retour
            </button>
            <button
              onClick={fetchQuote}
              disabled={address.length < 5 || quoting}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
            >
              {quoting && <Loader2 className="h-4 w-4 animate-spin" />}
              Calculer
            </button>
          </div>
        </div>
      )}

      {step === 4 && quote && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-line p-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink">
              Coaching à domicile
            </h3>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">Type de cours</dt>
                <dd className="font-medium text-ink">{courseType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">Date</dt>
                <dd className="font-medium text-ink">
                  {new Date(`${date}T${time}`).toLocaleString("fr-FR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">Adresse</dt>
                <dd className="max-w-[60%] text-right font-medium text-ink">{address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft/60">Distance</dt>
                <dd className="font-medium text-ink">{quote.distanceKm} km</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-bold text-ink">TOTAL</dt>
                <dd className="font-extrabold text-brand-red">{formatPrice(quote.priceCents)}</dd>
              </div>
            </dl>
          </div>

          {!quote.isWithinZone && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Zone de déplacement : {quote.radiusKm} km maximum. Cette adresse est à{" "}
              {quote.distanceKm} km.
            </p>
          )}
          {quote.isWithinZone && !quote.isAvailable && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {quote.unavailableReason}
            </p>
          )}

          {submitError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {submitError}
              {requiresAuth && (
                <div className="mt-2 flex gap-3">
                  <Link href="/connexion?callbackUrl=/rendez-vous" className="font-semibold underline">
                    Se connecter
                  </Link>
                  <Link href="/inscription" className="font-semibold underline">
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink-soft"
            >
              Retour
            </button>
            <button
              onClick={submitBooking}
              disabled={!quote.isWithinZone || !quote.isAvailable || submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Réserver et payer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
