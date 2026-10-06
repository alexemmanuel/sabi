import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Stamp } from "@/components/stamp";
import { Button } from "@/components/ui/button";
import { SKILLS } from "@/lib/sabi/catalog";
import { listBoard, listChallenges, listJobs } from "@/lib/sabi/server";
import { formatScore, naira } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [board, jobs, challenges] = await Promise.all([
      listBoard({ data: { skill: "all", city: "all" } }),
      listJobs({ data: { skill: "all", city: "all" } }),
      listChallenges(),
    ]);
    return { board: board.slice(0, 6), jobs: jobs.filter((j) => j.status === "open").slice(0, 3), challenges: challenges.slice(0, 4) };
  },
  component: Home,
});

function Home() {
  const { board, jobs, challenges } = Route.useLoaderData();

  return (
    <main className="space-y-14">
      <section className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Proof of skill</p>
          <h1 className="mt-3 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Sabi over certificate.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Paper can lie. Work cannot. Sabi ranks people by challenges, completed jobs, and client ratings —
            not by the school that printed a name.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/challenges">Take a trial</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/jobs">Hire from the board</Link>
            </Button>
          </div>
        </div>
        <aside className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wide text-faint">How rank is earned</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex justify-between gap-4 border-b border-line pb-3">
              <span>Skill trials</span>
              <span className="font-mono text-fg">45%</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-line pb-3">
              <span>Client ratings</span>
              <span className="font-mono text-fg">30%</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-line pb-3">
              <span>Completed jobs</span>
              <span className="font-mono text-fg">15%</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Peer endorsements</span>
              <span className="font-mono text-fg">10%</span>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-faint">
            Certificates can sit on a profile. They do not move the number.
          </p>
        </aside>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight">The board</h2>
          <Link to="/board" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            Full ranking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((p, i) => (
            <Link
              key={p.userId}
              to="/pros/$handle"
              params={{ handle: p.handle }}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-muted"
            >
              <span className="w-6 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
              <Stamp name={p.displayName} seed={p.userId} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.displayName}</p>
                <p className="truncate text-xs text-muted">
                  {SKILLS.find((s) => s.id === p.primarySkill)?.name} · {p.city}
                </p>
              </div>
              <span className="font-mono text-lg text-accent">{formatScore(p.sabiScore)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl tracking-tight">Open jobs</h2>
            <Link to="/jobs" className="text-sm text-muted hover:text-fg">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.map((j) => (
              <Link
                key={j.id}
                to="/jobs/$id"
                params={{ id: String(j.id) }}
                className="block rounded-lg border border-line bg-surface p-4 hover:border-muted"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium leading-snug">{j.title}</p>
                  <span className="shrink-0 font-mono text-sm text-accent">{naira(j.budgetNaira)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {SKILLS.find((s) => s.id === j.skillId)?.name} · {j.city}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl tracking-tight">Live trials</h2>
            <Link to="/challenges" className="text-sm text-muted hover:text-fg">
              All trials
            </Link>
          </div>
          <div className="space-y-3">
            {challenges.map((c) => (
              <Link
                key={c.id}
                to="/challenges/$id"
                params={{ id: c.id }}
                className="block rounded-lg border border-line bg-surface p-4 hover:border-muted"
              >
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {SKILLS.find((s) => s.id === c.skillId)?.name} · {c.minutes} min · {c.difficulty}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
