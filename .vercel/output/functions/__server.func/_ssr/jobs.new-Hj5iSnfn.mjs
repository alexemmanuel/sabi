import { o as __toESM } from "../_runtime.mjs";
import { a as SKILLS, n as CITIES } from "./catalog-qfqyDFYs.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useNavigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as postJob, f as RedirectToSignIn, h as useCurrentUserState } from "./router-pjcKKlHL.mjs";
import { t as Button } from "./button-CtfZeCiB.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-C6vudg5_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs.new-Hj5iSnfn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewJobPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [skillId, setSkillId] = (0, import_react.useState)(SKILLS[0].id);
	const [city, setCity] = (0, import_react.useState)("Lagos");
	const [budget, setBudget] = (0, import_react.useState)("50000");
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await postJob({ data: {
				title,
				description,
				skillId,
				city,
				budgetNaira: Number(budget)
			} });
			toast.success("Job posted");
			navigate({
				to: "/jobs/$id",
				params: { id: String(res.id) }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not post");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: "Client"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: "Post a job"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Ranked people for that skill will appear on the job. You hire from the list."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "skill",
								children: "Skill"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "skill",
								value: skillId,
								onChange: (e) => setSkillId(e.target.value),
								className: "h-11 w-full rounded-md border border-line bg-raised px-3 text-sm",
								children: SKILLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "city",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "city",
								value: city,
								onChange: (e) => setCity(e.target.value),
								className: "h-11 w-full rounded-md border border-line bg-raised px-3 text-sm",
								children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "budget",
							children: "Budget (naira)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "budget",
							type: "number",
							min: 5e3,
							value: budget,
							onChange: (e) => setBudget(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "desc",
							children: "Brief"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "desc",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: saving,
						children: saving ? "Posting…" : "Publish job"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/jobs",
							className: "text-muted hover:text-fg",
							children: "Cancel"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { NewJobPage as component };
