import { cn } from "@/lib/utils";

const HUES = [18, 32, 142, 168, 200, 24, 12, 85, 45, 155];

export function Stamp({
  name,
  seed,
  size = "md",
}: {
  name: string;
  seed: string;
  size?: "sm" | "md" | "lg";
}) {
  const n = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = HUES[n % HUES.length];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const dim = size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-16 w-16 text-lg" : "h-11 w-11 text-sm";

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-md font-display font-medium text-paper",
        dim,
      )}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 18% 22%), hsl(${hue} 12% 12%))`,
      }}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 40 40">
        <circle cx="6" cy="8" r="10" fill={`hsl(${hue} 30% 30%)`} />
        <rect x="20" y="18" width="24" height="24" fill={`hsl(${hue} 20% 18%)`} />
      </svg>
      <span className="relative">{initials}</span>
    </div>
  );
}
