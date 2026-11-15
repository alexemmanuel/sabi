import { o as __toESM } from "../_runtime.mjs";
import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as endorsePro, n as Route$1 } from "./router-CApGr4CO.mjs";
import { n as formatScore } from "./utils-DXs1-lZF.mjs";
import { t as Stamp } from "./stamp-Dxnj5P0w.mjs";
import { t as Button } from "./button-ByQdrJKz.mjs";
import { i as useCurrentUser, t as Input } from "./use-current-user-BQp3yYvs.mjs";
import { t as Badge } from "./badge-kKPPkPIq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pros._handle-F-cz6oKu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProPage() {
	const data = Route$1.useLoaderData();
	const user = useCurrentUser();
	const router = useRouter();
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Nobody with that handle"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/board",
		className: "mt-4 inline-block text-sm text-muted",
		children: "Back to the board"
	})] });
	const { profile, attempts, endorsements, ratings } = data;
	const canEndorse = user && user.id !== profile.userId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid gap-8 lg:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					name: profile.displayName,
					seed: profile.userId,
					size: "lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl tracking-tight",
					children: profile.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"@",
						profile.handle,
						" · ",
						profile.city
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: SKILLS.find((s) => s.id === profile.primarySkill)?.name }), profile.isFeatured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Featured" }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: profile.bio || "No bio yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 grid grid-cols-3 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase tracking-wide text-faint",
								children: "Sabi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-2xl text-accent",
								children: formatScore(profile.sabiScore)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase tracking-wide text-faint",
								children: "Jobs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-2xl",
								children: profile.jobsDone
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase tracking-wide text-faint",
								children: "Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono text-2xl",
								children: profile.ratingCount ? profile.ratingAvg.toFixed(1) : "—"
							})]
						})
					]
				}),
				canEndorse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-2",
					onSubmit: async (e) => {
						e.preventDefault();
						setBusy(true);
						try {
							await endorsePro({ data: {
								toId: profile.userId,
								skillId: profile.primarySkill,
								note
							} });
							toast.success("Endorsed");
							setNote("");
							await router.invalidate();
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not endorse");
						} finally {
							setBusy(false);
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "I have seen this person work…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "ghost",
						className: "w-full",
						disabled: busy,
						children: "Endorse this skill"
					})]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Trials"
				}), attempts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No trials submitted yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: attempts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/challenges/$id",
								params: { id: a.challengeId },
								className: "text-sm font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-accent",
								children: a.score
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: a.feedback
						})]
					}, a.challengeId))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Endorsements"
				}), endorsements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No peer stamps yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: endorsements.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: e.fromName
							}),
							" on ",
							SKILLS.find((s) => s.id === e.skillId)?.name,
							e.note ? ` — ${e.note}` : ""
						]
					}, `${e.fromId}-${i}`))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Client notes"
				}), ratings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No ratings yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: ratings.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-muted",
						children: [
							r.stars,
							"/5",
							r.comment ? ` — ${r.comment}` : ""
						]
					}, i))
				})] })
			]
		})]
	});
}
//#endregion
export { ProPage as component };
