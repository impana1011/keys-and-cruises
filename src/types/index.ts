export type Category = "Car" | "Bike" | "SUV" | "Tempo Traveller" | "Mini Bus" | "Travels";

export type MaintenanceStatus = "Healthy" | "Service Due" | "Under Maintenance";

export interface ServiceWindow {
  serviceType: string;
  startDate: string;
  expectedEndDate: string;
  garageName: string;
  notes?: string | undefined;
}

export interface VehicleHealth {
  mileageKm: number;
  lastServiceKm: number;
  oilChangeIntervalKm: number; // e.g. 5000 km
  lastServiceDate: string; // YYYY-MM-DD
  nextServiceDueDate: string; // YYYY-MM-DD
  pucExpiryDate: string; // YYYY-MM-DD
  insuranceExpiryDate: string; // YYYY-MM-DD
  maintenanceStatus: MaintenanceStatus;
  currentServiceWindow?: ServiceWindow | undefined;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  serviceType: "Oil Change" | "PUC Test" | "Insurance Renewal" | "Periodic Service" | "Brake & Tire Check" | "Emergency Repair";
  startDate: string;
  endDate: string;
  odometerReadingKm: number;
  costInRupees: number;
  garageName: string;
  status: "In Progress" | "Completed";
  notes?: string | undefined;
}

export interface Vehicle {
  id: string;
  name: string;
  category: Category;
  pricePerDay: number;
  seats: number;
  fuel: string;
  transmission: string;
  available: boolean;
  imageUrl?: string | undefined;
  health?: VehicleHealth | undefined;
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

// --- 1. Customer Reviews & Ratings ---
export interface Review {
  id: string;
  vehicleId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  tripType: string; // e.g. "Family Trip", "Business", "Solo Outing", "Group Tour"
}

// --- 2. Driver / Chauffeur Add-on ---
export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  badgeNumber: string;
  experienceYears: number;
  rating: number;
  tripsCount: number;
  languages: string[];
}

// --- 3. Multi-City & Multi-Branch Hubs ---
export type IndianCity =
  | "Bangalore"
  | "Mumbai"
  | "Delhi NCR"
  | "Hyderabad"
  | "Chennai"
  | "Pune"
  | "Goa"
  | "Jaipur"
  | "Kochi"
  | "Ahmedabad";

export interface BranchHub {
  id: string;
  name: string;
  city: IndianCity;
  type: "Airport" | "City Center" | "Railway Station" | "Suburban Hub";
  address: string;
  contactNumber: string;
  operatingHours: string;
}

export interface OneWayTransitDetails {
  isInterCity: boolean;
  isInterBranch: boolean;
  pickupBranch: BranchHub;
  dropBranch: BranchHub;
  distanceKm: number;
  estimatedTransitHours: number;
  baseTransitCharge: number;
  tollAllowance: number;
  totalTransitFee: number;
}

// --- 4. Fuel Management Tracker ---
export type FuelLevel = "100% (Full Tank)" | "75% (3/4 Tank)" | "50% (Half Tank)" | "25% (1/4 Tank)" | "Reserve / Empty";

export interface FuelLog {
  dispatchLevel: FuelLevel;
  returnLevel?: FuelLevel | undefined;
  deficitCharges?: number | undefined;
  notes?: string | undefined;
}

// --- 5. Loyalty & Rewards ---
export type LoyaltyTier = "Silver" | "Gold" | "Platinum";

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: LoyaltyTier;
  lifetimeEarned: number;
}

export interface LoyaltyTransaction {
  id: string;
  date: string;
  points: number;
  type: "Earned" | "Redeemed";
  description: string;
  bookingId?: string | undefined;
}

// --- Enhanced Booking Interface ---
export interface Booking {
  id: string;
  vehicleId: string;
  customer: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;

  // Multi-city & Multi-Branch
  pickupCity?: IndianCity | undefined;
  dropCity?: IndianCity | undefined;
  pickupBranchId?: string | undefined;
  dropBranchId?: string | undefined;
  pickupBranchName?: string | undefined;
  dropBranchName?: string | undefined;
  transitDistanceKm?: number | undefined;
  intercityFee?: number | undefined;
  oneWayTransitFee?: number | undefined;

  // Driver Addon
  withDriver?: boolean | undefined;
  driverFee?: number | undefined;
  driverDetails?: DriverDetails | undefined;

  // Loyalty Rewards
  loyaltyPointsRedeemed?: number | undefined;
  loyaltyDiscountAmount?: number | undefined;
  loyaltyPointsEarned?: number | undefined;

  // Fuel Management
  fuelLog?: FuelLog | undefined;

  // Invoice / Payment info
  baseRentalPrice?: number | undefined;
  gstAmount?: number | undefined;
  invoiceNumber?: string | undefined;
  createdDate?: string | undefined;
}
