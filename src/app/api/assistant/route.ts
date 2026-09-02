import { NextResponse } from "next/server";
import { z } from "zod";
import { chatCompletion } from "@/lib/providers/ai";
import { getAssistantConfig } from "@/lib/services/assistant";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const config = await getAssistantConfig();
  if (!config.isActive) {
    return NextResponse.json(
      { error: "L'assistant est actuellement désactivé." },
      { status: 503 }
    );
  }

  const reply = await chatCompletion([
    { role: "system", content: config.systemInstructions },
    ...parsed.data.messages,
  ]);

  return NextResponse.json({ reply });
}
