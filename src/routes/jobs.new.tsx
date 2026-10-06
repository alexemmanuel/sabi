import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CITIES, SKILLS } from "@/lib/sabi/catalog";
import { postJob } from "@/lib/sabi/server";

export const Route = createFileRoute("/jobs/new")({ component: NewJobPage });

function NewJobPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillId, setSkillId] = useState(SKILLS[0].id);
  const [city, setCity] = useState("Lagos");
  const [budget, setBudget] = useState("50000");
  const [saving, setSaving] = useState(false);

  if (isPending) {
    return <div className="h-40 animate-pulse rounded-xl bg-surface" />;
  }
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await postJob({
        data: {
          title,
          description,
          skillId,
          city,
          budgetNaira: Number(budget),
        },
      });
      toast.success("Job posted");
      void navigate({ to: "/jobs/$id", params: { id: String(res.id) } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Client</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Post a job</h1>
      <p className="mt-2 text-sm text-muted">
        Ranked people for that skill will appear on the job. You hire from the list.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="skill">Skill</Label>
            <select
              id="skill"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value as typeof skillId)}
              className="h-11 w-full rounded-md border border-line bg-raised px-3 text-sm"
            >
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 w-full rounded-md border border-line bg-raised px-3 text-sm"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">Budget (naira)</Label>
          <Input
            id="budget"
            type="number"
            min={5000}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desc">Brief</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Posting…" : "Publish job"}
        </Button>
        <p className="text-center text-sm">
          <Link to="/jobs" className="text-muted hover:text-fg">
            Cancel
          </Link>
        </p>
      </form>
    </main>
  );
}
