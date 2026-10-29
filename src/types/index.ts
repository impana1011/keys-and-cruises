export type Category = "Car" | "Bike" | "SUV";

export interface Vehicle {
  id: string;
  name: string;
  category: Category;
  pricePerDay: number;
  seats: number;
  fuel: string;
  transmission: string;
  location: string;
  available: boolean;
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface Booking {
  id: string;
  vehicleId: string;
  customer: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: BookingStatus;
}
