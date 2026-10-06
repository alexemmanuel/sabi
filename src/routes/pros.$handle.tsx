import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Stamp } from "@/components/stamp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { SKILLS } from "@/lib/sabi/catalog";
import { endorsePro, getProfileByHandle } from "@/lib/sabi/server";
import { formatScore } from "@/lib/utils";

export const Route = createFileRoute("/pros/$handle")({
  loader: ({ params }) => getProfileByHandle({ data: params.handle }),
  component: ProPage,
});

function ProPage() {
  const data = Route.useLoaderData();
  const user = useCurrentUser();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (!data) {
    return (
      <main>
        <h1 className="font-display text-3xl">Nobody with that handle</h1>
        <Link to="/board" className="mt-4 inline-block text-sm text-muted">
          Back to the board
        </Link>
      </main>
    );
  }

  const { profile, attempts, endorsements, ratings } = data;
  const canEndorse = user && user.id !== profile.userId;

  return (
    <main className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-xl border border-line bg-surface p-5">
        <Stamp name={profile.displayName} seed={profile.userId} size="lg" />
        <h1 className="mt-4 font-display text-3xl tracking-tight">{profile.displayName}</h1>
        <p className="text-sm text-muted">
          @{profile.handle} · {profile.city}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{SKILLS.find((s) => s.id === profile.primarySkill)?.name}</Badge>
          {profile.isFeatured ? <Badge>Featured</Badge> : null}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{profile.bio || "No bio yet."}</p>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-raised p-3">
            <dt className="text-[11px] uppercase tracking-wide text-faint">Sabi</dt>
            <dd className="font-mono text-2xl text-accent">{formatScore(profile.sabiScore)}</dd>
          </div>
          <div className="rounded-md bg-raised p-3">
            <dt className="text-[11px] uppercase tracking-wide text-faint">Jobs</dt>
            <dd className="font-mono text-2xl">{profile.jobsDone}</dd>
          </div>
          <div className="rounded-md bg-raised p-3">
            <dt className="text-[11px] uppercase tracking-wide text-faint">Rating</dt>
            <dd className="font-mono text-2xl">
              {profile.ratingCount ? profile.ratingAvg.toFixed(1) : "—"}
            </dd>
          </div>
        </dl>
        {canEndorse ? (
          <form
            className="mt-6 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await endorsePro({
                  data: { toId: profile.userId, skillId: profile.primarySkill, note },
                });
                toast.success("Endorsed");
                setNote("");
                await router.invalidate();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not endorse");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I have seen this person work…"
            />
            <Button type="submit" variant="ghost" className="w-full" disabled={busy}>
              Endorse this skill
            </Button>
          </form>
        ) : null}
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="font-display text-xl">Trials</h2>
          {attempts.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No trials submitted yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {attempts.map((a) => (
                <li key={a.challengeId} className="rounded-lg border border-line bg-surface p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link to="/challenges/$id" params={{ id: a.challengeId }} className="text-sm font-medium">
                      {a.title}
                    </Link>
                    <span className="font-mono text-accent">{a.score}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{a.feedback}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-display text-xl">Endorsements</h2>
          {endorsements.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No peer stamps yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {endorsements.map((e, i) => (
                <li key={`${e.fromId}-${i}`} className="text-sm text-muted">
                  <span className="text-fg">{e.fromName}</span> on {SKILLS.find((s) => s.id === e.skillId)?.name}
                  {e.note ? ` — ${e.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-display text-xl">Client notes</h2>
          {ratings.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No ratings yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {ratings.map((r, i) => (
                <li key={i} className="text-sm text-muted">
                  {r.stars}/5{r.comment ? ` — ${r.comment}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
