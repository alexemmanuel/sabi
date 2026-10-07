import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { l as cn } from "./router-pjcKKlHL.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CtfZeCiB.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg", {
	variants: {
		variant: {
			primary: "bg-paper text-paper-fg hover:bg-fg",
			accent: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "bg-transparent text-fg border border-line hover:bg-raised",
			faint: "bg-raised text-fg hover:bg-line",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-[10px]",
			md: "h-11 px-4 text-sm rounded-md",
			lg: "h-12 px-5 text-base rounded-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
