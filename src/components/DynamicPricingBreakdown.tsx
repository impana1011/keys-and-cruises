import { useState } from "react";
import type { Vehicle } from "@/types";
import { calculateDynamicRentalPricing, type DynamicPricingResult } from "@/services/pricingEngine";

interface Props {
  vehicle: Vehicle;
  pickupDate: string;
  returnDate: string;
}

export function DynamicPricingBreakdown({ vehicle, pickupDate, returnDate }: Props) {
  const [showDays, setShowDays] = useState(false);
  const pricing: DynamicPricingResult = calculateDynamicRentalPricing(vehicle, pickupDate, returnDate);
  const hasDates = Boolean(pickupDate && returnDate && returnDate > pickupDate);

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">Dynamic Pricing</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              Algorithm Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prices adjust dynamically based on weekends, festival periods, seasonal demand & fleet availability.
          </p>
        </div>
      </div>

      {/* Pricing rates display */}
      <div className="my-3 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Base Daily Rate</span>
          <span className="text-sm font-medium line-through text-muted-foreground">
            ₹{pricing.baseRatePerDay} / day
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">Dynamic Effective Rate</span>
          <div className="text-right">
            <span className="text-lg font-bold text-primary">₹{pricing.effectiveRatePerDay}</span>
            <span className="text-xs text-muted-foreground"> / day avg</span>
          </div>
        </div>

        {hasDates && (
          <div className="flex items-baseline justify-between border-t pt-2">
            <span className="text-sm">Total Duration</span>
            <span className="text-sm font-medium">{pricing.totalDays} {pricing.totalDays === 1 ? "day" : "days"}</span>
          </div>
        )}
      </div>

      {/* Active Algorithmic Factors Badges */}
      <div className="my-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Dynamic Factors
        </p>
        <div className="flex flex-wrap gap-1.5">
          {pricing.factors.map((f, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                f.type === "surge"
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <span>{f.type === "surge" ? "⚡" : "🏷️"}</span>
              <span>{f.description}</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded border border-muted bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
            📊 {pricing.utilizationCategory} Utilization: {pricing.utilizationRate}%
          </span>
        </div>
      </div>

      {/* Total and Surge/Discount Alert */}
      {hasDates ? (
        <div className="mt-3 rounded border bg-muted/40 p-2.5">
          <div className="flex items-center justify-between font-semibold">
            <span>Estimated Total:</span>
            <span className="text-lg text-primary">₹{pricing.totalFinalPrice}</span>
          </div>
          {pricing.isSurge && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚡ Festive/Weekend surge of ₹{pricing.differenceAmount} applied over base fare.
            </p>
          )}
          {pricing.isDiscount && (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              🎉 Weekday discount saves you ₹{Math.abs(pricing.differenceAmount)} off standard fare!
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic mt-2">
          Select pickup and return dates above to compute full multi-day dynamic breakdown.
        </p>
      )}

      {/* Day-by-Day Toggle */}
      {hasDates && pricing.dayDetails.length > 1 && (
        <div className="mt-3 border-t pt-2">
          <button
            type="button"
            onClick={() => setShowDays(!showDays)}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            {showDays ? "Hide day-by-day calculation ▲" : "View day-by-day dynamic breakdown ▼"}
          </button>

          {showDays && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded border text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted text-muted-foreground sticky top-0">
                  <tr>
                    <th className="p-1.5">Date</th>
                    <th className="p-1.5">Day Type</th>
                    <th className="p-1.5">Factors</th>
                    <th className="p-1.5 text-right">Daily Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pricing.dayDetails.map((day, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-1.5 font-medium whitespace-nowrap">
                        {day.date} ({day.dayName.slice(0, 3)})
                      </td>
                      <td className="p-1.5">
                        {day.festivalName ? (
                          <span className="text-amber-600 font-medium">Festive</span>
                        ) : day.isWeekend ? (
                          <span className="text-amber-600">Weekend</span>
                        ) : (
                          <span className="text-emerald-600">Weekday</span>
                        )}
                      </td>
                      <td className="p-1.5 text-muted-foreground truncate max-w-[120px]" title={day.appliedFactors.join(", ")}>
                        {day.appliedFactors[0] ?? "-"}
                      </td>
                      <td className="p-1.5 text-right font-semibold whitespace-nowrap">
                        ₹{day.dynamicRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
