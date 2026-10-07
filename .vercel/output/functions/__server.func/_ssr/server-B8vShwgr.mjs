import { a as SKILLS, i as SAMPLE_JOBS, r as FEATURED, t as CHALLENGES } from "./catalog-qfqyDFYs.mjs";
import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-DKFYdQSp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-B8vShwgr.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function mapProfile(p) {
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
		ratingCount: Number(p.rating_count)
	};
}
function mapJob(j) {
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
		hiredName: j.hired_name
	};
}
async function ensureSeed(sql) {
	const [meta] = await sql`select value from app_meta where key = 'seeded'`;
	if (meta?.value === "1") return;
	for (const c of CHALLENGES) await sql`
      insert into challenges (id, skill_id, title, prompt, rubric, difficulty, minutes)
      values (${c.id}, ${c.skillId}, ${c.title}, ${c.prompt}, ${c.rubric}, ${c.difficulty}, ${c.minutes})
      on conflict (id) do nothing
    `;
	for (const p of FEATURED) await sql`
      insert into profiles (
        user_id, handle, display_name, city, bio, role, primary_skill, is_featured,
        sabi_score, jobs_done, rating_avg, rating_count
      ) values (
        ${p.userId}, ${p.handle}, ${p.displayName}, ${p.city}, ${p.bio}, 'both', ${p.primarySkill}, true,
        ${p.sabiScore}, ${p.jobsDone}, ${p.ratingAvg}, ${p.ratingCount}
      )
      on conflict (user_id) do nothing
    `;
	const [{ n }] = await sql`select count(*)::int as n from jobs`;
	if (n === 0) for (const j of SAMPLE_JOBS) await sql`
        insert into jobs (client_id, skill_id, title, description, city, budget_naira, status)
        values (${j.clientId}, ${j.skillId}, ${j.title}, ${j.description}, ${j.city}, ${j.budget}, 'open')
        on conflict (client_id, title) do nothing
      `;
	else await sql`
      delete from jobs a
      using jobs b
      where a.id > b.id and a.client_id = b.client_id and a.title = b.title
    `;
	await sql`insert into app_meta (key, value) values ('seeded', '1') on conflict (key) do update set value = '1'`;
}
function slugHandle(name, userId) {
	return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "sabi"}-${userId.replace(/[^a-z0-9]/gi, "").slice(-4) || "user"}`;
}
async function ensureProfile(sql, userId, displayName) {
	const existing = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (existing[0]) return mapProfile(existing[0]);
	const name = displayName?.trim() || "New Sabi";
	let handle = slugHandle(name, userId);
	if ((await sql`select handle from profiles where handle = ${handle}`)[0]) handle = `${handle}-${Math.floor(Math.random() * 90 + 10)}`;
	await sql`
    insert into profiles (user_id, handle, display_name, city, bio, role, primary_skill)
    values (${userId}, ${handle}, ${name}, 'Lagos', '', 'both', 'electrical')
  `;
	return mapProfile((await sql`select * from profiles where user_id = ${userId}`)[0]);
}
async function recomputeScore(sql, userId) {
	const [chal] = await sql`
    select coalesce(avg(max_score), 0) as avg from (
      select max(score) as max_score from challenge_attempts where user_id = ${userId} group by challenge_id
    ) s
  `;
	const [rate] = await sql`
    select coalesce(avg(stars), 0) as avg, count(*)::int as n from ratings where to_id = ${userId}
  `;
	const [jobs] = await sql`
    select count(*)::int as n from jobs where hired_id = ${userId} and status = 'completed'
  `;
	const [endo] = await sql`
    select count(*)::int as n from endorsements where to_id = ${userId}
  `;
	const challengeAvg = Number(chal?.avg ?? 0);
	const ratingAvg = Number(rate?.avg ?? 0);
	const ratingCount = Number(rate?.n ?? 0);
	const jobsDone = Number(jobs?.n ?? 0);
	const endorsements = Number(endo?.n ?? 0);
	await sql`
    update profiles
    set sabi_score = ${Math.round(.45 * challengeAvg + .3 * (ratingCount ? ratingAvg * 20 : challengeAvg * .5) + .15 * Math.min(100, jobsDone * 12) + .1 * Math.min(100, endorsements * 15))},
        jobs_done = ${jobsDone},
        rating_avg = ${ratingAvg},
        rating_count = ${ratingCount}
    where user_id = ${userId} and is_featured = false
  `;
}
function heuristicScore(answer, rubric) {
	const tokens = rubric.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
	const text = answer.toLowerCase();
	const hits = tokens.filter((t) => text.includes(t)).length;
	const coverage = tokens.length ? hits / tokens.length : 0;
	const lengthBonus = Math.min(20, Math.floor(answer.trim().length / 40));
	return Math.max(28, Math.min(92, Math.round(coverage * 70 + lengthBonus)));
}
async function scoreWithAi(input) {
	const fallback = () => {
		const score = heuristicScore(input.answer, input.rubric);
		return {
			score,
			feedback: score >= 70 ? "Solid practical thinking. A few gaps versus the rubric, but this would get you hired on a street job." : "The answer is thin against the rubric. Name the tests, the order, and the thing you would refuse to guess.",
			usedAi: false
		};
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return fallback();
	if (input.answer.trim().length < 40) return {
		score: 20,
		feedback: "Too short to prove sabi. Walk the work, in order, with the checks you would actually run.",
		usedAi: false
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 280,
				messages: [{
					role: "system",
					content: "You score practical skill answers for Sabi, a Nigerian proof-of-skill platform. Certificates do not matter. Return ONLY JSON: {\"score\":0-100,\"feedback\":\"2-4 sentences, direct, no emoji\"}."
				}, {
					role: "user",
					content: `Skill: ${input.skill}\nChallenge: ${input.title}\nPrompt: ${input.prompt}\nRubric: ${input.rubric}\nAnswer:\n${input.answer.slice(0, 4e3)}`
				}]
			})
		});
		if (!res.ok) return fallback();
		const match = ((await res.json()).choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
		if (!match) return fallback();
		const parsed = JSON.parse(match[0]);
		return {
			score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
			feedback: String(parsed.feedback || "").slice(0, 600) || fallback().feedback,
			usedAi: true
		};
	} catch {
		return fallback();
	}
}
var listSkills_createServerFn_handler = createServerRpc({
	id: "d610384b7eb32d150017e29c50189b59064a89e899d8f9d788a0d73937ca57ce",
	name: "listSkills",
	filename: "src/lib/sabi/server.ts"
}, (opts) => listSkills.__executeServer(opts));
var listSkills = createServerFn({ method: "GET" }).handler(listSkills_createServerFn_handler, async () => SKILLS);
var listChallenges_createServerFn_handler = createServerRpc({
	id: "ebf9a46fec9c21cc0b299009b7c3887d202e5937fdb3f0abb41b3dfc3cfb26d0",
	name: "listChallenges",
	filename: "src/lib/sabi/server.ts"
}, (opts) => listChallenges.__executeServer(opts));
var listChallenges = createServerFn({ method: "GET" }).handler(listChallenges_createServerFn_handler, async () => {
	const sql = await getSql();
	await ensureSeed(sql);
	return (await sql`
    select id, skill_id, title, prompt, rubric, difficulty, minutes from challenges order by skill_id, id
  `).map((r) => ({
		id: r.id,
		skillId: r.skill_id,
		title: r.title,
		prompt: r.prompt,
		rubric: r.rubric,
		difficulty: r.difficulty,
		minutes: r.minutes
	}));
});
var getChallenge_createServerFn_handler = createServerRpc({
	id: "5e0196ca77b78b452c6fc684723842206b5f60707b3e09f8551d18f71beaf78a",
	name: "getChallenge",
	filename: "src/lib/sabi/server.ts"
}, (opts) => getChallenge.__executeServer(opts));
var getChallenge = createServerFn({ method: "GET" }).validator((id) => id).handler(getChallenge_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const r = (await sql`select * from challenges where id = ${id} limit 1`)[0];
	if (!r) return null;
	return {
		id: r.id,
		skillId: r.skill_id,
		title: r.title,
		prompt: r.prompt,
		rubric: r.rubric,
		difficulty: r.difficulty,
		minutes: r.minutes
	};
});
var listBoard_createServerFn_handler = createServerRpc({
	id: "ccdea2c2b85dd5e6e2b189c8b542078eee3b18e9513144fbd6ee4f1f1b8110f0",
	name: "listBoard",
	filename: "src/lib/sabi/server.ts"
}, (opts) => listBoard.__executeServer(opts));
var listBoard = createServerFn({ method: "GET" }).validator((input) => input).handler(listBoard_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const skill = data.skill && data.skill !== "all" ? data.skill : null;
	const city = data.city && data.city !== "all" ? data.city : null;
	let rows;
	if (skill && city) rows = await sql`
        select * from profiles where primary_skill = ${skill} and city = ${city}
        order by sabi_score desc, rating_count desc limit 40`;
	else if (skill) rows = await sql`
        select * from profiles where primary_skill = ${skill}
        order by sabi_score desc, rating_count desc limit 40`;
	else if (city) rows = await sql`
        select * from profiles where city = ${city}
        order by sabi_score desc, rating_count desc limit 40`;
	else rows = await sql`
        select * from profiles order by sabi_score desc, rating_count desc limit 40`;
	return rows.map(mapProfile);
});
var getProfileByHandle_createServerFn_handler = createServerRpc({
	id: "8ef937a40664c03e487983cad7a458d82777c5738e61c7fe4b91a6ce861a0dc7",
	name: "getProfileByHandle",
	filename: "src/lib/sabi/server.ts"
}, (opts) => getProfileByHandle.__executeServer(opts));
var getProfileByHandle = createServerFn({ method: "GET" }).validator((handle) => handle).handler(getProfileByHandle_createServerFn_handler, async ({ data: handle }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const rows = await sql`select * from profiles where handle = ${handle} limit 1`;
	if (!rows[0]) return null;
	const profile = mapProfile(rows[0]);
	const attempts = await sql`
      select a.challenge_id, a.score, a.feedback, a.created_at::text as created_at, c.title, c.skill_id
      from challenge_attempts a
      join challenges c on c.id = a.challenge_id
      where a.user_id = ${profile.userId}
      order by a.score desc
    `;
	const endorsements = await sql`
      select e.from_id, e.skill_id, e.note, p.display_name
      from endorsements e
      join profiles p on p.user_id = e.from_id
      where e.to_id = ${profile.userId}
      order by e.created_at desc
      limit 12
    `;
	const ratings = await sql`
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
			skillId: a.skill_id
		})),
		endorsements: endorsements.map((e) => ({
			fromId: e.from_id,
			skillId: e.skill_id,
			note: e.note,
			fromName: e.display_name
		})),
		ratings: ratings.map((r) => ({
			stars: r.stars,
			comment: r.comment
		}))
	};
});
var listJobs_createServerFn_handler = createServerRpc({
	id: "cb819e8e9904767a91633dc64cc6e08d26ef0ca7dc08edb1158668a673efa29b",
	name: "listJobs",
	filename: "src/lib/sabi/server.ts"
}, (opts) => listJobs.__executeServer(opts));
var listJobs = createServerFn({ method: "GET" }).validator((input) => input).handler(listJobs_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const skill = data.skill && data.skill !== "all" ? data.skill : null;
	const city = data.city && data.city !== "all" ? data.city : null;
	let rows;
	if (skill && city) rows = await sql`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.skill_id = ${skill} and j.city = ${city}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
	else if (skill) rows = await sql`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.skill_id = ${skill}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
	else if (city) rows = await sql`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        where j.city = ${city}
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
	else rows = await sql`
        select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
               j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
        from jobs j
        join profiles c on c.user_id = j.client_id
        left join profiles h on h.user_id = j.hired_id
        order by case j.status when 'open' then 0 when 'hired' then 1 else 2 end, j.created_at desc
        limit 40`;
	return rows.map(mapJob);
});
var getJob_createServerFn_handler = createServerRpc({
	id: "4e474c8ac4002d3d4f8924daefe83628479615c44b3d9d50abec5a83a234743a",
	name: "getJob",
	filename: "src/lib/sabi/server.ts"
}, (opts) => getJob.__executeServer(opts));
var getJob = createServerFn({ method: "GET" }).validator((id) => id).handler(getJob_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const jobs = await sql`
      select j.id, j.client_id, j.skill_id, j.title, j.description, j.city, j.budget_naira, j.status,
             j.hired_id, j.created_at::text as created_at, c.display_name as client_name, h.display_name as hired_name
      from jobs j
      join profiles c on c.user_id = j.client_id
      left join profiles h on h.user_id = j.hired_id
      where j.id = ${id}
      limit 1`;
	const job = jobs[0] ? mapJob(jobs[0]) : null;
	if (!job) return null;
	return {
		job,
		candidates: (await sql`
      select * from profiles
      where primary_skill = ${job.skillId} and user_id <> ${job.clientId}
      order by sabi_score desc
      limit 16
    `).map(mapProfile)
	};
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "255ca541c6fa79f7848f8150a5ed787870041584389a98728760c77d65cb2043",
	name: "getMyProfile",
	filename: "src/lib/sabi/server.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const { getSessionUser } = await import("./verify.server-C8fCJPBh.mjs");
	const name = (await getSessionUser())?.email?.split("@")[0]?.replace(/[._]/g, " ") ?? "New Sabi";
	return ensureProfile(sql, context.userId, name);
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "bba54cc7051f2b94c1a5d2a2b964fe59518bdb053b99eecb25c87c7989644ac4",
	name: "updateMyProfile",
	filename: "src/lib/sabi/server.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	await ensureProfile(sql, context.userId, data.displayName);
	await sql`
      update profiles
      set display_name = ${data.displayName.trim().slice(0, 60) || "New Sabi"}, city = ${data.city.slice(0, 40)}, bio = ${data.bio.trim().slice(0, 280)}, primary_skill = ${SKILLS.some((s) => s.id === data.primarySkill) ? data.primarySkill : "electrical"}, role = ${[
		"pro",
		"client",
		"both"
	].includes(data.role) ? data.role : "both"}
      where user_id = ${context.userId}
    `;
	return mapProfile((await sql`select * from profiles where user_id = ${context.userId}`)[0]);
});
var submitChallenge_createServerFn_handler = createServerRpc({
	id: "086d6e7cfd7484e6de421ed721b17cd14ce2ffdd860a6c0fc6c46bac39f367d6",
	name: "submitChallenge",
	filename: "src/lib/sabi/server.ts"
}, (opts) => submitChallenge.__executeServer(opts));
var submitChallenge = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitChallenge_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	await ensureProfile(sql, context.userId, "New Sabi");
	const chal = (await sql`select id, title, prompt, rubric, skill_id from challenges where id = ${data.challengeId} limit 1`)[0];
	if (!chal) throw new Error("Challenge not found");
	const answer = data.answer.trim().slice(0, 5e3);
	if (answer.length < 40) return {
		score: 20,
		feedback: "Too short to prove sabi. Walk the work, in order.",
		usedAi: false
	};
	const result = await scoreWithAi({
		title: chal.title,
		prompt: chal.prompt,
		rubric: chal.rubric,
		answer,
		skill: chal.skill_id
	});
	await sql`
      insert into challenge_attempts (user_id, challenge_id, answer, score, feedback)
      values (${context.userId}, ${chal.id}, ${answer}, ${result.score}, ${result.feedback})
      on conflict (user_id, challenge_id)
      do update set answer = excluded.answer, score = excluded.score, feedback = excluded.feedback, created_at = now()
    `;
	await recomputeScore(sql, context.userId);
	return result;
});
var getMyAttempt_createServerFn_handler = createServerRpc({
	id: "ca340811452f108f9d23b91361d456c03fa4376f9a208c4c6d4b7490c1916a7e",
	name: "getMyAttempt",
	filename: "src/lib/sabi/server.ts"
}, (opts) => getMyAttempt.__executeServer(opts));
var getMyAttempt = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((challengeId) => challengeId).handler(getMyAttempt_createServerFn_handler, async ({ context, data: challengeId }) => {
	return (await (await getSql())`
      select score, feedback, answer from challenge_attempts
      where user_id = ${context.userId} and challenge_id = ${challengeId}
      limit 1
    `)[0] ?? null;
});
var postJob_createServerFn_handler = createServerRpc({
	id: "fe2e2d5ec9eed77bdcde7a1dcd09358bdc69bd65e4e138f49a008d0faeb4b13a",
	name: "postJob",
	filename: "src/lib/sabi/server.ts"
}, (opts) => postJob.__executeServer(opts));
var postJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postJob_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	await ensureProfile(sql, context.userId, "New Sabi");
	const title = data.title.trim().slice(0, 80);
	const description = data.description.trim().slice(0, 800);
	if (title.length < 6 || description.length < 20) throw new Error("Write a real brief.");
	const skill = SKILLS.some((s) => s.id === data.skillId) ? data.skillId : "electrical";
	const budget = Math.max(5e3, Math.min(5e6, Math.round(data.budgetNaira) || 0));
	return { id: (await sql`
      insert into jobs (client_id, skill_id, title, description, city, budget_naira, status)
      values (${context.userId}, ${skill}, ${title}, ${description}, ${data.city}, ${budget}, 'open')
      returning id
    `)[0].id };
});
var hirePro_createServerFn_handler = createServerRpc({
	id: "d2aaba3d439f5653c521d2eca8d26f973cac18ff84f53ab6ce073f4e2928ad16",
	name: "hirePro",
	filename: "src/lib/sabi/server.ts"
}, (opts) => hirePro.__executeServer(opts));
var hirePro = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(hirePro_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.proId === context.userId) throw new Error("You cannot hire yourself.");
	if (!(await sql`
      update jobs set hired_id = ${data.proId}, status = 'hired'
      where id = ${data.jobId} and client_id = ${context.userId} and status = 'open'
      returning id
    `)[0]) throw new Error("Job is not open, or you are not the client.");
	return { ok: true };
});
var completeJob_createServerFn_handler = createServerRpc({
	id: "98a8fda39c9080b34846f142d9cf8d786d0d8bd44738e483f8dcc86b8aa9dda8",
	name: "completeJob",
	filename: "src/lib/sabi/server.ts"
}, (opts) => completeJob.__executeServer(opts));
var completeJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((jobId) => jobId).handler(completeJob_createServerFn_handler, async ({ context, data: jobId }) => {
	const sql = await getSql();
	const rows = await sql`
      update jobs set status = 'completed'
      where id = ${jobId} and status = 'hired'
        and (client_id = ${context.userId} or hired_id = ${context.userId})
      returning id, hired_id
    `;
	if (!rows[0]) throw new Error("Only the client or hired pro can complete this job.");
	if (rows[0].hired_id) await recomputeScore(sql, rows[0].hired_id);
	return { ok: true };
});
var rateJob_createServerFn_handler = createServerRpc({
	id: "18ab14789470af373cf0fbb89f28457a19fdbb0e70f059564e8acafdd2d72d68",
	name: "rateJob",
	filename: "src/lib/sabi/server.ts"
}, (opts) => rateJob.__executeServer(opts));
var rateJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(rateJob_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`
      select client_id, hired_id from jobs where id = ${data.jobId} limit 1
    `)[0];
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
	return { ok: true };
});
var endorsePro_createServerFn_handler = createServerRpc({
	id: "0657b00315ed9662d40977be0fdf43bf996211c5bb30295e5c27a2f113a5eb18",
	name: "endorsePro",
	filename: "src/lib/sabi/server.ts"
}, (opts) => endorsePro.__executeServer(opts));
var endorsePro = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(endorsePro_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
//#endregion
export { completeJob_createServerFn_handler, endorsePro_createServerFn_handler, getChallenge_createServerFn_handler, getJob_createServerFn_handler, getMyAttempt_createServerFn_handler, getMyProfile_createServerFn_handler, getProfileByHandle_createServerFn_handler, hirePro_createServerFn_handler, listBoard_createServerFn_handler, listChallenges_createServerFn_handler, listJobs_createServerFn_handler, listSkills_createServerFn_handler, postJob_createServerFn_handler, rateJob_createServerFn_handler, submitChallenge_createServerFn_handler, updateMyProfile_createServerFn_handler };
