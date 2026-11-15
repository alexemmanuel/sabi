import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

const DOORS = [
  {
    to: "/board",
    kicker: "Rank",
    title: "The board",
    body: "People ranked by work they have already shown, in a city and a skill. A certificate does not move the list.",
  },
  {
    to: "/challenges",
    kicker: "Prove",
    title: "Trials",
    body: "Timed problems: a dead socket, a bad fit, a pitch, a cut. Write how you would actually do it. The score sticks to your name.",
  },
  {
    to: "/jobs",
    kicker: "Hire",
    title: "Jobs",
    body: "A client posts the work. Sabi shows people who have already passed that kind of trial, then keeps the rating after the job.",
  },
  {
    to: "/me",
    kicker: "You",
    title: "Your sabi",
    body: "Set your city and skill. Take trials. The same reputation follows you from one gig to the next.",
  },
] as const;

function Home() {
  return (
    <main className="space-y-10">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Skill over paper</p>
        <h1 className="mt-2 max-w-xl font-display text-4xl leading-tight tracking-tight md:text-5xl">
          Show the work. The certificate can wait.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Sabi ranks people by what they can do: trials, finished jobs, and ratings. Lagos to Kano. Electrical, fashion, code, cooking. No exam body required.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/board"
            className="inline-flex h-11 items-center rounded-md bg-paper px-4 text-sm font-medium text-paper-fg"
          >
            Open the board
          </Link>
          <Link
            to="/challenges"
            className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm"
          >
            Take a trial
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {DOORS.map((door) => (
          <Link
            key={door.to}
            to={door.to}
            className="rounded-lg border border-line bg-surface p-4 hover:border-muted"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-faint">{door.kicker}</p>
            <h2 className="mt-1 font-display text-2xl">{door.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{door.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
