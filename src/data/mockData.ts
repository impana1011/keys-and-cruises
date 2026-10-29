import type { Booking, Vehicle } from "@/types";

export const vehicles: Vehicle[] = [
  { id: "1", name: "Toyota Corolla", category: "Car", pricePerDay: 45, seats: 5, fuel: "Petrol", transmission: "Automatic", location: "Mumbai", available: true },
  { id: "2", name: "Honda City", category: "Car", pricePerDay: 40, seats: 5, fuel: "Petrol", transmission: "Manual", location: "Delhi", available: true },
  { id: "3", name: "Hyundai Creta", category: "SUV", pricePerDay: 65, seats: 5, fuel: "Diesel", transmission: "Automatic", location: "Bengaluru", available: true },
  { id: "4", name: "Mahindra XUV700", category: "SUV", pricePerDay: 80, seats: 7, fuel: "Diesel", transmission: "Automatic", location: "Pune", available: false },
  { id: "5", name: "Royal Enfield Classic 350", category: "Bike", pricePerDay: 20, seats: 2, fuel: "Petrol", transmission: "Manual", location: "Goa", available: true },
  { id: "6", name: "Honda Activa", category: "Bike", pricePerDay: 10, seats: 2, fuel: "Petrol", transmission: "Automatic", location: "Mumbai", available: true },
  { id: "7", name: "Bajaj Pulsar 150", category: "Bike", pricePerDay: 15, seats: 2, fuel: "Petrol", transmission: "Manual", location: "Delhi", available: true },
];

export const bookings: Booking[] = [
  { id: "B1001", vehicleId: "1", customer: "Demo User", pickupDate: "2026-11-02", returnDate: "2026-11-05", totalPrice: 135, status: "Confirmed" },
  { id: "B1002", vehicleId: "5", customer: "Demo User", pickupDate: "2026-10-10", returnDate: "2026-10-12", totalPrice: 40, status: "Completed" },
  { id: "B1003", vehicleId: "3", customer: "Asha K", pickupDate: "2026-11-10", returnDate: "2026-11-14", totalPrice: 260, status: "Pending" },
];
