import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { fetchAllRegistrations } from "../../services/api/registrations";
import type { Participant } from "../../types";

const ADMIN_PASSWORD = "2020";

function csvValue(value: unknown): string {
  const text = Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join("; ")
    : value == null
      ? ""
      : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(registrations: Participant[]) {
  const columns = [
    "Registration ID", "Full Name", "Email", "Phone", "Gender", "Registration Type",
    "College", "Department", "Year", "Events", "Paper Team", "Paper Team Size",
    "E-Sports Team", "E-Sports Team Size", "E-Sports Game", "Food Preference",
    "Transaction ID", "Amount", "Payment Status", "Registered On",
  ];
  const rows = registrations.map((registration) => [
    registration.registrationId,
    registration.fullName,
    registration.email,
    registration.phone,
    registration.gender,
    registration.registrationType,
    registration.collegeName,
    registration.department,
    registration.year,
    registration.selectedEvents.map((event) => event.eventName).join("; "),
    registration.paperTeamName,
    registration.paperTeamSize,
    registration.esportsTeamName,
    registration.esportsTeamSize,
    registration.esportsGame,
    registration.foodPreference,
    registration.transactionId,
    registration.totalAmount,
    registration.paymentStatus,
    registration.createdAt,
  ]);
  const csv = [columns, ...rows].map((row) => row.map(csvValue).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `elvarix-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
      return;
    }
    setError("Incorrect admin password.");
    setPassword("");
  };

  return (
    <main className="circuit-bg flex min-h-screen items-center justify-center px-5 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-sm border border-copper/30 bg-coffee/50 p-8 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
          <ShieldCheck size={24} />
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-copper-light">ELVARIX'26 / Restricted Area</p>
        <h1 className="mt-3 font-display text-3xl text-parchment">Admin Access</h1>
        <p className="mt-2 text-sm text-muted">Sign in to view registration records and payment totals.</p>
        <label className="mt-8 block">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Password</span>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-sm border border-white/10 bg-black/30 px-4 py-3 text-parchment focus:border-gold focus:outline-none"
          />
        </label>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button type="submit" className="mt-6 w-full rounded-sm bg-copper px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light">
          Enter Dashboard
        </button>
      </form>
    </main>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRegistrations = async () => {
    setLoading(true);
    setError("");
    try {
      setRegistrations(await fetchAllRegistrations());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) void loadRegistrations();
  }, [authenticated]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;
    return registrations.filter((registration) =>
      [registration.registrationId, registration.fullName, registration.email, registration.phone, registration.collegeName, registration.registrationType, registration.transactionId]
        .some((value) => String(value ?? "").toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  const internalCount = registrations.filter((registration) => registration.registrationType === "Internal").length;
  const externalCount = registrations.filter((registration) => registration.registrationType === "External").length;
  const vegCount = registrations.filter((registration) => registration.foodPreference === "Veg").length;
  const nonVegCount = registrations.filter((registration) => registration.foodPreference === "Non-Veg").length;
  const amountReceived = registrations.reduce((total, registration) => total + (Number(registration.totalAmount) || 0), 0);

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;

  return (
    <main className="circuit-bg min-h-screen bg-ink px-5 py-10 text-parchment md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-copper/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-copper-light">ELVARIX'26 / Control Room</p>
            <h1 className="mt-2 font-display text-3xl text-parchment md:text-4xl">Registration Dashboard</h1>
            <p className="mt-2 text-sm text-muted">Live records from the Firebase registrations collection.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => void loadRegistrations()} className="flex items-center gap-2 rounded-sm border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-muted hover:border-copper/50 hover:text-parchment">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button type="button" onClick={() => downloadCsv(registrations)} disabled={registrations.length === 0} className="flex items-center gap-2 rounded-sm bg-copper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink hover:bg-copper-light disabled:cursor-not-allowed disabled:opacity-40">
              <Download size={14} /> Download All CSV
            </button>
            <button type="button" onClick={() => setAuthenticated(false)} className="flex items-center gap-2 rounded-sm border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-muted hover:text-parchment">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </header>

        {error && <div className="mt-6 rounded-sm border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</div>}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Total Students</p><p className="mt-2 font-display text-3xl font-bold text-parchment">{registrations.length}</p></div>
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Internal Students</p><p className="mt-2 font-display text-3xl font-bold text-gold">{internalCount}</p></div>
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">External Students</p><p className="mt-2 font-display text-3xl font-bold text-copper-light">{externalCount}</p></div>
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Veg Registrations</p><p className="mt-2 font-display text-3xl font-bold text-gold">{vegCount}</p></div>
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Non-Veg Registrations</p><p className="mt-2 font-display text-3xl font-bold text-copper-light">{nonVegCount}</p></div>
          <div className="rounded-sm border border-copper/20 bg-coffee/40 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Amount Received</p><p className="mt-2 font-display text-3xl font-bold text-gold">₹{amountReceived.toLocaleString("en-IN")}</p></div>
        </section>

        <section className="mt-8 rounded-sm border border-copper/20 bg-coffee/30">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
            <div><h2 className="font-display text-xl text-parchment">Student Records</h2><p className="mt-1 text-xs text-muted">{filteredRegistrations.length} of {registrations.length} records shown</p></div>
            <label className="relative block w-full md:max-w-sm"><Search size={15} className="absolute left-3 top-3.5 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ID, email..." className="w-full rounded-sm border border-white/10 bg-black/30 py-3 pl-9 pr-4 text-sm text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none" /></label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1320px] w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Student</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">College</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Events</th><th className="px-5 py-3">Team Details</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Transaction ID</th><th className="px-5 py-3">Registered</th></tr></thead>
              <tbody className="divide-y divide-white/5">{filteredRegistrations.map((registration) => <tr key={registration.registrationId} className="hover:bg-white/[0.03]"><td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-gold">{registration.registrationId}</td><td className="px-5 py-4"><div className="font-medium text-parchment">{registration.fullName}</div><div className="mt-1 text-xs text-muted">{registration.gender || "Gender not given"}</div></td><td className="px-5 py-4 text-xs text-muted"><div>{registration.email}</div><div className="mt-1">{registration.phone}</div></td><td className="max-w-[190px] px-5 py-4 text-xs text-muted"><div className="truncate" title={registration.collegeName}>{registration.collegeName}</div><div className="mt-1">{registration.department} / {registration.year}</div></td><td className="px-5 py-4"><span className={registration.registrationType === "Internal" ? "text-gold" : "text-copper-light"}>{registration.registrationType}</span></td><td className="max-w-[170px] px-5 py-4 text-xs text-parchment">{registration.selectedEvents.map((event) => event.eventName).join(", ")}</td><td className="max-w-[210px] px-5 py-4 text-xs text-muted">{registration.paperTeamName && <div>Paper: <span className="text-parchment">{registration.paperTeamName}</span> ({registration.paperTeamSize})</div>}{registration.esportsTeamName && <div>E-Sports: <span className="text-parchment">{registration.esportsTeamName}</span> ({registration.esportsTeamSize})</div>}{registration.esportsGame && <div className="mt-1 text-copper-light">{registration.esportsGame}</div>}{!registration.paperTeamName && !registration.esportsTeamName && "Individual"}</td><td className="whitespace-nowrap px-5 py-4 text-gold">₹{Number(registration.totalAmount || 0).toLocaleString("en-IN")}</td><td className="max-w-[180px] break-all px-5 py-4 font-mono text-xs text-parchment" title={registration.transactionId}>{registration.transactionId}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-muted">{new Date(registration.createdAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody>
            </table>
            {!loading && filteredRegistrations.length === 0 && <div className="px-5 py-14 text-center text-sm text-muted"><Users className="mx-auto mb-3 text-copper/60" size={28} />No registration records found.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
