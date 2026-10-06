import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, House, Trophy, UserRound, Zap } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/board", label: "Board", icon: Trophy },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/challenges", label: "Trials", icon: Zap },
  { to: "/me", label: "Me", icon: UserRound },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-md bg-raised" />;
  }
  if (user) return <UserButton />;
  return (
    <Link
      to="/login"
      className="inline-flex h-9 items-center rounded-md border border-line px-3 text-sm text-fg hover:bg-raised"
    >
      Sign in
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-paper font-display text-sm font-semibold text-paper-fg">
              S
            </span>
            <span className="font-display text-lg tracking-tight">Sabi</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.to ? "bg-raised text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SignedOut>
              <span className="hidden text-xs text-faint sm:inline">Proof over paper</span>
            </SignedOut>
            <SignedIn>
              <span className="hidden text-xs text-faint sm:inline">Your sabi is the CV</span>
            </SignedIn>
            <AuthSlot />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-12">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                    active ? "text-fg" : "text-faint",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.7} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
