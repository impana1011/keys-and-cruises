import type { MaintenanceRecord, ServiceWindow, Vehicle, VehicleHealth } from "@/types";
import { vehicleService } from "./api";

const TODAY_DATE = "2026-10-31";

// In-memory maintenance log records
let maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "M-101",
    vehicleId: "16",
    vehicleName: "Mahindra Thar 4x4",
    serviceType: "Oil Change",
    startDate: "2026-10-29",
    endDate: "2026-11-03",
    odometerReadingKm: 15400,
    costInRupees: 4200,
    garageName: "Mahindra Authorized Service Center, Pune",
    status: "In Progress",
    notes: "5,000 km periodic engine oil change, oil filter & differential check.",
  },
  {
    id: "M-102",
    vehicleId: "25",
    vehicleName: "Force Maharaja TT (1x1 Luxury Recliner)",
    serviceType: "Brake & Tire Check",
    startDate: "2026-10-30",
    endDate: "2026-11-02",
    odometerReadingKm: 28500,
    costInRupees: 8500,
    garageName: "Force Motors Commercial Hub, Mumbai",
    status: "In Progress",
    notes: "Front brake pad replacement, wheel alignment & AC gas top-up before holiday season.",
  },
  {
    id: "M-098",
    vehicleId: "1",
    vehicleName: "Maruti Suzuki Swift",
    serviceType: "Oil Change",
    startDate: "2026-09-15",
    endDate: "2026-09-16",
    odometerReadingKm: 22000,
    costInRupees: 2800,
    garageName: "Maruti Suzuki Arena Workshop",
    status: "Completed",
    notes: "Synthetic engine oil replacement & 40-point vehicle checkup.",
  },
  {
    id: "M-099",
    vehicleId: "13",
    vehicleName: "Hyundai Creta",
    serviceType: "PUC Test",
    startDate: "2026-10-05",
    endDate: "2026-10-05",
    odometerReadingKm: 18200,
    costInRupees: 250,
    garageName: "Govt Authorized RTO Emission Test Center",
    status: "Completed",
    notes: "Passed BS-VI diesel emission test with zero faults.",
  },
];

/**
 * Generates or initializes realistic vehicle health profiles
 */
export function getDefaultVehicleHealth(vehicle: Vehicle): VehicleHealth {
  // Check if vehicle is already flagged with an active service
  if (vehicle.id === "16") {
    // Mahindra Thar 4x4 - currently in workshop
    return {
      mileageKm: 15400,
      lastServiceKm: 10400,
      oilChangeIntervalKm: 5000,
      lastServiceDate: "2026-05-10",
      nextServiceDueDate: "2026-11-03",
      pucExpiryDate: "2027-04-15",
      insuranceExpiryDate: "2027-08-30",
      maintenanceStatus: "Under Maintenance",
      currentServiceWindow: {
        serviceType: "5,000 km Oil Change & Engine Flush",
        startDate: "2026-10-29",
        expectedEndDate: "2026-11-03",
        garageName: "Mahindra Authorized Service Hub",
        notes: "Scheduled workshop maintenance; vehicle blocked from booking.",
      },
    };
  }

  if (vehicle.id === "25") {
    // Force Maharaja TT - currently in service window
    return {
      mileageKm: 28500,
      lastServiceKm: 23500,
      oilChangeIntervalKm: 5000,
      lastServiceDate: "2026-06-20",
      nextServiceDueDate: "2026-11-02",
      pucExpiryDate: "2027-03-10",
      insuranceExpiryDate: "2027-06-15",
      maintenanceStatus: "Under Maintenance",
      currentServiceWindow: {
        serviceType: "Brake Pad & Pre-Festive Commercial Overhaul",
        startDate: "2026-10-30",
        expectedEndDate: "2026-11-02",
        garageName: "Force Commercial Motors Hub",
        notes: "Group tourer safety inspection.",
      },
    };
  }

  if (vehicle.id === "2") {
    // WagonR - Service Due (mileage is 5,100 km since last oil change)
    return {
      mileageKm: 35100,
      lastServiceKm: 30000,
      oilChangeIntervalKm: 5000,
      lastServiceDate: "2026-04-12",
      nextServiceDueDate: "2026-11-05",
      pucExpiryDate: "2026-11-10", // PUC expires in 10 days!
      insuranceExpiryDate: "2027-02-28",
      maintenanceStatus: "Service Due",
    };
  }

  // Standard healthy vehicle profile
  const baseMileage = 12000 + (parseInt(vehicle.id, 10) * 1150);
  const lastKm = baseMileage - 1800; // 1,800 km since last service (well below 5,000 km)

  return {
    mileageKm: baseMileage,
    lastServiceKm: lastKm,
    oilChangeIntervalKm: 5000,
    lastServiceDate: "2026-08-15",
    nextServiceDueDate: "2027-02-15",
    pucExpiryDate: "2027-05-20",
    insuranceExpiryDate: "2027-09-10",
    maintenanceStatus: "Healthy",
  };
}

/**
 * Evaluates vehicle health based on odometer km, oil interval, PUC and insurance dates
 */
export function evaluateVehicleHealth(vehicle: Vehicle): VehicleHealth {
  const health = vehicle.health ?? getDefaultVehicleHealth(vehicle);
  const kmSinceLastService = health.mileageKm - health.lastServiceKm;
  const oilOverdue = kmSinceLastService >= health.oilChangeIntervalKm;
  const pucExpired = health.pucExpiryDate < TODAY_DATE;
  const insuranceExpired = health.insuranceExpiryDate < TODAY_DATE;

  // Active service window check
  const hasActiveService = Boolean(
    health.currentServiceWindow &&
    health.currentServiceWindow.startDate <= TODAY_DATE &&
    health.currentServiceWindow.expectedEndDate >= TODAY_DATE
  );

  let status: VehicleHealth["maintenanceStatus"] = "Healthy";

  if (hasActiveService || pucExpired || insuranceExpired) {
    status = "Under Maintenance";
  } else if (oilOverdue || kmSinceLastService >= health.oilChangeIntervalKm - 400 || isDateSoon(health.pucExpiryDate, 15) || isDateSoon(health.insuranceExpiryDate, 15)) {
    status = "Service Due";
  }

  return {
    ...health,
    maintenanceStatus: status,
  };
}

function isDateSoon(targetDateStr: string, daysThreshold: number): boolean {
  const target = new Date(targetDateStr).getTime();
  const today = new Date(TODAY_DATE).getTime();
  const diffDays = (target - today) / 86400000;
  return diffDays >= 0 && diffDays <= daysThreshold;
}

export const maintenanceService = {
  /**
   * Initializes health tracking on all fleet vehicles
   */
  initFleetHealth(): void {
    const list = vehicleService.getAll();
    list.forEach((v) => {
      if (!v.health) {
        const h = getDefaultVehicleHealth(v);
        const isUnderMaint = h.maintenanceStatus === "Under Maintenance";
        vehicleService.save({
          ...v,
          available: isUnderMaint ? false : v.available,
          health: h,
        });
      }
    });
  },

  /**
   * Checks whether a vehicle can be booked for specified dates
   */
  canBookVehicle(
    vehicleId: string,
    pickupDate?: string,
    returnDate?: string
  ): { canBook: boolean; reason?: string | undefined; serviceWindow?: ServiceWindow | undefined } {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle) return { canBook: false, reason: "Vehicle not found." };

    const health = vehicle.health ?? evaluateVehicleHealth(vehicle);

    // 1. If currently under maintenance
    if (health.maintenanceStatus === "Under Maintenance") {
      const window = health.currentServiceWindow;
      const windowMsg = window
        ? `under scheduled maintenance (${window.serviceType}) until ${window.expectedEndDate}`
        : "currently under maintenance and safety inspection";
      return {
        canBook: false,
        reason: `This vehicle is ${windowMsg}. Bookings are temporarily blocked.`,
        serviceWindow: window,
      };
    }

    // 2. If rental dates overlap with a scheduled future service window
    if (pickupDate && returnDate && health.currentServiceWindow) {
      const sw = health.currentServiceWindow;
      const overlaps = pickupDate <= sw.expectedEndDate && returnDate >= sw.startDate;
      if (overlaps) {
        return {
          canBook: false,
          reason: `Requested dates overlap with scheduled maintenance (${sw.serviceType}: ${sw.startDate} to ${sw.expectedEndDate}).`,
          serviceWindow: sw,
        };
      }
    }

    // 3. If PUC or Insurance expired
    if (health.pucExpiryDate < TODAY_DATE) {
      return {
        canBook: false,
        reason: "Vehicle PUC certificate is expired. Mandatory emission test required before rental.",
      };
    }
    if (health.insuranceExpiryDate < TODAY_DATE) {
      return {
        canBook: false,
        reason: "Vehicle insurance renewal pending. Blocked for customer safety & legal compliance.",
      };
    }

    // 4. If vehicle available flag is false
    if (!vehicle.available) {
      return {
        canBook: false,
        reason: "Vehicle is currently unavailable.",
      };
    }

    return { canBook: true };
  },

  /**
   * Schedule vehicle for maintenance and automatically set available = false
   */
  scheduleService(
    vehicleId: string,
    service: {
      serviceType: string;
      startDate: string;
      expectedEndDate: string;
      garageName: string;
      notes?: string;
    }
  ): void {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle) return;

    const health = vehicle.health ?? getDefaultVehicleHealth(vehicle);
    const serviceWindow: ServiceWindow = {
      serviceType: service.serviceType,
      startDate: service.startDate,
      expectedEndDate: service.expectedEndDate,
      garageName: service.garageName,
      notes: service.notes,
    };

    const updatedHealth: VehicleHealth = {
      ...health,
      maintenanceStatus: "Under Maintenance",
      currentServiceWindow: serviceWindow,
    };

    // Auto-block vehicle from booking
    vehicleService.save({
      ...vehicle,
      available: false,
      health: updatedHealth,
    });

    // Add record to log
    const log: MaintenanceRecord = {
      id: "M-" + Math.floor(100 + Math.random() * 900),
      vehicleId,
      vehicleName: vehicle.name,
      serviceType: service.serviceType.includes("Oil")
        ? "Oil Change"
        : service.serviceType.includes("PUC")
        ? "PUC Test"
        : service.serviceType.includes("Insurance")
        ? "Insurance Renewal"
        : "Periodic Service",
      startDate: service.startDate,
      endDate: service.expectedEndDate,
      odometerReadingKm: health.mileageKm,
      costInRupees: 0,
      garageName: service.garageName,
      status: "In Progress",
      notes: service.notes,
    };

    maintenanceRecords = [log, ...maintenanceRecords];
  },

  /**
   * Complete service, advance odometer service tracking, update validity and restore vehicle to available
   */
  completeService(
    vehicleId: string,
    completion: {
      costInRupees: number;
      garageName?: string;
      notes?: string;
      renewPuc?: boolean;
      renewInsurance?: boolean;
    }
  ): void {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle || !vehicle.health) return;

    const currentHealth = vehicle.health;
    const today = new Date(TODAY_DATE);

    // Calculate extended dates
    const nextServiceDate = new Date(today);
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 6);

    let newPucDate = currentHealth.pucExpiryDate;
    if (completion.renewPuc || currentHealth.pucExpiryDate <= TODAY_DATE) {
      const p = new Date(today);
      p.setMonth(p.getMonth() + 6);
      newPucDate = p.toISOString().slice(0, 10);
    }

    let newInsuranceDate = currentHealth.insuranceExpiryDate;
    if (completion.renewInsurance || currentHealth.insuranceExpiryDate <= TODAY_DATE) {
      const ins = new Date(today);
      ins.setFullYear(ins.getFullYear() + 1);
      newInsuranceDate = ins.toISOString().slice(0, 10);
    }

    const updatedHealth: VehicleHealth = {
      ...currentHealth,
      lastServiceKm: currentHealth.mileageKm, // reset oil change km interval
      lastServiceDate: TODAY_DATE,
      nextServiceDueDate: nextServiceDate.toISOString().slice(0, 10),
      pucExpiryDate: newPucDate,
      insuranceExpiryDate: newInsuranceDate,
      maintenanceStatus: "Healthy",
      currentServiceWindow: undefined,
    };

    // Auto-restore vehicle availability
    vehicleService.save({
      ...vehicle,
      available: true,
      health: updatedHealth,
    });

    // Mark log record as completed
    maintenanceRecords = maintenanceRecords.map((r) => {
      if (r.vehicleId === vehicleId && r.status === "In Progress") {
        return {
          ...r,
          status: "Completed",
          costInRupees: completion.costInRupees || 2500,
          endDate: TODAY_DATE,
          notes: completion.notes || r.notes || "Service completed and quality-inspected.",
        };
      }
      return r;
    });
  },

  /**
   * Update vehicle odometer reading and automatically re-evaluate service triggers
   */
  updateOdometer(vehicleId: string, newKm: number): VehicleHealth | undefined {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle || !vehicle.health) return undefined;

    const health: VehicleHealth = {
      ...vehicle.health,
      mileageKm: newKm,
    };

    const reEvaluated = evaluateVehicleHealth({ ...vehicle, health });

    vehicleService.save({
      ...vehicle,
      available: reEvaluated.maintenanceStatus === "Under Maintenance" ? false : vehicle.available,
      health: reEvaluated,
    });

    return reEvaluated;
  },

  /**
   * Fast renewal for PUC Test certificate (extends by 6 months)
   */
  renewPuc(vehicleId: string): void {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle || !vehicle.health) return;

    const p = new Date(TODAY_DATE);
    p.setMonth(p.getMonth() + 6);
    const newPuc = p.toISOString().slice(0, 10);

    const updatedHealth: VehicleHealth = {
      ...vehicle.health,
      pucExpiryDate: newPuc,
    };

    const reEvaluated = evaluateVehicleHealth({ ...vehicle, health: updatedHealth });
    vehicleService.save({ ...vehicle, health: reEvaluated });

    maintenanceRecords = [
      {
        id: "M-" + Math.floor(100 + Math.random() * 900),
        vehicleId,
        vehicleName: vehicle.name,
        serviceType: "PUC Test",
        startDate: TODAY_DATE,
        endDate: TODAY_DATE,
        odometerReadingKm: vehicle.health.mileageKm,
        costInRupees: 250,
        garageName: "Govt Authorized Emission Center",
        status: "Completed",
        notes: "PUC certificate renewed. Valid for 6 months.",
      },
      ...maintenanceRecords,
    ];
  },

  /**
   * Fast renewal for Insurance (extends by 1 year)
   */
  renewInsurance(vehicleId: string): void {
    const vehicle = vehicleService.getById(vehicleId);
    if (!vehicle || !vehicle.health) return;

    const ins = new Date(TODAY_DATE);
    ins.setFullYear(ins.getFullYear() + 1);
    const newInsurance = ins.toISOString().slice(0, 10);

    const updatedHealth: VehicleHealth = {
      ...vehicle.health,
      insuranceExpiryDate: newInsurance,
    };

    const reEvaluated = evaluateVehicleHealth({ ...vehicle, health: updatedHealth });
    vehicleService.save({ ...vehicle, health: reEvaluated });

    maintenanceRecords = [
      {
        id: "M-" + Math.floor(100 + Math.random() * 900),
        vehicleId,
        vehicleName: vehicle.name,
        serviceType: "Insurance Renewal",
        startDate: TODAY_DATE,
        endDate: TODAY_DATE,
        odometerReadingKm: vehicle.health.mileageKm,
        costInRupees: 6500,
        garageName: "ICICI Lombard / HDFC ERGO General Insurance",
        status: "Completed",
        notes: "Comprehensive bumper-to-bumper commercial insurance renewed.",
      },
      ...maintenanceRecords,
    ];
  },

  /**
   * Get all maintenance records
   */
  getAllRecords(): MaintenanceRecord[] {
    return maintenanceRecords;
  },

  /**
   * Get fleet health metrics
   */
  getFleetHealthSummary() {
    const all = vehicleService.getAll();
    const withHealth = all.map((v) => v.health ?? evaluateVehicleHealth(v));

    const total = withHealth.length;
    const underMaintenance = withHealth.filter((h) => h.maintenanceStatus === "Under Maintenance").length;
    const serviceDue = withHealth.filter((h) => h.maintenanceStatus === "Service Due").length;
    const healthy = withHealth.filter((h) => h.maintenanceStatus === "Healthy").length;

    return {
      total,
      underMaintenance,
      serviceDue,
      healthy,
      fleetHealthScore: total > 0 ? Math.round((healthy / total) * 100) : 100,
    };
  },
};

// Initialize fleet health on startup
maintenanceService.initFleetHealth();
