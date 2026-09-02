import {
  Dumbbell,
  PersonStanding,
  Flame,
  HeartHandshake,
  Apple,
  Timer,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell,
  PersonStanding,
  Flame,
  HeartHandshake,
  Apple,
  Timer,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Dumbbell;
}
