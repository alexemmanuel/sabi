import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SkillCityFilters } from "@/components/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SKILLS } from "@/lib/sabi/catalog";
import { listJobs } from "@/lib/sabi/server";
import { naira } from "@/lib/utils";

type Search = { skill?: string; city?: string };

export const Route = createFileRoute("/jobs/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    skill: typeof s.skill === "string" ? s.skill : undefined,
    city: typeof s.city === "string" ? s.city : undefined,
  }),
  loaderDeps: ({ search }) => ({ skill: search.skill ?? "all", city: search.city ?? "all" }),
  loader: ({ deps }) => listJobs({ data: deps }),
  component: JobsPage,
});

function JobsPage() {
  const jobs = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs/" });

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Work</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Jobs</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Post a brief. Ranked people for that skill show first. Hire from proof, not from paper.
          </p>
        </div>
        <Button asChild>
          <Link to="/jobs/new">Post a job</Link>
        </Button>
      </div>
      <div className="mt-6">
        <SkillCityFilters
          skill={search.skill ?? "all"}
          city={search.city ?? "all"}
          onSkill={(skill) => navigate({ search: (prev) => ({ ...prev, skill: skill === "all" ? undefined : skill }) })}
          onCity={(city) => navigate({ search: (prev) => ({ ...prev, city: city === "all" ? undefined : city }) })}
        />
      </div>
      <div className="mt-6 space-y-3">
        {jobs.length === 0 ? (
          <p className="rounded-lg border border-line bg-surface p-6 text-sm text-muted">No jobs on this filter.</p>
        ) : (
          jobs.map((j) => (
            <Link
              key={j.id}
              to="/jobs/$id"
              params={{ id: String(j.id) }}
              className="block rounded-lg border border-line bg-surface p-4 hover:border-muted"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium leading-snug">{j.title}</h2>
                  <p className="mt-1 text-xs text-muted">
                    {SKILLS.find((s) => s.id === j.skillId)?.name} · {j.city} · {j.clientName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-accent">{naira(j.budgetNaira)}</p>
                  <Badge className="mt-1">{j.status}</Badge>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{j.description}</p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
