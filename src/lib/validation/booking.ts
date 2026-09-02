import { z } from "zod";

export const bookingRequestSchema = z.object({
  courseType: z.string().min(1, "Choisissez un type de cours"),
  duration: z.enum(["MIN60", "MIN90", "MIN120"]),
  date: z.string().min(1, "Date requise"), // "YYYY-MM-DD"
  time: z.string().min(1, "Heure requise"), // "HH:mm"
  address: z.string().min(5, "Adresse requise"),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const DURATION_MINUTES: Record<BookingRequestInput["duration"], number> = {
  MIN60: 60,
  MIN90: 90,
  MIN120: 120,
};
