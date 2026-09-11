import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-copper/20">
        <div className="circuit-bg absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-copper/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 py-28 text-center md:py-36">
          <motion.svg
            width="220"
            height="2"
            viewBox="0 0 220 2"
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <line x1="0" y1="1" x2="220" y2="1" stroke="#BF6A2E" strokeWidth="1" strokeDasharray="220" className="animate-trace" />
          </motion.svg>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-copper-light"
          >
            Department of Computer Science Engineering
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-6 font-display text-6xl font-bold tracking-wide text-parchment md:text-8xl"
          >
            ELVARIX<span className="text-gradient-copper">'26</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 font-display text-xl text-gold md:text-2xl"
          >
            "THE GRAND SYMPOSIUM"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.6 }}
            className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted"
          >
            Technical Events &nbsp;|&nbsp; Non-Technical Events
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-6 flex flex-col items-center gap-1 text-sm text-muted"
          >
            <span>September 23, 2026</span>
            <span>Grace College of Engineering</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              to="/register"
              className="rounded-sm bg-copper px-8 py-3 font-mono text-xs uppercase tracking-[0.25em] text-ink transition-transform hover:-translate-y-0.5 hover:bg-copper-light"
            >
              Register Now
            </Link>
            <Link
              to="/events"
              className="rounded-sm border border-white/15 px-8 py-3 font-mono text-xs uppercase tracking-[0.25em] text-parchment transition-transform hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              Explore Events
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 font-display text-sm tracking-[0.3em] text-copper-light/80"
          >
            INNOVATE • INSPIRE • IGNITE
          </motion.p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-5xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-copper-light">About</span>
            <h2 className="mt-3 font-display text-3xl text-parchment">ELVARIX'26</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Organized by the Department of Computer Science Engineering at Grace College of
              Engineering, ELVARIX'26 brings together technical rigor and creative expression across
              a single day of competitions, presentations, and challenges.
            </p>
          </div>

          <div className="space-y-6 border-l border-copper/20 pl-8">
            {[
              { label: "Organizing Department", value: "Computer Science Engineering" },
              { label: "Symposium", value: "ELVARIX'26 — The Grand Symposium" },
              { label: "Tracks", value: "Technical Events & Non-Technical Events" },
              { label: "Date", value: "September 23, 2026" },
              { label: "Venue", value: "Grace College of Engineering" },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                  {row.label}
                </span>
                <span className="text-right text-sm text-parchment">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
