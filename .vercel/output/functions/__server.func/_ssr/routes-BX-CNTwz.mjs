import { a as SKILLS } from "./catalog-qfqyDFYs.mjs";
import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as Route$10, d as naira, u as formatScore } from "./router-BanMfBzo.mjs";
import { t as Stamp } from "./stamp-BY7-BKaP.mjs";
import { t as Button } from "./button-BgD28_99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BX-CNTwz.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { board, jobs, challenges } = Route$10.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "space-y-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
						children: "Proof of skill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-[2.6rem] leading-[1.05] tracking-[-0.03em] md:text-6xl",
						children: "Sabi over certificate."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base leading-relaxed text-muted",
						children: "Paper can lie. Work cannot. Sabi ranks people by challenges, completed jobs, and client ratings — not by the school that printed a name."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/challenges",
								children: "Take a trial"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/jobs",
								children: "Hire from the board"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-faint",
							children: "How rank is earned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-4 border-b border-line pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skill trials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-fg",
										children: "45%"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-4 border-b border-line pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Client ratings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-fg",
										children: "30%"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-4 border-b border-line pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completed jobs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-fg",
										children: "15%"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Peer endorsements" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-fg",
										children: "10%"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs leading-relaxed text-faint",
							children: "Certificates can sit on a profile. They do not move the number."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "The board"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/board",
					className: "inline-flex items-center gap-1 text-sm text-muted hover:text-fg",
					children: ["Full ranking ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: board.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/pros/$handle",
					params: { handle: p.handle },
					className: "flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 font-mono text-xs text-faint",
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
									p.city
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-lg text-accent",
							children: formatScore(p.sabiScore)
						})
					]
				}, p.userId))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Open jobs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/jobs",
						className: "text-sm text-muted hover:text-fg",
						children: "See all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/jobs/$id",
						params: { id: String(j.id) },
						className: "block rounded-lg border border-line bg-surface p-4 hover:border-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium leading-snug",
								children: j.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-mono text-sm text-accent",
								children: naira(j.budgetNaira)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								SKILLS.find((s) => s.id === j.skillId)?.name,
								" · ",
								j.city
							]
						})]
					}, j.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Live trials"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/challenges",
						className: "text-sm text-muted hover:text-fg",
						children: "All trials"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: challenges.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/challenges/$id",
						params: { id: c.id },
						className: "block rounded-lg border border-line bg-surface p-4 hover:border-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: c.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								SKILLS.find((s) => s.id === c.skillId)?.name,
								" · ",
								c.minutes,
								" min · ",
								c.difficulty
							]
						})]
					}, c.id))
				})] })]
			})
		]
	});
}
//#endregion
export { Home as component };
