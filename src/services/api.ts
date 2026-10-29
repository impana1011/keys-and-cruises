// Centralized API service. Currently backed by in-memory mock data.
// To connect Spring Boot later, replace each function body with fetch(`${API_BASE_URL}/...`).
import { bookings as seedBookings, vehicles as seedVehicles } from "@/data/mockData";
import type { Booking, Vehicle } from "@/types";

export const API_BASE_URL = "http://localhost:8080/api"; // future Spring Boot URL (not called)

let vehicles: Vehicle[] = [...seedVehicles];
let bookings: Booking[] = [...seedBookings];

export const vehicleService = {
  getAll: (): Vehicle[] => vehicles,
  getById: (id: string): Vehicle | undefined => vehicles.find((v) => v.id === id),
  save: (v: Vehicle): void => {
    vehicles = vehicles.some((x) => x.id === v.id) ? vehicles.map((x) => (x.id === v.id ? v : x)) : [...vehicles, v];
  },
  remove: (id: string): void => {
    vehicles = vehicles.filter((v) => v.id !== id);
  },
};

export const bookingService = {
  getAll: (): Booking[] => bookings,
  getById: (id: string): Booking | undefined => bookings.find((b) => b.id === id),
  create: (b: Omit<Booking, "id" | "status">): Booking => {
    const booking: Booking = { ...b, id: "B" + (1000 + bookings.length + 1), status: "Confirmed" };
    bookings = [...bookings, booking];
    return booking;
  },
  setStatus: (id: string, status: Booking["status"]): void => {
    bookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  },
};

export const authService = {
  login: (email: string) => ({ ok: true, message: `Simulated login for ${email}. No real authentication.` }),
  register: (name: string) => ({ ok: true, message: `Simulated registration for ${name}. No account was created.` }),
};

export function rentalDays(pickup: string, ret: string): number {
  const d = (new Date(ret).getTime() - new Date(pickup).getTime()) / 86400000;
  return Math.round(d);
}

export function validateDates(pickup: string, ret: string): string | null {
  if (!pickup || !ret) return "Please select pickup and return dates.";
  const today = new Date().toISOString().slice(0, 10);
  if (pickup < today) return "Pickup date cannot be in the past.";
  if (ret <= pickup) return "Return date must be after pickup date.";
  return null;
}
