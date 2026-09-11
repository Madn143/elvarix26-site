import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center">
      <p className="font-mono text-sm text-copper-light">404</p>
      <h1 className="mt-3 font-display text-3xl text-parchment">Page Not Found</h1>
      <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-gold hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
