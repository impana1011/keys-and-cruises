import type { Category, DriverDetails } from "@/types";

export const CHAUFFEURS_POOL: DriverDetails[] = [
  {
    id: "DRV-101",
    name: "Ramesh Sharma",
    phone: "+91 98450 12345",
    badgeNumber: "KA-COMM-8921",
    experienceYears: 12,
    rating: 4.9,
    tripsCount: 230,
    languages: ["Hindi", "English", "Kannada"],
  },
  {
    id: "DRV-102",
    name: "Suresh Patil",
    phone: "+91 97230 45678",
    badgeNumber: "MH-COMM-4412",
    experienceYears: 9,
    rating: 4.8,
    tripsCount: 185,
    languages: ["Marathi", "Hindi", "English"],
  },
  {
    id: "DRV-103",
    name: "Gurpreet Singh",
    phone: "+91 98110 99887",
    badgeNumber: "DL-COMM-7733",
    experienceYears: 15,
    rating: 4.95,
    tripsCount: 410,
    languages: ["Punjabi", "Hindi", "English"],
  },
  {
    id: "DRV-104",
    name: "K. Murugan",
    phone: "+91 94440 22334",
    badgeNumber: "TN-COMM-6621",
    experienceYears: 11,
    rating: 4.85,
    tripsCount: 195,
    languages: ["Tamil", "English", "Telugu"],
  },
];

export function getDailyDriverRate(category: Category): number {
  if (category === "Mini Bus" || category === "Tempo Traveller" || category === "Travels") {
    return 1200; // ₹1,200/day for commercial heavy passenger vehicles
  }
  return 800; // ₹800/day for Cars & SUVs (Bikes do not support driver)
}

export function canHaveDriver(category: Category): boolean {
  return category !== "Bike";
}

export function assignChauffeur(indexSeed = 0): DriverDetails {
  return CHAUFFEURS_POOL[indexSeed % CHAUFFEURS_POOL.length]!;
}
