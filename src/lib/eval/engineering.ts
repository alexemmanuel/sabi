export type Answer = Record<string, number>;

export type Task = {
  id: string;
  title: string;
  domain: string;
  prompt: string;
  fields: { key: string; label: string; unit: string; tol: number }[];
  whyModelsMiss: string;
};

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function kobo(naira: string) {
  const [whole, frac = ""] = naira.split(".");
  const padded = (frac + "00").slice(0, 2);
  const sign = naira.trim().startsWith("-") ? -1 : 1;
  return sign * (Math.abs(Number(whole)) * 100 + Number(padded));
}

const LEDGER = ["8.20", "1.10", "0.70"];

function beamMm() {
  const P = 12_000;
  const L = 4.2;
  const E = 200e9;
  const I = 8.4e6 * 1e-12;
  const meters = (P * L ** 3) / (48 * E * I);
  return round3(meters * 1000);
}

function branchMa() {
  const rPar = (200 * 300) / (200 + 300);
  const iTotal = 12 / (100 + rPar);
  const vPar = iTotal * rPar;
  return round3((vPar / 300) * 1000);
}

function clearances() {
  const holeMin = 20.0;
  const holeMax = 20.02;
  const shaftMax = 19.96;
  const shaftMin = 19.93;
  return {
    minClearanceUm: Math.round((holeMin - shaftMax) * 1000),
    maxClearanceUm: Math.round((holeMax - shaftMin) * 1000),
  };
}

const EDGES: [string, string, number][] = [
  ["S", "A", 2],
  ["S", "B", 5],
  ["A", "B", 1],
  ["A", "C", 7],
  ["B", "C", 1],
  ["B", "T", 8],
  ["C", "T", 2],
];

function shortest(): number {
  const nodes = ["S", "A", "B", "C", "T"];
  const dist = new Map(nodes.map((n) => [n, Infinity]));
  dist.set("S", 0);
  const used = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    let u: string | null = null;
    for (const n of nodes) {
      if (used.has(n)) continue;
      if (u === null || (dist.get(n) ?? Infinity) < (dist.get(u) ?? Infinity)) u = n;
    }
    if (u === null || !Number.isFinite(dist.get(u))) break;
    used.add(u);
    for (const [a, b, w] of EDGES) {
      const v = a === u ? b : b === u ? a : null;
      if (!v || used.has(v)) continue;
      const next = (dist.get(u) ?? Infinity) + w;
      if (next < (dist.get(v) ?? Infinity)) dist.set(v, next);
    }
  }
  return dist.get("T") ?? Infinity;
}

function stoppingM() {
  const v = 72 / 3.6;
  const reaction = v * 1.2;
  const brake = (v * v) / (2 * 0.45 * 9.81);
  return round3(reaction + brake);
}

function spectrum() {
  const fs = 44100;
  const n = 1024;
  const bin = Math.round((440 * n) / fs);
  const centerHz = round3((bin * fs) / n);
  return { bin, centerHz };
}

function threePhaseW() {
  return Math.round(Math.sqrt(3) * 400 * 18.5 * 0.86);
}

export const GOLD: Record<string, Answer> = {
  "kobo-ledger": { totalKobo: LEDGER.reduce((s, x) => s + kobo(x), 0) },
  "beam-deflection": { deflectionMm: beamMm() },
  "branch-current": { currentMa: branchMa() },
  "fit-clearance": clearances(),
  "shortest-path": { distance: shortest() },
  "stopping-distance": { distanceM: stoppingM() },
  "spectrum-bin": spectrum(),
  "three-phase-power": { powerW: threePhaseW() },
};

export const TASKS: Task[] = [
  {
    id: "kobo-ledger",
    title: "Kobo ledger",
    domain: "Money arithmetic",
    prompt: `Sum these naira amounts exactly, as an integer number of kobo (1 naira = 100 kobo). Do not use binary floating point. Amounts: ${LEDGER.join(", ")}. Reply with JSON: {"totalKobo": <integer>}.`,
    fields: [{ key: "totalKobo", label: "Total", unit: "kobo", tol: 0 }],
    whyModelsMiss: "They add IEEE-754 floats then multiply by 100, which is off by a kobo.",
  },
  {
    id: "beam-deflection",
    title: "Midspan deflection",
    domain: "Structural",
    prompt:
      "A simply supported steel beam carries a single point load at midspan. Use δ = P L³ / (48 E I). P = 12 kN, L = 4.2 m, E = 200 GPa, I = 8.4×10⁶ mm⁴. Report midspan deflection in millimetres to 3 decimal places. Reply with JSON: {\"deflectionMm\": <number>}.",
    fields: [{ key: "deflectionMm", label: "Deflection", unit: "mm", tol: 0.02 }],
    whyModelsMiss: "They forget mm⁴ → m⁴ is ×10⁻¹², so the deflection is orders of magnitude off.",
  },
  {
    id: "branch-current",
    title: "Branch current",
    domain: "Circuits",
    prompt:
      "A 12 V DC source feeds R1 = 100 Ω in series with the parallel pair R2 = 200 Ω and R3 = 300 Ω. Find the current through R3 in milliamps, to 3 decimal places. Reply with JSON: {\"currentMa\": <number>}.",
    fields: [{ key: "currentMa", label: "I(R3)", unit: "mA", tol: 0.02 }],
    whyModelsMiss: "They treat the three resistors as one series string, or they split current by resistance instead of conductance.",
  },
  {
    id: "fit-clearance",
    title: "Shaft and hole fit",
    domain: "Tolerances",
    prompt:
      "Hole: 20.00 mm, +0.02 / −0.00. Shaft: 19.96 mm, +0.00 / −0.03. Report worst-case minimum and maximum clearance in micrometres (integers). Reply with JSON: {\"minClearanceUm\": <integer>, \"maxClearanceUm\": <integer>}.",
    fields: [
      { key: "minClearanceUm", label: "Min clearance", unit: "µm", tol: 0 },
      { key: "maxClearanceUm", label: "Max clearance", unit: "µm", tol: 0 },
    ],
    whyModelsMiss: "They subtract nominals, or they pair the tolerances the wrong way (largest shaft with largest hole).",
  },
  {
    id: "shortest-path",
    title: "Undirected shortest path",
    domain: "Graphs",
    prompt:
      "Undirected weighted edges: S–A 2, S–B 5, A–B 1, A–C 7, B–C 1, B–T 8, C–T 2. Find the shortest-path distance from S to T. Reply with JSON: {\"distance\": <number>}.",
    fields: [{ key: "distance", label: "Distance", unit: "", tol: 0 }],
    whyModelsMiss: "They walk the cheapest first edge and never reopen a node, so they miss S–A–B–C–T.",
  },
  {
    id: "stopping-distance",
    title: "Stopping distance",
    domain: "Vehicle dynamics",
    prompt:
      "Level dry road. Speed 72 km/h, friction μ = 0.45, g = 9.81 m/s², driver reaction 1.2 s. Stopping distance = reaction distance + v² / (2 μ g). Report metres to 3 decimal places. Reply with JSON: {\"distanceM\": <number>}.",
    fields: [{ key: "distanceM", label: "Distance", unit: "m", tol: 0.05 }],
    whyModelsMiss: "They drop the reaction distance, or they leave speed in km/h inside v².",
  },
  {
    id: "spectrum-bin",
    title: "FFT bin of 440 Hz",
    domain: "Signals",
    prompt:
      "Real FFT, sample rate 44100 Hz, N = 1024. A pure 440 Hz tone. Report the nearest bin index (integer) and that bin's centre frequency in hertz to 3 decimal places. Reply with JSON: {\"bin\": <integer>, \"centerHz\": <number>}.",
    fields: [
      { key: "bin", label: "Bin", unit: "", tol: 0 },
      { key: "centerHz", label: "Centre", unit: "Hz", tol: 0.02 },
    ],
    whyModelsMiss: "They assume bin width is 44100/1000, or they report 440 Hz as if it lands on a bin centre.",
  },
  {
    id: "three-phase-power",
    title: "Three-phase real power",
    domain: "Power",
    prompt:
      "Balanced three-phase load. Line voltage 400 V, line current 18.5 A, power factor 0.86 lagging. Real power P = √3 · V_L · I_L · pf. Report watts as an integer (round half away from zero). Reply with JSON: {\"powerW\": <integer>}.",
    fields: [{ key: "powerW", label: "Power", unit: "W", tol: 0 }],
    whyModelsMiss: "They use P = V · I · pf and drop √3, which is the single-phase formula.",
  },
];

export const MISSES: Record<string, Answer> = {
  "kobo-ledger": { totalKobo: LEDGER.reduce((s, x) => s + Number(x), 0) * 100 },
  "beam-deflection": (() => {
    const P = 12_000;
    const L = 4.2;
    const E = 200e9;
    const I = 8.4e6;
    return { deflectionMm: (P * L ** 3) / (48 * E * I) };
  })(),
  "branch-current": { currentMa: round3((12 / (100 + 200 + 300)) * 1000) },
  "fit-clearance": { minClearanceUm: 40, maxClearanceUm: 40 },
  "shortest-path": { distance: 11 },
  "stopping-distance": { distanceM: round3(((72 / 3.6) ** 2) / (2 * 0.45 * 9.81)) },
  "spectrum-bin": { bin: 10, centerHz: 440 },
  "three-phase-power": { powerW: Math.round(400 * 18.5 * 0.86) },
};

export function gradeTask(task: Task, answer: Answer) {
  const gold = GOLD[task.id];
  const fields = task.fields.map((field) => {
    const expected = gold[field.key];
    const got = answer[field.key];
    const pass = typeof got === "number" && Number.isFinite(got) && Math.abs(got - expected) <= field.tol;
    return { ...field, expected, got: Number.isFinite(got) ? got : null, pass };
  });
  const passed = fields.filter((f) => f.pass).length;
  return { fields, passed, total: fields.length, pass: passed === fields.length };
}

function asNumber(item: unknown): number | null {
  if (typeof item === "number" && Number.isFinite(item)) return item;
  if (typeof item === "string" && item.trim() !== "" && Number.isFinite(Number(item))) return Number(item);
  return null;
}

export function parseJsonObject(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```(?:json)?/gi, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const value = JSON.parse(match[0]) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toAnswer(value: Record<string, unknown>): Answer {
  const out: Answer = {};
  for (const [key, item] of Object.entries(value)) {
    const n = asNumber(item);
    if (n !== null) out[key] = n;
  }
  return out;
}

export function parseAnswer(raw: string): Answer | null {
  const value = parseJsonObject(raw);
  if (!value) return null;
  const out = toAnswer(value);
  return Object.keys(out).length ? out : null;
}

export function parseSuite(raw: string): Record<string, Answer> | null {
  const value = parseJsonObject(raw);
  if (!value) return null;
  const known = new Set(TASKS.map((task) => task.id));
  const suite: Record<string, Answer> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!known.has(key) || !item || typeof item !== "object" || Array.isArray(item)) continue;
    const answer = toAnswer(item as Record<string, unknown>);
    if (Object.keys(answer).length) suite[key] = answer;
  }
  return Object.keys(suite).length ? suite : null;
}
