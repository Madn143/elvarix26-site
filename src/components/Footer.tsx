export default function Footer() {
  return (
    <footer className="border-t border-copper/20 bg-coal">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg text-parchment">ELVARIX'26</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-copper-light">
              Innovate • Inspire • Ignite
            </p>
          </div>
          <div className="text-xs leading-relaxed">
            <p>Department of Computer Science Engineering</p>
            <p>Grace College of Engineering, Thoothukudi</p>
            <p>September 23, 2026</p>
          </div>
        </div>
        <p className="mt-8 border-t border-white/5 pt-6 text-xs text-muted/70">
          © 2026 ELVARIX Symposium Committee. Built by the Department of CSE.
        </p>
      </div>
    </footer>
  );
}
