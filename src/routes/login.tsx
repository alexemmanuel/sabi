import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto max-w-md py-10">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Enter</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Sign in to prove it.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your rank, trials, and jobs follow this account. Guests can browse the board. Signing in is how you
        sit on it.
      </p>
      <div className="mt-8 space-y-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => signIn(p.providerId, { callbackURL: "/me" })}
            >
              Continue with {p.label}
            </Button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
      <p className="mt-6 text-sm text-faint">
        <Link to="/" className="underline decoration-line underline-offset-4 hover:text-fg">
          Back to the board
        </Link>
      </p>
    </main>
  );
}
