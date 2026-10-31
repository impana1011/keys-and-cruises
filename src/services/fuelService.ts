import type { Category, FuelLevel, FuelLog } from "@/types";

export const FUEL_LEVELS: FuelLevel[] = [
  "100% (Full Tank)",
  "75% (3/4 Tank)",
  "50% (Half Tank)",
  "25% (1/4 Tank)",
  "Reserve / Empty",
];

const LEVEL_WEIGHTS: Record<FuelLevel, number> = {
  "100% (Full Tank)": 4,
  "75% (3/4 Tank)": 3,
  "50% (Half Tank)": 2,
  "25% (1/4 Tank)": 1,
  "Reserve / Empty": 0,
};

export function calculateFuelDeficitCharge(
  category: Category,
  dispatchLevel: FuelLevel = "100% (Full Tank)",
  returnLevel: FuelLevel = "100% (Full Tank)"
): { missingQuarters: number; deficitAmount: number; serviceCharge: number; totalFuelPenalty: number } {
  const dispatchWeight = LEVEL_WEIGHTS[dispatchLevel];
  const returnWeight = LEVEL_WEIGHTS[returnLevel];
  const missingQuarters = Math.max(0, dispatchWeight - returnWeight);

  if (missingQuarters === 0) {
    return { missingQuarters: 0, deficitAmount: 0, serviceCharge: 0, totalFuelPenalty: 0 };
  }

  const isHeavy = category === "Mini Bus" || category === "Tempo Traveller" || category === "Travels";
  const costPerQuarter = isHeavy ? 1000 : 500;
  const serviceCharge = isHeavy ? 200 : 100;
  const deficitAmount = missingQuarters * costPerQuarter;
  const totalFuelPenalty = deficitAmount + serviceCharge;

  return { missingQuarters, deficitAmount, serviceCharge, totalFuelPenalty };
}

export function createDefaultFuelLog(): FuelLog {
  return {
    dispatchLevel: "100% (Full Tank)",
    notes: "Verified at hub dispatch: 100% Full tank with tamper-proof seal.",
  };
}
