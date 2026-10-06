import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { SignInGate } from "@/lib/auth/gates";
import { SKILLS } from "@/lib/sabi/catalog";
import { getChallenge, getMyAttempt, submitChallenge } from "@/lib/sabi/server";

export const Route = createFileRoute("/challenges/$id")({
  loader: async ({ params }) => {
    const challenge = await getChallenge({ data: params.id });
    let attempt: { score: number; feedback: string; answer: string } | null = null;
    try {
      attempt = await getMyAttempt({ data: params.id });
    } catch {
      attempt = null;
    }
    return { challenge, attempt };
  },
  component: ChallengePage,
});

function ChallengePage() {
  const { challenge, attempt } = Route.useLoaderData();
  const [answer, setAnswer] = useState(attempt?.answer ?? "");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(
    attempt ? { score: attempt.score, feedback: attempt.feedback } : null,
  );

  if (!challenge) {
    return (
      <main>
        <h1 className="font-display text-3xl">Trial not found</h1>
        <Link to="/challenges" className="mt-4 inline-block text-sm text-muted hover:text-fg">
          All trials
        </Link>
      </main>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await submitChallenge({ data: { challengeId: challenge!.id, answer } });
      setResult(res);
      toast.success(`Scored ${res.score}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not score";
      if (message === "Unauthorized") {
        toast.error("Sign in to submit a trial.");
      } else {
        toast.error(message);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
        {SKILLS.find((s) => s.id === challenge.skillId)?.name} · {challenge.minutes} min
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">{challenge.title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{challenge.prompt}</p>
      <p className="mt-4 rounded-md border border-line bg-surface px-3 py-2 text-xs text-faint">
        Certificates are ignored. The scorer looks for sequence, safety, and whether you would actually do
        this on site.
      </p>

      {result ? (
        <div className="mt-6 rounded-lg border border-accent/30 bg-raised p-4">
          <p className="font-mono text-3xl text-accent">{result.score}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{result.feedback}</p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Walk the work. Order of checks. What you would refuse to guess."
          className="min-h-48"
        />
        <SignInGate
          fallback={
            <Button asChild className="w-full" variant="ghost">
              <Link to="/login">Sign in to submit</Link>
            </Button>
          }
        >
          <Button type="submit" disabled={pending || answer.trim().length < 40} className="w-full">
            {pending ? "Scoring…" : result ? "Resubmit trial" : "Submit trial"}
          </Button>
        </SignInGate>
      </form>
    </main>
  );
}
