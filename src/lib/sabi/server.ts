import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { CHALLENGES, FEATURED, SAMPLE_JOBS, SKILLS, type SkillId } from "./catalog";

const cache = new Map<string, { at: number; value: unknown }>();
let seedReady = false;
const submitTimes = new Map<string, number[]>();

function remember<T>(key: string, value: T): T {
  cache.set(key, { at: Date.now(), value });
  if (cache.size > 80) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  return value;
}

function recall<T>(key: string, ttlMs: number): T | undefined {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.at > ttlMs) return undefined;
  return hit.value as T;
}

function bustPublic() {
  for (const key of cache.keys()) {
    if (key.startsWith("board:") || key.startsWith("jobs:") || key.startsWith("job:")) cache.delete(key);
  }
}

function allowSubmit(userId: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (submitTimes.get(userId) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= 8) return false;
  recent.push(now);
  submitTimes.set(userId, recent);
  return true;
}

export type ProfileRow = {
  userId: string;
  handle: string;
  displayName: string;
  city: string;
  bio: string;
  role: string;
  primarySkill: string;
  isFeatured: boolean;
  sabiScore: number;
  jobsDone: number;
  ratingAvg: number;
  ratingCount: number;
};

export type JobRow = {
  id: number;
  clientId: string;
  skillId: string;
  title: string;
  description: string;
  city: string;
  budgetNaira: number;
  status: string;
  hiredId: string | null;
  createdAt: string;
  clientName: string;
  hiredName: string | null;
};

type ProfileSql = {
  user_id: string;
  handle: string;
  display_name: string;
  city: string;
  bio: string;
  role: string;
  primary_skill: string;
  is_featured: boolean;
  sabi_score: number;
  jobs_done: number;
  rating_avg: string | number;
  rating_count: number;
};

type JobSql = {
  id: number;
  client_id: string;
  skill_id: string;
  title: string;
  description: string;
  city: string;
  budget_naira: number;
  status: string;
  hired_id: string | null;
  created_at: string;
  client_name: string;
  hired_name: string | null;
};

function mapProfile(p: ProfileSql): ProfileRow {
  return {
    userId: p.user_id,
    handle: p.handle,
    displayName: p.display_name,
    city: p.city,
    bio: p.bio,
    role: p.role,
    primarySkill: p.primary_skill,
    isFeatured: p.is_featured,
    sabiScore: Number(p.sabi_score),
    jobsDone: Number(p.jobs_done),
    ratingAvg: Number(p.rating_avg),
    ratingCount: Number(p.rating_count),
  };
}

function mapJob(j: JobSql): JobRow {
  return {
    id: j.id,
    clientId: j.client_id,
    skillId: j.skill_id,
    title: j.title,
    description: j.description,
    city: j.city,
    budgetNaira: j.budget_naira,
    status: j.status,
    hiredId: j.hired_id,
    createdAt: j.created_at,
    clientName: j.client_name,
    hiredName: j.hired_name,
  };
}

async function ensureSeed(sql: Sql) {
  if (seedReady) return;
  const [meta] = await sql<{ value: string }>`select value from app_meta where key = 'seeded'`;
  if (meta?.value === "1") {
    seedReady = true;
    return;
  }

  for (const c of CHALLENGES) {
    await sql`
      insert into challenges (id, skill_id, title, prompt, rubric, difficulty, minutes)
      values (${c.id}, ${c.skillId}, ${c.title}, ${c.prompt}, ${c.rubric}, ${c.difficulty}, ${c.minutes})
      on conflict (id) do nothing
    `;
  }
  for (const p of FEATURED) {
    await sql`
      insert into profiles (
        user_id, handle, display_name, city, bio, role, primary_skill, is_featured,
        sabi_score, jobs_done, rating_avg, rating_count
      ) values (
        ${p.userId}, ${p.handle}, ${p.displayName}, ${p.city}, ${p.bio}, 'both', ${p.primarySkill}, true,
        ${p.sabiScore}, ${p.jobsDone}, ${p.ratingAvg}, ${p.ratingCount}
      )
      on conflict (user_id) do nothing
    `;
  }
  const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from jobs`;
  if (n === 0) {
    for (const j of SAMPLE_JOBS) {
      await sql`
        insert into jobs (client_id, skill_id, title, description, city, budget_naira, status)
        values (${j.clientId}, ${j.skillId}, ${j.title}, ${j.description}, ${j.city}, ${j.budget}, 'open')
        on conflict (client_id, title) do nothing
      `;
    }
  } else {
    await sql`
      delete from jobs a
      using jobs b
      where a.id > b.id and a.client_id = b.client_id and a.title = b.title
    `;
  }
  await sql`insert into app_meta (key, value) values ('seeded', '1') on conflict (key) do update set value = '1'`;
  seedReady = true;
}

function slugHandle(name: string, userId: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "sabi";
  return `${base}-${userId.replace(/[^a-z0-9]/gi, "").slice(-4) || "user"}`;
}

async function ensureProfile(sql: Sql, userId: string, displayName: string | null): Promise<ProfileRow> {
  const existing = await sql<ProfileSql>`select * from profiles where user_id = ${userId} limit 1`;
  if (existing[0]) return mapProfile(existing[0]);
  const name = displayName?.trim() || "New Sabi";
  let handle = slugHandle(name, userId);
  const clash = await sql<{ handle: string }>`select handle from profiles where handle = ${handle}`;
  if (clash[0]) handle = `${handle}-${Math.floor(Math.random() * 90 + 10)}`;
  await sql`
    insert into profiles (user_id, handle, display_name, city, bio, role, primary_skill)
    values (${userId}, ${handle}, ${name}, 'Lagos', '', 'both', 'electrical')
  `;
  const rows = await sql<ProfileSql>`select * from profiles where user_id = ${userId}`;
  return mapProfile(rows[0]);
}

async function recomputeScore(sql: Sql, userId: string) {
  const [chal] = await sql<{ avg: string | number }>`
    select coalesce(avg(max_score), 0) as avg from (
      select max(score) as max_score from challenge_attempts where user_id = ${userId} group by challenge_id
    ) s
  `;
  const [rate] = await sql<{ avg: string | number; n: number }>`
    select coalesce(avg(stars), 0) as avg, count(*)::int as n from ratings where to_id = ${userId}
  `;
  const [jobs] = await sql<{ n: number }>`
    select count(*)::int as n from jobs where hired_id = ${userId} and status = 'completed'
  `;
  const [endo] = await sql<{ n: number }>`
    select count(*)::int as n from endorsements where to_id = ${userId}
  `;
  const challengeAvg = Number(chal?.avg ?? 0);
  const ratingAvg = Number(rate?.avg ?? 0);
  const ratingCount = Number(rate?.n ?? 0);
  const jobsDone = Number(jobs?.n ?? 0);
  const endorsements = Number(endo?.n ?? 0);
  const score = Math.round(
    0.45 * challengeAvg +
      0.3 * (ratingCount ? ratingAvg * 20 : challengeAvg * 0.5) +
      0.15 * Math.min(100, jobsDone * 12) +
      0.1 * Math.min(100, endorsements * 15),
  );
  await sql`
    update profiles
    set sabi_score = ${score},
        jobs_done = ${jobsDone},
        rating_avg = ${ratingAvg},
        rating_count = ${ratingCount}
    where user_id = ${userId} and is_featured = false
  `;
}

function heuristicScore(answer: string, rubric: string) {
  const tokens = rubric
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  const text = answer.toLowerCase();
  const hits = tokens.filter((t) => text.includes(t)).length;
  const coverage = tokens.length ? hits / tokens.length : 0;
  const lengthBonus = Math.min(20, Math.floor(answer.trim().length / 40));
  return Math.max(28, Math.min(92, Math.round(coverage * 70 + lengthBonus)));
}

async function scoreWithAi(input: {
  title: string;
  prompt: string;
  rubric: string;
  answer: string;
  skill: string;
}): Promise<{ score: number; feedback: string; usedAi: boolean }> {
  const fallback = () => {
    const score = heuristicScore(input.answer, input.rubric);
    return {
      score,
      feedback:
        score >= 70
          ? "Solid practical thinking. A few gaps versus the rubric, but this would get you hired on a street job."
          : "The answer is thin against the rubric. Name the tests, the order, and the thing you would refuse to guess.",
      usedAi: false,
    };
  };

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return fallback();
  if (input.answer.trim().length < 40) {
    return {
      score: 20,
      feedback: "Too short to prove sabi. Walk the work, in order, with the checks you would actually run.",
      usedAi: false,
    };
  }

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        messages: [
          {
            role: "system",
            content:
              'You score practical skill answers for Sabi, a Nigerian proof-of-skill platform. Certificates do not matter. Return ONLY JSON: {"score":0-100,"feedback":"2-4 sentences, direct, no emoji"}.',
          },
          {
            role: "user",
            content: `Skill: ${input.skill}\nChallenge: ${input.title}\nPrompt: ${input.prompt}\nRubric: ${input.rubric}\nAnswer:\n${input.answer.slice(0, 4000)}`,
          },
        ],
      }),
    });
    if (!res.ok) return fallback();
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = body.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return fallback();
    const parsed = JSON.parse(match[0]) as { score?: number; feedback?: string };
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const feedback = String(parsed.feedback || "").slice(0, 600) || fallback().feedback;
    return { score, feedback, usedAi: true };
  } catch {
    return fallback();
  }
}

export const listSkills = createServerFn({ method: "GET" }).handler(async () => SKILLS);

export const listChallenges = createServerFn({ method: "GET" }).handler(async () => {
  const hit = recall<Awaited<ReturnType<typeof loadChallenges>>>("challenges", 60_000);
  if (hit) return hit;
  return remember("challenges", await loadChallenges());
});

async function loadChallenges() {
  const sql = await getSql();
  await ensureSeed(sql);
  const rows = await sql<{
    id: string;
    skill_id: string;
    title: string;
    prompt: string;
    rubric: string;
    difficulty: string;
    minutes: number;
  }>`
    select id, skill_id, title, prompt, rubric, difficulty, minutes from challenges order by skill_id, id
  `;
  return rows.map((r) => ({
    id: r.id,
    skillId: r.skill_id,
    title: r.title,
    prompt: r.prompt,
    rubric: r.rubric,
    difficulty: r.difficulty,
    minutes: r.minutes,
  }));
}

export const getChallenge = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<{
      id: string;
      skill_id: string;
      title: string;
      prompt: string;
      rubric: string;
      difficulty: string;
      minutes: number;
    }>`select * from challenges where id = ${id} limit 1`;
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      skillId: r.skill_id,
      title: r.title,
      prompt: r.prompt,
      rubric: r.rubric,
      difficulty: r.difficulty,
      minutes: r.minutes,
    };
  });

export const listBoard = createServerFn({ method: "GET" })
  .validator((input: { skill?: string; city?: string }) => input)
  .handler(async ({ data }) => {
    const skill = data.skill && data.skill !== "all" ? data.skill : "all";
    const city = data.city && data.city !== "all" ? data.city : "all";
    const key = `board:${skill}:${city}`;
    const hit = recall<ProfileRow[]>(key, 20_000);
    if (hit) return hit;
    const sql = await getSql();
    await ensureSeed(sql);
    const skillFilter = skill === "all" ? null : skill;
    const cityFilter = city === "all" ? null : city;
    let rows: ProfileSql[];
    if (skillFilter && cityFilter) {
      rows = await sql<ProfileSql>`
        select * from profiles where primary_skill = ${skillFilter} and city = ${cityFilter}
        order by sabi_score desc, rating_count desc limit 40`;
    } else if (skillFilter) {
      rows = await sql<ProfileSql>`
        select * from profiles where primary_skill = ${skillFilter}
        order by sabi_score desc, rating_count desc limit 40`;
    } else if (cityFilter) {
      rows = await sql<ProfileSql>`
        select * from profiles where city = ${cityFilter}
        order by sabi_score desc, rating_count desc limit 40`;
    } else {
      rows = await sql<ProfileSql>`
        select * from profiles order by sabi_score desc, rating_count desc limit 40`;
    }
    return remember(key, rows.map(mapProfile));
  });

export const getProfileByHandle = createServerFn({ method: "GET" })
  .validator((handle: string) => handle)
  .handler(async ({ data: handle }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<ProfileSql>`select * from profiles where handle = ${handle} limit 1`;
    if (!rows[0]) return null;
    const profile = mapProfile(rows[0]);
    const attempts = await sql<{
      challenge_id: string;
      score: number;
      feedback: string;
      created_at: string;
      title: string;
      skill_id: string;
    }>`
      select a.challenge_id, a.score, a.feedback, a.created_at::text as created_at, c.title, c.skill_id
      from challenge_attempts a
      join challenges c on c.id = a.challenge_id
      where a.user_id = ${profile.userId}
      order by a.score desc
    `;
    const endorsements = await sql<{
      from_id: string;
      skill_id: string;
      note: string;
      display_name: string;
    }>`
      select e.from_id, e.skill_id, e.note, p.display_name
      from endorsements e
      join profiles p on p.user_id = e.from_id
      where e.to_id = ${profile.userId}
      order by e.created_at desc
      limit 12
    `;
    const ratings = await sql<{ stars: number; comment: string }>`
      select stars, comment from ratings where to_id = ${profile.userId} order by created_at desc limit 8
    `;
    return {
      profile,
      attempts: attempts.map((a) => ({
        challengeId: a.challenge_id,
        score: a.score,
        feedback: a.feedback,
        createdAt: a.created_at,
        title: a.title,
        skillId: a.skill_id,
      })),
      endorsements: endorsements.map((e) => ({
        fromId: e.from_id,
        skillId: e.skill_id,
        note: e.note,
        fromName: e.display_name,
      })),
      ratings: ratings.map((r) => ({ stars: r.stars, comment: r.comment })),
    };
  });

export const listJobs = createServerFn({ method: "GET" })
  .validator((input: { skill?: string; city?: string }) => input)
  .handler(async ({ data }) => {
    const skill = data.skill && data.skill !== "all" ? data.skill : "all";
    const city = data.city && data.city !== "all" ? data.city : "all";
    const key = `jobs:${skill}:${city}`;
    const hit = recall<JobRow[]>(key, 15_000);
    if (hit) return hit;
    const sql = await getSql();
    await ensureSeed(sql);
    const skillFilter = skill === "all" ? null : skill;
    const cityFilter = city === "all" ? null : city;
    let rows: JobSql[];
    if (skillFilter && cityFilter) {
      rows = await sql<JobSql>`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.skill_id = ${skillFilter} and j.city = ${cityFilter}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
    } else if (skillFilter) {
      rows = await sql<JobSql>`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.skill_id = ${skillFilter}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
    } else if (cityFilter) {
      rows = await sql<JobSql>`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.city = ${cityFilter}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
    } else {
      rows = await sql<JobSql>`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
    }
    return remember(key, rows.map(mapJob));
  });

export const getJob = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const jobs = await sql<JobSql>`
      select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
             j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
      from jobs j
      join profiles c on c.user_id = j.client_id
      left join profiles h on h.user_id = j.hired_id
      where j.id = ${id}
      limit 1`;
    const job = jobs[0] ? mapJob(jobs[0]) : null;
    if (!job) return null;
    const candidates = await sql<ProfileSql>`
      select * from profiles
      where primary_skill = ${job.skillId} and user_id <> ${job.clientId}
      order by sabi_score desc
      limit 16
    `;
    return { job, candidates: candidates.map(mapProfile) };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const u = await getSessionUser();
    const name = u?.email?.split("@")[0]?.replace(/[._]/g, " ") ?? "New Sabi";
    return ensureProfile(sql, context.userId, name);
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; city: string; bio: string; primarySkill: string; role: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    await ensureProfile(sql, context.userId, data.displayName);
    const name = data.displayName.trim().slice(0, 60) || "New Sabi";
    const city = data.city.slice(0, 40);
    const bio = data.bio.trim().slice(0, 280);
    const skill = SKILLS.some((s) => s.id === data.primarySkill) ? data.primarySkill : "electrical";
    const role = ["pro", "client", "both"].includes(data.role) ? data.role : "both";
    await sql`
      update profiles
      set display_name = ${name}, city = ${city}, bio = ${bio}, primary_skill = ${skill}, role = ${role}
      where user_id = ${context.userId}
    `;
    const rows = await sql<ProfileSql>`select * from profiles where user_id = ${context.userId}`;
    bustPublic();
    return mapProfile(rows[0]);
  });

export const submitChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { challengeId: string; answer: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    await ensureProfile(sql, context.userId, "New Sabi");
    const chalRows = await sql<{
      id: string;
      title: string;
      prompt: string;
      rubric: string;
      skill_id: string;
    }>`select id, title, prompt, rubric, skill_id from challenges where id = ${data.challengeId} limit 1`;
    const chal = chalRows[0];
    if (!chal) throw new Error("Challenge not found");
    const answer = data.answer.trim().slice(0, 5000);
    if (answer.length < 40) {
      return { score: 20, feedback: "Too short to prove sabi. Walk the work, in order.", usedAi: false };
    }
    if (!allowSubmit(context.userId)) {
      return {
        score: 0,
        feedback: "Slow down. Eight trials every 10 minutes keeps the board up for everyone else.",
        usedAi: false,
      };
    }
    const result = await scoreWithAi({
      title: chal.title,
      prompt: chal.prompt,
      rubric: chal.rubric,
      answer,
      skill: chal.skill_id,
    });
    await sql`
      insert into challenge_attempts (user_id, challenge_id, answer, score, feedback)
      values (${context.userId}, ${chal.id}, ${answer}, ${result.score}, ${result.feedback})
      on conflict (user_id, challenge_id)
      do update set answer = excluded.answer, score = excluded.score, feedback = excluded.feedback, created_at = now()
    `;
    await recomputeScore(sql, context.userId);
    bustPublic();
    return result;
  });

export const getMyAttempt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((challengeId: string) => challengeId)
  .handler(async ({ context, data: challengeId }) => {
    const sql = await getSql();
    const rows = await sql<{ score: number; feedback: string; answer: string }>`
      select score, feedback, answer from challenge_attempts
      where user_id = ${context.userId} and challenge_id = ${challengeId}
      limit 1
    `;
    return rows[0] ?? null;
  });

export const postJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { title: string; description: string; skillId: string; city: string; budgetNaira: number }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSeed(sql);
    await ensureProfile(sql, context.userId, "New Sabi");
    const title = data.title.trim().slice(0, 80);
    const description = data.description.trim().slice(0, 800);
    if (title.length < 6 || description.length < 20) throw new Error("Write a real brief.");
    const skill = (SKILLS.some((s) => s.id === data.skillId) ? data.skillId : "electrical") as SkillId;
    const budget = Math.max(5000, Math.min(5000000, Math.round(data.budgetNaira) || 0));
    const rows = await sql<{ id: number }>`
      insert into jobs (client_id, skill_id, title, description, city, budget_naira, status)
      values (${context.userId}, ${skill}, ${title}, ${description}, ${data.city}, ${budget}, 'open')
      returning id
    `;
    bustPublic();
    return { id: rows[0].id };
  });

export const hirePro = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: number; proId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.proId === context.userId) throw new Error("You cannot hire yourself.");
    const rows = await sql<{ id: number }>`
      update jobs set hired_id = ${data.proId}, status = 'hired'
      where id = ${data.jobId} and client_id = ${context.userId} and status = 'open'
      returning id
    `;
    if (!rows[0]) throw new Error("Job is not open, or you are not the client.");
    bustPublic();
    return { ok: true as const };
  });

export const completeJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((jobId: number) => jobId)
  .handler(async ({ context, data: jobId }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number; hired_id: string | null }>`
      update jobs set status = 'completed'
      where id = ${jobId} and status = 'hired'
        and (client_id = ${context.userId} or hired_id = ${context.userId})
      returning id, hired_id
    `;
    if (!rows[0]) throw new Error("Only the client or hired pro can complete this job.");
    if (rows[0].hired_id) await recomputeScore(sql, rows[0].hired_id);
    bustPublic();
    return { ok: true as const };
  });

export const rateJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: number; stars: number; comment: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobs = await sql<{ client_id: string; hired_id: string | null }>`
      select client_id, hired_id from jobs where id = ${data.jobId} limit 1
    `;
    const job = jobs[0];
    if (!job?.hired_id) throw new Error("No hire to rate.");
    if (job.client_id !== context.userId) throw new Error("Only the client rates the work.");
    const stars = Math.max(1, Math.min(5, Math.round(data.stars)));
    const comment = data.comment.trim().slice(0, 280);
    await sql`
      insert into ratings (job_id, from_id, to_id, stars, comment)
      values (${data.jobId}, ${context.userId}, ${job.hired_id}, ${stars}, ${comment})
      on conflict (job_id, from_id) do update set stars = excluded.stars, comment = excluded.comment
    `;
    await recomputeScore(sql, job.hired_id);
    bustPublic();
    return { ok: true as const };
  });

export const endorsePro = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { toId: string; skillId: string; note: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId, "New Sabi");
    if (data.toId === context.userId) throw new Error("Endorse someone else.");
    const note = data.note.trim().slice(0, 160);
    const skill = SKILLS.some((s) => s.id === data.skillId) ? data.skillId : "electrical";
    await sql`
      insert into endorsements (from_id, to_id, skill_id, note)
      values (${context.userId}, ${data.toId}, ${skill}, ${note})
      on conflict (from_id, to_id, skill_id) do update set note = excluded.note
    `;
    await recomputeScore(sql, data.toId);
    bustPublic();
    return { ok: true as const };
  });
