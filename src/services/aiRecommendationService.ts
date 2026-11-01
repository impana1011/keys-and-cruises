import { vehicleService } from "./api";
import { reviewService } from "./reviewService";
import type { Category, Vehicle } from "@/types";

export interface AIChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recommendedVehicles?: Vehicle[] | undefined;
  tags?: string[] | undefined;
}

export interface ParsedTripIntent {
  maxBudget?: number | undefined;
  minSeats?: number | undefined;
  maxSeats?: number | undefined;
  transmission?: "Automatic" | "Manual" | undefined;
  fuelType?: "CNG" | "Diesel" | "Petrol" | undefined;
  preferredCategory?: Category | undefined;
  tripVibe?: "family" | "hills" | "group" | "luxury" | "commute" | "budget" | "wedding" | "solo" | undefined;
  isFuelEfficient?: boolean | undefined;
}

export function parseUserQuery(query: string): ParsedTripIntent {
  const q = query.toLowerCase();
  const intent: ParsedTripIntent = {};

  // 1. Budget extraction (e.g. "under 2000", "below ₹2,500", "under 1500/day")
  const budgetMatch = q.match(/(?:under|below|less than|within|budget of)\s*(?:₹|rs\.?|inr)?\s*([0-9,]+)/i);
  if (budgetMatch && budgetMatch[1]) {
    intent.maxBudget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
  }

  // 2. Transmission extraction
  if (q.includes("automatic") || q.includes(" auto ") || q.endsWith(" auto") || q.includes("gearless")) {
    intent.transmission = "Automatic";
  } else if (q.includes("manual")) {
    intent.transmission = "Manual";
  }

  // 3. Passenger / Seats extraction (e.g. "family of 5", "7 seater", "12 people", "15 passengers", "20 members")
  const seatMatch = q.match(/(\d+)\s*(?:seater|seats|people|persons|passengers|members|friends)/i);
  if (seatMatch && seatMatch[1]) {
    const count = parseInt(seatMatch[1], 10);
    intent.minSeats = count;
  } else if (q.includes("family")) {
    intent.minSeats = 5;
    intent.tripVibe = "family";
  } else if (q.includes("couple") || q.includes("2 of us") || q.includes("two people")) {
    intent.minSeats = 2;
  } else if (q.includes("solo") || q.includes("alone") || q.includes("single")) {
    intent.minSeats = 1;
    intent.tripVibe = "solo";
  }

  // 4. Fuel & Efficiency
  if (q.includes("cng")) {
    intent.fuelType = "CNG";
    intent.isFuelEfficient = true;
  } else if (q.includes("diesel")) {
    intent.fuelType = "Diesel";
  } else if (q.includes("petrol")) {
    intent.fuelType = "Petrol";
  }
  if (q.includes("fuel-efficient") || q.includes("fuel efficient") || q.includes("mileage") || q.includes("economical")) {
    intent.isFuelEfficient = true;
  }

  // 5. Category keywords
  if (q.includes("tempo traveller") || q.includes(" tt ") || q.includes("tempo") || q.includes("traveller")) {
    intent.preferredCategory = "Tempo Traveller";
  } else if (q.includes("mini bus") || q.includes("minibus") || q.includes("bus")) {
    intent.preferredCategory = "Mini Bus";
  } else if (q.includes("suv") || q.includes("4x4") || q.includes("thar") || q.includes("creta")) {
    intent.preferredCategory = "SUV";
  } else if (q.includes("bike") || q.includes("scooter") || q.includes("motorcycle") || q.includes("activa") || q.includes("bullet")) {
    intent.preferredCategory = "Bike";
  } else if (q.includes("car") || q.includes("sedan") || q.includes("hatchback")) {
    intent.preferredCategory = "Car";
  }

  // 6. Terrain / Vibe
  if (q.includes("mountain") || q.includes("hills") || q.includes("ghat") || q.includes("ooty") || q.includes("ladakh") || q.includes("manali") || q.includes("coorg") || q.includes("offroad")) {
    intent.tripVibe = "hills";
  } else if (q.includes("wedding") || q.includes("reception") || q.includes("vip") || q.includes("luxury")) {
    intent.tripVibe = "luxury";
  } else if (q.includes("commute") || q.includes("city") || q.includes("daily") || q.includes("errands")) {
    intent.tripVibe = "commute";
  } else if (q.includes("group") || q.includes("team") || q.includes("friends") || q.includes("outing")) {
    intent.tripVibe = "group";
  }

  return intent;
}

export function getAIRecommendations(query: string): {
  reply: string;
  recommendedVehicles: Vehicle[];
  tags: string[];
} {
  const allVehicles = vehicleService.getAll();
  const intent = parseUserQuery(query);
  const qLower = query.toLowerCase();

  // Handling general FAQs / greetings
  if (qLower.includes("hello") || qLower.includes("hi ") || qLower === "hi" || qLower.includes("hey")) {
    return {
      reply:
        "Hello! I'm your DriveEase AI Fleet Advisor. Tell me about your upcoming trip — like how many people are travelling, your destination terrain, preferred transmission (Automatic/Manual), or daily budget — and I'll find the perfect vehicle for you!",
      recommendedVehicles: [
        vehicleService.getById("4")!, // Dzire AT
        vehicleService.getById("13")!, // Creta AT
        vehicleService.getById("22")!, // Force TT 12-Seater
      ].filter(Boolean),
      tags: ["Automatic Cars", "Family SUVs", "Group Travellers"],
    };
  }

  if (qLower.includes("fuel policy") || qLower.includes("fuel")) {
    const fuelCars = allVehicles.filter((v) => v.fuel.includes("CNG") || v.pricePerDay <= 1200).slice(0, 3);
    return {
      reply:
        "At DriveEase, all vehicles operate on a transparent **100% Full-to-Full Fuel Policy**. Every car or bus is dispatched with a full tank so you never lose time at fuel pumps before your journey starts. Return it full to incur zero refueling deficit fees!",
      recommendedVehicles: fuelCars,
      tags: ["Full-to-Full", "CNG Fleet", "Fuel Mileage"],
    };
  }

  if (qLower.includes("driver") || qLower.includes("chauffeur")) {
    const chauffeurVehicles = allVehicles.filter((v) => v.category === "Travels" || v.category === "Tempo Traveller" || v.category === "SUV").slice(0, 3);
    return {
      reply:
        "Yes! You can hire a professional verified commercial chauffeur on any Car, SUV, Tempo Traveller, or Mini Bus. Chauffeur daily allowance is ₹800/day for cars and ₹1,200/day for heavy passenger vehicles, including complete passenger insurance and outstation expertise.",
      recommendedVehicles: chauffeurVehicles,
      tags: ["Verified Drivers", "Commercial Badge", "Zero Liability"],
    };
  }

  if (qLower.includes("intercity") || qLower.includes("one way") || qLower.includes("drop")) {
    const tourers = allVehicles.filter((v) => v.category === "SUV" || v.category === "Travels" || v.category === "Car").slice(0, 3);
    return {
      reply:
        "Yes! DriveEase provides Multi-Branch & Inter-City One-Way drop-offs across 24 hubs in 10 major Indian cities (including 24/7 airport hubs). Our system automatically calculates the national highway transit distance and FASTag toll fees so you only pay for what you use.",
      recommendedVehicles: tourers,
      tags: ["Inter-City Drop", "Airport Hubs", "FASTag Tolls"],
    };
  }

  // Scoring and ranking vehicles based on parsed intent
  const scored = allVehicles.map((v) => {
    let score = 0;
    const reasons: string[] = [];

    // Prioritize available & healthy road-ready vehicles
    if (v.available) {
      score += 25;
    } else {
      score -= 30; // Deprioritize blocked / maintenance vehicles
    }

    // Budget match
    if (intent.maxBudget) {
      if (v.pricePerDay <= intent.maxBudget) {
        score += 35;
        reasons.push(`Fits your ₹${intent.maxBudget} budget (at ₹${v.pricePerDay}/day)`);
      } else if (v.pricePerDay <= intent.maxBudget * 1.15) {
        score += 10; // close to budget
      } else {
        score -= 40;
      }
    }

    // Transmission match
    if (intent.transmission) {
      if (v.transmission.toLowerCase() === intent.transmission.toLowerCase()) {
        score += 35;
        reasons.push(`${v.transmission} transmission for effortless driving`);
      } else {
        score -= 35;
      }
    }

    // Seating capacity match
    if (intent.minSeats) {
      if (v.seats >= intent.minSeats && v.seats <= intent.minSeats + 3) {
        score += 40; // Ideal seat count
        reasons.push(`Comfortably seats ${v.seats} passengers`);
      } else if (v.seats >= intent.minSeats) {
        score += 20; // Has enough seats, though larger
      } else {
        score -= 60; // Not enough seats!
      }
    }

    // Fuel preference
    if (intent.fuelType) {
      if (v.fuel.toLowerCase().includes(intent.fuelType.toLowerCase())) {
        score += 30;
        reasons.push(`${v.fuel} powertrain`);
      }
    }

    // High mileage / fuel efficiency
    if (intent.isFuelEfficient) {
      if (v.fuel.includes("CNG") || (v.category === "Car" && v.fuel === "Petrol" && v.pricePerDay <= 1400)) {
        score += 25;
        reasons.push("Outstanding fuel economy / mileage");
      }
    }

    // Category match
    if (intent.preferredCategory) {
      if (v.category === intent.preferredCategory) {
        score += 35;
      }
    }

    // Vibe match
    if (intent.tripVibe === "hills") {
      if (v.category === "SUV" || (v.category === "Bike" && v.name.includes("Royal Enfield"))) {
        score += 30;
        reasons.push("High ground clearance & hill climb capability");
      }
    } else if (intent.tripVibe === "luxury" || intent.tripVibe === "wedding") {
      if (v.name.includes("Urbania") || v.name.includes("Maharaja") || v.name.includes("Innova") || v.name.includes("City")) {
        score += 35;
        reasons.push("Executive luxury recliner seating & VIP presence");
      }
    } else if (intent.tripVibe === "group") {
      if (v.category === "Tempo Traveller" || v.category === "Mini Bus") {
        score += 35;
        reasons.push("Generous boot space & pushback seating for groups");
      }
    } else if (intent.tripVibe === "commute") {
      if (v.pricePerDay <= 1300 && (v.category === "Car" || v.category === "Bike")) {
        score += 25;
        reasons.push("Compact city maneuvering and easy parking");
      }
    }

    // Customer review rating bonus
    const reviewSummary = reviewService.getVehicleRatingSummary(v.id);
    if (reviewSummary.average >= 4.8) {
      score += 10;
    }

    return { vehicle: v, score, reasons };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top 3 recommended vehicles
  const topMatches = scored.slice(0, 3).map((s) => s.vehicle);

  // Generate intelligent explanation
  let explanation = "";
  const bestMatch = scored[0];

  if (bestMatch) {
    const v = bestMatch.vehicle;
    const reasonsStr = bestMatch.reasons.length > 0 ? bestMatch.reasons.join(", ") : "well-balanced comfort and value";

    if (intent.transmission === "Automatic" && intent.tripVibe === "family" && intent.maxBudget) {
      explanation = `I found ideal options for your family road trip! The **${v.name}** is an **Automatic ${v.category}** priced at just **₹${v.pricePerDay}/day** (under your ₹${intent.maxBudget} budget). It offers 5 comfortable seats, excellent fuel economy, and effortless highway cruising.`;
    } else if (intent.minSeats && intent.minSeats > 7) {
      explanation = `For a group of ${intent.minSeats} travellers, I recommend the **${v.name}**. With ${v.seats} pushback seats, individual AC vents, and large luggage capacity, it keeps everyone together comfortably on outstation routes.`;
    } else if (intent.tripVibe === "hills") {
      explanation = `For mountain and hill road trips, ground clearance and low-end torque are essential. The **${v.name}** (${v.fuel}, ₹${v.pricePerDay}/day) is engineered to handle steep inclines and uneven terrain effortlessly.`;
    } else if (intent.maxBudget) {
      explanation = `Looking for options under **₹${intent.maxBudget}/day**? The **${v.name}** stands out at **₹${v.pricePerDay}/day** with ${reasonsStr}.`;
    } else {
      explanation = `Based on your request, the **${v.name}** is my top recommendation (${reasonsStr}). Here are the best certified road-ready options:`;
    }
  } else {
    explanation = "Here are popular certified vehicles from our fleet that match your requirements:";
  }

  const tags: string[] = [];
  if (intent.transmission) tags.push(`${intent.transmission} Transmission`);
  if (intent.maxBudget) tags.push(`Under ₹${intent.maxBudget}`);
  if (intent.minSeats) tags.push(`${intent.minSeats}+ Seats`);
  if (intent.tripVibe) tags.push(`${intent.tripVibe.charAt(0).toUpperCase() + intent.tripVibe.slice(1)} Trip`);

  return {
    reply: explanation,
    recommendedVehicles: topMatches,
    tags: tags.length > 0 ? tags : ["Top Pick", "Certified Road-Ready", "Best Value"],
  };
}
