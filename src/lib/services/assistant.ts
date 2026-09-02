import { prisma } from "@/lib/prisma";

export async function getAssistantConfig() {
  const config = await prisma.assistantConfig.findUnique({
    where: { id: "singleton" },
  });
  if (config) return config;
  return prisma.assistantConfig.create({ data: { id: "singleton" } });
}

export function parseSuggestions(json: unknown): string[] {
  if (Array.isArray(json)) return json.filter((x): x is string => typeof x === "string");
  return [];
}
