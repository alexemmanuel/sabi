import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Stamp } from "@/components/stamp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { SKILLS } from "@/lib/sabi/catalog";
import { completeJob, getJob, hirePro, rateJob } from "@/lib/sabi/server";
import { formatScore, naira } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$id")({
  loader: async ({ params }) => getJob({ data: Number(params.id) }),
  component: JobDetailPage,
});

function JobDetailPage() {
  const data = Route.useLoaderData();
  const user = useCurrentUser();
  const router = useRouter();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  if (!data) {
    return (
      <main>
        <h1 className="font-display text-3xl">Job not found</h1>
      </main>
    );
  }

  const { job, candidates } = data;
  const isClient = user?.id === job.clientId;
  const isHired = user?.id === job.hiredId;

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          {SKILLS.find((s) => s.id === job.skillId)?.name} · {job.city}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">{job.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge>{job.status}</Badge>
          <span className="font-mono text-sm text-accent">{naira(job.budgetNaira)}</span>
          <span className="text-xs text-faint">Posted by {job.clientName}</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">{job.description}</p>
        {job.hiredName ? (
          <p className="mt-4 text-sm">
            Hired:{" "}
            <span className="text-fg">{job.hiredName}</span>
          </p>
        ) : null}

        {isClient && job.status === "hired" ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => run(() => completeJob({ data: job.id }), "Marked complete")}>
              Mark complete
            </Button>
          </div>
        ) : null}
        {isHired && job.status === "hired" ? (
          <div className="mt-6">
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => run(() => completeJob({ data: job.id }), "Marked complete")}
            >
              Mark my work complete
            </Button>
          </div>
        ) : null}
        {isClient && job.status === "completed" ? (
          <form
            className="mt-6 space-y-3 rounded-lg border border-line bg-surface p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void run(
                () => rateJob({ data: { jobId: job.id, stars, comment } }),
                "Rating saved",
              );
            }}
          >
            <p className="text-sm font-medium">Rate the work</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  className={`h-10 w-10 rounded-md border text-sm ${stars >= n ? "border-paper bg-paper text-paper-fg" : "border-line text-muted"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did they actually do well?"
            />
            <Button type="submit" disabled={busy}>
              Save rating
            </Button>
          </form>
        ) : null}
      </section>

      <aside>
        <h2 className="font-display text-xl">Ranked for this skill</h2>
        <p className="mt-1 text-xs text-muted">Highest Sabi score first. Hire from here.</p>
        <ul className="mt-4 space-y-2">
          {candidates.map((p) => (
            <li key={p.userId} className="rounded-lg border border-line bg-surface p-3">
              <div className="flex items-center gap-3">
                <Stamp name={p.displayName} seed={p.userId} size="sm" />
                <Link to="/pros/$handle" params={{ handle: p.handle }} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.displayName}</p>
                  <p className="text-xs text-muted">
                    {formatScore(p.sabiScore)} · {p.city}
                  </p>
                </Link>
                {isClient && job.status === "open" ? (
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      run(() => hirePro({ data: { jobId: job.id, proId: p.userId } }), `Hired ${p.displayName}`)
                    }
                  >
                    Hire
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {!user ? (
          <p className="mt-4 text-sm text-muted">
            <Link to="/login" className="underline decoration-line underline-offset-4">
              Sign in
            </Link>{" "}
            as the client to hire.
          </p>
        ) : null}
      </aside>
    </main>
  );
}
