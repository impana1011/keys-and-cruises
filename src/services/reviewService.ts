import type { Review } from "@/types";

let reviews: Review[] = [
  {
    id: "REV-101",
    vehicleId: "1", // Maruti Suzuki Swift
    customerName: "Rahul Sharma",
    rating: 5,
    comment: "Extremely smooth drive! AC was chilling, clean interior, and fuel economy was great for our Mysore road trip.",
    date: "2026-10-18",
    tripType: "Weekend Getaway",
  },
  {
    id: "REV-102",
    vehicleId: "1", // Maruti Suzuki Swift
    customerName: "Pooja V.",
    rating: 4,
    comment: "Good city car, very easy to park in Bangalore traffic. Pickup process was prompt at Indiranagar hub.",
    date: "2026-09-28",
    tripType: "City Commute",
  },
  {
    id: "REV-103",
    vehicleId: "13", // Hyundai Creta
    customerName: "Amitabh Sen",
    rating: 5,
    comment: "Spacious and luxurious automatic transmission. Handled the Western Ghats hairpin bends effortlessly.",
    date: "2026-10-22",
    tripType: "Family Vacation",
  },
  {
    id: "REV-104",
    vehicleId: "13", // Hyundai Creta
    customerName: "Neha Nair",
    rating: 5,
    comment: "Super clean vehicle with pristine seats. The panoramic sunroof was a hit with the kids!",
    date: "2026-10-05",
    tripType: "Outstation Tour",
  },
  {
    id: "REV-105",
    vehicleId: "21", // Royal Enfield Classic 350
    customerName: "Vikram Rajput",
    rating: 5,
    comment: "Signature Enfield thump! Rented for a solo ride to Nandi Hills at sunrise. Engine in top condition.",
    date: "2026-10-14",
    tripType: "Solo Ride",
  },
  {
    id: "REV-106",
    vehicleId: "22", // Force Tempo Traveller 12-Seater
    customerName: "Dr. K. Srinivas",
    rating: 5,
    comment: "Took 11 family members to Coorg. Pushback seats were very comfortable for senior citizens. AC was powerful throughout.",
    date: "2026-10-12",
    tripType: "Group Travels",
  },
  {
    id: "REV-107",
    vehicleId: "26", // Tata / Eicher AC Mini Bus 20-Seater
    customerName: "TechCorp Offsite Team",
    rating: 5,
    comment: "Booked for our company team outing to Kabini. Spotless condition, great sound system, and generous luggage boot.",
    date: "2026-09-30",
    tripType: "Corporate Tour",
  },
  {
    id: "REV-108",
    vehicleId: "29", // Force Urbania Luxury Van
    customerName: "Rajeev Agarwal",
    rating: 5,
    comment: "Next-level luxury van! European comfort, individual AC vents, and high roof standing clearance. Worth every rupee.",
    date: "2026-10-20",
    tripType: "Wedding Group",
  },
  {
    id: "REV-109",
    vehicleId: "17", // Honda Activa 6G
    customerName: "Karthik B.",
    rating: 4,
    comment: "Reliable scooter, quick handover with helmet provided. Best way to explore Goa beaches.",
    date: "2026-10-11",
    tripType: "Local Sightseeing",
  },
];

export const reviewService = {
  getAll: (): Review[] => [...reviews],

  getByVehicleId: (vehicleId: string): Review[] => {
    return reviews.filter((r) => r.vehicleId === vehicleId);
  },

  getVehicleRatingSummary: (vehicleId: string): { average: number; count: number; breakdown: Record<number, number> } => {
    const list = reviews.filter((r) => r.vehicleId === vehicleId);
    if (list.length === 0) {
      // Default initial rating based on vehicle id hash for realism if no specific reviews yet
      const pseudoAvg = 4.7;
      return { average: pseudoAvg, count: 8, breakdown: { 5: 6, 4: 2, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = list.reduce((acc, cur) => acc + cur.rating, 0);
    const average = Math.round((sum / list.length) * 10) / 10;
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[star] = (breakdown[star] ?? 0) + 1;
    });

    return { average, count: list.length, breakdown };
  },

  addReview: (review: Omit<Review, "id" | "date">): Review => {
    const newReview: Review = {
      ...review,
      id: "REV-" + (100 + reviews.length + 1),
      date: new Date().toISOString().slice(0, 10),
    };
    reviews = [newReview, ...reviews];
    return newReview;
  },
};
