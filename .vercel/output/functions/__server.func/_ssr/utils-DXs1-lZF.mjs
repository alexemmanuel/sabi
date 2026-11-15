import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DXs1-lZF.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function naira(value) {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0
	}).format(value);
}
function formatScore(value) {
	return Math.round(value).toString();
}
//#endregion
export { formatScore as n, naira as r, cn as t };
