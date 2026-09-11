import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { TextField, OptionGroupField } from "../../components/FormField";

const TEAM_SIZES = [1, 2, 3, 4];
const ESPORTS_GAMES = ["Free Fire", "PUBG", "Efootball"] as const;

export default function TeamStep() {
  const {
    selectedEvents,
    paperTeamName,
    paperTeamSize,
    esportsTeamName,
    esportsTeamSize,
    esportsGame,
    setPaperTeamName,
    setPaperTeamSize,
    setEsportsTeamName,
    setEsportsTeamSize,
    setEsportsGame,
    resetEvents,
    resetTeam,
  } = useRegistration();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const hasPaper = selectedEvents.some((e) => e.eventName === "Paper Presentation");
  const hasEsports = selectedEvents.some((e) => e.eventName === "E-Sports");
  const hasAnyTeam = hasPaper || hasEsports;

  // Categorize selected events for display
  const technicalEvents = selectedEvents.filter((e) => e.eventCategory === "Technical");
  const nonTechnicalEvents = selectedEvents.filter((e) => e.eventCategory === "Non-Technical");

  const handleContinue = (e?: FormEvent) => {
    e?.preventDefault();
    if (hasPaper && !paperTeamName.trim()) {
      setError("Team Name is required for Paper Presentation.");
      return;
    }
    if (hasEsports && !esportsTeamName.trim()) {
      setError("Team Name is required for E-Sports.");
      return;
    }
    if (hasEsports && !esportsGame) {
      setError("Please select a game for E-Sports.");
      return;
    }
    setError("");
    navigate("/register/payment");
  };

  const TeamSizeSelector = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (size: number) => void;
  }) => (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        Number of Members <span className="text-copper-light">*</span>
      </span>
      <div className="mt-2 flex gap-2">
        {TEAM_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`flex h-12 w-12 items-center justify-center rounded-sm border font-mono text-sm transition-colors ${
              value === size
                ? "border-gold bg-gold/10 text-gold"
                : "border-white/10 text-muted hover:border-copper/40 hover:text-parchment"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Minimum 1, maximum 4 members.</p>
    </div>
  );

  return (
    <form onSubmit={handleContinue} noValidate className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl text-parchment">Team & Events</h2>
        <p className="mt-1 text-sm text-muted">
          Review your selected events and fill in team details where required.
        </p>
      </div>

      {/* Selected Events Summary */}
      <div className="rounded-sm border border-white/10 bg-coffee/20 p-5 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
          Your Selected Events
        </p>

        {technicalEvents.length > 0 ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
              <Check size={11} strokeWidth={3} />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Technical</p>
              <p className="text-sm text-parchment">
                {technicalEvents.map((e) => e.eventName).join(", ")}
                {hasPaper && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">(Team)</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted/60 italic">No technical event selected.</p>
        )}

        {nonTechnicalEvents.length > 0 ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
              <Check size={11} strokeWidth={3} />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Non-Technical</p>
              <p className="text-sm text-parchment">
                {nonTechnicalEvents.map((e) => e.eventName).join(", ")}
                {hasEsports && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">(Team)</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted/60 italic">No non-technical event selected.</p>
        )}
      </div>

      {/* Paper Presentation Team Section */}
      {hasPaper && (
        <div className="rounded-sm border border-copper/30 bg-coffee/30 p-5 space-y-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
              Paper Presentation — Team Details
            </p>
            <p className="mt-1 text-xs text-muted">
              Technical team event. Enter your paper presentation team details.
            </p>
          </div>
          <TextField
            label="Team Name"
            required
            value={paperTeamName}
            onChange={(e) => setPaperTeamName(e.target.value)}
            placeholder="Enter your team name"
          />
          <TeamSizeSelector value={paperTeamSize} onChange={setPaperTeamSize} />
        </div>
      )}

      {/* E-Sports Team Section */}
      {hasEsports && (
        <div className="rounded-sm border border-copper/30 bg-coffee/30 p-5 space-y-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">
              E-Sports — Team Details
            </p>
            <p className="mt-1 text-xs text-muted">
              Non-technical team event. Enter your E-Sports team details and select a game.
            </p>
          </div>
          <TextField
            label="Team Name"
            required
            value={esportsTeamName}
            onChange={(e) => setEsportsTeamName(e.target.value)}
            placeholder="Enter your team name"
          />
          <TeamSizeSelector value={esportsTeamSize} onChange={setEsportsTeamSize} />
          <OptionGroupField
            label="Select Game"
            required
            name="esports-game"
            value={esportsGame || ""}
            onChange={setEsportsGame}
            options={ESPORTS_GAMES.map((g) => ({ label: g, value: g }))}
          />
        </div>
      )}

      {/* No team events */}
      {!hasAnyTeam && (
        <div className="flex items-center gap-4 rounded-sm border border-gold/40 bg-gold/10 p-5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold bg-gold text-ink">
            <Check size={14} strokeWidth={3} />
          </span>
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.15em] text-gold">
              Individual Participation
            </p>
            <p className="mt-1 text-xs text-muted">
              Your selected events are for individual participants — no team details needed.
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Actions */}
      <div className="flex items-center pt-2">
        <button
          type="button"
          onClick={() => {
            resetEvents();
            resetTeam();
            navigate("/register/events");
          }}
          className="rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            setPaperTeamName("");
            setPaperTeamSize(1);
            setEsportsTeamName("");
            setEsportsTeamSize(1);
            setEsportsGame("");
            setError("");
          }}
          className="ml-4 rounded-sm border border-white/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-parchment"
        >
          Clear
        </button>
        <div className="flex-1" />
        <button
          type="submit"
          className="rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
