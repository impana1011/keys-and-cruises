import type { Vehicle } from "@/types";
import { vehicleService } from "./api";

export interface DayPricingDetail {
  date: string; // YYYY-MM-DD
  dayName: string;
  isWeekend: boolean;
  festivalName?: string | undefined;
  baseRate: number;
  dynamicRate: number;
  multiplier: number;
  appliedFactors: string[];
}

export interface PricingFactor {
  name: string;
  type: "surge" | "discount";
  percentage: number;
  description: string;
}

export interface DynamicPricingResult {
  vehicleId: string;
  vehicleName: string;
  baseRatePerDay: number;
  effectiveRatePerDay: number;
  totalDays: number;
  totalBasePrice: number;
  totalFinalPrice: number;
  differenceAmount: number;
  isSurge: boolean;
  isDiscount: boolean;
  overallMultiplier: number;
  factors: PricingFactor[];
  dayDetails: DayPricingDetail[];
  utilizationRate: number; // 0 to 100%
  utilizationCategory: string;
}

// Major Indian Festival & Holiday Calendar (Recurring by Month & Date)
export interface IndianSeasonRule {
  name: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  multiplier: number; // e.g. 1.30 for +30%
  description: string;
}

export const INDIAN_FESTIVAL_SEASONS: IndianSeasonRule[] = [
  {
    name: "Diwali & Dussehra Festive Rush",
    startMonth: 10,
    startDay: 15,
    endMonth: 11,
    endDay: 20,
    multiplier: 1.30,
    description: "Peak festive travel & holiday vacation season across India (+30%)",
  },
  {
    name: "Christmas & New Year Peak",
    startMonth: 12,
    startDay: 20,
    endMonth: 1,
    endDay: 5,
    multiplier: 1.35,
    description: "Winter holiday rush, year-end travel & tourist surges (+35%)",
  },
  {
    name: "Republic Day Long Weekend",
    startMonth: 1,
    startDay: 24,
    endMonth: 1,
    endDay: 28,
    multiplier: 1.15,
    description: "National holiday weekend travel demand (+15%)",
  },
  {
    name: "Holi Festival Season",
    startMonth: 3,
    startDay: 10,
    endMonth: 3,
    endDay: 26,
    multiplier: 1.20,
    description: "Spring festival holiday getaways (+20%)",
  },
  {
    name: "Summer Vacation Travel Peak",
    startMonth: 5,
    startDay: 1,
    endMonth: 6,
    endDay: 25,
    multiplier: 1.15,
    description: "Annual summer school vacation & family tourer season (+15%)",
  },
  {
    name: "Independence Day Long Weekend",
    startMonth: 8,
    startDay: 12,
    endMonth: 8,
    endDay: 18,
    multiplier: 1.15,
    description: "Monsoon getaway & national holiday weekend (+15%)",
  },
  {
    name: "Monsoon Off-Peak Period",
    startMonth: 7,
    startDay: 1,
    endMonth: 8,
    endDay: 10,
    multiplier: 0.90,
    description: "Heavy monsoon low-demand discount (-10%)",
  },
];

/**
 * Checks if a specific date falls within an Indian festival/holiday season
 */
export function getIndianSeasonalFactor(date: Date): IndianSeasonRule | undefined {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();

  for (const season of INDIAN_FESTIVAL_SEASONS) {
    if (season.startMonth <= season.endMonth) {
      // Normal within-year range
      const afterStart = m > season.startMonth || (m === season.startMonth && d >= season.startDay);
      const beforeEnd = m < season.endMonth || (m === season.endMonth && d <= season.endDay);
      if (afterStart && beforeEnd) return season;
    } else {
      // Year-wrapping range (e.g. Dec 20 to Jan 5)
      const inDec = (m === season.startMonth && d >= season.startDay) || m > season.startMonth;
      const inJan = (m === season.endMonth && d <= season.endDay) || m < season.endMonth;
      if (inDec || inJan) return season;
    }
  }
  return undefined;
}

/**
 * Calculates vehicle category utilization from live in-memory fleet status
 */
export function getCategoryUtilization(category: string): { rate: number; booked: number; total: number } {
  const fleet = vehicleService.getAll().filter((v) => v.category === category);
  if (fleet.length === 0) return { rate: 0, booked: 0, total: 0 };
  const unavailable = fleet.filter((v) => !v.available).length;
  const rate = Math.round((unavailable / fleet.length) * 100);
  return { rate, booked: unavailable, total: fleet.length };
}

/**
 * Core Algorithm: Calculates dynamic price for a specific single day
 */
export function calculateDayRate(vehicle: Vehicle, dateStr: string): DayPricingDetail {
  const date = new Date(dateStr + "T00:00:00");
  const dayOfWeek = date.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[dayOfWeek] ?? "Day";
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

  let multiplier = 1.0;
  const appliedFactors: string[] = [];

  // 1. Day of week adjustment
  if (isWeekend) {
    // Weekend surge in India: +20% for cars & bikes, +25% for TT and Mini Buses
    const weekendSurge = vehicle.category === "Tempo Traveller" || vehicle.category === "Mini Bus" ? 1.25 : 1.20;
    multiplier *= weekendSurge;
    appliedFactors.push(`Weekend Surge (+${Math.round((weekendSurge - 1) * 100)}%)`);
  } else {
    // Weekday discount (Mon - Thu): -10% discount to stimulate demand
    const weekdayDiscount = 0.90;
    multiplier *= weekdayDiscount;
    appliedFactors.push("Weekday Discount (-10%)");
  }

  // 2. Indian Seasonality & Festival Surge
  const season = getIndianSeasonalFactor(date);
  let festivalName: string | undefined;
  if (season) {
    festivalName = season.name;
    multiplier *= season.multiplier;
    const diffPct = Math.round((season.multiplier - 1) * 100);
    appliedFactors.push(`${season.name} (${diffPct >= 0 ? "+" : ""}${diffPct}%)`);
  }

  // 3. Fleet Utilization adjustment
  const { rate: utilRate } = getCategoryUtilization(vehicle.category);
  if (utilRate >= 50) {
    // High demand surge (+15%)
    multiplier *= 1.15;
    appliedFactors.push(`High Category Demand (+15%)`);
  } else if (utilRate >= 25) {
    // Moderate demand (+5%)
    multiplier *= 1.05;
    appliedFactors.push(`Moderate Utilization (+5%)`);
  } else if (!isWeekend && !season) {
    // Surplus inventory discount on quiet weekdays (-5%)
    multiplier *= 0.95;
    appliedFactors.push(`Surplus Fleet Saver (-5%)`);
  }

  // Large travel group demand factor for TT & Mini Bus
  if ((vehicle.category === "Tempo Traveller" || vehicle.category === "Mini Bus") && (isWeekend || season)) {
    multiplier *= 1.10;
    appliedFactors.push("Group Travel Peak Demand (+10%)");
  }

  // Calculate dynamic rate rounded to nearest ₹50 for clean Indian pricing
  const rawRate = vehicle.pricePerDay * multiplier;
  const dynamicRate = Math.max(Math.round(rawRate / 50) * 50, 200);

  return {
    date: dateStr,
    dayName,
    isWeekend,
    festivalName,
    baseRate: vehicle.pricePerDay,
    dynamicRate,
    multiplier: Math.round(multiplier * 100) / 100,
    appliedFactors,
  };
}

/**
 * Calculates complete dynamic pricing across an entire rental duration
 */
export function calculateDynamicRentalPricing(
  vehicle: Vehicle,
  pickupDate: string,
  returnDate: string
): DynamicPricingResult {
  const { rate: utilizationRate } = getCategoryUtilization(vehicle.category);

  if (!pickupDate || !returnDate || returnDate <= pickupDate) {
    // Fallback single day projection (today or current day)
    const todayStr = new Date().toISOString().slice(0, 10);
    const singleDay = calculateDayRate(vehicle, todayStr);
    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      baseRatePerDay: vehicle.pricePerDay,
      effectiveRatePerDay: singleDay.dynamicRate,
      totalDays: 1,
      totalBasePrice: vehicle.pricePerDay,
      totalFinalPrice: singleDay.dynamicRate,
      differenceAmount: singleDay.dynamicRate - vehicle.pricePerDay,
      isSurge: singleDay.dynamicRate > vehicle.pricePerDay,
      isDiscount: singleDay.dynamicRate < vehicle.pricePerDay,
      overallMultiplier: singleDay.multiplier,
      factors: buildFactorsSummary(singleDay.appliedFactors),
      dayDetails: [singleDay],
      utilizationRate,
      utilizationCategory: vehicle.category,
    };
  }

  // Generate date range
  const startDate = new Date(pickupDate + "T00:00:00");
  const endDate = new Date(returnDate + "T00:00:00");
  const dayDetails: DayPricingDetail[] = [];
  const allFactorsSet = new Set<string>();

  const cur = new Date(startDate);
  while (cur < endDate) {
    const curStr = cur.toISOString().slice(0, 10);
    const dayResult = calculateDayRate(vehicle, curStr);
    dayDetails.push(dayResult);
    dayResult.appliedFactors.forEach((f) => allFactorsSet.add(f));
    cur.setDate(cur.getDate() + 1);
  }

  const totalDays = Math.max(dayDetails.length, 1);
  const totalFinalPrice = dayDetails.reduce((sum, d) => sum + d.dynamicRate, 0);
  const totalBasePrice = vehicle.pricePerDay * totalDays;
  const effectiveRatePerDay = Math.round(totalFinalPrice / totalDays);
  const differenceAmount = totalFinalPrice - totalBasePrice;
  const overallMultiplier = Math.round((totalFinalPrice / totalBasePrice) * 100) / 100;

  return {
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    baseRatePerDay: vehicle.pricePerDay,
    effectiveRatePerDay,
    totalDays,
    totalBasePrice,
    totalFinalPrice,
    differenceAmount,
    isSurge: differenceAmount > 0,
    isDiscount: differenceAmount < 0,
    overallMultiplier,
    factors: buildFactorsSummary(Array.from(allFactorsSet)),
    dayDetails,
    utilizationRate,
    utilizationCategory: vehicle.category,
  };
}

/**
 * Returns today's active pricing snapshot for cards and listings
 */
export function getTodayVehiclePricing(vehicle: Vehicle): {
  basePrice: number;
  dynamicPrice: number;
  multiplier: number;
  badge?: { label: string; type: "surge" | "discount" } | undefined;
} {
  const todayStr = new Date().toISOString().slice(0, 10);
  const dayRate = calculateDayRate(vehicle, todayStr);
  let badge: { label: string; type: "surge" | "discount" } | undefined;

  if (dayRate.dynamicRate > dayRate.baseRate) {
    if (dayRate.festivalName) {
      badge = { label: `⚡ ${dayRate.festivalName.split(" ")[0]} Rush`, type: "surge" };
    } else if (dayRate.isWeekend) {
      badge = { label: "⚡ Weekend Surge", type: "surge" };
    } else {
      badge = { label: "⚡ High Demand", type: "surge" };
    }
  } else if (dayRate.dynamicRate < dayRate.baseRate) {
    badge = { label: "🏷️ Weekday Saver (-10%)", type: "discount" };
  }

  return {
    basePrice: dayRate.baseRate,
    dynamicPrice: dayRate.dynamicRate,
    multiplier: dayRate.multiplier,
    badge,
  };
}

function buildFactorsSummary(factorStrings: string[]): PricingFactor[] {
  return factorStrings.map((str) => {
    const isSurge = str.includes("+");
    const pctMatch = str.match(/([+-]?\d+)%/);
    const percentage = pctMatch && pctMatch[1] ? parseInt(pctMatch[1], 10) : isSurge ? 15 : -10;
    return {
      name: str.replace(/\s*\([+-]?\d+%\)/, ""),
      type: isSurge ? "surge" : "discount",
      percentage,
      description: str,
    };
  });
}
