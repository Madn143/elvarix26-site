import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, an uncaught error anywhere in the React tree (e.g. calling
 * .filter() on data that turned out not to be an array because an API call
 * silently returned the wrong thing) unmounts the entire app and leaves a
 * blank white page with no visible clue why. This boundary catches that and
 * shows the actual error message on screen instead, in the existing theme,
 * so it's actionable instead of silent.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ELVARIX'26 caught a render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper-light">
            Something Went Wrong
          </p>
          <h1 className="mt-3 font-display text-2xl text-parchment">This page hit an error</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">{this.state.error.message}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => this.setState({ error: null })}
              className="rounded-sm border border-white/15 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-parchment hover:border-gold hover:text-gold"
            >
              Try Again
            </button>
            <a
              href="/"
              className="rounded-sm bg-copper px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-copper-light"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
