import type { BranchHub, Category, IndianCity, OneWayTransitDetails } from "@/types";

export const INDIAN_CITIES: IndianCity[] = [
  "Bangalore",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Goa",
  "Jaipur",
  "Kochi",
  "Ahmedabad",
];

export const BRANCH_HUBS: BranchHub[] = [
  // Bangalore
  {
    id: "BLR-AIRPORT",
    name: "Kempegowda Int'l Airport (BLR) Hub",
    city: "Bangalore",
    type: "Airport",
    address: "Terminal 1 Arrivals, Car Rental Concourse, Devanahalli",
    contactNumber: "+91 80 6678 1101",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "BLR-INDIRANAGAR",
    name: "Indiranagar 100ft Road Hub",
    city: "Bangalore",
    type: "City Center",
    address: "#142, 100ft Road, HAL 2nd Stage, Indiranagar",
    contactNumber: "+91 80 2521 8890",
    operatingHours: "07:00 AM - 11:00 PM",
  },
  {
    id: "BLR-ELECTRONIC-CITY",
    name: "Electronic City Phase 1 Hub",
    city: "Bangalore",
    type: "Suburban Hub",
    address: "Velankani Drive, Opp Gate 2, Hosur Main Road",
    contactNumber: "+91 80 4110 3344",
    operatingHours: "08:00 AM - 10:00 PM",
  },
  {
    id: "BLR-SBC",
    name: "KSR Bangalore Central Railway Station Hub",
    city: "Bangalore",
    type: "Railway Station",
    address: "Majestic East Entry, Platform 1 Car Park, Gandhinagar",
    contactNumber: "+91 80 2287 4411",
    operatingHours: "06:00 AM - 11:30 PM",
  },

  // Mumbai
  {
    id: "BOM-AIRPORT",
    name: "Chhatrapati Shivaji Maharaj Int'l (BOM) T2 Hub",
    city: "Mumbai",
    type: "Airport",
    address: "Level P4 MLCP Car Park, Terminal 2, Sahar, Andheri East",
    contactNumber: "+91 22 6685 2200",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "BOM-ANDHERI",
    name: "Andheri West S.V. Road Hub",
    city: "Mumbai",
    type: "City Center",
    address: "Near Andheri Metro Station, SV Road, Andheri West",
    contactNumber: "+91 22 2620 4455",
    operatingHours: "07:00 AM - 11:00 PM",
  },
  {
    id: "BOM-NAVI",
    name: "Navi Mumbai Vashi Hub",
    city: "Mumbai",
    type: "Suburban Hub",
    address: "Sector 17, Palm Beach Road Junction, Vashi",
    contactNumber: "+91 22 2789 6633",
    operatingHours: "08:00 AM - 10:00 PM",
  },

  // Delhi NCR
  {
    id: "DEL-AIRPORT",
    name: "Indira Gandhi Int'l (DEL) T3 Hub",
    city: "Delhi NCR",
    type: "Airport",
    address: "Terminal 3 Multi-Level Parking Level 1, New Delhi",
    contactNumber: "+91 11 4963 8800",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "DEL-CP",
    name: "Connaught Place Central Hub",
    city: "Delhi NCR",
    type: "City Center",
    address: "Block B, Inner Circle, Connaught Place, New Delhi",
    contactNumber: "+91 11 2341 5566",
    operatingHours: "07:00 AM - 11:00 PM",
  },
  {
    id: "DEL-GURGAON",
    name: "Cyber City Gurgaon DLF Hub",
    city: "Delhi NCR",
    type: "Suburban Hub",
    address: "Building 10 Tower B, DLF CyberHub, Phase 2, Gurugram",
    contactNumber: "+91 124 405 1199",
    operatingHours: "08:00 AM - 10:30 PM",
  },

  // Hyderabad
  {
    id: "HYD-AIRPORT",
    name: "Rajiv Gandhi Int'l (HYD) Shamshabad Hub",
    city: "Hyderabad",
    type: "Airport",
    address: "Car Park Level C, Commercial Fleet Bay, Shamshabad",
    contactNumber: "+91 40 6654 6677",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "HYD-HITECH",
    name: "Hitech City Madhapur Hub",
    city: "Hyderabad",
    type: "City Center",
    address: "Inorbit Mall Road, Cyberabad, Madhapur",
    contactNumber: "+91 40 4012 3322",
    operatingHours: "08:00 AM - 10:30 PM",
  },

  // Chennai
  {
    id: "MAA-AIRPORT",
    name: "Chennai Int'l Airport (MAA) Hub",
    city: "Chennai",
    type: "Airport",
    address: "Aerohub MLCP Floor 2, GST Road, Meenambakkam",
    contactNumber: "+91 44 2256 7788",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "MAA-TNAGAR",
    name: "T. Nagar Panagal Park Hub",
    city: "Chennai",
    type: "City Center",
    address: "#48 South Usman Road, T. Nagar, Chennai",
    contactNumber: "+91 44 2434 1122",
    operatingHours: "08:00 AM - 10:00 PM",
  },

  // Pune
  {
    id: "PNQ-AIRPORT",
    name: "Pune Int'l Airport (PNQ) AeroMall Hub",
    city: "Pune",
    type: "Airport",
    address: "AeroMall 1st Floor, New Airport Road, Lohegaon",
    contactNumber: "+91 20 2668 5544",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "PNQ-KOREGAON",
    name: "Koregaon Park Central Hub",
    city: "Pune",
    type: "City Center",
    address: "North Main Road, Near Lane 7, Koregaon Park",
    contactNumber: "+91 20 6602 1100",
    operatingHours: "08:00 AM - 10:30 PM",
  },

  // Goa
  {
    id: "GOX-MOPA",
    name: "Manohar Int'l Airport Mopa (GOX) Hub",
    city: "Goa",
    type: "Airport",
    address: "Arrivals Fleet Zone, Mopa, Pernem, North Goa",
    contactNumber: "+91 832 249 9901",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "GOI-DABOLIM",
    name: "Dabolim Airport (GOI) Hub",
    city: "Goa",
    type: "Airport",
    address: "Terminal Parking Bay A-12, Vasco da Gama, South Goa",
    contactNumber: "+91 832 254 3311",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "GOA-PANAJI",
    name: "Panaji Central Promenade Hub",
    city: "Goa",
    type: "City Center",
    address: "Dayanand Bandodkar Marg, Miramar, Panaji",
    contactNumber: "+91 832 222 5566",
    operatingHours: "08:00 AM - 10:00 PM",
  },

  // Jaipur
  {
    id: "JAI-AIRPORT",
    name: "Jaipur Int'l Airport (JAI) Hub",
    city: "Jaipur",
    type: "Airport",
    address: "Terminal 2 Pickup Bay 3, Sanganer, Jaipur",
    contactNumber: "+91 141 272 6600",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "JAI-MI-ROAD",
    name: "MI Road Heritage Hub",
    city: "Jaipur",
    type: "City Center",
    address: "Mirza Ismail Road, Near Panch Batti, Jaipur",
    contactNumber: "+91 141 236 4411",
    operatingHours: "08:00 AM - 10:00 PM",
  },

  // Kochi
  {
    id: "COK-AIRPORT",
    name: "Cochin Int'l Airport (COK) Hub",
    city: "Kochi",
    type: "Airport",
    address: "Canopy Arrival Commercial Parking, Nedumbassery",
    contactNumber: "+91 484 261 1122",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "COK-MG-ROAD",
    name: "Ernakulam MG Road Hub",
    city: "Kochi",
    type: "City Center",
    address: "Ravipuram Junction, MG Road, Ernakulam, Kochi",
    contactNumber: "+91 484 235 6677",
    operatingHours: "08:00 AM - 10:00 PM",
  },

  // Ahmedabad
  {
    id: "AMD-AIRPORT",
    name: "Sardar Vallabhbhai Patel (AMD) Hub",
    city: "Ahmedabad",
    type: "Airport",
    address: "Terminal 2 International Parking Area, Hansol",
    contactNumber: "+91 79 2286 9911",
    operatingHours: "24/7 Round the Clock",
  },
  {
    id: "AMD-SG-HIGHWAY",
    name: "SG Highway Prahlad Nagar Hub",
    city: "Ahmedabad",
    type: "City Center",
    address: "Corporate Road, Opposite Prahlad Nagar Garden",
    contactNumber: "+91 79 4005 2233",
    operatingHours: "08:00 AM - 10:00 PM",
  },
];

/**
 * Real National Highway distance matrix between major Indian cities (KM)
 */
const CITY_DISTANCE_MATRIX_KM: Record<string, number> = {
  // Mumbai corridor
  "Mumbai-Pune": 150,
  "Pune-Mumbai": 150,
  "Mumbai-Goa": 590,
  "Goa-Mumbai": 590,
  "Mumbai-Ahmedabad": 530,
  "Ahmedabad-Mumbai": 530,

  // Delhi corridor
  "Delhi NCR-Jaipur": 280,
  "Jaipur-Delhi NCR": 280,
  "Delhi NCR-Ahmedabad": 940,
  "Ahmedabad-Delhi NCR": 940,

  // Bangalore & South corridor
  "Bangalore-Chennai": 345,
  "Chennai-Bangalore": 345,
  "Bangalore-Hyderabad": 570,
  "Hyderabad-Bangalore": 570,
  "Bangalore-Goa": 560,
  "Goa-Bangalore": 560,
  "Bangalore-Kochi": 540,
  "Kochi-Bangalore": 540,
  "Bangalore-Pune": 840,
  "Pune-Bangalore": 840,
  "Chennai-Hyderabad": 630,
  "Hyderabad-Chennai": 630,
  "Chennai-Kochi": 690,
  "Kochi-Chennai": 690,
  "Pune-Goa": 440,
  "Goa-Pune": 440,
  "Hyderabad-Pune": 560,
  "Pune-Hyderabad": 560,
};

export function getBranchById(id: string): BranchHub {
  const found = BRANCH_HUBS.find((b) => b.id === id);
  if (found) return found;
  return BRANCH_HUBS[0]!;
}

export function getBranchesByCity(city: IndianCity): BranchHub[] {
  return BRANCH_HUBS.filter((b) => b.city === city);
}

/**
 * Calculates highway transit distance between any two branches.
 */
export function getRouteDistanceKm(pickupBranchId: string, dropBranchId: string): number {
  if (pickupBranchId === dropBranchId) return 0;

  const pickup = getBranchById(pickupBranchId);
  const drop = getBranchById(dropBranchId);

  if (pickup.city === drop.city) {
    // Intra-city branch transfer (e.g. Airport to City Center or Railway Station)
    return 35; // standard 35 km city traverse
  }

  const key = `${pickup.city}-${drop.city}`;
  if (CITY_DISTANCE_MATRIX_KM[key]) {
    return CITY_DISTANCE_MATRIX_KM[key]!;
  }

  // Cross-country default estimation
  return 750;
}

/**
 * Calculates complete one-way transit fee, tolls, duration, and logistics charges.
 */
export function calculateOneWayTransitFee(
  category: Category,
  pickupBranchId: string,
  dropBranchId: string
): OneWayTransitDetails {
  const pickupBranch = getBranchById(pickupBranchId);
  const dropBranch = getBranchById(dropBranchId);
  const isInterCity = pickupBranch.city !== dropBranch.city;
  const isInterBranch = pickupBranchId !== dropBranchId;
  const distanceKm = getRouteDistanceKm(pickupBranchId, dropBranchId);

  if (!isInterBranch) {
    return {
      isInterCity: false,
      isInterBranch: false,
      pickupBranch,
      dropBranch,
      distanceKm: 0,
      estimatedTransitHours: 0,
      baseTransitCharge: 0,
      tollAllowance: 0,
      totalTransitFee: 0,
    };
  }

  // Intra-city branch transfer fee (e.g. Airport pick, City drop)
  if (!isInterCity) {
    const isAirportTransfer = pickupBranch.type === "Airport" || dropBranch.type === "Airport";
    const totalTransitFee = isAirportTransfer ? 350 : 250;
    return {
      isInterCity: false,
      isInterBranch: true,
      pickupBranch,
      dropBranch,
      distanceKm,
      estimatedTransitHours: 1,
      baseTransitCharge: totalTransitFee,
      tollAllowance: 0,
      totalTransitFee,
    };
  }

  // Inter-city distance calculation
  // Vehicle type rate per KM
  let perKmRate = 6.5;
  if (category === "Bike") perKmRate = 3.5;
  else if (category === "SUV") perKmRate = 8.5;
  else if (category === "Tempo Traveller" || category === "Mini Bus" || category === "Travels") perKmRate = 12.0;

  // Base raw transit
  const rawBaseTransit = distanceKm * perKmRate * 0.45; // partial return logistics index
  // National highway FASTag toll allowance based on distance
  let tollAllowance = 350;
  if (distanceKm > 500) tollAllowance = 750;
  if (distanceKm > 800) tollAllowance = 1100;

  // Round to clean ₹50
  const baseTransitCharge = Math.round(rawBaseTransit / 50) * 50;
  const totalTransitFee = baseTransitCharge + tollAllowance;
  const estimatedTransitHours = Math.max(2, Math.round(distanceKm / 55));

  return {
    isInterCity: true,
    isInterBranch: true,
    pickupBranch,
    dropBranch,
    distanceKm,
    estimatedTransitHours,
    baseTransitCharge,
    tollAllowance,
    totalTransitFee,
  };
}

/**
 * Backward compatibility helper for legacy city string lookups
 */
export function calculateIntercitySurcharge(pickupCity: IndianCity, dropCity: IndianCity): number {
  if (pickupCity === dropCity) return 0;
  const pBranch = getBranchesByCity(pickupCity)[0]!.id;
  const dBranch = getBranchesByCity(dropCity)[0]!.id;
  return calculateOneWayTransitFee("Car", pBranch, dBranch).totalTransitFee;
}
