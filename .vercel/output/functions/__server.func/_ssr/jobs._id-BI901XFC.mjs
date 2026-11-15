import { o as __toESM } from "../_runtime.mjs";
import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as completeJob, d as hirePro, p as rateJob, r as Route$3 } from "./router-CApGr4CO.mjs";
import { n as formatScore, r as naira } from "./utils-DXs1-lZF.mjs";
import { t as Stamp } from "./stamp-Dxnj5P0w.mjs";
import { t as Button } from "./button-ByQdrJKz.mjs";
import { i as useCurrentUser, t as Input } from "./use-current-user-BQp3yYvs.mjs";
import { t as Badge } from "./badge-kKPPkPIq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs._id-BI901XFC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JobDetailPage() {
	const data = Route$3.useLoaderData();
	const user = useCurrentUser();
	const router = useRouter();
	const [stars, setStars] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Job not found"
	}) });
	const { job, candidates } = data;
	const isClient = user?.id === job.clientId;
	const isHired = user?.id === job.hiredId;
	async function run(fn, ok) {
		setBusy(true);
		try {
			await fn();
			toast.success(ok);
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid gap-8 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: [
					SKILLS.find((s) => s.id === job.skillId)?.name,
					" · ",
					job.city
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: job.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: job.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm text-accent",
						children: naira(job.budgetNaira)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-faint",
						children: ["Posted by ", job.clientName]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm leading-relaxed text-muted",
				children: job.description
			}),
			job.hiredName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					"Hired:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: job.hiredName
					})
				]
			}) : null,
			isClient && job.status === "hired" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => run(() => completeJob({ data: job.id }), "Marked complete"),
					children: "Mark complete"
				})
			}) : null,
			isHired && job.status === "hired" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					disabled: busy,
					onClick: () => run(() => completeJob({ data: job.id }), "Marked complete"),
					children: "Mark my work complete"
				})
			}) : null,
			isClient && job.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3 rounded-lg border border-line bg-surface p-4",
				onSubmit: (e) => {
					e.preventDefault();
					run(() => rateJob({ data: {
						jobId: job.id,
						stars,
						comment
					} }), "Rating saved");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Rate the work"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStars(n),
							className: `h-10 w-10 rounded-md border text-sm ${stars >= n ? "border-paper bg-paper text-paper-fg" : "border-line text-muted"}`,
							children: n
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: comment,
						onChange: (e) => setComment(e.target.value),
						placeholder: "What did they actually do well?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: "Save rating"
					})
				]
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Ranked for this skill"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "Highest Sabi score first. Hire from here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: candidates.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-line bg-surface p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								name: p.displayName,
								seed: p.userId,
								size: "sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/pros/$handle",
								params: { handle: p.handle },
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: p.displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										formatScore(p.sabiScore),
										" · ",
										p.city
									]
								})]
							}),
							isClient && job.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: busy,
								onClick: () => run(() => hirePro({ data: {
									jobId: job.id,
									proId: p.userId
								} }), `Hired ${p.displayName}`),
								children: "Hire"
							}) : null
						]
					})
				}, p.userId))
			}),
			!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "underline decoration-line underline-offset-4",
						children: "Sign in"
					}),
					" ",
					"as the client to hire."
				]
			}) : null
		] })]
	});
}
//#endregion
export { JobDetailPage as component };
