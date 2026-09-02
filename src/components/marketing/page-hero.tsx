export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-ink py-14 text-white">
      <div className="container-page">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {kicker}
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">{description}</p>
        )}
      </div>
    </section>
  );
}
