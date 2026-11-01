import { useState } from "react";
import { AdminNav, Page, StatusBadge } from "@/components/Layout";
import { bookingService, vehicleService } from "@/services/api";
import type { Booking, Category, FuelLevel, Vehicle } from "@/types";

import { getCategoryUtilization, getIndianSeasonalFactor, INDIAN_FESTIVAL_SEASONS } from "@/services/pricingEngine";
import { evaluateVehicleHealth, maintenanceService } from "@/services/maintenanceService";
import { VehicleHealthBadge } from "@/components/VehicleHealthBadge";
import { InvoiceModal } from "@/components/InvoiceModal";
import { FuelGauge } from "@/components/FuelGauge";
import { calculateFuelDeficitCharge, FUEL_LEVELS } from "@/services/fuelService";
import { BRANCH_HUBS, INDIAN_CITIES } from "@/services/cityService";
import { Building, FileText, Fuel, MapPin, Navigation, Plane, Train, UserCheck } from "lucide-react";

export function AdminDashboard() {
  const v = vehicleService.getAll();
  const b = bookingService.getAll();
  const stats = [
    ["Total vehicles", v.length], ["Available", v.filter((x) => x.available).length],
    ["Total bookings", b.length], ["Revenue (mock)", "₹" + b.filter((x) => x.status !== "Cancelled").reduce((s, x) => s + x.totalPrice, 0)],
  ];

  const categories = ["Car", "SUV", "Bike", "Tempo Traveller", "Mini Bus", "Travels"];
  const today = new Date();
  const activeSeason = getIndianSeasonalFactor(today);
  const isWeekend = today.getDay() === 0 || today.getDay() === 5 || today.getDay() === 6;

  return (
    <Page title="Admin Dashboard">
      <AdminNav />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
        {stats.map(([k, val]) => <div key={k} className="rounded border p-4 bg-card"><p className="text-sm text-muted-foreground">{k}</p><p className="text-2xl font-bold">{val}</p></div>)}
      </div>

      {/* Dynamic Pricing Engine Live Status */}
      <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>⚡ Dynamic Pricing Engine Status</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 font-semibold">Running</span>
            </h2>
            <p className="text-xs text-muted-foreground">Autonomous algorithmic rate adjustments for Indian market factors.</p>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Current Date: {today.toISOString().slice(0, 10)} ({today.toLocaleDateString("en-IN", { weekday: "long" })})
          </div>
        </div>

        {/* Current Active Rules */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Festival / Season</p>
            <p className="text-sm font-bold mt-1 text-amber-600">
              {activeSeason ? activeSeason.name : "Regular Season"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeSeason ? `+${Math.round((activeSeason.multiplier - 1) * 100)}% peak holiday surge` : "Standard seasonal multiplier"}
            </p>
          </div>

          <div className="rounded border p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Day-of-Week Rule</p>
            <p className="text-sm font-bold mt-1 text-primary">
              {isWeekend ? "Weekend Rush Active (+20%)" : "Weekday Saver (-10%)"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isWeekend ? "Fri-Sun demand surge applied" : "Mon-Thu off-peak rate applied"}
            </p>
          </div>

          <div className="rounded border p-3 bg-muted/30">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Indian Peak Windows</p>
            <p className="text-sm font-bold mt-1">
              {INDIAN_FESTIVAL_SEASONS.length} Active Rules
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Diwali, New Year, Holi, Summer & Weekends</p>
          </div>
        </div>

        {/* Category Fleet Utilization */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Live Category Utilization & Demand Surge
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((c) => {
              const u = getCategoryUtilization(c);
              const isHigh = u.rate >= 50;
              return (
                <div key={c} className="rounded border p-2.5 bg-background text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{c}</span>
                    <span className={`font-medium ${isHigh ? "text-amber-600" : "text-emerald-600"}`}>
                      {u.rate}% Booked
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${isHigh ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${Math.max(u.rate, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>{u.booked} booked / {u.total} total</span>
                    <span>{isHigh ? "+15% demand surge" : "Normal rate"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Multi-Branch & Inter-City Transit Network Monitor */}
      <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Navigation size={18} className="text-primary" />
              <span>Multi-Branch & Inter-City Drop-off Network</span>
              <span className="rounded-full bg-primary/10 text-primary text-xs px-2.5 py-0.5 font-semibold">
                {BRANCH_HUBS.length} Live Hubs
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Automated one-way repatriation tracking and real-time highway distance calculation across {INDIAN_CITIES.length} Indian metropolitan hubs.
            </p>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Airports (24/7) · City Centers · Railway Terminals
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {INDIAN_CITIES.slice(0, 6).map((city) => {
            const cityHubs = BRANCH_HUBS.filter((b) => b.city === city);
            return (
              <div key={city} className="rounded border p-3 bg-muted/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-primary" />
                    <span>{city} Cluster</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{cityHubs.length} Hubs</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  {cityHubs.map((h) => (
                    <div key={h.id} className="flex items-center justify-between text-muted-foreground">
                      <span className="truncate max-w-[170px]" title={h.name}>
                        {h.type === "Airport" ? "✈️ " : h.type === "Railway Station" ? "🚆 " : "🏢 "}
                        {h.name.split(" ")[0]} ({h.type})
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600">{h.operatingHours.includes("24/7") ? "24/7" : "Day"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}

const empty: Vehicle = { id: "", name: "", category: "Car", pricePerDay: 0, seats: 5, fuel: "Petrol", transmission: "Manual", available: true, imageUrl: "" };

export function AdminVehicles() {
  const [list, setList] = useState(vehicleService.getAll());
  const [form, setForm] = useState<Vehicle>(empty);
  const [msg, setMsg] = useState("");
  const refresh = () => setList(vehicleService.getAll());
  return (
    <Page title="Manage Vehicles">
      <AdminNav />
      <form className="mb-6 grid gap-2 rounded border p-4 sm:grid-cols-3" onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || form.pricePerDay <= 0) return setMsg("Name and price are required.");
        vehicleService.save({ ...form, id: form.id || String(Date.now()) });
        setMsg(`Vehicle ${form.id ? "updated" : "added"} (simulated, in-memory only).`);
        setForm(empty); refresh();
      }}>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
          <option>Car</option><option>SUV</option><option>Bike</option><option>Tempo Traveller</option><option>Mini Bus</option><option>Travels</option>
        </select>
        <input className="input" type="number" placeholder="Price/day (₹)" value={form.pricePerDay || ""} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} />
        <input className="input" placeholder="Fuel (e.g. Petrol, Diesel, CNG)" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} />
        <input className="input" placeholder="Transmission (Manual / Automatic)" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} />
        <input className="input" placeholder="Image URL (optional)" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available</label>
        <div className="flex gap-2 sm:col-span-3">
          <button className="btn">{form.id ? "Update" : "Add"} Vehicle</button>
          {form.id && <button type="button" className="btn-outline" onClick={() => setForm(empty)}>Cancel</button>}
        </div>
        {msg && <p className="text-sm sm:col-span-3">{msg}</p>}
      </form>
      <table className="table">
        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Specs</th><th>Price/Day</th><th>Available</th><th>Actions</th></tr></thead>
        <tbody>{list.map((v) => (
          <tr key={v.id}>
            <td>
              {v.imageUrl ? (
                <img src={v.imageUrl} alt={v.name} className="h-10 w-16 rounded object-cover" />
              ) : (
                <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">No img</div>
              )}
            </td>
            <td>{v.name}</td><td>{v.category}</td><td>{v.fuel} · {v.transmission}</td><td>₹{v.pricePerDay}</td><td>{v.available ? "Yes" : "No"}</td>
            <td className="space-x-2">
              <button className="btn-outline" onClick={() => setForm(v)}>Edit</button>
              <button className="btn-outline" onClick={() => { if (confirm("Delete vehicle? (simulated)")) { vehicleService.remove(v.id); refresh(); setMsg("Vehicle deleted (simulated)."); } }}>Delete</button>
            </td></tr>
        ))}</tbody>
      </table>
    </Page>
  );
}

export function AdminBookings() {
  const [list, setList] = useState(bookingService.getAll());
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [fuelCheckBooking, setFuelCheckBooking] = useState<Booking | null>(null);
  const [returnFuelLevel, setReturnFuelLevel] = useState<FuelLevel>("100% (Full Tank)");
  const [fuelMsg, setFuelMsg] = useState("");

  const update = (id: string, s: Booking["status"]) => {
    bookingService.setStatus(id, s);
    setList(bookingService.getAll());
  };

  const handleFuelCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuelCheckBooking) return;
    const v = vehicleService.getById(fuelCheckBooking.vehicleId);
    if (!v) return;

    const penalty = calculateFuelDeficitCharge(
      v.category,
      fuelCheckBooking.fuelLog?.dispatchLevel ?? "100% (Full Tank)",
      returnFuelLevel
    );

    // Update booking in-memory
    const updatedBookings = bookingService.getAll().map((b) => {
      if (b.id === fuelCheckBooking.id) {
        return {
          ...b,
          status: "Completed" as const,
          fuelLog: {
            dispatchLevel: b.fuelLog?.dispatchLevel ?? "100% (Full Tank)",
            returnLevel: returnFuelLevel,
            deficitCharges: penalty.totalFuelPenalty,
            notes: penalty.totalFuelPenalty > 0
              ? `Deficit charge assessed: ₹${penalty.totalFuelPenalty} (${penalty.missingQuarters} quarters missing @ ₹${penalty.deficitAmount} + ₹${penalty.serviceCharge} refill charge).`
              : "Returned with full tank. Zero fuel deficit penalty.",
          },
        };
      }
      return b;
    });

    // Save and refresh
    setList(updatedBookings);
    setFuelMsg(
      penalty.totalFuelPenalty > 0
        ? `Trip Completed! Return fuel: ${returnFuelLevel}. Penalty of ₹${penalty.totalFuelPenalty} assessed to customer invoice.`
        : `Trip Completed! Return fuel verified 100% full. No penalty.`
    );
    setTimeout(() => {
      setFuelCheckBooking(null);
      setFuelMsg("");
    }, 3000);
  };

  return (
    <Page title="Manage Bookings & Invoices">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-xs text-muted-foreground">
          Real-time fleet reservation audit, chauffeur dispatch, fuel return check-in, and GST tax invoices.
        </p>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Route / City</th>
              <th>Dates</th>
              <th>Chauffeur</th>
              <th>Total</th>
              <th>Fuel Status</th>
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
                  <td>{b.customer}</td>
                  <td>
                    <div className="font-semibold text-xs">{v?.name ?? "-"}</div>
                    <div className="text-[11px] text-muted-foreground">{v?.category}</div>
                  </td>
                  <td className="text-xs">
                    <div className="font-medium">{b.pickupBranchName ?? b.pickupCity ?? "Bangalore"}</div>
                    {b.dropBranchName && b.dropBranchName !== b.pickupBranchName ? (
                      <div className="text-[11px] text-amber-600 font-medium">
                        → {b.dropBranchName} ({b.transitDistanceKm} KM)
                      </div>
                    ) : (
                      <div className="text-[10px] text-muted-foreground">Same Hub</div>
                    )}
                  </td>
                  <td className="text-xs">{b.pickupDate} → {b.returnDate}</td>
                  <td className="text-xs">
                    {b.withDriver ? (
                      <span className="rounded bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 font-bold">
                        {b.driverDetails?.name ?? "Assigned"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Self-Drive</span>
                    )}
                  </td>
                  <td className="font-bold text-xs text-primary">₹{b.totalPrice}</td>
                  <td>
                    {b.fuelLog?.returnLevel ? (
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {b.fuelLog.returnLevel}
                        {b.fuelLog.deficitCharges ? ` (-₹${b.fuelLog.deficitCharges})` : ""}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        {b.fuelLog?.dispatchLevel ?? "100% Full"}
                      </span>
                    )}
                  </td>
                  <td><StatusBadge s={b.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <select
                        className="input text-xs py-0.5 px-1.5"
                        value={b.status}
                        onChange={(e) => update(b.id, e.target.value as Booking["status"])}
                      >
                        {["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>

                      {/* Fuel Check-in button */}
                      {v && b.status !== "Cancelled" && (
                        <button
                          type="button"
                          onClick={() => {
                            setFuelCheckBooking(b);
                            setReturnFuelLevel(b.fuelLog?.returnLevel ?? "100% (Full Tank)");
                          }}
                          className="btn-outline text-[11px] px-2 py-0.5 flex items-center gap-1"
                          title="Record Return Fuel Level & calculate deficit penalty"
                        >
                          <Fuel size={12} className="text-amber-600" />
                          <span>Fuel Check</span>
                        </button>
                      )}

                      {/* Invoice modal button */}
                      {v && (
                        <button
                          type="button"
                          onClick={() => setInvoiceBooking(b)}
                          className="btn-outline text-[11px] px-2 py-0.5 flex items-center gap-1"
                          title="View & Print Official GST Tax Invoice"
                        >
                          <FileText size={12} />
                          <span>Invoice</span>
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

      {/* Tax Invoice Modal */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          vehicle={vehicleService.getById(invoiceBooking.vehicleId)!}
          onClose={() => setInvoiceBooking(null)}
        />
      )}

      {/* Return Fuel Check-in Modal */}
      {fuelCheckBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Fuel size={18} className="text-amber-500" />
              <span>Vehicle Return Fuel Inspection</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Booking #{fuelCheckBooking.id} · {vehicleService.getById(fuelCheckBooking.vehicleId)?.name}
            </p>

            {fuelMsg ? (
              <div className="rounded bg-emerald-50 text-emerald-800 p-3 text-xs font-semibold">
                ✓ {fuelMsg}
              </div>
            ) : (
              <form onSubmit={handleFuelCheckSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Dispatch Fuel Tank Level</label>
                  <p className="text-muted-foreground">
                    {fuelCheckBooking.fuelLog?.dispatchLevel ?? "100% (Full Tank)"} (Verified at departure)
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-2">Record Return Fuel Tank Level</label>
                  <FuelGauge
                    level={returnFuelLevel}
                    interactive
                    onChange={setReturnFuelLevel}
                    label="Current Return Tank"
                  />
                </div>

                {/* Deficit calculation preview */}
                {(() => {
                  const v = vehicleService.getById(fuelCheckBooking.vehicleId);
                  if (!v) return null;
                  const pen = calculateFuelDeficitCharge(
                    v.category,
                    fuelCheckBooking.fuelLog?.dispatchLevel ?? "100% (Full Tank)",
                    returnFuelLevel
                  );

                  return pen.totalFuelPenalty > 0 ? (
                    <div className="rounded border border-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 text-amber-900 dark:text-amber-200">
                      <p className="font-bold">⚠️ Fuel Deficit Penalty:</p>
                      <p className="mt-1">
                        Tank is short by {pen.missingQuarters} quarter(s). Customer will be billed ₹{pen.deficitAmount} refueling cost + ₹{pen.serviceCharge} convenience fee = <span className="font-bold">₹{pen.totalFuelPenalty}</span>.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-emerald-800 dark:text-emerald-200 font-medium">
                      ✓ Tank returned 100% full. Zero refueling penalty.
                    </div>
                  );
                })()}

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setFuelCheckBooking(null)}
                    className="btn-outline text-xs"
                  >
                    Cancel
                  </button>
                  <button className="btn text-xs">
                    Confirm Inspection & Complete Trip
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}

export function AdminMaintenance() {
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("Oil Change (5,000 km)");
  const [startDate, setStartDate] = useState<string>("2026-10-31");
  const [endDate, setEndDate] = useState<string>("2026-11-04");
  const [garageName, setGarageName] = useState<string>("Authorized Service Hub");
  const [notes, setNotes] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const fleet = vehicleService.getAll();
  const summary = maintenanceService.getFleetHealthSummary();
  const records = maintenanceService.getAllRecords();

  const filteredFleet = fleet.filter((v) => {
    const h = v.health ?? evaluateVehicleHealth(v);
    if (filterStatus === "All") return true;
    return h.maintenanceStatus === filterStatus;
  });

  const handleScheduleService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      setMsg("Please select a vehicle to schedule for maintenance.");
      return;
    }
    maintenanceService.scheduleService(selectedVehicleId, {
      serviceType,
      startDate,
      expectedEndDate: endDate,
      garageName,
      notes,
    });
    setMsg(`Vehicle scheduled for ${serviceType} and automatically flagged as 'Under Maintenance' (bookings blocked).`);
    setSelectedVehicleId("");
    setNotes("");
    refresh();
  };

  const handleCompleteService = (vehicleId: string) => {
    maintenanceService.completeService(vehicleId, {
      costInRupees: 3500,
      notes: "Scheduled service completed, fluid levels & safety verified. Restored to available.",
      renewPuc: true,
    });
    setMsg("Service completed! Odometer interval reset, PUC updated, and vehicle unlocked for bookings.");
    refresh();
  };

  const handleAddKm = (vehicleId: string) => {
    const v = vehicleService.getById(vehicleId);
    if (!v) return;
    const currentKm = v.health?.mileageKm ?? 15000;
    const updated = maintenanceService.updateOdometer(vehicleId, currentKm + 1000);
    if (updated?.maintenanceStatus === "Service Due") {
      setMsg(`Odometer updated (+1,000 km). Threshold crossed: vehicle automatically flagged with 'Service Due'!`);
    } else {
      setMsg(`Odometer updated to ${currentKm + 1000} km.`);
    }
    refresh();
  };

  return (
    <Page title="Automated Maintenance & Fleet Health">
      <AdminNav />

      {/* KPI Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 mb-6">
        <div className="rounded border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Fleet Health Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{summary.fleetHealthScore}%</span>
            <span className="text-xs text-muted-foreground">Certified Road-Ready</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${summary.fleetHealthScore}%` }} />
          </div>
        </div>

        <div className="rounded border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Under Maintenance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-600">{summary.underMaintenance}</span>
            <span className="text-xs text-rose-600 font-medium">Bookings Auto-Blocked</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Active workshop service windows</p>
        </div>

        <div className="rounded border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Service Due Soon</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">{summary.serviceDue}</span>
            <span className="text-xs text-amber-600 font-medium">Action Required</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Oil change / PUC / Insurance due</p>
        </div>

        <div className="rounded border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Healthy & Available</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-primary">{summary.healthy}</span>
            <span className="text-xs text-muted-foreground">/ {summary.total} Vehicles</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Fully compliant for customer hire</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 rounded border border-primary/30 bg-primary/10 p-3 text-xs text-primary font-medium flex items-center justify-between">
          <span>{msg}</span>
          <button type="button" onClick={() => setMsg("")} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
      )}

      {/* Schedule Maintenance Service Window Form */}
      <div className="mb-6 rounded-lg border bg-card p-5 shadow-sm space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>🔧 Schedule Maintenance Window</span>
          <span className="text-xs font-normal text-muted-foreground">(Automatically blocks customer bookings during service)</span>
        </h2>
        <form className="grid gap-2 sm:grid-cols-3" onSubmit={handleScheduleService}>
          <select
            className="input sm:col-span-1"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            <option value="">-- Select Vehicle --</option>
            {fleet.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.category} - {v.health?.maintenanceStatus ?? "Healthy"})
              </option>
            ))}
          </select>

          <select
            className="input sm:col-span-1"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option>Oil Change (5,000 km)</option>
            <option>PUC Emission Test & Certification</option>
            <option>Commercial Insurance Renewal</option>
            <option>Brake & Suspension Overhaul</option>
            <option>Comprehensive 40-Point Periodic Service</option>
            <option>Emergency Mechanical Repair</option>
          </select>

          <input
            className="input sm:col-span-1"
            placeholder="Authorized Garage / Workshop"
            value={garageName}
            onChange={(e) => setGarageName(e.target.value)}
          />

          <div className="flex items-center gap-2 text-xs">
            <label className="flex-1">
              Start Date
              <input type="date" className="input w-full mt-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label className="flex-1">
              End Date
              <input type="date" className="input w-full mt-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>

          <input
            className="input sm:col-span-2"
            placeholder="Service Notes / Work Order Instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button className="btn sm:col-span-3">
            Schedule Service & Auto-Block Vehicle Bookings
          </button>
        </form>
      </div>

      {/* Fleet Maintenance Table */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold">Fleet Health & Compliance Status</h2>
          <div className="flex gap-1.5 text-xs">
            {["All", "Under Maintenance", "Service Due", "Healthy"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`rounded px-2.5 py-1 border transition-all ${
                  filterStatus === status ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded border">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Odometer & Oil Life</th>
                <th>PUC Status</th>
                <th>Insurance</th>
                <th>Health Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFleet.map((v) => {
                const health = v.health ?? evaluateVehicleHealth(v);
                const kmSinceLast = health.mileageKm - health.lastServiceKm;
                const isUnderMaint = health.maintenanceStatus === "Under Maintenance";

                return (
                  <tr key={v.id} className={isUnderMaint ? "bg-rose-50/40 dark:bg-rose-950/20" : ""}>
                    <td>
                      <div className="font-semibold">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.category} · {v.seats} Seats</div>
                    </td>
                    <td>
                      <div className="text-xs font-mono">{health.mileageKm.toLocaleString()} KM</div>
                      <div className="text-[11px] text-muted-foreground">
                        Oil: {kmSinceLast} / {health.oilChangeIntervalKm} km
                      </div>
                      <div className="w-24 bg-muted rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className={`h-full ${kmSinceLast >= health.oilChangeIntervalKm ? "bg-rose-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min((kmSinceLast / health.oilChangeIntervalKm) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="text-xs">
                        {health.pucExpiryDate >= "2026-10-31" ? (
                          <span className="text-emerald-600 font-medium">{health.pucExpiryDate}</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Expired</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => { maintenanceService.renewPuc(v.id); setMsg(`PUC renewed for ${v.name} (+6 months).`); refresh(); }}
                        className="text-[11px] text-primary hover:underline mt-0.5"
                      >
                        Renew PUC
                      </button>
                    </td>
                    <td>
                      <div className="text-xs">
                        {health.insuranceExpiryDate >= "2026-10-31" ? (
                          <span className="text-emerald-600 font-medium">{health.insuranceExpiryDate}</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Expired</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => { maintenanceService.renewInsurance(v.id); setMsg(`Insurance renewed for ${v.name} (+1 year).`); refresh(); }}
                        className="text-[11px] text-primary hover:underline mt-0.5"
                      >
                        Renew Ins.
                      </button>
                    </td>
                    <td>
                      <VehicleHealthBadge vehicle={v} />
                      {health.currentServiceWindow && (
                        <div className="text-[10px] text-rose-600 mt-1 max-w-[140px] truncate" title={health.currentServiceWindow.serviceType}>
                          {health.currentServiceWindow.serviceType}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {isUnderMaint ? (
                          <button
                            type="button"
                            onClick={() => handleCompleteService(v.id)}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700 font-medium"
                          >
                            ✓ Complete & Unlock
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVehicleId(v.id);
                              setServiceType("Oil Change (5,000 km)");
                              window.scrollTo({ top: 150, behavior: "smooth" });
                            }}
                            className="btn-outline text-xs px-2 py-0.5"
                          >
                            Service
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddKm(v.id)}
                          className="btn-outline text-[11px] px-1.5 py-0.5 text-muted-foreground"
                          title="Simulate adding 1,000 KM to test automated oil change interval threshold"
                        >
                          +1k KM
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance History & Work Orders */}
      <div className="space-y-3">
        <h2 className="text-base font-bold">Maintenance Records & Work Orders</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Service Type</th>
              <th>Dates</th>
              <th>Odometer</th>
              <th>Garage / Workshop</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs">{r.id}</td>
                <td>{r.vehicleName}</td>
                <td className="font-medium">{r.serviceType}</td>
                <td className="text-xs">{r.startDate} → {r.endDate}</td>
                <td className="font-mono text-xs">{r.odometerReadingKm.toLocaleString()} KM</td>
                <td className="text-xs text-muted-foreground">{r.garageName}</td>
                <td className="font-semibold text-xs">{r.costInRupees > 0 ? `₹${r.costInRupees}` : "In Progress"}</td>
                <td>
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${r.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
