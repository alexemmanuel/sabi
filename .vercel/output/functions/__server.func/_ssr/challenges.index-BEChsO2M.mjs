import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$6 } from "./router-pjcKKlHL.mjs";
import { t as Badge } from "./badge-DrBxXYS3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/challenges.index-BEChsO2M.js
var import_jsx_runtime = require_jsx_runtime();
function ChallengesPage() {
	const challenges = Route$6.useLoaderData();
	const groups = SKILLS.map((skill) => ({
		skill,
		items: challenges.filter((c) => c.skillId === skill.id)
	})).filter((g) => g.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
			children: "Prove it"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl tracking-tight",
			children: "Trials"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-sm text-muted",
			children: "Timed, scored, no certificate required. Write how you would actually do the work. Ranked people review the same problems."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 space-y-8",
			children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: g.skill.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-faint",
					children: g.skill.category
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: g.items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/challenges/$id",
					params: { id: c.id },
					className: "rounded-lg border border-line bg-surface p-4 hover:border-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium leading-snug",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.difficulty })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-2 text-sm text-muted",
							children: c.prompt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-faint",
							children: [c.minutes, " minutes"]
						})
					]
				}, c.id))
			})] }, g.skill.id))
		})
	] });
}
//#endregion
export { ChallengesPage as component };
