import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-s-ZNE2yR.mjs";
import { t as Button } from "./button-BgD28_99.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D4EeHBW3.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-md py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
				children: "Enter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl tracking-tight",
				children: "Sign in to prove it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Your rank, trials, and jobs follow this account. Guests can browse the board. Signing in is how you sit on it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					className: "w-full",
					onClick: () => signIn(p.providerId, { callbackURL: "/me" }),
					children: ["Continue with ", p.label]
				}, p.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-faint",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "underline decoration-line underline-offset-4 hover:text-fg",
					children: "Back to the board"
				})
			})
		]
	});
}
//#endregion
export { Login as component };
