"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { getAssistantConfig } from "@/lib/services/assistant";

type ChatMessage = { role: "user" | "assistant"; content: string };

type AssistantConfigDTO = Awaited<ReturnType<typeof getAssistantConfig>>;

export function AssistantWidget({ config }: { config: AssistantConfigDTO }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions: string[] = Array.isArray(config.suggestions)
    ? (config.suggestions as unknown[]).filter((s): s is string => typeof s === "string")
    : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!config.isActive) return null;

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "Une erreur est survenue." }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Une erreur est survenue, réessaie dans un instant." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl">
          <div className="flex items-center justify-between gap-2 bg-ink px-4 py-3 text-white">
            <span className="text-sm font-semibold">{config.name}</span>
            <button aria-label="Fermer" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <div className="rounded-2xl rounded-tl-sm bg-mist px-3 py-2 text-sm text-ink-soft">
              {config.greeting}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-brand-red text-white"
                    : "rounded-tl-sm bg-mist text-ink-soft"
                )}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl rounded-tl-sm bg-mist px-3 py-2 text-sm text-ink-soft/60">
                …
              </div>
            )}

            {messages.length === 0 && suggestions.length > 0 && (
              <div className="flex flex-col gap-2 pt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-xs font-medium text-ink-soft hover:border-brand-red hover:text-brand-red"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.some(
              (m) =>
                m.role === "assistant" && m.content.toLowerCase().includes("nutrition ia")
            ) && (
              <Link
                href="/nutrition/abonnement"
                className="block rounded-xl border border-brand-red/30 bg-brand-red/5 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-brand-red hover:bg-brand-red/10"
              >
                {config.nutritionCta}
              </Link>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question…"
              className="flex-1 rounded-full border border-line px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Envoyer"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <div className="relative">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="assistant-hint-bubble pointer-events-auto absolute bottom-[calc(100%+0.9rem)] right-3 whitespace-nowrap rounded-2xl bg-ink px-4 py-2.5 text-sm font-medium text-white opacity-0 shadow-xl"
          >
            {config.hintText}
            <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-ink" />
          </button>
        )}

        {open ? (
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer l'assistant"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl ring-2 ring-white/10 transition hover:ring-brand-red"
          >
            <X className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir l'assistant"
            className="assistant-figure relative block h-28 w-20 bg-transparent transition hover:scale-[1.03] sm:h-40 sm:w-28"
          >
            <span className="assistant-figure-glow" aria-hidden="true" />
            <Image
              src="/images/coach/logo-coach-saad.png"
              alt="Assistant Coach Saad"
              fill
              sizes="(min-width: 640px) 112px, 80px"
              className="relative object-contain object-bottom"
              priority
            />
          </button>
        )}
      </div>
    </div>
  );
}
