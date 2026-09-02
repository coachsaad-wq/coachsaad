"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.coerce.number().int().optional(),
  goal: z.string().max(100).optional(),
  quote: z.string().min(1).max(1000),
  result: z.string().max(100).optional(),
  order: z.coerce.number().int().default(0),
});

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin();
  const parsed = testimonialSchema.parse({
    name: formData.get("name"),
    age: formData.get("age") || undefined,
    goal: formData.get("goal") || undefined,
    quote: formData.get("quote"),
    result: formData.get("result") || undefined,
    order: formData.get("order") || 0,
  });

  await prisma.testimonial.create({ data: parsed });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function togglePublishTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const isPublished = formData.get("isPublished") === "true";
  await prisma.testimonial.update({ where: { id }, data: { isPublished: !isPublished } });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}
