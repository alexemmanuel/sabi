import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { SKILLS } from "@/lib/sabi/catalog";
import { listChallenges } from "@/lib/sabi/server";

export const Route = createFileRoute("/challenges/")({
  loader: () => listChallenges(),
  component: ChallengesPage,
});

function ChallengesPage() {
  const challenges = Route.useLoaderData();
  const groups = SKILLS.map((skill) => ({
    skill,
    items: challenges.filter((c) => c.skillId === skill.id),
  })).filter((g) => g.items.length);

  return (
    <main>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Prove it</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Trials</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Timed, scored, no certificate required. Write how you would actually do the work. Ranked people
        review the same problems.
      </p>
      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <section key={g.skill.id}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-xl">{g.skill.name}</h2>
              <span className="text-xs text-faint">{g.skill.category}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {g.items.map((c) => (
                <Link
                  key={c.id}
                  to="/challenges/$id"
                  params={{ id: c.id }}
                  className="rounded-lg border border-line bg-surface p-4 hover:border-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium leading-snug">{c.title}</h3>
                    <Badge>{c.difficulty}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{c.prompt}</p>
                  <p className="mt-3 text-xs text-faint">{c.minutes} minutes</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
