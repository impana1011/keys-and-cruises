import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookingSummary, Page, StatusBadge, VehicleCard } from "@/components/Layout";
import { DynamicPricingBreakdown } from "@/components/DynamicPricingBreakdown";
import { VehicleHealthBadge } from "@/components/VehicleHealthBadge";
import { StarRating } from "@/components/StarRating";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { InvoiceModal } from "@/components/InvoiceModal";
import { FuelGauge } from "@/components/FuelGauge";
import { authService, bookingService, rentalDays, validateDates, vehicleService } from "@/services/api";
import { calculateDynamicRentalPricing } from "@/services/pricingEngine";
import { maintenanceService } from "@/services/maintenanceService";
import {
  BRANCH_HUBS,
  INDIAN_CITIES,
  calculateIntercitySurcharge,
  calculateOneWayTransitFee,
  getBranchById,
  getBranchesByCity,
} from "@/services/cityService";
import { assignChauffeur, canHaveDriver, getDailyDriverRate } from "@/services/driverService";
import { createDefaultFuelLog } from "@/services/fuelService";
import { loyaltyService } from "@/services/loyaltyService";
import { reviewService } from "@/services/reviewService";
import { BranchSelector } from "@/components/BranchSelector";
import type { Booking, IndianCity, OneWayTransitDetails, Review, Vehicle } from "@/types";
import {
  ArrowRight,
  Award,
  Building,
  Calendar,
  CheckCircle2,
  FileText,
  Fuel,
  MapPin,
  MessageSquare,
  Navigation,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";

const CATEGORIES = ["All", "Car", "SUV", "Bike", "Tempo Traveller", "Mini Bus", "Travels"] as const;

export function HomePage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [city, setCity] = useState<IndianCity>("Bangalore");

  const featured = [
    vehicleService.getById("1"),
    vehicleService.getById("13"),
    vehicleService.getById("22"),
    vehicleService.getById("26"),
    vehicleService.getById("29"),
    vehicleService.getById("21"),
  ].filter(Boolean) as Vehicle[];

  return (
    <main className="mx-auto max-w-6xl p-4">
      <section className="my-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-primary/20 text-primary px-3 py-0.5 text-xs font-semibold">
              🇮🇳 India's Premier Fleet Rental
            </span>
            <span className="text-xs text-muted-foreground">Cars · Bikes · Tempo Travellers · Mini Buses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Explore India with Freedom & Comfort
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Algorithm-driven fair pricing, verified commercial chauffeurs, full-to-full fuel, and instant rewards points on every trip.
          </p>
        </div>

        {/* Enhanced Search Form */}
        <form
          className="mt-6 flex flex-wrap gap-2.5 bg-card p-3 rounded-xl border shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/vehicles", search: { q, category: cat } });
          }}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <MapPin size={16} className="text-primary shrink-0 ml-1" />
            <select
              className="input w-full border-none shadow-none text-xs"
              value={city}
              onChange={(e) => setCity(e.target.value as IndianCity)}
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  City: {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <input
              className="input w-full text-xs"
              placeholder="Search Swift, Thar, Tempo Traveller, Activa..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select className="input text-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button className="btn text-xs px-5">Find Vehicles</button>
        </form>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 text-xs">
        <div className="flex items-center gap-2 rounded border bg-card p-3">
          <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Automated Health Check</p>
            <p className="text-[11px] text-muted-foreground">Certified road-ready</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded border bg-card p-3">
          <UserCheck size={20} className="text-primary shrink-0" />
          <div>
            <p className="font-bold">Chauffeur Add-on</p>
            <p className="text-[11px] text-muted-foreground">Expert drivers from ₹800/day</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded border bg-card p-3">
          <Fuel size={20} className="text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Full-to-Full Fuel</p>
            <p className="text-[11px] text-muted-foreground">Transparent tank policy</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded border bg-card p-3">
          <Award size={20} className="text-purple-600 shrink-0" />
          <div>
            <p className="font-bold">DriveEase Rewards</p>
            <p className="text-[11px] text-muted-foreground">Earn points on every trip</p>
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-xl font-bold flex items-center justify-between">
        <span>Featured Fleet in {city}</span>
        <Link to="/vehicles" className="text-xs font-medium text-primary hover:underline">
          View all fleet →
        </Link>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {(featured.length > 0 ? featured : vehicleService.getAll().slice(0, 6)).map((v) => (
          <VehicleCard key={v.id} v={v} />
        ))}
      </div>
    </main>
  );
}

export function VehiclesPage({ q: q0 = "", category: c0 = "All" }: { q?: string | undefined; category?: string | undefined }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(c0);
  const [city, setCity] = useState<IndianCity>("Bangalore");

  const list = vehicleService.getAll().filter((v) => {
    const matchesCategory =
      cat === "All" ||
      v.category === cat ||
      (cat === "Travels" && (v.category === "Travels" || v.category === "Tempo Traveller" || v.category === "Mini Bus"));
    const matchesQuery =
      v.name.toLowerCase().includes(q.toLowerCase()) ||
      v.category.toLowerCase().includes(q.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <Page title="Vehicles & Travels Fleet">
      <div className="mb-4 flex flex-wrap gap-2.5 bg-card p-3 rounded-lg border">
        <div className="flex items-center gap-1.5 min-w-[160px]">
          <MapPin size={16} className="text-primary" />
          <select
            className="input text-xs"
            value={city}
            onChange={(e) => setCity(e.target.value as IndianCity)}
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <input
          className="input flex-1 min-w-[180px] text-xs"
          placeholder="Search by model or type (Swift, Creta, TT, Mini Bus)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select className="input text-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button
          className="btn-outline text-xs px-3"
          onClick={() => {
            setQ("");
            setCat("All");
          }}
        >
          Clear
        </button>
      </div>

      {/* AI Assistant Callout Banner */}
      <div className="mb-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-amber-500/10 to-transparent p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0 shadow-sm">
            <Sparkles size={16} className="text-amber-300" />
          </div>
          <div>
            <p className="font-bold text-foreground">Need help choosing the right vehicle?</p>
            <p className="text-muted-foreground text-[11px]">
              Our AI Advisor recommends matching cars, SUVs, bikes, or tempo travellers based on your passengers, terrain, and budget.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-muted-foreground hidden sm:inline">Try asking:</span>
          <span className="rounded bg-background border px-2 py-0.5 text-foreground font-mono text-[10px]">
            "Automatic family car under ₹2,000"
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {list.length} vehicles available across {city} hubs</span>
        <span>Multi-city drop option available at checkout</span>
      </div>

      {list.length === 0 && <p className="text-sm py-8 text-center text-muted-foreground">No vehicles match your search criteria.</p>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {list.map((v) => (
          <VehicleCard key={v.id} v={v} />
        ))}
      </div>
    </Page>
  );
}

function DateFields({
  pickup,
  ret,
  setPickup,
  setRet,
}: {
  pickup: string;
  ret: string;
  setPickup: (s: string) => void;
  setRet: (s: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <label className="text-xs flex-1 min-w-[120px]">
        Pickup Date
        <input type="date" className="input w-full mt-1 text-xs" value={pickup} onChange={(e) => setPickup(e.target.value)} />
      </label>
      <label className="text-xs flex-1 min-w-[120px]">
        Return Date
        <input type="date" className="input w-full mt-1 text-xs" value={ret} onChange={(e) => setRet(e.target.value)} />
      </label>
    </div>
  );
}

export function VehicleDetailsPage({ v }: { v: Vehicle }) {
  const nav = useNavigate();
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");
  const [pickupBranchId, setPickupBranchId] = useState("BLR-AIRPORT");
  const [dropBranchId, setDropBranchId] = useState("BLR-AIRPORT");
  const [transitDetails, setTransitDetails] = useState<OneWayTransitDetails>(
    calculateOneWayTransitFee(v.category, "BLR-AIRPORT", "BLR-AIRPORT")
  );
  const [err, setErr] = useState<string | null>(null);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(reviewService.getByVehicleId(v.id));
  const ratingSummary = reviewService.getVehicleRatingSummary(v.id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewer, setNewReviewer] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTripType, setNewTripType] = useState("Family Trip");
  const [newComment, setNewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const bookingCheck = maintenanceService.canBookVehicle(v.id, pickup, ret);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer || !newComment) return;
    const added = reviewService.addReview({
      vehicleId: v.id,
      customerName: newReviewer,
      rating: newRating,
      tripType: newTripType,
      comment: newComment,
    });
    setReviewsList(reviewService.getByVehicleId(v.id));
    setNewReviewer("");
    setNewComment("");
    setShowReviewForm(false);
    setReviewSuccess("Thank you! Your verified review has been published.");
    setTimeout(() => setReviewSuccess(""), 4000);
  };

  return (
    <Page title={v.name}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            {v.imageUrl ? (
              <img src={v.imageUrl} alt={v.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">{v.category} image</div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{v.name}</h2>
              <StarRating rating={ratingSummary.average} count={ratingSummary.count} size={15} />
            </div>
            <VehicleHealthBadge vehicle={v} />
          </div>

          <table className="table">
            <tbody>
              {[
                ["Category", v.category],
                ["Seats", `${v.seats} Seats`],
                ["Fuel Type", v.fuel],
                ["Transmission", v.transmission],
                ["Chauffeur Add-on", canHaveDriver(v.category) ? `Available (₹${getDailyDriverRate(v.category)}/day)` : "Self-drive only"],
                ["Fuel Policy", "100% Full-to-Full"],
                ["Road Readiness", v.available ? "Certified Ready" : "Under Service"],
              ].map(([k, val]) => (
                <tr key={k as string}>
                  <td className="font-medium text-xs">{k}</td>
                  <td className="text-xs">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Vehicle Health & Compliance Card */}
          <VehicleHealthBadge vehicle={v} detailed />

          {/* Transparent Fuel Policy Note */}
          <div className="rounded border bg-card p-3 shadow-xs text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Fuel size={14} className="text-emerald-600" />
              <span>Full-to-Full Transparent Fuel Policy</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Vehicle dispatched with 100% full tank. Return with full tank to avoid refueling convenience charges.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Multi-Branch & Inter-City Transit Selector */}
          <BranchSelector
            category={v.category}
            pickupBranchId={pickupBranchId}
            dropBranchId={dropBranchId}
            onPickupBranchChange={setPickupBranchId}
            onDropBranchChange={setDropBranchId}
            onTransitDetailsChange={setTransitDetails}
          />

          {/* Real-time Interactive Availability Calendar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                <span>Real-time Availability Calendar</span>
              </label>
              <span className="text-[11px] text-muted-foreground">Click dates to select range</span>
            </div>

            <AvailabilityCalendar
              vehicleId={v.id}
              selectedPickup={pickup}
              selectedReturn={ret}
              onSelectRange={(p, r) => {
                setPickup(p);
                setRet(r);
              }}
            />

            <div className="pt-2">
              <DateFields pickup={pickup} ret={ret} setPickup={setPickup} setRet={setRet} />
            </div>
          </div>

          <DynamicPricingBreakdown vehicle={v} pickupDate={pickup} returnDate={ret} />

          {/* Maintenance Blocking Notice */}
          {!bookingCheck.canBook && (
            <div className="rounded border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200 font-medium">
              🚫 {bookingCheck.reason}
            </div>
          )}

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button
            className="btn w-full text-xs py-2.5"
            disabled={!bookingCheck.canBook}
            onClick={() => {
              const e = validateDates(pickup, ret);
              setErr(e);
              if (!e && bookingCheck.canBook) {
                nav({
                  to: "/booking/$vehicleId",
                  params: { vehicleId: v.id },
                  search: {
                    pickup,
                    ret,
                    pickupBranch: pickupBranchId,
                    dropBranch: dropBranchId,
                  },
                });
              }
            }}
          >
            {bookingCheck.canBook ? "Proceed to Customise & Book" : "Currently Blocked for Service"}
          </button>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div className="mt-12 border-t pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Customer Reviews & Ratings</span>
              <span className="text-xs font-normal text-muted-foreground">({reviewsList.length} reviews)</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={ratingSummary.average} count={ratingSummary.count} size={16} />
              <span className="text-xs text-muted-foreground">· 100% verified customer bookings</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-outline text-xs flex items-center gap-1.5"
          >
            <MessageSquare size={14} />
            <span>{showReviewForm ? "Cancel Review" : "Write a Review"}</span>
          </button>
        </div>

        {reviewSuccess && (
          <div className="rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 p-3 text-xs font-medium">
            ✓ {reviewSuccess}
          </div>
        )}

        {/* Review Submission Form */}
        {showReviewForm && (
          <form onSubmit={handleAddReview} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm">Write a Customer Review</h3>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <input
                className="input text-xs"
                placeholder="Your Name (e.g. Ananya S.)"
                value={newReviewer}
                onChange={(e) => setNewReviewer(e.target.value)}
                required
              />
              <select
                className="input text-xs"
                value={newTripType}
                onChange={(e) => setNewTripType(e.target.value)}
              >
                <option>Family Vacation</option>
                <option>Weekend Getaway</option>
                <option>Business Trip</option>
                <option>Solo Ride</option>
                <option>Corporate Outing</option>
              </select>
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs text-muted-foreground">Rating:</span>
                <StarRating rating={newRating} size={18} interactive onRatingChange={setNewRating} showText={false} />
                <span className="text-xs font-bold text-amber-500">{newRating} Stars</span>
              </div>
            </div>
            <textarea
              className="input w-full text-xs h-20"
              placeholder="Share your driving experience, vehicle condition, cleanliness, and fuel mileage..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button className="btn text-xs">Submit Review</button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid gap-3 sm:grid-cols-2">
          {reviewsList.map((r) => (
            <div key={r.id} className="rounded-lg border bg-card p-4 shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-foreground">{r.customerName}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={r.rating} size={12} showText={false} />
                    <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground font-medium">
                      {r.tripType}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{r.date}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export function BookingPage({
  v,
  pickup: p0 = "",
  ret: r0 = "",
  pickupBranch: pb0 = "BLR-AIRPORT",
  dropBranch: db0 = "BLR-AIRPORT",
}: {
  v: Vehicle;
  pickup?: string | undefined;
  ret?: string | undefined;
  pickupBranch?: string | undefined;
  dropBranch?: string | undefined;
}) {
  const nav = useNavigate();
  const [pickup, setPickup] = useState(p0);
  const [ret, setRet] = useState(r0);
  const [pickupBranchId, setPickupBranchId] = useState(pb0);
  const [dropBranchId, setDropBranchId] = useState(db0);
  const [transitDetails, setTransitDetails] = useState<OneWayTransitDetails>(
    calculateOneWayTransitFee(v.category, pb0, db0)
  );
  const [withDriver, setWithDriver] = useState(false);
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loyaltyAccount = loyaltyService.getAccount();
  const days = Math.max(1, rentalDays(pickup, ret));
  const dynamic = calculateDynamicRentalPricing(v, pickup, ret);

  const intercityFee = transitDetails.totalTransitFee;
  const driverDailyRate = getDailyDriverRate(v.category);
  const driverFee = withDriver ? driverDailyRate * days : 0;
  const driverDetails = withDriver ? assignChauffeur(Number(v.id)) : undefined;

  // Max loyalty redemption capped at current user points or 30% of total
  const potentialPoints = Math.min(loyaltyAccount.points, Math.floor(dynamic.totalFinalPrice * 0.3));
  const loyaltyDiscount = redeemLoyalty ? potentialPoints : 0;

  const grandTotal = Math.max(0, dynamic.totalFinalPrice + intercityFee + driverFee - loyaltyDiscount);
  const pointsToEarn = loyaltyService.calculatePointsToEarn(grandTotal);

  const bookingCheck = maintenanceService.canBookVehicle(v.id, pickup, ret);

  const handleConfirm = () => {
    const e = validateDates(pickup, ret);
    setErr(e);
    if (e || !bookingCheck.canBook) return;

    if (redeemLoyalty && loyaltyDiscount > 0) {
      loyaltyService.redeemPoints(loyaltyDiscount);
    }

    const b = bookingService.create({
      vehicleId: v.id,
      customer: "Demo User",
      pickupDate: pickup,
      returnDate: ret,
      totalPrice: grandTotal,
      pickupCity: transitDetails.pickupBranch.city,
      dropCity: transitDetails.dropBranch.city,
      pickupBranchId: transitDetails.pickupBranch.id,
      dropBranchId: transitDetails.dropBranch.id,
      pickupBranchName: transitDetails.pickupBranch.name,
      dropBranchName: transitDetails.dropBranch.name,
      transitDistanceKm: transitDetails.distanceKm,
      intercityFee: transitDetails.totalTransitFee,
      oneWayTransitFee: transitDetails.totalTransitFee,
      withDriver,
      driverFee,
      driverDetails,
      loyaltyPointsRedeemed: loyaltyDiscount,
      loyaltyDiscountAmount: loyaltyDiscount,
      loyaltyPointsEarned: pointsToEarn,
      fuelLog: createDefaultFuelLog(),
      baseRentalPrice: v.pricePerDay * days,
      invoiceNumber: `INV-2026-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toISOString().slice(0, 10),
    });

    loyaltyService.awardPoints(grandTotal, b.id);
    nav({ to: "/booking-confirmation/$id", params: { id: b.id } });
  };

  return (
    <Page title="Confirm Booking & Add-ons">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {/* Multi-Branch & Inter-City Transit Selector */}
          <BranchSelector
            category={v.category}
            pickupBranchId={pickupBranchId}
            dropBranchId={dropBranchId}
            onPickupBranchChange={setPickupBranchId}
            onDropBranchChange={setDropBranchId}
            onTransitDetailsChange={setTransitDetails}
          />

          {/* Dates & Real-time Availability Calendar */}
          <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rental Dates & Availability
            </label>
            <AvailabilityCalendar
              vehicleId={v.id}
              selectedPickup={pickup}
              selectedReturn={ret}
              onSelectRange={(p, r) => {
                setPickup(p);
                setRet(r);
              }}
            />
            <DateFields pickup={pickup} ret={ret} setPickup={setPickup} setRet={setRet} />
          </div>

          {/* Chauffeur / Driver Addon */}
          {canHaveDriver(v.category) && (
            <div className="rounded-lg border bg-card p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withDriver}
                    onChange={(e) => setWithDriver(e.target.checked)}
                    className="rounded accent-primary h-4 w-4"
                  />
                  <span>Add Commercial Chauffeur (+₹{driverDailyRate}/day)</span>
                </label>
                <span className="text-xs font-semibold text-primary">₹{driverFee} total</span>
              </div>
              <p className="text-[11px] text-muted-foreground pl-6">
                Verified badge commercial driver with 10+ years experience, local route mastery, and zero passenger liability.
              </p>

              {withDriver && driverDetails && (
                <div className="mt-2 ml-6 rounded border bg-muted/30 p-2.5 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{driverDetails.name} ({driverDetails.badgeNumber})</p>
                    <p className="text-[11px] text-muted-foreground">
                      ★ {driverDetails.rating} · {driverDetails.tripsCount} trips · {driverDetails.languages.join(", ")}
                    </p>
                  </div>
                  <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 font-bold">
                    Assigned
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loyalty & Rewards Redemption */}
          <div className="rounded-lg border bg-card p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={redeemLoyalty}
                  disabled={potentialPoints <= 0}
                  onChange={(e) => setRedeemLoyalty(e.target.checked)}
                  className="rounded accent-primary h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-amber-500" />
                  <span>Redeem DriveEase Rewards Points</span>
                </span>
              </label>
              <span className="text-xs font-semibold text-emerald-600">
                {redeemLoyalty ? `-₹${loyaltyDiscount}` : `${loyaltyAccount.points} pts available`}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground pl-6">
              You have {loyaltyAccount.points} points. Redeem up to {potentialPoints} points (₹{potentialPoints} discount) on this booking.
            </p>
          </div>

          {/* Transparent Fuel Policy Status */}
          <FuelGauge level="100% (Full Tank)" label="Dispatch Fuel Tank (Full-to-Full)" />

          <DynamicPricingBreakdown vehicle={v} pickupDate={pickup} returnDate={ret} />

          {!bookingCheck.canBook && (
            <div className="rounded border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200 font-medium">
              🚫 {bookingCheck.reason}
            </div>
          )}

          {err && <p className="text-sm text-destructive">{err}</p>}

          <div className="rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 p-2.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between font-medium">
            <span>🎉 You will earn {pointsToEarn} DriveEase Rewards Points on this rental!</span>
          </div>

          <button
            className="btn w-full text-xs py-3 font-bold"
            disabled={!bookingCheck.canBook}
            onClick={handleConfirm}
          >
            {bookingCheck.canBook ? `Confirm & Pay ₹${grandTotal} (Instant Confirmation)` : "Blocked by Maintenance Schedule"}
          </button>
        </div>

        <div className="space-y-4">
          <BookingSummary
            v={v}
            pickup={pickup}
            ret={ret}
            pickupCity={transitDetails.pickupBranch.city}
            dropCity={transitDetails.dropBranch.city}
            pickupBranchName={transitDetails.pickupBranch.name}
            dropBranchName={transitDetails.dropBranch.name}
            transitDistanceKm={transitDetails.distanceKm}
            intercityFee={intercityFee}
            withDriver={withDriver}
            driverFee={driverFee}
            loyaltyDiscount={loyaltyDiscount}
          />
          <VehicleHealthBadge vehicle={v} detailed />
        </div>
      </div>
    </Page>
  );
}

export function ConfirmationPage({ id }: { id: string }) {
  const [showInvoice, setShowInvoice] = useState(false);
  const b = bookingService.getById(id);
  const v = b && vehicleService.getById(b.vehicleId);
  const isOneWay = b?.pickupBranchName && b?.dropBranchName && b.pickupBranchName !== b.dropBranchName;

  return (
    <Page title="Booking Confirmed & Road Ready! 🎉">
      {b && v ? (
        <div className="space-y-6">
          <div className="rounded-xl border bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
              <div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-3 py-1 font-bold">
                  ✓ Booking Confirmed & Verified
                </span>
                <h2 className="text-2xl font-black mt-2">Booking #{b.id}</h2>
                <p className="text-xs text-muted-foreground">
                  Vehicle reserved and prepped at {b.pickupBranchName ?? b.pickupCity ?? "Bangalore"}.
                </p>
              </div>

              {/* Tax Invoice trigger button */}
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="btn flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
              >
                <FileText size={16} />
                <span>View & Print Tax Invoice (PDF)</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded border bg-card p-3">
                <p className="text-muted-foreground uppercase text-[10px] font-bold">Pickup Hub</p>
                <p className="font-bold text-foreground mt-0.5">
                  {b.pickupBranchName ?? b.pickupCity ?? "Bangalore"}
                </p>
                {isOneWay ? (
                  <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
                    ↓ Drop Hub: {b.dropBranchName} ({b.transitDistanceKm} KM)
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-0.5">(Same Hub Return)</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">{b.pickupDate} to {b.returnDate}</p>
              </div>

              <div className="rounded border bg-card p-3">
                <p className="text-muted-foreground uppercase text-[10px] font-bold">Total Fare Paid</p>
                <p className="font-bold text-foreground text-base mt-0.5 text-primary">₹{b.totalPrice}</p>
                <p className="text-[11px] text-muted-foreground">Includes 18% GST (Tax Invoice ready)</p>
              </div>

              <div className="rounded border bg-card p-3">
                <p className="text-muted-foreground uppercase text-[10px] font-bold">Loyalty Rewards Earned</p>
                <p className="font-bold text-emerald-600 text-base mt-0.5">
                  +{b.loyaltyPointsEarned ?? Math.floor(b.totalPrice / 10)} Pts
                </p>
                <p className="text-[11px] text-muted-foreground">Credited to DriveEase account</p>
              </div>
            </div>

            {/* Assigned Driver Card if requested */}
            {b.withDriver && b.driverDetails && (
              <div className="rounded-lg border bg-card p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Assigned Chauffeur: {b.driverDetails.name}</p>
                    <p className="text-muted-foreground">
                      Badge: {b.driverDetails.badgeNumber} · Phone: {b.driverDetails.phone} · Languages: {b.driverDetails.languages.join(", ")}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">★ {b.driverDetails.rating} Star Commercial Driver</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Confirmed</span>
              </div>
            )}

            {/* Fuel Status */}
            <FuelGauge level="100% (Full Tank)" label="Dispatch Fuel Tank (Full-to-Full Policy)" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <BookingSummary
              v={v}
              pickup={b.pickupDate}
              ret={b.returnDate}
              pickupCity={b.pickupCity}
              dropCity={b.dropCity}
              pickupBranchName={b.pickupBranchName}
              dropBranchName={b.dropBranchName}
              transitDistanceKm={b.transitDistanceKm}
              intercityFee={b.intercityFee}
              withDriver={b.withDriver}
              driverFee={b.driverFee}
              loyaltyDiscount={b.loyaltyDiscountAmount}
            />
            <VehicleHealthBadge vehicle={v} detailed />
          </div>

          {/* Printable Invoice Modal */}
          {showInvoice && <InvoiceModal booking={b} vehicle={v} onClose={() => setShowInvoice(false)} />}
        </div>
      ) : (
        <p>Booking not found (demo data resets on page reload).</p>
      )}

      <div className="mt-6 flex gap-2">
        <Link to="/my-bookings" className="btn text-xs">My Bookings</Link>
        <Link to="/vehicles" className="btn-outline text-xs">Browse more fleet</Link>
      </div>
    </Page>
  );
}


export function MyBookingsPage() {
  const [, force] = useState(0);
  const [filter, setFilter] = useState<string>("All");
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  const allBookings = bookingService.getAll();
  const list = allBookings
    .filter((b) => b.customer === "Demo User")
    .filter((b) => (filter === "All" ? true : b.status === filter));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !reviewComment) return;
    reviewService.addReview({
      vehicleId: reviewBooking.vehicleId,
      customerName: "Demo User",
      rating: reviewStars,
      tripType: "Completed Rental",
      comment: reviewComment,
    });
    setReviewMsg("Review published successfully! Thank you for rating.");
    setTimeout(() => {
      setReviewBooking(null);
      setReviewMsg("");
      setReviewComment("");
    }, 2000);
  };

  return (
    <Page title="My Rental Bookings & History">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex gap-1.5 text-xs">
          {["All", "Confirmed", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded px-3 py-1 border transition-all ${
                filter === s ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Showing {list.length} bookings for Demo User</p>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Vehicle</th>
              <th>City Route</th>
              <th>Rental Dates</th>
              <th>Chauffeur</th>
              <th>Total Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => {
              const v = vehicleService.getById(b.vehicleId);
              return (
                <tr key={b.id}>
                  <td className="font-mono text-xs font-bold">{b.id}</td>
                  <td>
                    <div className="font-semibold text-xs">{v?.name ?? "Vehicle"}</div>
                    <div className="text-[11px] text-muted-foreground">{v?.category}</div>
                  </td>
                  <td className="text-xs">
                    <div className="font-medium text-foreground">
                      {b.pickupBranchName ?? b.pickupCity ?? "Bangalore Hub"}
                    </div>
                    {b.dropBranchName && b.dropBranchName !== b.pickupBranchName ? (
                      <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                        <span>→ {b.dropBranchName}</span>
                        {typeof b.transitDistanceKm === "number" && b.transitDistanceKm > 0 && (
                          <span className="rounded bg-amber-100 text-amber-900 text-[9px] px-1 font-mono">
                            {b.transitDistanceKm} KM
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground">Same Hub Return</div>
                    )}
                  </td>
                  <td className="text-xs">{b.pickupDate} → {b.returnDate}</td>
                  <td className="text-xs">
                    {b.withDriver ? (
                      <span className="rounded bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 font-bold">
                        ✓ Chauffeur
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Self-Drive</span>
                    )}
                  </td>
                  <td className="font-bold text-xs text-primary">₹{b.totalPrice}</td>
                  <td><StatusBadge s={b.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {/* View Tax Invoice Button */}
                      {v && (
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceBooking(b)}
                          className="btn-outline text-[11px] px-2 py-0.5 flex items-center gap-1"
                          title="View & Print Official GST Tax Invoice"
                        >
                          <FileText size={12} />
                          <span>Invoice</span>
                        </button>
                      )}

                      {/* Review Button for completed trips */}
                      {b.status === "Completed" && (
                        <button
                          type="button"
                          onClick={() => setReviewBooking(b)}
                          className="rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 text-[11px] px-2 py-0.5 hover:bg-amber-500/20 font-medium flex items-center gap-1"
                        >
                          <Star size={12} className="fill-amber-400" />
                          <span>Rate</span>
                        </button>
                      )}

                      {/* Cancellation button */}
                      {(b.status === "Confirmed" || b.status === "Pending") && (
                        <button
                          className="btn-outline text-[11px] px-2 py-0.5 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            bookingService.setStatus(b.id, "Cancelled");
                            force((n) => n + 1);
                            alert("Booking cancelled (refund initiated to original payment mode).");
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          vehicle={vehicleService.getById(selectedInvoiceBooking.vehicleId)!}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

      {/* Write Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base">Rate Your Experience: {vehicleService.getById(reviewBooking.vehicleId)?.name}</h3>
            {reviewMsg ? (
              <p className="text-xs text-emerald-600 font-bold">{reviewMsg}</p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Your Rating:</span>
                  <StarRating rating={reviewStars} interactive onRatingChange={setReviewStars} size={20} showText={false} />
                  <span className="text-xs font-bold text-amber-500">{reviewStars} Stars</span>
                </div>
                <textarea
                  className="input w-full text-xs h-24"
                  placeholder="How was the ride comfort, vehicle cleanliness, AC, and fuel performance?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setReviewBooking(null)} className="btn-outline text-xs">
                    Cancel
                  </button>
                  <button className="btn text-xs">Submit Rating</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Page title={mode === "login" ? "Login" : "Register"}>
      <form
        className="max-w-sm space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!f.email.includes("@") || f.password.length < 6 || (mode === "register" && !f.name))
            return setMsg("Please fill all fields (valid email, password 6+ chars).");
          setMsg(mode === "login" ? authService.login(f.email).message : authService.register(f.name).message);
        }}
      >
        {mode === "register" && <input className="input w-full" placeholder="Full name" value={f.name} onChange={set("name")} />}
        <input className="input w-full" placeholder="Email" value={f.email} onChange={set("email")} />
        <input className="input w-full" type="password" placeholder="Password" value={f.password} onChange={set("password")} />
        <button className="btn w-full">{mode === "login" ? "Login" : "Create account"}</button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm">
          {mode === "login" ? (
            <Link to="/register" className="text-primary">Need an account? Register</Link>
          ) : (
            <Link to="/login" className="text-primary">Have an account? Login</Link>
          )}
        </p>
      </form>
    </Page>
  );
}
