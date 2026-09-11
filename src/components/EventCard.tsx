import { Link } from "react-router-dom";
import type { SymposiumEvent } from "../types";

const TBA = "To be announced";

export default function EventCard({ event }: { event: SymposiumEvent }) {
  const hasCapacity = event.maxParticipants != null;
  const full = event.status === "full" || (hasCapacity && event.registeredCount >= event.maxParticipants!);
  const fillRatio = hasCapacity
    ? Math.min(100, Math.round((event.registeredCount / event.maxParticipants!) * 100))
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-sm border border-copper/20 bg-coffee/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-copper/60 hover:shadow-[0_0_30px_-8px_rgba(191,106,46,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          {event.category}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {event.participationType === "TBA" ? "Format TBA" : event.participationType}
          {event.participationType === "Team" && event.maxTeamSize ? ` · up to ${event.maxTeamSize}` : ""}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg leading-tight text-parchment">{event.eventName}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{event.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-muted">
        <dt className="text-muted/70">Date</dt>
        <dd className="text-right text-parchment">
          {event.date
            ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
            : TBA}
        </dd>
        <dt className="text-muted/70">Time</dt>
        <dd className="text-right text-parchment">{event.time || TBA}</dd>
        <dt className="text-muted/70">Venue</dt>
        <dd className="text-right text-parchment">{event.venue || TBA}</dd>
      </dl>

      <div className="mt-4">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted">
          <span>
            {hasCapacity ? `${event.registeredCount} / ${event.maxParticipants} SLOTS FILLED` : "SLOTS TO BE ANNOUNCED"}
          </span>
          {hasCapacity && <span>{fillRatio}%</span>}
        </div>
        {hasCapacity && (
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-copper to-gold transition-all"
              style={{ width: `${fillRatio}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Link
          to={`/events/${event.slug}`}
          className="flex-1 rounded-sm border border-white/10 py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:border-copper/50 hover:text-parchment"
        >
          View Details
        </Link>
        {full ? (
          <span className="flex-1 rounded-sm bg-white/5 py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted/60">
            Registration Full
          </span>
        ) : (
          <Link
            to={`/register?event=${event._id}`}
            className="flex-1 rounded-sm bg-copper py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-copper-light"
          >
            Register
          </Link>
        )}
      </div>
    </div>
  );
}
