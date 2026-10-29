import { Link } from "@tanstack/react-router";
import { Car } from "lucide-react";
import type { Booking, Vehicle } from "@/types";
import { rentalDays } from "@/services/api";

export function Navbar() {
  const l = "text-sm hover:text-primary";
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary"><Car size={20} /> DriveEase</Link>
        <div className="ml-auto flex flex-wrap gap-4">
          <Link to="/vehicles" className={l}>Vehicles</Link>
          <Link to="/my-bookings" className={l}>My Bookings</Link>
          <Link to="/admin" className={l}>Admin</Link>
          <Link to="/login" className={l}>Login</Link>
          <Link to="/register" className={l}>Register</Link>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return <footer className="mt-12 border-t p-4 text-center text-sm text-muted-foreground">© 2026 DriveEase — Prototype (mock data, no backend)</footer>;
}

export function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <div className="rounded border p-4">
      <div className="mb-3 flex h-28 items-center justify-center rounded bg-muted text-muted-foreground">{v.category} image</div>
      <h3 className="font-semibold">{v.name}</h3>
      <p className="text-sm text-muted-foreground">{v.category} · {v.location}</p>
      <p className="my-2 font-medium">${v.pricePerDay}/day {!v.available && <span className="text-sm text-destructive">(Unavailable)</span>}</p>
      <Link to="/vehicles/$id" params={{ id: v.id }} className="btn inline-block">View Details</Link>
    </div>
  );
}

export function BookingSummary({ v, pickup, ret }: { v: Vehicle; pickup: string; ret: string }) {
  const days = pickup && ret ? Math.max(rentalDays(pickup, ret), 0) : 0;
  return (
    <div className="rounded border p-4 text-sm">
      <h3 className="mb-2 font-semibold">Booking Summary</h3>
      <p>Vehicle: {v.name}</p>
      <p>Pickup: {pickup || "-"}</p>
      <p>Return: {ret || "-"}</p>
      <p>Days: {days}</p>
      <p>Rate: ${v.pricePerDay}/day</p>
      <p className="mt-2 font-semibold">Estimated total: ${days * v.pricePerDay}</p>
    </div>
  );
}

export function StatusBadge({ s }: { s: Booking["status"] }) {
  return <span className="rounded border px-2 py-0.5 text-xs">{s}</span>;
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
    <div className="mb-4 flex gap-4 text-sm">
      <Link to="/admin" className="text-primary">Dashboard</Link>
      <Link to="/admin/vehicles" className="text-primary">Vehicles</Link>
      <Link to="/admin/bookings" className="text-primary">Bookings</Link>
    </div>
  );
}
