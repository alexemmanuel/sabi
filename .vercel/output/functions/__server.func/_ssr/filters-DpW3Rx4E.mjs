import { a as SKILLS, n as CITIES } from "./catalog-qfqyDFYs.mjs";
import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-DXs1-lZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filters-DpW3Rx4E.js
var import_jsx_runtime = require_jsx_runtime();
function SkillCityFilters({ skill, city, onSkill, onCity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: skill === "all",
				onClick: () => onSkill("all"),
				children: "All skills"
			}), SKILLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: skill === s.id,
				onClick: () => onSkill(s.id),
				children: s.name
			}, s.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: city === "all",
				onClick: () => onCity("all"),
				children: "All cities"
			}), CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: city === c,
				onClick: () => onCity(c),
				children: c
			}, c))]
		})]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full border px-3 text-sm transition-colors", active ? "border-paper bg-paper text-paper-fg" : "border-line bg-surface text-muted hover:text-fg"),
		children
	});
}
//#endregion
export { SkillCityFilters as t };
