import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteBooking } from "@/lib/services/booking";

const schema = z.object({
  address: z.string().min(5),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.enum(["MIN60", "MIN90", "MIN120"]),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const startAt = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(startAt.getTime())) {
    return NextResponse.json({ error: "Date ou heure invalide." }, { status: 400 });
  }

  const quote = await quoteBooking(parsed.data.address, startAt, parsed.data.duration);
  return NextResponse.json(quote);
}
