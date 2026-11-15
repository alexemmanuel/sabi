import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-2w6BDm1i.js
var import_jsx_runtime = require_jsx_runtime();
var DOORS = [
	{
		to: "/board",
		kicker: "Rank",
		title: "The board",
		body: "People ranked by work they have already shown, in a city and a skill. A certificate does not move the list."
	},
	{
		to: "/challenges",
		kicker: "Prove",
		title: "Trials",
		body: "Timed problems: a dead socket, a bad fit, a pitch, a cut. Write how you would actually do it. The score sticks to your name."
	},
	{
		to: "/jobs",
		kicker: "Hire",
		title: "Jobs",
		body: "A client posts the work. Sabi shows people who have already passed that kind of trial, then keeps the rating after the job."
	},
	{
		to: "/me",
		kicker: "You",
		title: "Your sabi",
		body: "Set your city and skill. Take trials. The same reputation follows you from one gig to the next."
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: "Skill over paper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 max-w-xl font-display text-4xl leading-tight tracking-tight md:text-5xl",
				children: "Show the work. The certificate can wait."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
				children: "Sabi ranks people by what they can do: trials, finished jobs, and ratings. Lagos to Kano. Electrical, fashion, code, cooking. No exam body required."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/board",
					className: "inline-flex h-11 items-center rounded-md bg-paper px-4 text-sm font-medium text-paper-fg",
					children: "Open the board"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/challenges",
					className: "inline-flex h-11 items-center rounded-md border border-line px-4 text-sm",
					children: "Take a trial"
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid gap-3 sm:grid-cols-2",
			children: DOORS.map((door) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: door.to,
				className: "rounded-lg border border-line bg-surface p-4 hover:border-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-faint",
						children: door.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl",
						children: door.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: door.body
					})
				]
			}, door.to))
		})]
	});
}
//#endregion
export { Home as component };
