import { useState } from "react";
import type { Category, IndianCity, OneWayTransitDetails } from "@/types";
import {
  BRANCH_HUBS,
  INDIAN_CITIES,
  calculateOneWayTransitFee,
  getBranchById,
  getBranchesByCity,
} from "@/services/cityService";
import { ArrowRight, Building, Clock, MapPin, Navigation, Phone, Plane, Train } from "lucide-react";

interface BranchSelectorProps {
  category: Category;
  pickupBranchId: string;
  dropBranchId: string;
  onPickupBranchChange: (branchId: string) => void;
  onDropBranchChange: (branchId: string) => void;
  onTransitDetailsChange?: ((details: OneWayTransitDetails) => void) | undefined;
}

export function BranchSelector({
  category,
  pickupBranchId,
  dropBranchId,
  onPickupBranchChange,
  onDropBranchChange,
  onTransitDetailsChange,
}: BranchSelectorProps) {
  const isDifferentDrop = pickupBranchId !== dropBranchId;
  const [allowDifferentBranch, setAllowDifferentBranch] = useState(isDifferentDrop);

  const pickupBranch = getBranchById(pickupBranchId);
  const dropBranch = getBranchById(dropBranchId);

  const transitDetails = calculateOneWayTransitFee(category, pickupBranchId, dropBranchId);

  const handleToggleDifferent = (checked: boolean) => {
    setAllowDifferentBranch(checked);
    if (!checked) {
      onDropBranchChange(pickupBranchId);
      if (onTransitDetailsChange) {
        onTransitDetailsChange(calculateOneWayTransitFee(category, pickupBranchId, pickupBranchId));
      }
    }
  };

  const handlePickupChange = (newBranchId: string) => {
    onPickupBranchChange(newBranchId);
    const effectiveDropId = allowDifferentBranch ? dropBranchId : newBranchId;
    if (!allowDifferentBranch) {
      onDropBranchChange(newBranchId);
    }
    const updated = calculateOneWayTransitFee(category, newBranchId, effectiveDropId);
    onTransitDetailsChange?.(updated);
  };

  const handleDropChange = (newBranchId: string) => {
    onDropBranchChange(newBranchId);
    const updated = calculateOneWayTransitFee(category, pickupBranchId, newBranchId);
    onTransitDetailsChange?.(updated);
  };

  const getBranchIcon = (type: string) => {
    switch (type) {
      case "Airport":
        return <Plane size={13} className="text-sky-600" />;
      case "Railway Station":
        return <Train size={13} className="text-amber-600" />;
      default:
        return <Building size={13} className="text-emerald-600" />;
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs space-y-3.5 text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-sm">
          <Navigation size={16} className="text-primary" />
          <span>Multi-Branch & Inter-City Transit Hubs</span>
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer font-medium text-primary hover:underline">
          <input
            type="checkbox"
            checked={allowDifferentBranch}
            onChange={(e) => handleToggleDifferent(e.target.checked)}
            className="rounded accent-primary h-3.5 w-3.5"
          />
          <span>Return to a different hub or city</span>
        </label>
      </div>

      {/* Pickup Branch Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-muted-foreground uppercase text-[11px] flex items-center gap-1">
            <MapPin size={12} className="text-emerald-600" />
            <span>Pickup Hub</span>
          </span>
          <span className="text-[11px] text-muted-foreground">{pickupBranch.city}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <select
            className="input text-xs py-1.5"
            value={pickupBranch.city}
            onChange={(e) => {
              const firstInCity = getBranchesByCity(e.target.value as IndianCity)[0]!.id;
              handlePickupChange(firstInCity);
            }}
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                City: {c}
              </option>
            ))}
          </select>

          <select
            className="input text-xs py-1.5"
            value={pickupBranchId}
            onChange={(e) => handlePickupChange(e.target.value)}
          >
            {getBranchesByCity(pickupBranch.city).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.type})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Pickup Branch Info Card */}
        <div className="rounded-md bg-muted/40 p-2.5 text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center gap-1">
              {getBranchIcon(pickupBranch.type)}
              <span>{pickupBranch.name}</span>
            </span>
            <span className="rounded bg-background px-1.5 py-0.2 border text-[10px] text-muted-foreground font-medium">
              {pickupBranch.type}
            </span>
          </div>
          <p className="text-muted-foreground line-clamp-1">{pickupBranch.address}</p>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              <span>{pickupBranch.operatingHours}</span>
            </span>
            <span className="flex items-center gap-1">
              <Phone size={10} />
              <span>{pickupBranch.contactNumber}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Drop Branch Selection (if enabled) */}
      {allowDifferentBranch && (
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground uppercase text-[11px] flex items-center gap-1">
              <MapPin size={12} className="text-rose-600" />
              <span>Drop-Off Hub</span>
            </span>
            <span className="text-[11px] text-muted-foreground">{dropBranch.city}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <select
              className="input text-xs py-1.5"
              value={dropBranch.city}
              onChange={(e) => {
                const firstInCity = getBranchesByCity(e.target.value as IndianCity)[0]!.id;
                handleDropChange(firstInCity);
              }}
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  City: {c}
                </option>
              ))}
            </select>

            <select
              className="input text-xs py-1.5"
              value={dropBranchId}
              onChange={(e) => handleDropChange(e.target.value)}
            >
              {getBranchesByCity(dropBranch.city).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Drop Branch Info Card */}
          <div className="rounded-md bg-muted/40 p-2.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1">
                {getBranchIcon(dropBranch.type)}
                <span>{dropBranch.name}</span>
              </span>
              <span className="rounded bg-background px-1.5 py-0.2 border text-[10px] text-muted-foreground font-medium">
                {dropBranch.type}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-1">{dropBranch.address}</p>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                <span>{dropBranch.operatingHours}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone size={10} />
                <span>{dropBranch.contactNumber}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Transit Logistics & Fee Calculation Banner */}
      {transitDetails.isInterBranch && (
        <div className="rounded-lg border border-amber-300 bg-amber-50/70 dark:bg-amber-950/40 p-3 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1 text-amber-950 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5">
              <span>🚚 One-Way Transit & Rebalancing Surcharge</span>
              <span className="rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] px-1.5 py-0.2 font-mono">
                {transitDetails.distanceKm} KM
              </span>
            </span>
            <span className="font-mono font-extrabold text-sm text-primary">
              +₹{transitDetails.totalTransitFee}
            </span>
          </div>

          {/* Route path */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{pickupBranch.name.split(" ")[0]}</span>
            <ArrowRight size={12} className="text-primary" />
            <span className="font-medium text-foreground">{dropBranch.name.split(" ")[0]}</span>
            <span>(~{transitDetails.estimatedTransitHours} hrs highway transit)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-muted-foreground pt-1 border-t border-amber-200/60 dark:border-amber-900">
            <div>
              <span>Vehicle Transit: </span>
              <span className="font-semibold text-foreground">₹{transitDetails.baseTransitCharge}</span>
            </div>
            <div>
              <span>Highway Tolls: </span>
              <span className="font-semibold text-foreground">₹{transitDetails.tollAllowance}</span>
            </div>
            <div className="sm:col-span-1 col-span-2">
              <span>Repatriation Duration: </span>
              <span className="font-semibold text-foreground">{transitDetails.estimatedTransitHours} Hours</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
