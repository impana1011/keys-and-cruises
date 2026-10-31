import { Link } from "@tanstack/react-router";
import { Car, Fuel, ShieldCheck, UserCheck } from "lucide-react";
import type { Booking, IndianCity, Vehicle } from "@/types";
import { calculateDynamicRentalPricing, getTodayVehiclePricing } from "@/services/pricingEngine";
import { reviewService } from "@/services/reviewService";
import { VehicleHealthBadge } from "./VehicleHealthBadge";
import { StarRating } from "./StarRating";
import { LoyaltyWidget } from "./LoyaltyWidget";

export function Navbar() {
  const l = "text-sm hover:text-primary transition-colors";
  return (
    <nav className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg">
          <Car size={22} />
          <span>DriveEase</span>
        </Link>
        <div className="ml-auto flex items-center flex-wrap gap-4">
          <Link to="/vehicles" className={l}>Vehicles</Link>
          <Link to="/my-bookings" className={l}>My Bookings</Link>
          <Link to="/admin" className={l}>Admin</Link>
          <LoyaltyWidget />
          <Link to="/login" className={l}>Login</Link>
          <Link to="/register" className={l}>Register</Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t p-6 text-center text-xs text-muted-foreground bg-muted/20">
      <p>© 2026 DriveEase Mobility India Pvt. Ltd. — All-India Car, Bike, Tempo Traveller & Mini Bus Rentals.</p>
      <p className="mt-1">Transparent Full-to-Full Fuel Policy · 100% Verified Commercial Chauffeurs · DriveEase Rewards</p>
    </footer>
  );
}

export function VehicleCard({ v }: { v: Vehicle }) {
  const pricing = getTodayVehiclePricing(v);
  const isSurge = pricing.dynamicPrice > pricing.basePrice;
  const isDiscount = pricing.dynamicPrice < pricing.basePrice;
  const ratingSummary = reviewService.getVehicleRatingSummary(v.id);

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded border bg-card p-4 transition-all hover:shadow-md">
      <div>
        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded bg-muted">
          {v.imageUrl ? (
            <img
              src={v.imageUrl}
              alt={v.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">{v.category} image</div>
          )}
          {pricing.badge && (
            <div className="absolute top-2 right-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm ${
                  pricing.badge.type === "surge"
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {pricing.badge.label}
              </span>
            </div>
          )}
        </div>

        {/* Category & Health status */}
        <div className="flex items-center justify-between gap-1 mt-1">
          <p className="text-xs text-muted-foreground">{v.category} · {v.seats} Seats · {v.fuel}</p>
          <VehicleHealthBadge vehicle={v} />
        </div>

        {/* Vehicle Name */}
        <h3 className="font-bold text-base mt-1 line-clamp-1">{v.name}</h3>

        {/* Customer Star Rating */}
        <div className="mt-1">
          <StarRating rating={ratingSummary.average} count={ratingSummary.count} size={13} />
        </div>

        {/* Price & Features */}
        <div className="my-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">₹{pricing.dynamicPrice}</span>
            <span className="text-xs text-muted-foreground">/day</span>
            {(isSurge || isDiscount) && (
              <span className="text-xs text-muted-foreground line-through">₹{pricing.basePrice}</span>
            )}
            {!v.available && <span className="text-xs text-destructive font-medium">(Blocked)</span>}
          </div>
          <span className="text-[11px] text-muted-foreground">Dynamic pricing active</span>
        </div>
      </div>

      <Link to="/vehicles/$id" params={{ id: v.id }} className="btn mt-2 inline-block text-center text-xs">
        {v.available ? "View Details & Book" : "View Health Status"}
      </Link>
    </div>
  );
}

interface BookingSummaryProps {
  v: Vehicle;
  pickup: string;
  ret: string;
  pickupCity?: IndianCity | undefined;
  dropCity?: IndianCity | undefined;
  pickupBranchName?: string | undefined;
  dropBranchName?: string | undefined;
  transitDistanceKm?: number | undefined;
  intercityFee?: number | undefined;
  withDriver?: boolean | undefined;
  driverFee?: number | undefined;
  loyaltyDiscount?: number | undefined;
}

export function BookingSummary({
  v,
  pickup,
  ret,
  pickupCity = "Bangalore",
  dropCity,
  pickupBranchName,
  dropBranchName,
  transitDistanceKm,
  intercityFee = 0,
  withDriver = false,
  driverFee = 0,
  loyaltyDiscount = 0,
}: BookingSummaryProps) {
  const dynamic = calculateDynamicRentalPricing(v, pickup, ret);
  const hasDates = Boolean(pickup && ret && ret > pickup);
  const effectiveDropCity = dropCity ?? pickupCity;
  const isDifferentHub = pickupBranchName && dropBranchName && pickupBranchName !== dropBranchName;

  // Add-on adjustments
  const baseVehicleRental = hasDates ? dynamic.totalFinalPrice : dynamic.effectiveRatePerDay;
  const netEstimatedTotal = Math.max(0, baseVehicleRental + intercityFee + driverFee - loyaltyDiscount);

  return (
    <div className="rounded-lg border p-4 text-sm bg-card shadow-sm space-y-3">
      <h3 className="font-semibold text-base border-b pb-2">Booking Summary</h3>
      {v.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded bg-muted">
          <img src={v.imageUrl} alt={v.name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="space-y-1.5 divide-y divide-border">
        <div className="pb-1.5">
          <p className="font-bold text-base">{v.name}</p>
          <p className="text-xs text-muted-foreground">{v.category} · {v.seats} Seats · {v.fuel} ({v.transmission})</p>
        </div>

        <div className="pt-2 space-y-1.5 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Hub Route:</span>
            <div className="text-right">
              <span className="font-medium text-foreground block">
                {pickupBranchName ?? pickupCity}
              </span>
              {isDifferentHub ? (
                <span className="text-[11px] text-amber-600 block">
                  ↓ One-Way Drop to: {dropBranchName}
                  {typeof transitDistanceKm === "number" && transitDistanceKm > 0 && ` (${transitDistanceKm} KM)`}
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground block">(Same Hub Return)</span>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pickup Date:</span>
            <span className="font-medium">{pickup || "Not selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Return Date:</span>
            <span className="font-medium">{ret || "Not selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Duration:</span>
            <span className="font-medium">{hasDates ? `${dynamic.totalDays} Days` : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle Daily Rate:</span>
            <span className="font-semibold text-primary">₹{dynamic.effectiveRatePerDay}/day</span>
          </div>
        </div>

        {/* Addons & Adjustments */}
        <div className="pt-2 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle Rental Fare:</span>
            <span className="font-medium">₹{baseVehicleRental}</span>
          </div>

          {intercityFee > 0 && (
            <div className="flex justify-between text-amber-700 dark:text-amber-300">
              <span>One-Way Transit & Rebalancing Fee:</span>
              <span className="font-semibold">+₹{intercityFee}</span>
            </div>
          )}

          {withDriver && driverFee > 0 && (
            <div className="flex justify-between text-primary">
              <span className="flex items-center gap-1">
                <UserCheck size={12} />
                <span>Professional Chauffeur ({dynamic.totalDays} days):</span>
              </span>
              <span className="font-semibold">+₹{driverFee}</span>
            </div>
          )}

          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>DriveEase Rewards Discount:</span>
              <span>-₹{loyaltyDiscount}</span>
            </div>
          )}
        </div>

        {/* Dynamic Factors Badge */}
        {dynamic.factors.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">Applied Dynamic Factors:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {dynamic.factors.map((f, i) => (
                <span
                  key={i}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    f.type === "surge" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  {f.description}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Total & Policies */}
        <div className="pt-3">
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-sm">Estimated Total Fare:</span>
            <span className="text-xl font-extrabold text-primary">₹{netEstimatedTotal}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Includes standard 18% GST (Tax invoice provided)</p>

          <div className="mt-3 rounded bg-muted/40 p-2.5 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Fuel size={12} className="text-emerald-600" />
              <span>Full-to-Full Fuel Policy</span>
            </div>
            <p>Vehicle delivered with 100% full tank. Return with 100% tank to avoid refueling deficit charges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ s }: { s: Booking["status"] }) {
  let color = "bg-muted text-muted-foreground";
  if (s === "Confirmed") color = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300";
  if (s === "Completed") color = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300";
  if (s === "Cancelled") color = "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300";
  return <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${color}`}>{s}</span>;
}

export function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      {children}
    </main>
  );
}

export function AdminNav() {
  return (
    <div className="mb-4 flex flex-wrap gap-4 text-sm border-b pb-2">
      <Link to="/admin" className="text-primary font-medium hover:underline">Dashboard</Link>
      <Link to="/admin/vehicles" className="text-primary font-medium hover:underline">Vehicles</Link>
      <Link to="/admin/bookings" className="text-primary font-medium hover:underline">Bookings & Invoices</Link>
      <Link to="/admin/maintenance" className="text-primary font-medium hover:underline">🔧 Fleet Maintenance & Health</Link>
    </div>
  );
}
