import { o as __toESM } from "../_runtime.mjs";
import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as submitChallenge, a as Route$5, p as SignInGate } from "./router-pjcKKlHL.mjs";
import { t as Button } from "./button-CtfZeCiB.mjs";
import { r as Textarea } from "./input-C6vudg5_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/challenges._id-BMeOHvIe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChallengePage() {
	const { challenge, attempt } = Route$5.useLoaderData();
	const [answer, setAnswer] = (0, import_react.useState)(attempt?.answer ?? "");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(attempt ? {
		score: attempt.score,
		feedback: attempt.feedback
	} : null);
	if (!challenge) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Trial not found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/challenges",
		className: "mt-4 inline-block text-sm text-muted hover:text-fg",
		children: "All trials"
	})] });
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		try {
			const res = await submitChallenge({ data: {
				challengeId: challenge.id,
				answer
			} });
			setResult(res);
			toast.success(`Scored ${res.score}`);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not score";
			if (message === "Unauthorized") toast.error("Sign in to submit a trial.");
			else toast.error(message);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: [
					SKILLS.find((s) => s.id === challenge.skillId)?.name,
					" · ",
					challenge.minutes,
					" min"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: challenge.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: challenge.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-md border border-line bg-surface px-3 py-2 text-xs text-faint",
				children: "Certificates are ignored. The scorer looks for sequence, safety, and whether you would actually do this on site."
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg border border-accent/30 bg-raised p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-3xl text-accent",
					children: result.score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: result.feedback
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: answer,
					onChange: (e) => setAnswer(e.target.value),
					placeholder: "Walk the work. Order of checks. What you would refuse to guess.",
					className: "min-h-48"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full",
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Sign in to submit"
						})
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending || answer.trim().length < 40,
						className: "w-full",
						children: pending ? "Scoring…" : result ? "Resubmit trial" : "Submit trial"
					})
				})]
			})
		]
	});
}
//#endregion
export { ChallengePage as component };
