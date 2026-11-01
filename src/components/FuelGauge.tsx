import type { FuelLevel } from "@/types";
import { FUEL_LEVELS } from "@/services/fuelService";
import { Fuel } from "lucide-react";

interface FuelGaugeProps {
  level: FuelLevel;
  interactive?: boolean | undefined;
  onChange?: ((level: FuelLevel) => void) | undefined;
  label?: string | undefined;
}

export function FuelGauge({
  level,
  interactive = false,
  onChange,
  label = "Fuel Tank Status",
}: FuelGaugeProps) {
  const getPercentage = (l: FuelLevel): number => {
    switch (l) {
      case "100% (Full Tank)":
        return 100;
      case "75% (3/4 Tank)":
        return 75;
      case "50% (Half Tank)":
        return 50;
      case "25% (1/4 Tank)":
        return 25;
      case "Reserve / Empty":
        return 10;
      default:
        return 100;
    }
  };

  const pct = getPercentage(level);

  const getColor = (p: number) => {
    if (p >= 75) return "bg-emerald-500 text-emerald-600";
    if (p >= 50) return "bg-amber-500 text-amber-600";
    return "bg-rose-500 text-rose-600";
  };

  return (
    <div className="rounded border bg-card p-3 shadow-sm text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-semibold">
          <Fuel size={14} className={getColor(pct).split(" ")[1]} />
          <span>{label}</span>
        </div>
        <span className="font-mono font-bold">{level}</span>
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
        <div
          className={`h-full transition-all duration-300 ${getColor(pct).split(" ")[0]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>E</span>
        <span>1/4</span>
        <span>1/2</span>
        <span>3/4</span>
        <span>F</span>
      </div>

      {interactive && (
        <div className="mt-2.5 pt-2 border-t flex flex-wrap gap-1">
          {FUEL_LEVELS.map((fl) => (
            <button
              key={fl}
              type="button"
              onClick={() => onChange?.(fl)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                level === fl
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {fl.split(" ")[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
