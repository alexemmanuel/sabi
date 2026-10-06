import { o as __toESM } from "../_runtime.mjs";
import { a as SKILLS, n as CITIES } from "./catalog-qfqyDFYs.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { T as require_jsx_runtime, w as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as updateMyProfile, f as RedirectToSignIn, h as useCurrentUserState, u as formatScore, v as getMyProfile } from "./router-BanMfBzo.mjs";
import { t as Stamp } from "./stamp-BY7-BKaP.mjs";
import { t as Button } from "./button-BgD28_99.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-E8Ps6k-2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-S-kyt1lZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MePage() {
	const { user, isPending } = useCurrentUserState();
	const router = useRouter();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let live = true;
		getMyProfile().then((p) => {
			if (live) setProfile(p);
		}).catch(() => toast.error("Could not load profile")).finally(() => {
			if (live) setLoading(false);
		});
		return () => {
			live = false;
		};
	}, [isPending, user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-surface" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (loading || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-xl bg-surface" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeForm, {
		profile,
		onSaved: async (p) => {
			setProfile(p);
			await router.invalidate();
		}
	});
}
function MeForm({ profile, onSaved }) {
	const [displayName, setDisplayName] = (0, import_react.useState)(profile.displayName);
	const [city, setCity] = (0, import_react.useState)(profile.city);
	const [bio, setBio] = (0, import_react.useState)(profile.bio);
	const [primarySkill, setPrimarySkill] = (0, import_react.useState)(profile.primarySkill);
	const [role, setRole] = (0, import_react.useState)(profile.role);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			const next = await updateMyProfile({ data: {
				displayName,
				city,
				bio,
				primarySkill,
				role
			} });
			toast.success("Profile saved");
			await onSaved(next);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid gap-8 md:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-line bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						name: displayName,
						seed: profile.userId,
						size: "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl tracking-tight",
						children: displayName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["@", profile.handle]
					})] })]
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/pros/$handle",
					params: { handle: profile.handle },
					className: "mt-5 inline-block text-sm text-muted hover:text-fg",
					children: "View public profile"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Your record"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "skill",
							children: "Primary skill"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "skill",
							value: primarySkill,
							onChange: (e) => setPrimarySkill(e.target.value),
							className: "h-11 w-full rounded-md border border-line bg-raised px-3 text-sm",
							children: SKILLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.name
							}, s.id))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "role",
						children: "I am here to"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "role",
						value: role,
						onChange: (e) => setRole(e.target.value),
						className: "h-11 w-full rounded-md border border-line bg-raised px-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "both",
								children: "Work and hire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pro",
								children: "Get hired"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "client",
								children: "Hire people"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "bio",
						children: "Bio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "bio",
						value: bio,
						onChange: (e) => setBio(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: saving ? "Saving…" : "Save profile"
				})
			]
		})]
	});
}
//#endregion
export { MePage as component };
