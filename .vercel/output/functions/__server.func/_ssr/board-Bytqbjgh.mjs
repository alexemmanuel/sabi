import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { C as useNavigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Route$9, u as formatScore } from "./router-pjcKKlHL.mjs";
import { t as SkillCityFilters } from "./filters-CegZqX7u.mjs";
import { t as Stamp } from "./stamp-CzFcKSZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-Bytqbjgh.js
var import_jsx_runtime = require_jsx_runtime();
function BoardPage() {
	const people = Route$9.useLoaderData();
	const search = Route$9.useSearch();
	const navigate = useNavigate({ from: "/board" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
			children: "Public ranking"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl tracking-tight",
			children: "The board"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-sm text-muted",
			children: "Sorted by Sabi score. Take trials, finish jobs, collect ratings. Paper does not move you up."
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface",
			children: people.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "p-6 text-sm text-muted",
				children: "Nobody on this slice of the board yet."
			}) : people.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/pros/$handle",
				params: { handle: p.handle },
				className: "flex items-center gap-3 px-4 py-3 hover:bg-raised",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-7 font-mono text-xs text-faint",
						children: String(i + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						name: p.displayName,
						seed: p.userId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: p.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted",
							children: [
								SKILLS.find((s) => s.id === p.primarySkill)?.name,
								" · ",
								p.city,
								p.ratingCount ? ` · ${p.ratingAvg.toFixed(1)} from ${p.ratingCount}` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-lg text-accent",
							children: formatScore(p.sabiScore)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-faint",
							children: [p.jobsDone, " jobs"]
						})]
					})
				]
			}) }, p.userId))
		})
	] });
}
//#endregion
export { BoardPage as component };
