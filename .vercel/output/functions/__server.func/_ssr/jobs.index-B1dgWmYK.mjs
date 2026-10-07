import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { C as useNavigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as naira, i as Route$4 } from "./router-pjcKKlHL.mjs";
import { t as SkillCityFilters } from "./filters-CegZqX7u.mjs";
import { t as Button } from "./button-CtfZeCiB.mjs";
import { t as Badge } from "./badge-DrBxXYS3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs.index-B1dgWmYK.js
var import_jsx_runtime = require_jsx_runtime();
function JobsPage() {
	const jobs = Route$4.useLoaderData();
	const search = Route$4.useSearch();
	const navigate = useNavigate({ from: "/jobs/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
					children: "Work"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "Jobs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "Post a brief. Ranked people for that skill show first. Hire from proof, not from paper."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/jobs/new",
					children: "Post a job"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillCityFilters, {
				skill: search.skill ?? "all",
				city: search.city ?? "all",
				onSkill: (skill) => navigate({ search: (prev) => ({
					...prev,
					skill: skill === "all" ? void 0 : skill
				}) }),
				onCity: (city) => navigate({ search: (prev) => ({
					...prev,
					city: city === "all" ? void 0 : city
				}) })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-surface p-6 text-sm text-muted",
				children: "No jobs on this filter."
			}) : jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/jobs/$id",
				params: { id: String(j.id) },
				className: "block rounded-lg border border-line bg-surface p-4 hover:border-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium leading-snug",
						children: j.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							SKILLS.find((s) => s.id === j.skillId)?.name,
							" · ",
							j.city,
							" · ",
							j.clientName
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm text-accent",
							children: naira(j.budgetNaira)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-1",
							children: j.status
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted",
					children: j.description
				})]
			}, j.id))
		})
	] });
}
//#endregion
export { JobsPage as component };
