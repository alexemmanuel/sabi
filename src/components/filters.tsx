import { CITIES, SKILLS } from "@/lib/sabi/catalog";
import { cn } from "@/lib/utils";

export function SkillCityFilters({
  skill,
  city,
  onSkill,
  onCity,
}: {
  skill: string;
  city: string;
  onSkill: (v: string) => void;
  onCity: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterChip active={skill === "all"} onClick={() => onSkill("all")}>
          All skills
        </FilterChip>
        {SKILLS.map((s) => (
          <FilterChip key={s.id} active={skill === s.id} onClick={() => onSkill(s.id)}>
            {s.name}
          </FilterChip>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterChip active={city === "all"} onClick={() => onCity("all")}>
          All cities
        </FilterChip>
        {CITIES.map((c) => (
          <FilterChip key={c} active={city === c} onClick={() => onCity(c)}>
            {c}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-3 text-sm transition-colors",
        active ? "border-paper bg-paper text-paper-fg" : "border-line bg-surface text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
