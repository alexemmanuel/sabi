import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SkillCityFilters } from "@/components/filters";
import { Stamp } from "@/components/stamp";
import { SKILLS } from "@/lib/sabi/catalog";
import { listBoard } from "@/lib/sabi/server";
import { formatScore } from "@/lib/utils";

type Search = { skill?: string; city?: string };

export const Route = createFileRoute("/board")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    skill: typeof s.skill === "string" ? s.skill : undefined,
    city: typeof s.city === "string" ? s.city : undefined,
  }),
  loaderDeps: ({ search }) => ({ skill: search.skill ?? "all", city: search.city ?? "all" }),
  loader: ({ deps }) => listBoard({ data: deps }),
  component: BoardPage,
});

function BoardPage() {
  const people = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/board" });

  return (
    <main>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Public ranking</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">The board</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Sorted by Sabi score. Take trials, finish jobs, collect ratings. Paper does not move you up.
      </p>
      <div className="mt-6">
        <SkillCityFilters
          skill={search.skill ?? "all"}
          city={search.city ?? "all"}
          onSkill={(skill) => navigate({ search: (prev) => ({ ...prev, skill: skill === "all" ? undefined : skill }) })}
          onCity={(city) => navigate({ search: (prev) => ({ ...prev, city: city === "all" ? undefined : city }) })}
        />
      </div>
      <ol className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {people.length === 0 ? (
          <li className="p-6 text-sm text-muted">Nobody on this slice of the board yet.</li>
        ) : (
          people.map((p, i) => (
            <li key={p.userId}>
              <Link
                to="/pros/$handle"
                params={{ handle: p.handle }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-raised"
              >
                <span className="w-7 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <Stamp name={p.displayName} seed={p.userId} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.displayName}</p>
                  <p className="truncate text-xs text-muted">
                    {SKILLS.find((s) => s.id === p.primarySkill)?.name} · {p.city}
                    {p.ratingCount ? ` · ${p.ratingAvg.toFixed(1)} from ${p.ratingCount}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg text-accent">{formatScore(p.sabiScore)}</p>
                  <p className="text-[11px] text-faint">{p.jobsDone} jobs</p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ol>
    </main>
  );
}
