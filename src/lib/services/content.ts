import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getContentMap = cache(async (): Promise<Record<string, string>> => {
  const blocks = await prisma.contentBlock.findMany();
  const map: Record<string, string> = {};
  for (const block of blocks) {
    map[block.key] = block.value;
  }
  return map;
});

export function content(map: Record<string, string>, key: string, fallback = ""): string {
  return map[key] ?? fallback;
}
