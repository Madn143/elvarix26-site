import type { FlowStep } from "../utils/registrationSteps";

export default function ProgressSteps({ currentPath, steps }: { currentPath: string; steps: FlowStep[] }) {
  const currentIndex = steps.findIndex((s) => s.path === currentPath);

  return (
    <div className="mx-auto mb-10 flex max-w-3xl items-center justify-between overflow-x-auto px-2">
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;
        return (
          <div key={step.n} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors ${
                  isActive
                    ? "border-gold bg-gold/10 text-gold"
                    : isDone
                    ? "border-copper bg-copper text-ink"
                    : "border-white/15 text-muted"
                }`}
              >
                {step.n}
              </div>
              <span
                className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] ${
                  isActive ? "text-parchment" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${isDone ? "bg-copper" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
