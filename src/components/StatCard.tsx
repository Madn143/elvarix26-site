interface StatCardProps {
  label: string;
  value: number | string;
  accent?: "copper" | "gold" | "plain";
}

export default function StatCard({ label, value, accent = "plain" }: StatCardProps) {
  const accentClass =
    accent === "copper" ? "text-copper-light" : accent === "gold" ? "text-gold" : "text-parchment";

  return (
    <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}
