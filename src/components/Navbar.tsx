import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-copper/20 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-bold tracking-wide text-parchment">
            ELVARIX<span className="text-gold">'26</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-copper-light" : "text-muted hover:text-parchment"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/register"
            className="rounded-sm border border-copper bg-copper/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-light transition-colors hover:bg-copper hover:text-ink"
          >
            Register Now
          </Link>
        </nav>

        <button
          className="text-parchment md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
      </div>

      {open && (
        <div className="border-t border-copper/20 bg-coal px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.2em] text-muted hover:text-parchment"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="rounded-sm border border-copper bg-copper/10 px-5 py-2 text-center font-mono text-sm uppercase tracking-[0.2em] text-copper-light"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
