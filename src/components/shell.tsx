import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/board", label: "Board" },
  { to: "/challenges", label: "Trials" },
  { to: "/jobs", label: "Jobs" },
  { to: "/me", label: "You" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-paper font-display text-sm font-semibold text-paper-fg">
              S
            </span>
            <span className="font-display text-lg tracking-tight">Sabi</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2.5 py-2 text-muted hover:text-fg data-[status=active]:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">{children}</div>
    </div>
  );
}
