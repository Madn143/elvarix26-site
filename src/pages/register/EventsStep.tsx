import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import type { SymposiumEvent } from "../../types";
import { getEventIcon } from "../../components/eventIcons";
import { EVENT_SELECTION_EVENTS } from "../../services/api/events";

export default function EventsStep() {
  const { selectedEvents, toggleEvent, preselectEventId, setPreselectEventId, resetCollege, resetEvents } = useRegistration();
  const navigate = useNavigate();

  // If the participant arrived here via "Register Now" on a specific event card
  // elsewhere on the site, auto-select the matching event once (in addition to
  // anything else they pick — this flow allows multiple events).
  useEffect(() => {
    if (!preselectEventId) return;
    const match = EVENT_SELECTION_EVENTS.find((e) => e._id === preselectEventId);
    if (match && !selectedEvents.some((e) => e.eventId === match._id)) {
      toggleEvent({
        eventId: match._id,
        eventName: match.eventName,
        eventCategory: match.category,
        eventTime: match.time,
        eventVenue: match.venue,
        participationType: match.participationType,
        maxTeamSize: match.maxTeamSize,
        registrationFee: match.registrationFee,
      });
    }
    setPreselectEventId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectEventId]);

  const isSelected = (id: string) => selectedEvents.some((e) => e.eventId === id);

  const handleSelect = (event: SymposiumEvent) => {
    toggleEvent({
      eventId: event._id,
      eventName: event.eventName,
      eventCategory: event.category,
      eventTime: event.time,
      eventVenue: event.venue,
      participationType: event.participationType,
      maxTeamSize: event.maxTeamSize,
      registrationFee: event.registrationFee,
    });
  };

  const handleContinue = () => {
    if (selectedEvents.length === 0) return;
    navigate("/register/team");
  };

  const technical = EVENT_SELECTION_EVENTS.filter((e) => e.category === "Technical");
  const nonTechnical = EVENT_SELECTION_EVENTS.filter((e) => e.category === "Non-Technical");

  const renderGroup = (label: string, group: SymposiumEvent[]) => (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-light">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {group.map((event) => {
          const selected = isSelected(event._id);
          const Icon = getEventIcon(event.slug);

          return (
            <motion.button
              key={event._id}
              type="button"
              onClick={() => handleSelect(event)}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-sm border p-4 text-left transition-all ${
                selected
                  ? "border-gold bg-gold/10 shadow-[0_0_24px_-6px_rgba(212,169,74,0.5)]"
                  : "border-white/10 bg-coffee/30 hover:border-copper/50"
              }`}
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-ink"
                >
                  <Check size={14} strokeWidth={2.5} />
                </motion.span>
              )}

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-sm border ${
                    selected ? "border-gold/50 bg-gold/10 text-gold" : "border-copper/30 bg-copper/10 text-copper-light"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-copper-light">
                  {event.category}
                </span>
              </div>

              <h3 className="mt-3 font-display text-base text-parchment">{event.eventName}</h3>

              <div className="mt-2 space-y-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                <p>Place: {event.venue}</p>
                <p>Time: {event.time}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-parchment">Select Your Events</h2>
        <p className="mt-1 text-sm text-muted">
          Choose one Technical event and one Non-Technical event.
        </p>
      </div>

      <div className="rounded-sm border border-gold/30 bg-gold/5 px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold">
          {selectedEvents.length === 0
            ? "Selected Events: None"
            : `Selected Events (${selectedEvents.length}): ${selectedEvents.map((e) => e.eventName).join(", ")}`}
        </span>
      </div>

      <div className="space-y-8">
        {renderGroup("Technical Events", technical)}
        {renderGroup("Non-Technical Events", nonTechnical)}
      </div>

      {selectedEvents.length === 0 && (
        <p className="text-sm text-red-400">Please select at least one event to continue.</p>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => {
            resetCollege();
            resetEvents();
            navigate("/register/college");
          }}
          className="rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={selectedEvents.length === 0}
          className="rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
