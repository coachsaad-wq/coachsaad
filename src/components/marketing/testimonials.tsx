import { prisma } from "@/lib/prisma";
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel";

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-mist py-16">
      <div className="container-page">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
          Ils ont <span className="text-brand-red">changé leur vie</span>
        </h2>

        <div className="mt-10">
          <TestimonialsCarousel
            testimonials={testimonials.map((t) => ({
              id: t.id,
              name: t.name,
              goal: t.goal,
              quote: t.quote,
              result: t.result,
              photoPath: t.photoPath,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
