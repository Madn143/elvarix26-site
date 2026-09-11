import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { SymposiumEvent } from "../types";
import { getEventIcon } from "./eventIcons";

const TBA = "Details will be announced soon.";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <span className="text-right text-sm text-parchment">{value}</span>
    </div>
  );
}

export default function EventDetailsModal({
  event,
  onClose,
}: {
  event: SymposiumEvent;
  onClose: () => void;
}) {
  const Icon = getEventIcon(event.slug);
  const hasCapacity = event.maxParticipants != null;
  const full = event.status === "full" || (hasCapacity && event.registeredCount >= event.maxParticipants!);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-sm border border-copper/30 bg-coffee shadow-[0_0_60px_-15px_rgba(191,106,46,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-copper/40 bg-copper/10 text-copper-light">
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
                {event.category}
              </span>
              <h3 className="font-display text-xl text-parchment">{event.eventName}</h3>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-parchment">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">About the Event</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{event.description || TBA}</p>

          <div className="mt-5 divide-y divide-white/5 border-t border-white/5">
            <Row label="Event Type" value={event.participationType === "TBA" ? "To be announced" : event.participationType} />
            <Row
              label="Team Size"
              value={
                event.maxTeamSize
                  ? event.maxTeamSize === 1
                    ? "1"
                    : `Up to ${event.maxTeamSize}`
                  : "To be announced"
              }
            />
            <Row
              label="Date"
              value={
                event.date
                  ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
                  : "To be announced"
              }
            />
            <Row label="Time" value={event.time || "To be announced"} />
            <Row label="Venue" value={event.venue || "To be announced"} />
            {event.gameOptions && event.gameOptions.length > 0 && (
              <Row label="Game Options" value={event.gameOptions.join(" / ")} />
            )}
          </div>

          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Rules</p>
            {event.rules && event.rules.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {event.rules.map((rule, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-copper">—</span>
                    {rule}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">{TBA}</p>
            )}
          </div>

          <div className="mt-5 rounded-sm border border-white/5 bg-black/20 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Common Information</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-copper">—</span>
                All events start at 10:00 AM.
              </li>
              <li className="flex gap-2">
                <span className="text-copper">—</span>
                All events close by 4:00 PM.
              </li>
              <li className="flex gap-2">
                <span className="text-copper">—</span>
                Participants attending Technical Events must bring their own laptop.
              </li>
            </ul>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Registration Fee</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-copper">—</span>
                Internal Participants (Grace College of Engineering): ₹200 per participant
              </li>
              <li className="flex gap-2">
                <span className="text-copper">—</span>
                External Participants (Other Colleges): ₹250 per participant
              </li>
            </ul>
          </div>

          <div className="mt-6">
            {full ? (
              <span className="block rounded-sm bg-white/5 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Registration Full
              </span>
            ) : (
              <Link
                to={`/register?event=${event._id}`}
                className="block rounded-sm bg-copper py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-copper-light"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
