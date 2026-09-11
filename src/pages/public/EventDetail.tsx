import { Link, useParams } from "react-router-dom";
import { EVENT_SELECTION_EVENTS } from "../../services/api/events";

const TBA = "To be announced";

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const event = EVENT_SELECTION_EVENTS.find((candidate) => candidate.slug === slug);

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-muted">Event not found.</p>
        <Link to="/events" className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-copper-light">
          ← Back to all events
        </Link>
      </div>
    );
  }

  const hasCapacity = event.maxParticipants != null;
  const fillRatio = hasCapacity
    ? Math.min(100, Math.round((event.registeredCount / event.maxParticipants!) * 100))
    : 0;
  const full = event.status === "full" || (hasCapacity && event.registeredCount >= event.maxParticipants!);

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <Link to="/events" className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-copper-light">
        ← All Events
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="rounded-sm border border-copper/40 bg-copper/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          {event.category}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {event.participationType === "TBA" ? "Format TBA" : event.participationType}
          {event.participationType === "Team" && event.maxTeamSize ? ` · up to ${event.maxTeamSize} members` : ""}
        </span>
      </div>

      <h1 className="mt-4 font-display text-4xl text-parchment">{event.eventName}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{event.description}</p>

      <div className="mt-8 grid grid-cols-2 gap-6 border-y border-white/10 py-6 sm:grid-cols-3">
        {[
          {
            label: "Date",
            value: event.date
              ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
              : TBA,
          },
          { label: "Time", value: event.time || TBA },
          { label: "Venue", value: event.venue || TBA },
          ...(event.gameOptions && event.gameOptions.length > 0
            ? [{ label: "Game Options", value: event.gameOptions.join(" / ") }]
            : []),
        ].map((item) => (
          <div key={item.label}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{item.label}</p>
            <p className="mt-1 text-sm text-parchment">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between font-mono text-xs text-muted">
          <span>
            {hasCapacity ? `${event.registeredCount} / ${event.maxParticipants} SLOTS FILLED` : "SLOTS TO BE ANNOUNCED"}
          </span>
          {hasCapacity && <span>{fillRatio}%</span>}
        </div>
        {hasCapacity && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div className="h-full rounded-full bg-gradient-to-r from-copper to-gold" style={{ width: `${fillRatio}%` }} />
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Rules</p>
        {event.rules && event.rules.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {event.rules.map((rule, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-copper">—</span>
                {rule}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">{TBA}.</p>
        )}
      </div>

      <div className="mt-8 rounded-sm border border-white/5 bg-black/20 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Common Information</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
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
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Registration Fee</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
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

      <div className="mt-10">
        {full ? (
          <span className="inline-block rounded-sm bg-white/5 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Registration Full
          </span>
        ) : (
          <Link
            to={`/register?event=${event._id}`}
            className="inline-block rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-copper-light"
          >
            Register for This Event
          </Link>
        )}
      </div>
    </div>
  );
}
