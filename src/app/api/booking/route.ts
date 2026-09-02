import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { createBooking, BookingError } from "@/lib/services/booking";

const schema = z.object({
  courseType: z.string().min(1),
  duration: z.enum(["MIN60", "MIN90", "MIN120"]),
  date: z.string().min(1),
  time: z.string().min(1),
  address: z.string().min(5),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Connecte-toi pour finaliser ta réservation.", requiresAuth: true },
      { status: 401 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const startAt = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(startAt.getTime())) {
    return NextResponse.json({ error: "Date ou heure invalide." }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      userId: user.id,
      userEmail: user.email,
      userFirstName: user.firstName,
      courseType: parsed.data.courseType,
      duration: parsed.data.duration,
      startAt,
      address: parsed.data.address,
    });
    return NextResponse.json({ bookingId: booking.id });
  } catch (err) {
    if (err instanceof BookingError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
