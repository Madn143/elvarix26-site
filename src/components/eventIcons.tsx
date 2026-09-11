import {
  FileText,
  Code2,
  Palette,
  Brain,
  Clapperboard,
  MessageSquareText,
  Footprints,
  Gamepad2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Keyed by event slug. Events created later from the Admin Dashboard that
// aren't in this map simply fall back to the generic Sparkles icon —
// nothing here needs to change for the site to keep working.
const ICONS: Record<string, LucideIcon> = {
  "paper-presentation": FileText,
  "blind-coding": Code2,
  "ui-ux-design": Palette,
  "tech-quiz": Brain,
  "on-spot-video-editing": Clapperboard,
  "word-dump": MessageSquareText,
  "corporate-walk": Footprints,
  "e-sports": Gamepad2,
};

export function getEventIcon(slug: string): LucideIcon {
  return ICONS[slug] || Sparkles;
}
