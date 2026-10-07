import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as cn } from "./router-pjcKKlHL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stamp-CzFcKSZ6.js
var import_jsx_runtime = require_jsx_runtime();
var HUES = [
	18,
	32,
	142,
	168,
	200,
	24,
	12,
	85,
	45,
	155
];
function Stamp({ name, seed, size = "md" }) {
	const hue = HUES[seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
	const initials = name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid shrink-0 place-items-center overflow-hidden rounded-md font-display font-medium text-paper", size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-16 w-16 text-lg" : "h-11 w-11 text-sm"),
		style: { background: `linear-gradient(145deg, hsl(${hue} 18% 22%), hsl(${hue} 12% 12%))` },
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "absolute inset-0 h-full w-full opacity-40",
			viewBox: "0 0 40 40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "6",
				cy: "8",
				r: "10",
				fill: `hsl(${hue} 30% 30%)`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "18",
				width: "24",
				height: "24",
				fill: `hsl(${hue} 20% 18%)`
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative",
			children: initials
		})]
	});
}
//#endregion
export { Stamp as t };
