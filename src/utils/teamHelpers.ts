import type { SelectedEvent } from "../types";

/** True if any selected event is a genuine Team event (not Individual/TBA). */
export function isTeamRegistration(selectedEvents: SelectedEvent[]): boolean {
  return selectedEvents.some((e) => e.participationType === "Team");
}

/**
 * The smallest max-team-size among selected Team events, so the roster never
 * exceeds what every selected team event allows. Falls back to a generous
 * default if a Team event somehow has no limit set.
 */
export function getMaxTeamSize(selectedEvents: SelectedEvent[]): number {
  const limits = selectedEvents
    .filter((e) => e.participationType === "Team" && e.maxTeamSize != null)
    .map((e) => e.maxTeamSize as number);
  return limits.length > 0 ? Math.min(...limits) : 10;
}
