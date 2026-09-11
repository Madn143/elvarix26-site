import { useNavigate, useSearchParams } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import type { RegistrationType } from "../../types";

export default function RegisterType() {
  const { resetRegistration, setRegistrationType, setPreselectEventId } = useRegistration();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const choose = (type: RegistrationType) => {
    resetRegistration();
    setRegistrationType(type);
    const preselect = searchParams.get("event");
    if (preselect) setPreselectEventId(preselect);
    navigate("/register/personal");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-5 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-copper-light">Registration</span>
      <h1 className="mt-3 text-center font-display text-3xl text-parchment md:text-4xl">
        Choose Your Registration Type
      </h1>

      <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
        <button
          onClick={() => choose("Internal")}
          className="group rounded-sm border border-copper/30 bg-coffee/40 p-10 text-left transition-all hover:-translate-y-1 hover:border-copper hover:shadow-[0_0_40px_-10px_rgba(191,106,46,0.5)]"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Option 01</span>
          <h2 className="mt-4 font-display text-2xl text-parchment">Internal Participant</h2>
          <p className="mt-3 text-sm text-muted">Students from Grace College of Engineering.</p>
          <span className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-gold group-hover:underline">
            Continue →
          </span>
        </button>

        <button
          onClick={() => choose("External")}
          className="group rounded-sm border border-copper/30 bg-coffee/40 p-10 text-left transition-all hover:-translate-y-1 hover:border-copper hover:shadow-[0_0_40px_-10px_rgba(191,106,46,0.5)]"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper-light">Option 02</span>
          <h2 className="mt-4 font-display text-2xl text-parchment">External Participant</h2>
          <p className="mt-3 text-sm text-muted">Students from other colleges.</p>
          <span className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-gold group-hover:underline">
            Continue →
          </span>
        </button>
      </div>
    </div>
  );
}
