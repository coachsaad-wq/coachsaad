"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

type Testimonial = {
  id: string;
  name: string;
  goal: string | null;
  quote: string;
  result: string | null;
  photoPath: string | null;
};

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const visible = testimonials.slice(index, index + 3);
  const filled =
    visible.length < 3 ? [...visible, ...testimonials.slice(0, 3 - visible.length)] : visible;

  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }
  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {filled.map((t, i) => (
          <figure
            key={`${t.id}-${i}`}
            className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-6"
          >
            <Quote className="h-6 w-6 text-brand-red/40" />
            <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft/80">
              {t.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mist text-neutral-400">
                {t.photoPath ? (
                  <Image src={t.photoPath} alt={t.name} fill className="object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                {t.goal && <p className="text-xs text-ink-soft/60">{t.goal}</p>}
              </div>
              {t.result && (
                <span className="ml-auto rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-semibold text-brand-red">
                  {t.result}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {testimonials.length > 3 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Témoignage précédent"
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-brand-red hover:text-brand-red"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Témoignage suivant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-brand-red hover:text-brand-red"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
