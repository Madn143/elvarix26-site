import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import type { EventCategory, ParticipationType, SymposiumEvent } from "../../types";
import { EVENT_SELECTION_EVENTS } from "../../services/api/events";
import { getEventIcon } from "../../components/eventIcons";
import EventDetailsModal from "../../components/EventDetailsModal";

const CATEGORY_TABS: { label: string; value: EventCategory | "All" }[] = [
  { label: "All Events", value: "All" },
  { label: "Technical", value: "Technical" },
  { label: "Non-Technical", value: "Non-Technical" },
];

const TYPE_FILTERS: { label: string; value: ParticipationType | "All" }[] = [
  { label: "All Types", value: "All" },
  { label: "Individual", value: "Individual" },
  { label: "Team", value: "Team" },
];

const CATEGORY_COPY: Record<EventCategory, { heading: string; subtitle: string }> = {
  Technical: { heading: "Technical Events", subtitle: "Think. Build. Innovate." },
  "Non-Technical": { heading: "Non-Technical Events", subtitle: "Unleash your creativity. Own the stage." },
};

function EventListCard({
  event,
  number,
  onViewDetails,
}: {
  event: SymposiumEvent;
  number: number;
  onViewDetails: (event: SymposiumEvent) => void;
}) {
  const Icon = getEventIcon(event.slug);
  const hasCapacity = event.maxParticipants != null;
  const full = event.status === "full" || (hasCapacity && event.registeredCount >= event.maxParticipants!);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-sm border border-copper/20 bg-coffee/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-copper/60 hover:shadow-[0_0_30px_-8px_rgba(191,106,46,0.5)]"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-2xl text-copper-light/40">{String(number).padStart(2, "0")}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-copper/30 bg-copper/10 text-copper-light transition-transform duration-300 group-hover:scale-110 group-hover:text-gold">
          <Icon size={18} strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-sm border border-copper/40 bg-copper/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-copper-light">
          {event.category}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
          {event.participationType === "TBA" ? "Format TBA" : event.participationType}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg leading-tight text-parchment">{event.eventName}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{event.description}</p>

      <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        <p>Place: {event.venue || "TBA"}</p>
        <p>Time: {event.time || "TBA"}</p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => onViewDetails(event)}
          className="flex-1 rounded-sm border border-white/10 py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:border-copper/50 hover:text-parchment"
        >
          View Details
        </button>
        {full ? (
          <span className="flex-1 rounded-sm bg-white/5 py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted/60">
            Full
          </span>
        ) : (
          <Link
            to={`/register?event=${event._id}`}
            className="flex-1 rounded-sm bg-copper py-2 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-copper-light"
          >
            Register Now
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function CategorySection({
  category,
  events,
  numberOffset,
  onViewDetails,
}: {
  category: EventCategory;
  events: SymposiumEvent[];
  numberOffset: number;
  onViewDetails: (event: SymposiumEvent) => void;
}) {
  if (events.length === 0) return null;
  const copy = CATEGORY_COPY[category];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <div className="mb-6 text-center sm:text-left">
        <h2 className="font-display text-2xl text-parchment">{copy.heading.toUpperCase()}</h2>
        <p className="mt-1 font-display text-sm text-gold">"{copy.subtitle}"</p>
      </div>
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event, i) => (
          <EventListCard key={event._id} event={event} number={numberOffset + i + 1} onViewDetails={onViewDetails} />
        ))}
      </motion.div>
    </motion.section>
  );
}

export default function Events() {
  const [events] = useState<SymposiumEvent[]>(EVENT_SELECTION_EVENTS);
  const [category, setCategory] = useState<EventCategory | "All">("All");
  const [type, setType] = useState<ParticipationType | "All">("All");
  const [search, setSearch] = useState("");
  const [activeEvent, setActiveEvent] = useState<SymposiumEvent | null>(null);

  const matchesFilters = (event: SymposiumEvent) => {
    if (type !== "All" && event.participationType !== type) return false;
    if (search.trim() && !event.eventName.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  };

  const technical = useMemo(
    () => events.filter((e) => e.category === "Technical" && matchesFilters(e)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, type, search]
  );
  const nonTechnical = useMemo(
    () => events.filter((e) => e.category === "Non-Technical" && matchesFilters(e)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, type, search]
  );

  const showTechnical = category === "All" || category === "Technical";
  const showNonTechnical = category === "All" || category === "Non-Technical";
  const totalVisible = (showTechnical ? technical.length : 0) + (showNonTechnical ? nonTechnical.length : 0);

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-copper/20 py-16 text-center">
        <div className="circuit-bg absolute inset-x-0 top-0 h-64 opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl px-5"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-copper-light">ELVARIX'26</span>
          <h1 className="mt-3 font-display text-4xl text-parchment md:text-5xl">EVENTS</h1>
          <p className="mt-3 font-display text-lg text-gold">"Explore. Compete. Create."</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>Technical Events</span>
            <span className="text-copper">+</span>
            <span>Non-Technical Events</span>
          </div>
          <p className="mt-3 text-sm text-muted">September 23, 2026 · Grace College of Engineering</p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* CATEGORY SWITCHER */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setCategory(tab.value)}
              className={`rounded-sm border px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                category === tab.value
                  ? "border-copper bg-copper text-ink"
                  : "border-white/10 text-muted hover:border-copper/40 hover:text-parchment"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH + TYPE FILTER */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full rounded-sm border border-white/10 bg-black/30 py-2.5 pl-9 pr-4 text-sm text-parchment placeholder:text-muted/50 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setType(f.value)}
                className={`rounded-sm border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                  type === f.value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 text-muted hover:border-copper/40 hover:text-parchment"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {totalVisible === 0 ? (
          <p className="py-16 text-center text-sm text-muted">No events match your search or filters.</p>
        ) : (
          <AnimatePresence mode="popLayout">
            {showTechnical && (
              <CategorySection
                category="Technical"
                events={technical}
                numberOffset={0}
                onViewDetails={setActiveEvent}
              />
            )}
            {showNonTechnical && (
              <CategorySection
                category="Non-Technical"
                events={nonTechnical}
                numberOffset={showTechnical ? technical.length : 0}
                onViewDetails={setActiveEvent}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {activeEvent && <EventDetailsModal event={activeEvent} onClose={() => setActiveEvent(null)} />}
    </div>
  );
}
