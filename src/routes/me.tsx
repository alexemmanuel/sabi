import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Stamp } from "@/components/stamp";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CITIES, SKILLS } from "@/lib/sabi/catalog";
import { getMyProfile, updateMyProfile, type ProfileRow } from "@/lib/sabi/server";
import { formatScore } from "@/lib/utils";

export const Route = createFileRoute("/me")({ component: MePage });

function MePage() {
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    getMyProfile()
      .then((p) => {
        if (live) setProfile(p);
      })
      .catch(() => toast.error("Could not load profile"))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [isPending, user]);

  if (isPending) return <div className="h-48 animate-pulse rounded-xl bg-surface" />;
  if (!user) return <RedirectToSignIn />;
  if (loading || !profile) return <div className="h-48 animate-pulse rounded-xl bg-surface" />;

  return (
    <MeForm
      profile={profile}
      onSaved={async (p) => {
        setProfile(p);
        await router.invalidate();
      }}
    />
  );
}

function MeForm({
  profile,
  onSaved,
}: {
  profile: ProfileRow;
  onSaved: (p: ProfileRow) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio);
  const [primarySkill, setPrimarySkill] = useState(profile.primarySkill);
  const [role, setRole] = useState(profile.role);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const next = await updateMyProfile({
        data: { displayName, city, bio, primarySkill, role },
      });
      toast.success("Profile saved");
      await onSaved(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-3">
          <Stamp name={displayName} seed={profile.userId} size="lg" />
          <div>
            <h1 className="font-display text-2xl tracking-tight">{displayName}</h1>
            <p className="text-sm text-muted">@{profile.handle}</p>
          </div>
        </div>
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
        <Link
          to="/pros/$handle"
          params={{ handle: profile.handle }}
          className="mt-5 inline-block text-sm text-muted hover:text-fg"
        >
          View public profile
        </Link>
      </section>

      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="font-display text-xl">Your record</h2>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
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
          <div className="space-y-1.5">
            <Label htmlFor="skill">Primary skill</Label>
            <select
              id="skill"
              value={primarySkill}
              onChange={(e) => setPrimarySkill(e.target.value)}
              className="h-11 w-full rounded-md border border-line bg-raised px-3 text-sm"
            >
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">I am here to</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-11 w-full rounded-md border border-line bg-raised px-3 text-sm"
          >
            <option value="both">Work and hire</option>
            <option value="pro">Get hired</option>
            <option value="client">Hire people</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </main>
  );
}
